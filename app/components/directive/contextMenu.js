/**
 * Created by SNKraynov on 15.03.2016.
 */
angular.module('bitaskApp').directive('ngContextMenu', function($compile, $log, $window) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            var container = false, backdrop = false;

            /**
             * Создать меню
             * @param params
             * @returns {*}
             */
            var createMenu = function (params){

                // Контейнер для меню
                container = angular.element('<div class="open-menu-container md-whiteframe-z2"></div>');

                // Само меню
                var content = angular.element('<md-menu-content width="4" role="menu"></md-menu-content>');

                // Создаем пункты меню
                for(var i=0; i<params.length; i++)
                {
                    // Если передали функцию возвращающую параметры меню
                    if(typeof params[i] == 'function')
                    {
                        var settings = params[i](attrs);

                        // Создаем пункт меню
                        var item = angular.element("<md-menu-item></md-menu-item>");

                        // Создаем кнопку
                        var button = angular.element("<button class='md-button' "
                            + (settings.disabled=="disabled"?"disabled='disabled'":"") + "></button>");

                        // Создаем текст кнопки
                        var text = angular.element("<div layout='row' flex><p flex>"+ settings.name +"</p><span>"
                            +(typeof settings.hotkey == 'string'?settings.hotkey:'')
                            +"</span></div>");

                        // Если передан обработчик, прикрепляем его к кнопке
                        if(typeof settings.handler == 'function')
                        {
                            button.on('click', (function (handler){
                                return function (){
                                    handler();
                                    return true;
                                }
                            })(settings.handler));
                        }

                        content.append(item.append(button.append(text)));
                    }
                    // Если передали объект
                    else if(typeof params[i] == 'object')
                    {
                        //TODO: Отработать параметры в виде объекта, НЕ ЗАБУДЬ ЧУВАК, А ТО НЕ АЙС
                    }
                    // Если передали строку
                    else if(typeof params[i] == 'string' && (params[i] == 'divider' || params[i] == 'divide'))
                    {
                        content.append("<div class='menu-divider' role='separator'></div>");
                    }
                }

                return $compile(container.append(content).addClass('active'))(scope);
            };

            /**
             * Сломать меню
             * @returns {boolean}
             */
            var destroyMenu = function (){
                if(container)
                {
                    container.remove();
                    container = false;
                }

                if(backdrop)
                {
                    backdrop.remove();
                    backdrop = false;
                }
                angular.element($window).off('keydown', destroyMenu);
                return false;
            };

            if(typeof scope.ngContextMenu == 'object')
            {
                // Обработчик правого клика
                element.on('contextmenu', function (event){

                    var body = angular.element('body');
                    backdrop = angular.element('<md-backdrop></md-backdrop>');
                    backdrop.on('click contextmenu', destroyMenu);


                    var menu = createMenu(scope.ngContextMenu);
                    menu.on('click', destroyMenu);
                    body.append(backdrop, menu);

                    angular.element($window).on('keydown', destroyMenu);

                    var menu_height = menu.height();
                    var menu_width = menu.width();
                    var menu_offset = menu.offset();

                    var window = angular.element($window);
                    var window_width = window.width();
                    var window_height = window.height();

                    if(event.clientX > window_width-menu_width)
                    {
                        menu.css({left:window_width-menu_width});
                    }
                    else
                    {
                        menu.css({left:event.clientX});
                    }

                    if(event.clientY > window_height-menu_height)
                    {
                        menu.css({top:window_height-menu_height});
                    }
                    else
                    {
                        menu.css({top:event.clientY});
                    }
                    return false;
                });
            }
            else
                // Выводим ошибку, если контекстное меню не определено в scope
                $log.warn('ngContextMenu - "scope.ngContextMenu" not available :-( ');

        }
    }
});