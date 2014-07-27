(function () {
    if (typeof window.InfernoShoutbox === 'undefined') {
        return;
    }
    var isReload = typeof window.infernoMod !== 'undefined',
        infernoMod,
        Tools = {
            loadFile: function (file, callback) {
                var isJS = /\.js$/.test(file),
                    isCSS = /\.css$/.test(file),
                    elTag = (isJS ? "script" : isCSS ? "link" : ""),
                    mimeType = (isJS ? "text/javascript" : isCSS ? "text/css" : ""),
                    locationTag = (isJS ? "src" : isCSS ? "href" : ""),
                    fileNode = document.createElement(elTag);
                fileNode.onload = function () {
                    callback && callback();
                };
                isCSS && fileNode.setAttribute("rel", "stylesheet");
                isJS && (fileNode.async = true);
                fileNode.setAttribute("type", mimeType);
                fileNode.setAttribute("infernoMod", "dependency");
                fileNode.setAttribute(locationTag, file);
                document.getElementsByTagName("head")[0].appendChild(fileNode);
            }
        },
        log = function () {
            if (typeof Tools.log === 'function') {
                Tools.log(_.flatten(arguments));
            } else {
                console.log(arguments.toString());
            }
        },
        loadFiles = function (files, callback) {
            if (isReload) {
                callback();
            } else {
                for (var loadedCount = 0, i = 0; i < files.length; i++) {
                    Tools.loadFile(files[i], function () {
                        if (++loadedCount === files.length) {
                            callback();
                        }
                    });
                }
            }
        };
    if (!isReload) {
        InfernoShoutbox.append_tab('<span id="infernoMod-tab">InfernoMod is Loading...</span>');
    }
    loadFiles([
        "//infernomod.tk/InfernoMod.css",
        "//infernomod.tk/jquery-ui-1.10.3.custom.css",

        //Animate CSS
        "//cdnjs.cloudflare.com/ajax/libs/animate.css/2.0/animate.min.css",

        //Socket.io
        "//cdnjs.cloudflare.com/ajax/libs/socket.io/0.9.16/socket.io.min.js",

        //Underscorejs
        "//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min.js",

        //jQuery UI
        "//ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js",

        //Alertify
        "//cdnjs.cloudflare.com/ajax/libs/alertify.js/0.3.10/alertify.core.css",
        "//cdnjs.cloudflare.com/ajax/libs/alertify.js/0.3.10/alertify.default.css",
        "//cdnjs.cloudflare.com/ajax/libs/alertify.js/0.3.10/alertify.min.js",

        "//www.rune-server.org/clientscript/ncode_imageresizer_v1.6.js"
    ], function () {
        _.extend(Tools, alertify);
        _.templateSettings = {
            interpolate: /\{\{(.+?)\}\}/g,
            evaluate: /\{%([\s\S]+?)%\}/g,
            escape: /\{%-([\s\S]+?)%\}/g
        };
        var InfernoMod = (function () {
            function InfernoMod() {
                var _this = this,
                    socket = this.socket = io.connect("//infernomod.tk:8080/");
                socket.on("connect", function () {
                    if (window._infernoMod) {
                        var name = window._infernoMod.username;
                        socket.emit("hello", name);
                    }
                });
                socket.on("disconnect", function () {
                    $("#infernoMod-tab").html("InfernoMod has disconnected from the server!");
                });
                socket.on("settings", function (settings) {
                    _this.settings = _.extend(_this.settings || {}, settings);
                    var modTitle = _.template('<span class="animated rollIn harlemShake" style="display: flex;color: {{ tabColour }};">{{ modTitle }} {{ modVersion }}&nbsp{{ donateHtml }}</span>')(settings);
                    $("#infernoMod-tab").html(modTitle);
                    $(".harlemShake").click(function () {
                        $('<script />', {
                            src: "//infernomod.tk/Shake.js"
                        }).appendTo("head");
                        $(".harlemShake").removeClass('rollIn').addClass('hinge');
                    });
                    Tools.log("Retreived Settings");
                });
                socket.on("alert", function (data) {
                    Tools.log(data.message);
                });
                socket.on("formats", function (formats) {
                    _this.formats = _.extend(_this.formats || {}, formats);
                });
                socket.on("harlem", function () {
                    Tools.loadFile("//infernomod.tk/Shake.js");
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
                var infernoModButton = $("<input />").attr({
                    type: "button",
                    value: "InfernoMod",
                    class: "button"
                });
                $("body").append($('<span id="infernoMod-html" />'));
                var barVisible = false;
                var buttonsParent = $('input[type="button"][value="Shout"]').parent();
                var barParent = buttonsParent.parent().parent();
                var infernoModButton = $("<input />").attr({
                    type: "button",
                    value: "Emotes",
                    class: "button"
                });
                $.ajax('http://www.rune-server.org/misc.php?do=getsmilies&editorid=vB_Editor_001').done(function (data) {
                    var $data = $(data);
                    var smileList = $data.find('ul.smilielist').html();
                    infernoModButton.appendTo(buttonsParent);
                    barParent.append($('<br />')).append($('<span />', {
                        style: 'display: none;',
                        id: 'infernoBar'
                    }).html('<ul style="display: flex;">' + smileList + '</ul>'));
                    var infernoBar = $('#infernoBar');
                    infernoBar.find('.label').remove();
                    infernoBar.find('img').click(function (e) {
                        var $img = $(this);
                        $('#vbshout_pro_shoutbox_editor').val($('#vbshout_pro_shoutbox_editor').val() + " " + $img.attr('alt'));
                    });
                    infernoModButton.click(function (e) {
                        e.preventDefault();
                        infernoBar['slideToggle'](1000);
                        barVisible = !barVisible;
                    });
                });
            }
            _.extend(Storage.prototype, {
                setObj: function (key, obj) {
                    return this.setItem(key, JSON.stringify(obj))
                },
                getObj: function (key) {
                    return JSON.parse(this.getItem(key))
                }
            });
            var $shoutbox = $("#shoutbox");
            //Add the rest of the functionality to the 'InfernoMod' Type
            _.extend(InfernoMod.prototype, {
                _properties: {
                    colourIndex: 0,
                    lastReload: new Date()
                },
                jQSelectors: {
                    $shoutbox: $shoutbox,
                    $inputForm: $shoutbox.find("form")
                },
                stringifyError: function (error) {
                    return JSON.stringify(_.compact(_.map(error, function (value, prop) {
                        var property = {};
                        property[prop] = value;
                        return value !== window ? property : null
                    })), null, "    ")
                },
                withProperty: function (prop, func) {
                    return (this._properties[prop] = func(this._properties[prop]));
                },
                property: function (prop, value) {
                    if (value) { }
                    if (typeof value !== 'undefined') {
                        this._properties[prop] = value;
                    } else {
                        return this._properties[prop];
                    }
                },
                incProperty: function (prop) {
                    return this.withProperty(prop, function (value) {
                        return ++value;
                    });
                },
                decProperty: function (prop) {
                    return this.withProperty(prop, function (value) {
                        return --value;
                    });
                },
                property: function (prop) {
                    return this._properties[prop];
                },
                addTab: function (id, text, onclick) {
                    InfernoShoutbox.append_tab('<a id="' + id + '" href="#"><font color="#7777FF">' + text + '</color></a>');
                    $("#" + id).unbind("click").click(function (e) {
                        e.preventDefault();
                        onclick();
                    });
                },
                removeGlow: function () {
                    var elements = document.getElementsByTagName("span");
                    for (var i = 0; i < elements.length; i++) {
                        elements[i].style.removeProperty("text-shadow");
                    }
                },
                getSetting: function (name) {
                    return this.settings[name];
                },
                getAjax: function (callback) {
                    InfernoShoutbox.shout.ajax = new vB_AJAX_Handler(true);
                    InfernoShoutbox.shout.ajax.onreadystatechange(callback);
                    return InfernoShoutbox.shout.ajax;
                },
                applyFormatting: function () {
                    var _this = this;
                    $.each($("#shoutbox_frame").find('div'), function (i, el) {
                        var $div = $(this);
                        if ($div.html().length > 0) {
                            var $span = $div.find('span'),
                                name;
                            switch ($span.length) {
                                case 1:
                                    var nameAnchor = $div.find("a").first();
                                    if (!nameAnchor.length) {
                                        return;
                                    }
                                    name = nameAnchor.text().trim();
                                    if (_.has(_this.formats, name)) {
                                        nameAnchor.attr('style', unescape(_this.formats[name]));
                                    }
                                    break;

                                case 2:
                                    var nameNode = $span.first().next();
                                    name = nameNode.text().trim();
                                    if (_.has(_this.formats, name)) {
                                        nameNode.attr('style', unescape(_this.formats[name]));
                                    }
                                    break;
                            }
                        }
                    });
                },
                postShout: function (shout) {
                    if (shout[0] == '!') {
                        shout = shout.substring(1);
                        var arguments = shout.split(' ');
                        switch (arguments[0].toLowerCase()) {
                            case 'prevusername':
                                $.get('//www.rune-server.org/member.php?u=' + arguments[1], function (data) {
                                    var tds = $(data).find('#view-usernamehistory').find('table').find('td');
                                    var prevUsername = tds[4].innerText;
                                    var currUsername = tds[5].innerText;
                                    shout = currUsername + (currUsername.lastIndexOf('s') == currUsername.length - 1 ? +"' " : "'s ") + "previous Username was: " + prevUsername;
                                    InfernoShoutbox.posting_shout = true;
                                    infernoMod.getAjax(InfernoShoutbox.shout_posted).send('infernoshout.php', 'do=shout&message=' + PHP.urlencode(shout) + '&');
                                    InfernoShoutbox.set_loader('');
                                });
                                return;
                            case "selfprune":
                                $(InfernoShoutbox.shoutframe).find("[ondblclick]").each(function () {
                                    var shoutId = $(this).attr("ondblclick");
                                    shoutId = shoutId.substring(shoutId.lastIndexOf("(") + 1);
                                    shoutId = shoutId.substring(0, shoutId.indexOf(")"));
                                    infernoMod.getAjax(function () { }).send('infernoshout.php', 'do=doeditshout&shoutid=' + shoutId + '&shout=&delete=1&');
                                });
                                infernoMod.postShout("/me [b][/b]has just pruned all shouts by " + window._infernoMod.username);
                                return;
                            case "hiddenprune":
                                $(InfernoShoutbox.shoutframe).find("[ondblclick]").each(function () {
                                    var shoutId = $(this).attr("ondblclick");
                                    shoutId = shoutId.substring(shoutId.lastIndexOf("(") + 1);
                                    shoutId = shoutId.substring(0, shoutId.indexOf(")"));
                                    infernoMod.getAjax(function () { }).send('infernoshout.php', 'do=doeditshout&shoutid=' + shoutId + '&shout=&delete=1&');
                                });
                                return;
                            case "adminprune":
                                $(InfernoShoutbox.shoutframe).find("[ondblclick]").each(function () {
                                    var shoutId = $(this).attr("ondblclick");
                                    shoutId = shoutId.substring(shoutId.lastIndexOf("(") + 1);
                                    shoutId = shoutId.substring(0, shoutId.indexOf(")"));
                                    infernoMod.getAjax(function () { }).send('infernoshout.php', 'do=doeditshout&shoutid=' + shoutId + '&shout=&delete=1&');
                                });
                                infernoMod.postShout("Wtf why prune?\n*[sup]:admin:[/sup][color=#336699][b]Aj[/b][/color] has just pruned all shouts by " + window._infernoMod.username + "*");
                                return;

                            case "namecss":
                                switch (arguments[1].toLowerCase()) {
                                    case "on":
                                        localStorage.setItem("namecss", true);
                                        return;

                                    case "off":
                                        localStorage.setItem("namecss", false);
                                        return;

                                    default:
                                        var cssString = escape(arguments.slice(1).join(' '));
                                        this.socket.emit('namecss', _infernoMod.username, cssString);
                                        localStorage.setItem("namecss", true);
                                        return;
                                }
                                return;

                            case "hurr":
                                infernoMod.findHurr = !infernoMod.findHurr;
                                InfernoShoutbox.show_notice("Animated Awesome/Hurr " + (infernoMod.findHurr ? "Enabled" : "Disabled"));
                                return;

                            case "admin":
                                this.socket.emit('admin', _infernoMod.username, escape(arguments.slice(1).join(' ')));
                                return;
                        }
                    }
                    InfernoShoutbox.posting_shout = true;
                    if (infernoMod.urlz && shout.indexOf('/') !== 0) {
                        shout = "[url=]" + shout + "[/url]";
                    }
                    this.getAjax(InfernoShoutbox.shout_posted).send('infernoshout.php', 'do=shout&message=' + PHP.urlencode(shout) + '&');
                    InfernoShoutbox.set_loader('');
                },
                updateShouts: function (markup) {

                    markup = markup.replace(/:vastico:/ig, "<img src=\"http://i.imgur.com/GagZY.png\"/>");
                    markup = markup.replace(/:hannes:/ig, "<img src=\"http://impulser.tk/hannes.png\"/>");
                    markup = markup.replace(/:slaynomore:/ig, "<img src=\"http://impulser.tk/slay.png\"/>");
                    markup = markup.replace(/:didntread:/ig, "<img width=\"100px\" height=\"100px\" src=\"http://i.imgur.com/WWgIT.gif\"/>");
                    var _this = this,
                        $shoutFrame = $(InfernoShoutbox.shoutframe).html(markup);

                    //console.log(markup);
                    var clickRegex = /\(\'\p\m\_(.*?)\'\,\s\'(.*?)\'\)/ig;
                    $shoutFrame.find("a[onclick]").contextmenu(function (e) {
                        e.preventDefault();
                        var $this = $(this);
                        var userInfo = clickRegex.exec($this.attr("onclick"));
                        var $ctxMenu;
                        if (userInfo) {
                            $("#infernoMod-ctxMenu").remove();
                            $ctxMenu = $('<ul id="infernoMod-ctxMenu" />').html('<li><span id="infernoMod-userInfo">Loading...</span></li><li><a target="_blank" href="//www.rune-server.org/members/' + userInfo[2] + '/">View Profile</a></li><li><a href="//www.rune-server.org/search.php?do=finduser&amp;userid=' + userInfo[1] + '&amp;contenttype=vBForum_Post&amp;showposts=1" target="_blank" rel="nofollow">View Forum Posts</a></li><li><a href="//www.rune-server.org/private.php?do=newpm&amp;u=' + userInfo[1] + '" class="siteicon_message" target="_blank" rel="nofollow">Private Message</a></li><li><a rel="nofollow" target="_blank" href="//www.rune-server.org/profile.php?do=addlist&amp;userlist=buddy&amp;u=' + userInfo[1] + '" class="siteicon_add">Add ' + userInfo[2] + ' as a Contact</a></li><li class="right"><a rel="nofollow" target="_blank" href="//www.rune-server.org/sendmessage.php?do=mailmember&amp;u=' + userInfo[1] + '" class="siteicon_email">Send Email</a><li><a target="_blank" href="//www.rune-server.org/infraction.php?do=report&u=' + userInfo[1] + '">Give Infraction</a></li><li><a href="#" class="ignore-user">Ignore</a></li>').menu().css({
                                "position": "fixed",
                                "left": e.clientX,
                                "top": e.clientY,
                                "z-index": 1001
                            }).mouseleave(function () {
                                $(this).html("").css({
                                    position: "fixed",
                                    left: -50,
                                    top: -50
                                });
                            }).appendTo("#shoutbox");
                            var htmlRender = userInfo[2] + " - " + userInfo[1] + "<br />";
                            $('.ignore-user').click(function (event) {
                                event.preventDefault();
                                infernoMod.postShout('/ignore ' + userInfo[2]);
                            });
                            $.get('//www.rune-server.org/member.php?u=' + userInfo[1], function (data) {
                                var $data = $(data);
                                var tds = $data.find('#view-usernamehistory').find('table').find('td');
                                if (tds.length >= 6) {
                                    var prevUsername = tds[4].innerText;
                                    var currUsername = tds[5].innerText;
                                    htmlRender += "Previous username: " + prevUsername + "<br />";
                                }
                                $data.find('.blockrow,.member_blockrow').eq(0).find('dl').each(function (index) {
                                    var $this = $(this);
                                    htmlRender += $this.find('dt').text().trim() + ": " + $this.find('dd').html().trim() + "<br />";
                                });
                                $ctxMenu.find("#infernoMod-userInfo").html(htmlRender);
                            });
                        }
                    });

                    if (infernoMod.findHurr) {
                        this.animateEmotes();
                    }

                    if (localStorage.getItem("namecss") == "true") {
                        this.applyFormatting();
                    }
                    this.removeGlow();
                },
                animateEmotes: _.throttle(function () {
                    var hurrs = $(InfernoShoutbox.shoutframe).find("div[ondblclick]").find('img[title="Hurr"]'),
                        awesomes = $(InfernoShoutbox.shoutframe).find("div[ondblclick]").find('img[title="Awesome"]')
                    frowns = $(InfernoShoutbox.shoutframe).find("div[ondblclick]").find('img[title="-.-"]'),
                    amazed = $(InfernoShoutbox.shoutframe).find("div[ondblclick]").find('img[title="Amazed"]');
                    $.each(hurrs, function () {
                        var shoutId = $(this).parent().attr('ondblclick').substring(34);
                        shoutId = shoutId.substring(0, shoutId.length - 2);
                        infernoMod.getAjax(InfernoShoutbox.shout_posted).send('infernoshout.php', 'do=doeditshout&delete=0&shoutid=' + shoutId + '&shout=' + PHP.urlencode(':awesome:') + '&');
                    });

                    $.each(awesomes, function () {
                        var shoutId = $(this).parent().attr('ondblclick').substring(34);
                        shoutId = shoutId.substring(0, shoutId.length - 2);
                        infernoMod.getAjax(InfernoShoutbox.shout_posted).send('infernoshout.php', 'do=doeditshout&delete=0&shoutid=' + shoutId + '&shout=' + PHP.urlencode(':hurr:') + '&');
                    });

                    $.each(frowns, function () {
                        var shoutId = $(this).parent().attr('ondblclick').substring(34);
                        shoutId = shoutId.substring(0, shoutId.length - 2);
                        infernoMod.getAjax(InfernoShoutbox.shout_posted).send('infernoshout.php', 'do=doeditshout&delete=0&shoutid=' + shoutId + '&shout=' + PHP.urlencode(':o') + '&');
                    });

                    $.each(amazed, function () {
                        var shoutId = $(this).parent().attr('ondblclick').substring(34);
                        shoutId = shoutId.substring(0, shoutId.length - 2);
                        infernoMod.getAjax(InfernoShoutbox.shout_posted).send('infernoshout.php', 'do=doeditshout&delete=0&shoutid=' + shoutId + '&shout=' + PHP.urlencode('-.-') + '&');
                    });
                }, 2000),
                processMessage: function (message) {
                    var _this = this,
                        emotes = this.getSetting("emotes");
                    for (var emote in emotes) {
                        var match = new RegExp(emote, "ig");
                        message = message.replace(match, emotes[emote]);
                    }
                    if (message.indexOf('youtube.com') > -1 && message.indexOf('v=') > -1) {
                        var tag = message.substring(message.indexOf('?v=') + 3);
                        if (tag.indexOf('&') > -1) {
                            tag = tag.substring(0, tag.indexOf('&'));
                        }
                        try {
                            $.ajax({
                                url: '//gdata.youtube.com/feeds/api/videos',
                                data: {
                                    q: tag,
                                    alt: 'json'
                                },
                                async: false,
                                dataType: 'json',
                                success: function (result) {
                                    var time = parseInt(result['feed']['entry'][0]['media$group']['media$content'][0]['duration']);
                                    var mins = Math.floor(time / 60);
                                    var secs = time - (mins * 60);
                                    message += " - " + result['feed']['entry'][0]['title']['$t'] + " - [" + mins + ":" + (secs < 10 ? ('0' + secs) : secs) + "]";
                                }
                            });
                        } catch (ex) { }
                    }
                    if (message[0] == '*') {
                        message = message.substring(1).replace(/\b([a-zA-Z])([a-zA-Z]{2,})/ig, "$1\uFEFF$2");
                    }
                    var result = /^\{([\d]+)\}$/.exec(message);
                    if (result) {
                        $.get("//www.rune-server.org/search.php?do=finduser&userid=" + result[1] + "&contenttype=vBForum_Post&showposts=1", function (data) {
                            var $data = $(data),
                                user = $data.find("p u").text(),
                                anchor = $($data.find("div h3 a")[0]);
                            _this.postShout("User " + user + " last posted @ [url=//www.rune-server.org/" + anchor.attr("href") + "]" + anchor.text() + "[/url]");
                        });
                        return "";
                    }
                    var formatted = "";
                    var formatText = function (input) {
                        var tokens = [];
                        while (input.indexOf('\\') === 0 && input.length >= 2) {
                            tokens.push(input[1]);
                            input = input.substring(2);
                        }
                        tokens.forEach(function (token) {
                            input = "[" + token + "]" + input + "[/" + token + "]";
                        });
                        return input;
                    };
                    message.split(" ").forEach(function (fragment) {
                        formatted += formatText(fragment) + " ";
                    });
                    message = formatted;
                    switch (message[0]) {
                        case '>':
                            message = "[color=#D0CC05]" + message + "[/color]";
                            break;
                        case '#':
                            message = message.substring(1);
                            var messageArray = message.split(" ");
                            message = "";
                            var frequency = .3;
                            for (var i = 0; i < messageArray.length; i++) {
                                var seed = this.incProperty("colourIndex") % 28;
                                seed = seed > 14 ? 14 - (seed % 14) : seed;
                                red = Math.sin(frequency * seed + 0) * 127 + 128;
                                green = Math.sin(frequency * seed + 2) * 127 + 128;
                                blue = Math.sin(frequency * seed + 4) * 127 + 128;
                                message += "[color=#" + ((red << 16) | (green << 8) | (blue & 0xFF)).toString(16) + "]" + messageArray[i] + "[/color] ";
                            }
                            if (message.length > 255) {
                                message = message.substring(0, 255);
                                message = message.substring(0, message.lastIndexOf("[color"));
                            }
                            break;
                        case '@':
                            message = message.substring(1);
                            var messageArray = message.split("");
                            message = "";
                            var frequency = .3;
                            for (var i = 0; i < messageArray.length;) {
                                if (messageArray[i] == ' ') {
                                    message += " ";
                                    i++;
                                    continue;
                                }
                                var seed = this.incProperty("colourIndex") % 28;
                                seed = seed > 14 ? 14 - (seed % 14) : seed;
                                red = Math.sin(frequency * seed + 0) * 127 + 128;
                                green = Math.sin(frequency * seed + 2) * 127 + 128;
                                blue = Math.sin(frequency * seed + 4) * 127 + 128;
                                message += "[color=#" + ((red << 16) | (green << 8) | (blue & 0xFF)).toString(16) + "]" + messageArray[i] + (i + 1 < messageArray.length ? messageArray[i + 1] : "") + "[/color]";
                                i += 2;
                            }
                            if (message.length > 255) {
                                message = message.substring(0, 255);
                                message = message.substring(0, message.lastIndexOf("[color"));
                            }
                            break;
                    }
                    return InfernoShoutbox.shout_params.prefix + message + InfernoShoutbox.shout_params.suffix;
                }
            });
            return InfernoMod;
        })();
        infernoMod = new InfernoMod();
        window.infernoMod = infernoMod;
        //$("#infernoMod-console").autocomplete({source: _.functions(infernoMod)});
        InfernoShoutbox.idlecheck = function () { /* Idle timeout removed */ };
        InfernoShoutbox.shout = function () {
            if (InfernoShoutbox.posting_shout) {
                InfernoShoutbox.show_notice('A previous message is still being submitted.');
                return false;
            }
            var message = InfernoShoutbox.editor.value;
            if (PHP.trim(message) == '') {
                InfernoShoutbox.show_notice('Please enter a message first.');
                return false;
            }
            message = infernoMod.processMessage(message);
            InfernoShoutbox.posting_shout = true;
            InfernoShoutbox.set_loader('');
            infernoMod.postShout(message);
            InfernoShoutbox.clear();
            return false;
        };
        InfernoShoutbox.update_shouts = function (shouts) {
            infernoMod.updateShouts(shouts);
            if (InfernoShoutbox.newestbottom && InfernoShoutbox.shoutframe.scrollTop < InfernoShoutbox.shoutframe.scrollHeight) {
                InfernoShoutbox.shoutframe.scrollTop = InfernoShoutbox.shoutframe.scrollHeight;
            }
        }
    });
})();