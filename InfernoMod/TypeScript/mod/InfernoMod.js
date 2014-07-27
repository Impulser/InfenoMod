/// <reference path="../modules/require.d.ts" />
/// <reference path="../modules/underscore.d.ts" />
/// <reference path="../modules/socket.io-client.d.ts" />
/// <reference path="../modules/jquery.d.ts" />
define(["require", "exports", "socket.io-client"], function(require, exports, socketio) {
    var InfernoMod = (function () {
        function InfernoMod() {
            this.webSocket = socketio.connect("//pls-virus-stahp.it:8080/");
            this.setupSocketEvents(this.webSocket);
        }
        InfernoMod.prototype.setupSocketEvents = function (socket) {
            var _this = this;
            socket.on("connect", function () {
                /* if (window._infernoMod) {
                var name = window._infernoMod.username;
                socket.emit("hello", name);
                }*/
            });
            socket.on("disconnect", function () {
                $("#infernoMod-tab").html("InfernoMod has disconnected from the server!");
            });
            socket.on("settings", function (settings) {
                //  _this.settings = _.extend(_this.settings || {}, settings);
                var modTitle = _.template('<span class="animated rollIn harlemShake" style="display: flex;color: {{ tabColour }};">{{ modTitle }} {{ modVersion }}&nbsp{{ donateHtml }}</span>')(settings);
                $("#infernoMod-tab").html(modTitle);
                $(".harlemShake").click(function () {
                    $('<script />', {
                        src: "//infernomod.tk/Shake.js"
                    }).appendTo("head");
                    $(".harlemShake").removeClass("rollIn").addClass('hinge');
                });
                //  Tools.log("Retreived Settings");
            });
            socket.on("alert", function (data) {
                // Tools.log(data.message);
            });
            socket.on("formats", function (formats) {
                //_this.formats = _.extend(_this.formats || {}, formats);
            });
            socket.on("harlem", function () {
                // Tools.loadFile("//infernomod.tk/Shake.js");
            });
            socket.on("harlemstop", function () {
                $("audio").remove();
                $(".mw_added_css").remove();
            });

            /*socket.on("begin reload", function() {
            window.removeEventListener("error");
            socket.emit("reload me");
            });*/
            socket.on("reload", function () {
                socket.emit("reload me");
            });
        };
        return InfernoMod;
    })();

    require(["underscore", "jQuery"], function (_, $) {
        _.templateSettings = {
            interpolate: /\{\{(.+?)\}\}/g,
            evaluate: /\{%([\s\S]+?)%\}/g,
            escape: /\{%-([\s\S]+?)%\}/g
        };
    });
});
//# sourceMappingURL=InfernoMod.js.map
