/// <reference path="./modules/require.d.ts"/>
var Main = (function () {
    function Main() {
    }
    Main.setupConfig = function () {
        requirejs.config({
            baseUrl: "lib",
            paths: {
                requriecss: "requirecss",
                socketio: "http://cdnjs.cloudflare.com/ajax/libs/socket.io/0.9.16/socket.io.min",
                underscore: "http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min",
                jQueryUI: "http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min",
                infernomod: "../mod/InfernoMod"
            },
            underscore: {
                exports: '_'
            }
        });
    };
    return Main;
})();

Main.setupConfig();

require(["underscore", "infernomod"]);
//# sourceMappingURL=Main.js.map
