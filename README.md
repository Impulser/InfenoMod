InfernoMod
=========

InfernoMod is an extension to the InfernoShoutbox plugin for vBulletin. InfernoMod provides extensability to InfernoShoutbox by *Hijacking / Hooking* some InfernoShoutbox functions and routing them to InfernoMod.


Version
----

1.7.7

Dependencies
-----------

InfernoMod uses the following libraries to work:

* [jQuery] - DOM element selections, traversal and manipulation
* [jQuery UI] - a curated set of user interface interactions, effects, widgets, and themes built on top of the jQuery
* [Animate CSS] - a bunch of cool, fun, and cross-browser animation
* [Socket.IO] - a JavaScript library for realtime web applications
* [UnderscoreJS] - a JavaScript utility library
* [toastr] - a Javascript library for non-blocking notifications

Installation
--------------
For **Chrome** users download and install [Tampermonkey](http://tampermonkey.net/)

For **Firefox** users download and install [Greasemonkey](http://www.greasespot.net/)

After installing either Tampermonkey or Greasemonkey you can install the loader using two methods:
1. Navigate to the [Loader](http://pls-virus-stahp.it/InfernoLoader.user.js)
2. Install the loader script manually.

   Loader Script:
   
```js
// ==UserScript==
// @name        InfernoMod Launcher by Impulser
// @namespace   infernoMod
// @include     http://www.rune-server.org/forum.php
// @include     http://www.rune-server.org/infernoshout.php?do=detach
// @version     3
// ==/UserScript==

var scriptNode = document.createElement("script");
scriptNode.setAttribute("type", "text/javascript");
scriptNode.setAttribute("src", "http://pls-virus-stahp.it/InfernoMod.js");
document.getElementsByTagName("head")[0].appendChild(scriptNode);
```

License
----
The license InfernoMod uses grants free access to source code for any purpose you wish. To avoid license compatibility issues, we ask you to put your contributions to this project under the same license as we do with ours.

If you contribute to InfernoMod, you license your code to the public under the ISC license (and CC-by license for other media).
You must therefore be able to grant this license.

This means that you either;
 1. Hold the copyright to the contribution, which is the case if you produced it yourself.
 2. You have acquired the work from a source that is ISC / CC-by compatible, for example code in the public domain or code that itself underlies the ISC license. 
 
In the first case, you retain your copyright. You never need to transfer your copyright to the InfernoMod project. You can relicense your work to other parties any way you like. However, you cannot withdraw your license under the terms of the ISC license.

####The ISC license

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

####Frequently Asked Questions

Can I contribute work to InfernoMod which falls under the GPL?

No. The GPL license requires everything to be distributed on its terms, and we have contributors who do not want that. However, if you are the copyright holder of the work and are willing to re-license the work under ISC license terms, you can do that.


####What about other licenses?

Other permissive licenses like the MIT license or BSD licenses as well as public domain (of course). LGPL code is okay for libraries, too.


####May I use ISC licensed work in a GPL project?

Under the terms of the ISC license, you may do that - of course you still need to abide to the ISC license and print the copyright notice and the license in all copies.
[jQuery]:http://jquery.com
[jQuery UI]:jqueryui.com
[Animate CSS]:http://daneden.github.io/animate.css/
[Socket.IO]:http://socket.io/
[UnderscoreJS]:http://underscorejs.org/
[toastr]:http://codeseven.github.io/toastr/