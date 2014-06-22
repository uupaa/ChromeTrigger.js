(function(global) {
"use strict";

// --- dependency module -----------------------------------
// --- local variable --------------------------------------
//var _runOnNode = "process" in global;
//var _runOnWorker = "WorkerLocation" in global;
//var _runOnBrowser = "document" in global;

var _resourceString = {
    "en": {
//      "REDIRECT_CAPTION": "Redirect to Google Chrome...",
        "DIALOG_CAPTION":   "Complete action using",
//      "ICON_CAPTION_0":    "Chrome",
//      "ICON_CAPTION_1":    "Browser",
        "ALWAYS":           "Always",
        "JUST_ONCE":        "Just once"
    },
    "ja": {
//      "REDIRECT_CAPTION": "Google Chrome で開きます...",
        "DIALOG_CAPTION":   "アプリケーションを選択",
//      "ICON_CAPTION_0":    "Chrome",
//      "ICON_CAPTION_1":    "ブラウザ",
        "ALWAYS":           "常時",
        "JUST_ONCE":        "1回のみ"
    }
};

// --- define ----------------------------------------------
// --- interface -------------------------------------------
function IntentDialog(lang,       // @arg String - content language
                      callback) { // @arg Function - click event callback(event)
    this._lang       = lang;
    this._callback   = callback;
    this._outerFrame = null;
    this._icons      = []; // [url, url]
    this._package    = [];
}

IntentDialog["repository"] = "https://github.com/uupaa/IntentDialog.js"; // GitHub repository URL. http://git.io/Help
IntentDialog["prototype"] = {
    "constructor":  IntentDialog,               // new IntentDialog(lang:String, callback:Function)
    "setCaption":   IntentDialog_setCaption,    // IntentDialog#setCaption(captions:StringObject):this
    "setIcon":      IntentDialog_setIcon,       // IntentDialog#setIcon(index:Integer, icon:URLString, captions:Object, packageName:String = ""):this
    "open":         IntentDialog_open,          // IntentDialog#open(hideBody:Boolean = false):this
    "close":        IntentDialog_close,         // IntentDialog#close():this
    "jump":         IntentDialog_jump,          // IntentDialog#jump(id, url):this
    "enable":       IntentDialog_enable,        // IntentDialog#enable(id:String):this
    "disable":      IntentDialog_disable,       // IntentDialog#disable(id:String):this
    "isClosed":     IntentDialog_isClosed,      // IntentDialog#isClosed():Boolean
    "_setupIcons":  IntentDialog__setupIcons,
    "_setupButtons":IntentDialog__setupButtons
};

// --- implement -------------------------------------------
function IntentDialog_setCaption(captions) { // @arg StringObject - { en: "caption", ja: "キャプション" }
    _resourceString["en"]["DIALOG_CAPTION"] = captions["en"];
    _resourceString["ja"]["DIALOG_CAPTION"] = captions["ja"];
    return this;
}

function IntentDialog_setIcon(id,            // @arg Integer - icon index, from 0 to 1.
                              icon,          // @arg URLStringArray - [icon0, icon1]
                              captions,      // @arg StringObject - { en: "caption", ja: "キャプション" }
                              packageName) { // @arg String = "" - "com.android.chrome"
    this._icons[id] = icon;
    this._package[id] = packageName || "";
    _resourceString["en"]["ICON_CAPTION_" + id] = captions["en"];
    _resourceString["ja"]["ICON_CAPTION_" + id] = captions["ja"];
    return this;
}

function IntentDialog_open(hideBody) { // @ar Boolean = false
    if (!this._outerFrame) {
        var template = document.querySelector("#js-intent-dialog-template");

        document.body.innerHTML += _localization(template.innerHTML, this._lang);

        this._outerFrame = document.querySelector("#js-intent-dialog");

        if (!hideBody) {
            this._setupIcons();
            this._setupButtons();
        }
        this._outerFrame.style.display = "block"; // show modal dialog
    }
    return this;
}

function IntentDialog_close() {
    document.body.removeChild(this._outerFrame); // hide dialog
    this._outerFrame = null;
    return this;
}

function IntentDialog_jump(id,    // @arg Integer
                           url) { // @arg String
                                  // @arg URL - intent url
    location.href = _createIntentURL(url, this._package[id]);
}

function _createIntentURL(url, packageName) {
    var scheme = /^https/.test(url) ? "https" : "http";

    url = url.replace(/^https?\:\/\//, "");

    // https://developer.chrome.com/multidevice/android/intents
    var result =
            "intent://" + url + // URL is not necessary to encodeURIComponentencode.
            "#Intent;" +
                "package=" + packageName + ";" +
                "action=android.intent.action.VIEW;" +
                "scheme=" + scheme + ";" +
            "end";

    return result;
}

function IntentDialog_enable(id) { // @arg Integer
    var icons   = document.querySelectorAll("#js-intent-dialog .icon-button > img");
    var buttons = document.querySelectorAll("#js-intent-dialog .buttons > div.button");

    switch (id) {
    case 0:
        _removeCSSClass(icons[1].parentNode, "selected");
        _addCSSClass(icons[0].parentNode, "selected");
        _addCSSClass(buttons[0], "enable");
        _addCSSClass(buttons[1], "enable");
        break;
    case 1:
        _removeCSSClass(icons[0].parentNode, "selected");
        _addCSSClass(icons[1].parentNode, "selected");
        _addCSSClass(buttons[0], "enable");
        _addCSSClass(buttons[1], "enable");
    }
    return this;
}

function IntentDialog_disable(id) { // @arg Integer
    var icons   = document.querySelectorAll("#js-intent-dialog .icon-button > img");
    var buttons = document.querySelectorAll("#js-intent-dialog .buttons > div.button");

    switch (id) {
    case 0:
        _removeCSSClass(icons[1].parentNode, "selected");
        _removeCSSClass(icons[0].parentNode, "selected");
        _removeCSSClass(buttons[0], "enable");
        _removeCSSClass(buttons[1], "enable");
        break;
    case 1:
        _removeCSSClass(icons[1].parentNode, "selected");
        _removeCSSClass(icons[0].parentNode, "selected");
        _removeCSSClass(buttons[0], "enable");
        _removeCSSClass(buttons[1], "enable");
    }
    return this;
}

function IntentDialog_isClosed() { // @ret Boolean
    return !!this._outerFrame;
}

function IntentDialog__setupIcons() {
    var callback = this._callback;
    // --- setup icon images ---
    var icons = document.querySelectorAll("#js-intent-dialog .icon-button > img");

    if (this._icons[0]) {
        icons[0].src = this._icons[0];
        icons[0].style.visibility = "visible";
    }
    if (this._icons[1]) {
        icons[1].src = this._icons[1];
        icons[1].style.visibility = "visible";
    }

    // --- setup icon button event handlers ---
    var icon_buttons = document.querySelectorAll("#js-intent-dialog .icon-button");

    icon_buttons[0].onclick = function() {
        callback({ "type": "click", "id": 0 });
    };
    icon_buttons[1].onclick = function() {
        callback({ "type": "click", "id": 1 });
    };
    document.querySelector("#js-intent-dialog .icons").style.visibility = "visible";
}

function IntentDialog__setupButtons() {
    var callback = this._callback;
    var buttons = document.querySelectorAll("#js-intent-dialog .buttons > div.button");

    buttons[0].onclick = function() {
        callback({ "type": "click", "id": 100 });
    };
    buttons[1].onclick = function() {
        callback({ "type": "click", "id": 101 });
    };
    document.querySelector("#js-intent-dialog .buttons").style.visibility = "visible";
}

function _removeCSSClass(node, className) {
    node.className = (" " + node.className + " ").replace(new RegExp("\\s" + className + "\\s", "g"), "").trim();
}

function _addCSSClass(node, className) {
    if (node.className.indexOf(className) < 0) {
        node.className += " " + className;
    }
}

function _localization(fragment, lang) {
    var resource = _resourceString[lang];

    for (var key in resource) {
        var rex = new RegExp("\\{\\{" + key + "\\}\\}", "g");

        fragment = fragment.replace(rex, function() {
            return resource[key];
        });
    }
    return fragment;
}

// --- export ----------------------------------------------
global["IntentDialog" in global ? "IntentDialog_" : "IntentDialog"] = IntentDialog; // switch module. http://git.io/Minify

})((this || 0).self || global); // WebModule idiom. http://git.io/WebModule

