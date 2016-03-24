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
             * Открыть диалог удаления цели
             *
             * Если цель есть в массиве показывает диалог (удалить/отмена),
             * если нажать удалить, отправляется запрос в буффер на удаление
             */
            self.showDeleteGoalDialog = function (goalId){
                keyboardService.on();

                var goal = self.goals_indexed[goalId];

                if(empty(goal))
                {
                    var alert = $mdDialog.confirm()
                        .title('Удаление цели')
                        .textContent("Цель еще не создана")
                        .ariaLabel('Delete goal')
                        .ok('Ок');
                    //.cancel('Отмена');
                    $mdDialog.show(alert).then(function (){
                        keyboardService.off();
                    });
                }
                else {
                    var confirm = $mdDialog.confirm()
                        .title('Удаление цели')
                        .textContent('Вы собираетесь удалить цель.')
                        .ariaLabel('Delete goal')
                        .ok('Удалить')
                        .cancel('Отмена');
                    $mdDialog.show(confirm).then(function() {

                        self.deleteGoal(goal.id);

                        bufferService.send([[ uuid4.generate(), true, "target/delete", {id: goal.id}]]);

                        keyboardService.off();
                    }, function() {
                        keyboardService.off();
                    });
                }
            };
            /**
             * Удалить цель из хранилища целей (goals и goals_indexed)
             * @param goalId
             */
            self.deleteGoal = function (goalId){
                for(var i=0; i<self.goals.length; i++)
                {
                    if(self.goals[i].id == goalId)
                    {
                        self.goals.splice(i, 1);
                        break;
                    }

                }

                delete self.goals_indexed[goalId];
            };
            /**
             * Запрос на редактирование цели.
             *
             * @param goalId - id редактируемой цели
             * @param param - (object) параметры, которые должны быть отредактированы (key => value)
             */
            self.editGoal = function (goalId, param){
                // TODO: Реализовать редактирование целей
            };
            /**
             * Запрос на создание цели
             *
             * @param goal - объект цели
             */
            self.createGoal = function (goal){
                // TODO: Реализовать создание цели.
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