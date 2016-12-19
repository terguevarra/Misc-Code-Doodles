(function(){
    'use strict';

    angular
        .module('myApp')
        .directive('sourceError', sourceError);

        function sourceError(){
            return {
                link: function (scope, element, attrs){
                    element.bind('error', function(){
                        if(attrs.src != attrs.sourceError){
                            attrs.$set('src', attrs.sourceError);
                        }
                    });
                }
            }
        }
})();