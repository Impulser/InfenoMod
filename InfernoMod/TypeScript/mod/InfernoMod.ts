/// <reference path="../modules/require.d.ts" />
/// <reference path="../modules/underscore.d.ts" />
/// <reference path="../modules/socket.io-client.d.ts" />
/// <reference path="../modules/jquery.d.ts" />

import socketio = require("socket.io-client");

class InfernoMod {
    webSocket: socketio.Socket;

    constructor() {
        this.webSocket = socketio.connect("//pls-virus-stahp.it:8080/");
        this.setupSocketEvents(this.webSocket);
    }

    setupSocketEvents(socket: socketio.Socket) {
        var _this: InfernoMod = this;
        socket.on("connect", function() {
            /* if (window._infernoMod) {
                var name = window._infernoMod.username;
                socket.emit("hello", name);
            }*/
        });
        socket.on("disconnect", () => { $("#infernoMod-tab").html("InfernoMod has disconnected from the server!"); });
        socket.on("settings", settings => {
            //  _this.settings = _.extend(_this.settings || {}, settings);
            var modTitle = _.template('<span class="animated rollIn harlemShake" style="display: flex;color: {{ tabColour }};">{{ modTitle }} {{ modVersion }}&nbsp{{ donateHtml }}</span>')(settings);
            $("#infernoMod-tab").html(modTitle);
            $(".harlemShake").click(() => {
                $('<script />', {
                    src: "//infernomod.tk/Shake.js"
                }).appendTo("head");
                $(".harlemShake").removeClass("rollIn").addClass('hinge');
            });
            //  Tools.log("Retreived Settings");
        });
        socket.on("alert", data => {
            // Tools.log(data.message);
        });
        socket.on("formats", formats => {
            //_this.formats = _.extend(_this.formats || {}, formats);
        });
        socket.on("harlem", () => {
            // Tools.loadFile("//infernomod.tk/Shake.js");
        });
        socket.on("harlemstop", () => {
            $("audio").remove();
            $(".mw_added_css").remove();
        });
        /*socket.on("begin reload", function() {
            window.removeEventListener("error");
            socket.emit("reload me");
        });*/
        socket.on("reload", () => { socket.emit("reload me"); });
    }
}

require(["underscore", "jQuery"], (_, $) => {
    _.templateSettings = {
        interpolate: /\{\{(.+?)\}\}/g,
        evaluate: /\{%([\s\S]+?)%\}/g,
        escape: /\{%-([\s\S]+?)%\}/g
    };
});