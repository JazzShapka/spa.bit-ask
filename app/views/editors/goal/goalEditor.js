/**
 * Created by SNKraynov on 23.03.2016.
 */
/**
 * Created by SNKraynov on 03.03.2016.
 */
angular.module('bitaskApp.editors.goalEditor', [
        'bitaskApp.service.goal',
        'bitaskApp.service.date'
    ])
    .controller('goalEditor',['$scope', 'goalService', '$mdDialog', 'locals', '$interval', '$auth', 'uuid4', 'keyboardService',
        function ($scope, goalService, $mdDialog, locals, $interval, $auth, uuid4, keyboardService){

            var goal = {};

            $scope.goal = {
                description:'',
                divisionId: null,
                parentId: null
            };
            $scope.indicators_open = false;

            // Показать чекбокс завершения только при редактировании
            $scope.show_completebox = (locals.mode == "edit_goal");

            locals.onClose = function (){
                keyboardService.off();
            };

            /**
             * Кнопка сохранить (ОК)
             */
            $scope.save = function (){

                $scope.close();
            };

            /**
             * Кнопка закрыть (Х)
             */
            $scope.close = function (){


                $mdDialog.hide();
            };

            /**
             * Кнопка - удалить цель
             */
            $scope.delete = function (){
                goalService.showDeleteGoalDialog(goal.id);
            };

            /**
             * Открыть показатели.
             */
            $scope.openIndicators = function (){
                $scope.indicators_open = !$scope.indicators_open;
            };

            /**
             * Обработчик клавиш
             */
            keyboardService.on(null, function (event){

                switch (event.keyCode){
                    case 27:        // Esc
                    {
                        $scope.close();
                        break;
                    }
                }

                if(event.ctrlKey && event.keyCode == 13 || event.keyCode == 10)
                {
                    $scope.save();
                }
            });

            /**
             * Получить задачу с которой работаем.
             *
             * Создает новый или получает существующий объект.
             */
            var getGoal = function (){

                var goal;
                if(locals.mode == 'edit_goal')
                    goal = goalService.goals_indexed[locals.goalId];
                else
                    goal = {
                        "id":uuid4.generate(),
                        "description ": "",
                        "divisionId ": "",
                        "parentId":null
                    };

                // Определяем родителя
                switch (locals.mode){
                    case 'new_goal':
                        goal.parentId = null;
                        break;
                    case 'sub_goal':
                        goal.parentId = locals.goalId;
                        break;
                    case 'brother_goal':
                        goal.parentId = goalService.goals_indexed[locals.goalId].parentId;
                        break;
                    case 'edit_goal':
                        break;
                    default:
                        break;
                }

                return goal;
            };

            /**
             * Заполняем поля формы
             */
            var fillField = function (){

                $scope.goal.description = goal.description;
                $scope.goal.divisionId = goal.divisionId;
                $scope.goal.parentId = goal.parentId;
            };

            /**
             * Конструктор
             * @private
             */
            var __constructor = function (){

                // Получить задачу с которой работаем
                goal = getGoal();

                // Заполняем поля формы
                fillField();
            };
            __constructor();
        }
    ]);
