/**
 * Created by SNKraynov on 19.02.2016.
 */
angular.module('bitaskApp')
    .directive('btDraggable', function ($window){
        return {
            restrict: 'A',
            link: function (scope, element, attrs){
                var elem = $(element[0]);

                var config = {
                    onStart:function (){},  // Начало перетаскивания
                    onStop:function (){},   // Конец перетаскивания
                    onMove:function (){},   // Движение
                    opacity:'0.7',          // Прозрачность
                    distance: 5,            // На сколько пикселей надо сдвинуть, что бы оторвать
                    zIndex:100,             // z-index оторванного элемента
                    helper: 'original',     // Если 'original' то отрывается оригинал, если 'clone' - создается клон
                    cursor: 'move'          // Курсор
                };


                var clone = false;

                var start_pos = {};
                var mouse_offset = {};
                var mouse_down_flag = false;
                var distance = 5; // px

                var mousemove = function (event){

                    if(mouse_down_flag || (event.pageX>start_pos.x+distance||event.pageX<start_pos.x-distance||event.pageY>start_pos.y+distance||event.pageY<start_pos.y-distance))
                    {
                        mouse_down_flag = true;

                        if(!clone && config.helper == 'clone')
                        {
                            clone = elem.clone();
                            $('body').append(clone);
                            clone.css({opacity:'0.7'});
                        }

                        if(config.helper == 'clone')
                            clone.offset({left:event.pageX-mouse_offset.x, top: event.pageY-mouse_offset.y});
                        else
                            elem.offset({left:event.pageX-mouse_offset.x, top: event.pageY-mouse_offset.y});

                        config.onMove();
                    }

                };
                var mouseup = function (event){
                    mouse_down_flag = false;
                    $(document).off('mousemove', mousemove);
                    $(document).off('mouseup', mouseup);


                    if(clone) clone.fadeOut(300, function () {
                        clone.remove();
                        clone = false;
                    });

                    config.onStop();
                };
                var mousedown = function (event){
                    start_pos.x = event.pageX;
                    start_pos.y = event.pageY;

                    var elem_offset = elem.offset();
                    mouse_offset.x = start_pos.x - elem_offset.left;
                    mouse_offset.y = start_pos.y - elem_offset.top;


                    $(document).on('mousemove', mousemove);
                    $(document).on('mouseup', mouseup);

                    config.onStart();
                };
                var __construct = function (){

                    if(attrs.hasOwnProperty('onStart') && typeof scope[attrs.onStart] == "function")
                        config.onStart = scope[attrs.onStart];

                    if(attrs.hasOwnProperty('onStop') && typeof scope[attrs.onStop] == "function")
                        config.onStop = scope[attrs.onStop];

                    if(attrs.hasOwnProperty('onMove') && typeof scope[attrs.onMove] == "function")
                        config.onMove = scope[attrs.onMove];

                    if(attrs.hasOwnProperty('opacity'))
                        config.opacity = attrs.opacity;

                    if(attrs.hasOwnProperty('distance'))
                        config.distance = parseInt(attrs.distance);

                    if(attrs.hasOwnProperty('zIndex'))
                        config.zIndex = parseInt(attrs.zIndex);

                    if(attrs.hasOwnProperty('helper'))
                        config.helper = parseInt(attrs.helper);

                    if(attrs.hasOwnProperty('cursor'))
                        config.cursor = parseInt(attrs.cursor);

                    elem.css({cursor:config.cursor});

                };
                __construct();

                elem.on('mousedown', mousedown);
            }
        }
    });
