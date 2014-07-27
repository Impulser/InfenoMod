module Utilities {
    export function loadFile(file: string, callback: Function) {
        var isJS = /\.js$/.test(file),
            isCSS = /\.css$/.test(file),
            elTag = (isJS ? "script" : isCSS ? "link" : ""),
            mimeType = (isJS ? "text/javascript" : isCSS ? "text/css" : ""),
            locationTag = (isJS ? "src" : isCSS ? "href" : ""),
            fileNode = document.createElement(elTag);

        fileNode.onload = () => callback();
        if (isCSS) {
            var linkNode = <HTMLLinkElement>fileNode;
            linkNode.setAttribute("rel", "stylesheet");
        } else if (isJS) {
            var scriptNode = <HTMLScriptElement>fileNode;
            scriptNode.async = true;
        }
        fileNode.setAttribute("type", mimeType);
        fileNode.setAttribute("infernoMod", "dependency");
        fileNode.setAttribute(locationTag, file);
    }

    export function loadFiles(files: string[], callback: Function) {
        for (var loadedCount: number = 0, i = 0; i < files.length; i++) {
            loadFile(files[i], () => {
                if (++loadedCount === files.length) {
                    callback();
                }
            });
        }
    }
}