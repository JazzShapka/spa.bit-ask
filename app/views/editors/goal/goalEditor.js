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
                description: '',
                divisionId: null,
                parentId: null
            };
            $scope.indicators_open = false;


            /**
             * Обработчик закрытия окна
             */
            locals.onClose = function (){
                keyboardService.off();
            };
            /**
             * Кнопка сохранить (ОК)
             */
            $scope.save = function (){

                var param; // Наименование параметра

                if($scope.goal.parentId == '')
                    $scope.goal.parentId = null;

                if($scope.goal.divisionId == '')
                    $scope.goal.divisionId = null;


                // Если поле описание не заполнено, просто закрываем и выходим
                if($scope.goal.description == '')
                {
                    $scope.close();
                    return;
                }

                // Если редактирование, но берем только те параметры которые изменились
                if(locals.mode == 'edit')
                {
                    var new_params = {};
                    for(param in $scope.goal)
                    {
                        if($scope.goal[param] != goal[param])
                            new_params[param] = $scope.goal[param];
                    }
                    goalService.editGoal(goal.id, new_params);
                }
                // Если создание то отправляем объект целиком.
                else
                {
                    for(param in $scope.goal)
                    {
                        goal[param] = $scope.goal[param];
                    }
                    goalService.createGoal(goal);
                }

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
             * Настройка скролла на странице.
             *
             * @returns {{cursorcolor: string, zindex: number}}
             */
            $scope.niceScrollOption = function (){
                return {cursorcolor: '#424242', zindex:81};
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
             * Получить цель с которой работаем.
             *
             * Создает новый или получает существующий объект.
             * Если цель редактируем, то получаем существующий объект из goalService,
             * если создаем цель, то создаем новый объект цели с пустыми полями.
             */
            var getGoal = function (){

                var goal;
                if(locals.mode == 'edit')
                    goal = goalService.goals_indexed[locals.goalId];
                else
                    goal = {
                        "id":uuid4.generate(),
                        "description": "",
                        "divisionId": "",
                        "parentId": null,
                        "limitDate": null,
                        "beginDate": 0,
                        "endDate": 0,
                        "period": "day"//,  // (day,week,month,year)
                        /*"indicators": [
                            {
                                "id": uuid4.generate(),
                                "indicatorName":null,
                                "type": null,
                                "lineNumber": null,
                                "formula": null,
                                "startValue": null,
                                "measures": [
                                    {
                                        "date":null,
                                        "value": null,
                                        "auto": false
                                    }
                                ]
                            }
                        ]*/
                    };

                // Определяем родителя
                switch (locals.mode){
                    case 'new':
                        goal.parentId = null;
                        break;
                    case 'sub':
                        goal.parentId = locals.goalId;
                        break;
                    case 'brother':
                        goal.parentId = goalService.goals_indexed[locals.goalId].parentId;
                        break;
                    case 'edit':
                        break;
                    default:
                        break;
                }

                return goal;
            };
            /**
             * Заполняем поля формы
             *
             * Переносим поля объекта цели в объект формы, для редактирования.
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

                // Получить цель с которой работаем
                goal = getGoal();

                // Заполняем поля формы
                fillField();
            };
            __constructor();
        }
    ]);
