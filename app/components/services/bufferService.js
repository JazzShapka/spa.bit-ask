/**
 * Created by WebStorm.
 * User: ANLyhin
 * Date: 03.03.2016
 * Time: 10:25
 */
'use strict';

angular.module('bitaskApp.service.buffer', [
    'uuid4',
    'pouchdb',
    'AngularStompDK'])
.config(function ($httpProvider, ngstompProvider) {

    // Получить url сокет сервера без слеша в конце, что бы добавить порт
    var url = bitaskAppConfig.api_socket_url;
    if(url[url.length-1] == '/')
        url = url.slice(0, -1);

    // Настройка веб сокетов
    ngstompProvider
        .url(url + ':'+ bitaskAppConfig.api_socket_port +'/ws')     // URL сервера
        .credential('guest', 'guest')                               // Учетные данные (логин, пароль)
        .debug(bitaskAppConfig.debug)                               // Вывод в лог
        .vhost('/')
        .heartbeat(0, 0)                                            // Частота пингов
        .class(WebSocket);                                          // <-- Will be used by StompJS to do the connection


})
.service('bufferService', [
    '$http', '$auth', 'uuid4', '$log', 'pouchDB', '$timeout', '$rootScope', '$mdToast', 'ngstomp', //ngstomp
    function($http, $auth, uuid4, $log, pouchDB, $timeout, $rootScope, $mdToast, ngstomp) {

        var self = this;

        var db_data = pouchDB('data');              // БД для данных (задачи, встречи, структура, ...)
        var db_queue = pouchDB('queue');            // БД для очереди (сохранение запросов при оффлайне)

        var test_online_timer = false;              // Объект таймера, который проверяет онлайн ли сервер.
        var test_online_seconds = 5;                // Через какой интервал пинговать сервер (сек)


        /**
         * Отправить запрос на сервер, ответ обрабатывает callback
         *
         * @param data - данные в формате [[id, false, "task/openedtasks", {parentId:0}],[...],[...]]
         * @param callback
         */
        self.send = function (data, callback){

            /**
             * Обработчик удаченого ответа сервера
             * @param response
             */
            var successCallback = function (response){
                if(response.status !== 200)
                {
                    errorCallback(response);
                    return;
                }

                // Если ответ с сервера нормальный, изменяем статус на online
                setConnect(true);

                // Обрабатываем все сообщения с сервера
                for (var i=0; i<response.data.length; i++)
                {
                    // Хороший ответ
                    if(response.data[i][1][0] == 200)
                    {
                        if(typeof callback == 'function')
                        {
                            callback (response.data[i][2]);
                        }
                    }
                    // Не очень хорошие ответы выводим в виде всплывашки
                    else
                    {
                        $log.warn(response.data[i][1][1]);
                        $mdToast.show({
                            template: '<md-toast><span style="color:red">Error:&nbsp;</span><span flex>'+ response.data[i][1][1] +'</span></md-toast>',
                            hideDelay: 10000,
                            position: 'right bottom'
                        });
                    }
                }
            };

            /**
             * Обработчик ошибки
             * @param response
             */
            var errorCallback = function (){

                // Изменяем статус подключения
                setConnect(false, 'Offline');

                // Если тест на онлайн не запущен, запускаем его.
                if(!test_online_timer)
                    test_online_timer = $timeout(testConnect, 5000);


                // Сохраняем сообщения в базе, если нужно
                for(var i=0; i<data.length; i++)
                {
                    if(data[i][1])  // Проверяем, нужно ли кешировать запрос
                    {
                        db_queue.put({_id:data[i][0], time: (new Date).getTime(), data:data[i]})
                    }
                }
            };

            // Если онлайн отправляем запрос, иначе вызываем ошибку.
            if(isOnline())
            {
                $http({
                    url: bitaskAppConfig.api_url + 'index.php/event/all',
                    method: 'POST',
                    data: data
                })
                    .then(successCallback, errorCallback);
            }
            else
            {
                errorCallback();
            }
        };

        /**
         * Отчиска БД для данных
         *
         * Просто удаляет базу и создает ее снова
         *
         * @description Clear all data in db.
         */
        var clearDataDB = function () {

            db_data.destroy().then(function() {
                db_data = pouchDB('data');
            });
        };
        /**
         * Отчиска БД для очереди
         *
         * Просто удаляет базу и создает ее снова
         *
         * @description Clear all data in db.
         */
        var clearQueueDB = function (){
            db_queue.destroy().then(function() {
                db_queue = pouchDB('queue');
            });
        };

        /**
         * Пинг сервера
         *
         * Вызывается циклически пока не появится соеденеие
         */
        var testConnect = function (){

            $http.head(bitaskAppConfig.api_url).then(function (response){
                // Если соеденение восстановлено
                if(response.status == 200)
                {
                    test_online_timer = false;
                    setConnect(true);
                    newConnect();

                }
                else
                {
                    test_online_timer = $timeout(testConnect, test_online_seconds * 1000);
                }
            });
        };
        /**
         * Восстановление соеденения
         *
         * Синхронизация с сервером, отпаравка и получение новых сообщений
         */
        var newConnect = function (){

            // Получаем все записи из базы с сортировкой по времени вставки
            db_queue.find({selector:{time: {$gt: 0}}, sort:['time']}).then(function (data){

                if(data.docs.length)
                {
                    var messages = [];

                    // Заполняем массив сообщений.
                    angular.forEach(data.docs, function (val, key){
                        messages.push(val.data);
                    });

                    // Отчищаем базу
                    clearQueueDB();

                    // Отправляем сообщения
                    self.send(messages);

                }
            });
        };
        /**
         * Изменить состояние подключения.
         *
         *
         * @param status (bool) - онлайн или нет
         * @param message (string) - сообщение, если оффлайн
         */
        var setConnect = function (status, message){
            if(status)
            {
                $rootScope.buffer = {
                    online: true,
                    offline_message:''
                };
            }
            else
            {
                if(typeof message !== 'string')
                    message = 'offline';

                $rootScope.buffer = {
                    online: false,
                    offline_message:message
                };
            }
        };
        /**
         * Онлайн сейчас или нет
         * @returns {boolean}
         */
        var isOnline = function (){
            return $rootScope.buffer.online;
        };

        /**
         * Функция вызывается когда приходит новое сообщение по сокетам
         * @param message - сообщение с сервера
         */
        var socketCallback = function (message){

            debugger;
        };

        /**
         * Конструктор
         */
        var __constructor = function () {

            // Добавляем индекс к базе очередей (для сортировки, иначе не работает)
            db_queue.createIndex({
                index:{fields:['time', '_id']}
            });

            // Id Пользователя
            var uid = $auth.getPayload().sub;
            ngstomp
                .subscribeTo('/queue/' + uid)
                .callback(socketCallback)
                .connect();

            newConnect();
        };
        __constructor();

    }])
.run(function ($log, $rootScope) {

    // Инициализация объекта онлайн/оффлайн
    $rootScope.buffer = {
        online: true,           // Онлайн или нет
        offline_message:''      // Если оффлайн, выводит причину оффлайна
    };
});

