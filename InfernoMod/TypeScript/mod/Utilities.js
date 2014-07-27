/// <reference path="Extensions.ts" />
var Utilities;
(function (Utilities) {
    function loadFile(file, callback) {
        var isJS = /\.js$/.test(file), isCSS = /\.css$/.test(file), elTag = (isJS ? "script" : isCSS ? "link" : ""), mimeType = (isJS ? "text/javascript" : isCSS ? "text/css" : ""), locationTag = (isJS ? "src" : isCSS ? "href" : ""), fileNode = document.createElement(elTag);

        fileNode.onload = function () {
            return callback();
        };
        if (isCSS) {
            var linkNode = fileNode;
            linkNode.setAttribute("rel", "stylesheet");
        } else if (isJS) {
            var scriptNode = fileNode;
            scriptNode.async = true;
        }
        fileNode.setAttribute("type", mimeType);
        fileNode.setAttribute("infernoMod", "dependency");
        fileNode.setAttribute(locationTag, file);
    }
    Utilities.loadFile = loadFile;

    function getPrototype(obj) {
        return obj["prototype"];
    }
    Utilities.getPrototype = getPrototype;

    function _clone(obj) {
        if (obj == null || typeof (obj) != 'object') {
            return obj;
        }

        var temp = null;

        try  {
            temp = obj.constructor();
        } catch (ex) {
            console.error(ex);
            console.log(arguments);
        }

        for (var key in obj) {
            temp[key] = _clone(obj[key]);
        }

        return temp;
    }

    function tryIt(tryAction) {
        var params = [];
        for (var _i = 0; _i < (arguments.length - 1); _i++) {
            params[_i] = arguments[_i + 1];
        }
        try  {
            tryAction.apply(this, params);
            return true;
        } catch (ex) {
            return false;
        }
    }
    Utilities.tryIt = tryIt;

    function loadFiles(files, callback) {
        for (var loadedCount = 0, i = 0; i < files.length; i++) {
            loadFile(files[i], function () {
                if (++loadedCount === files.length) {
                    callback();
                }
            });
        }
    }
    Utilities.loadFiles = loadFiles;
})(Utilities || (Utilities = {}));
//# sourceMappingURL=Utilities.js.map
