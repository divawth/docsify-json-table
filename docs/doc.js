define(function (require, exports, module) {

    'use strict';

    exports.init = function () {


        new Yox({
            el: '#app',

            template: `
                <div class="bell-demo-wrapper">
                    <DemoBlockWrapper code="{{code}}" />
                </div>
            `,

            replace: true,

            data: function () {
                return {
                    code: code
                }
            }
        });
    }
});