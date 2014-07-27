/// <reference path="./modules/require.d.ts"/>

class Main {
    static setupConfig() {
        requirejs.config({
            baseUrl: "lib",
            paths: {
                socketio: "http://cdnjs.cloudflare.com/ajax/libs/socket.io/0.9.16/socket.io.min",
                underscore: "http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min",
                jQuery: "http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min",
                jQueryUI: "http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min",
                requriecss: "requirecss",
                infernomod: "../mod/InfernoMod"
            },
            underscore: {
                exports: '_'
            }
        });
    }
}

Main.setupConfig();

var infernoMod = require("infernomod");