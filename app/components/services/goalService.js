/**
 * Created by SNKraynov on 21.03.2016.
 */
angular.module('bitaskApp.service.goal', [
        'bitaskApp.editors.goalEditor',
        'bitaskApp.service.buffer',
        'uuid4'
    ])
    .service('goalService', ['$timeout', '$mdDialog', 'bufferService', 'uuid4', 'keyboardService', '$auth',
        function ($timeout, $mdDialog, bufferService, uuid4, keyboardService, $auth){

            var self = this;

            self.goals = [];                // Массив загруженых целей
            self.goals_indexed = {};        // Проиндексированный массив загруженных целей

            /**
             * Открыть редактор цели.
             *
             * @param mode - 'new_task' || 'sub_task' || 'brother_task' || 'edit_task'
             * @param goalId - id цели в контексте которой происходит открытие окна
             *
             *  ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ:
             *
             * 1) Создание новой цели
             *      goalService.showGoalEditor('new_goal');
             *      Создастся цель в корне документа
             *
             * 2) Создание цели на том же уровне
             *      goalService.showGoalEditor('brother_goal', "13cb2b00-c37c-f52a-1f2a-59b934a4c2b8");
             *      Вторым параметром передаем id цели на чьем уровне должна создаться подцель.
             *
             * 3) Создание подцели
             *      goalService.showGoalEditor('sub_goal', "13cb2b00-c37c-f52a-1f2a-59b934a4c2b8");
             *      Вторым параметром передаем id родительской цели.
             *
             * 4) Редактирование цели.
             *      goalService.showGoalEditor('edit_goal', "13cb2b00-c37c-f52a-1f2a-59b934a4c2b8");
             *      Вторым параметром передаем id цели которую хотим отредактировать.
             *
             *      -- Как то так...
             */
            self.showGoalEditor = function (mode, goalId){

                var locals = {
                    mode:mode,
                    goalId:goalId
                };

                $mdDialog.show({
                    controller: 'goalEditor',
                    templateUrl: 'app/views/editors/goal/goalEditor.html',
                    onRemoving: function (){
                        locals.onClose();
                    },
                    locals : locals,
                    escapeToClose: false,
                    clickOutsideToClose:false
                });
            };

            /**
             * Конструктор.
             *
             * Получает список целей с сервера.
             *
             * @private
             */
            var __constructor = function (){

                var userId = $auth.getPayload().sub;
                // Получаем все цели
                bufferService.send([[uuid4.generate(), false, "target/list", {userId:userId}]], function (data){

                    // Добавляем все новости в массив отображения
                    for(var i=0; i<data.length; i++)
                    {
                        // Индексируем массив карточек (новостей)
                        self.goals_indexed[data[i].id] = data[i];
                        self.goals.push(data[i]);
                    }
                });
            };
            __constructor();
        }
    ]);