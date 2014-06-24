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
    this._selected   = -1; // current selected item id. -1 is not selected.
    this._iconNodes  = null;
    this._buttonNodes = null;
    this._iconButtonNodes = null;
}

IntentDialog["prototype"] = {
    "constructor":  IntentDialog,               // new IntentDialog(lang:String, callback:Function)
    "setCaption":   IntentDialog_setCaption,    // IntentDialog#setCaption(captions:StringObject):this
    "setItem":      IntentDialog_setItem,       // IntentDialog#setItem(id:Integer, icon:URLString, captions:Object, packageName:String = ""):this
    "open":         IntentDialog_open,          // IntentDialog#open(hideBody:Boolean = false):this
    "close":        IntentDialog_close,         // IntentDialog#close():this
    "jump":         IntentDialog_jump,          // IntentDialog#jump(id, url):void
    "selected":     IntentDialog_selected,      // IntentDialog#selected():Integer
    "isClosed":     IntentDialog_isClosed       // IntentDialog#isClosed():Boolean
};

// --- implement -------------------------------------------
function IntentDialog_setCaption(captions) { // @arg StringObject - { en: "caption", ja: "キャプション" }
    _resourceString["en"]["DIALOG_CAPTION"] = captions["en"];
    _resourceString["ja"]["DIALOG_CAPTION"] = captions["ja"];
    return this;
}

function IntentDialog_setItem(id,            // @arg Integer - item index, from 0 to 1.
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

        this._outerFrame      = document.querySelector("#js-intent-dialog");
        this._iconNodes       = document.querySelectorAll("#js-intent-dialog .icon-button > img");
        this._buttonNodes     = document.querySelectorAll("#js-intent-dialog .buttons > div.button");
        this._iconButtonNodes = document.querySelectorAll("#js-intent-dialog .icon-button");

        if (!hideBody) {
            _setupIcons(this);
            document.querySelector("#js-intent-dialog .buttons").style.visibility = "visible";
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

function _enableItem(that, id) {
    switch (id) {
    case 0:
        _removeCSSClass(that._iconNodes[1].parentNode, "selected");
        _addCSSClass(that._iconNodes[0].parentNode, "selected");
        _addCSSClass(that._buttonNodes[0], "enable");
        _addCSSClass(that._buttonNodes[1], "enable");
        that._buttonNodes[0].onclick = _alwaysClick;
        that._buttonNodes[1].onclick = _onceClick;
        break;
    case 1:
        _removeCSSClass(that._iconNodes[0].parentNode, "selected");
        _addCSSClass(that._iconNodes[1].parentNode, "selected");
        _addCSSClass(that._buttonNodes[0], "enable");
        _addCSSClass(that._buttonNodes[1], "enable");
        that._buttonNodes[0].onclick = _alwaysClick;
        that._buttonNodes[1].onclick = _onceClick;
    }

    function _alwaysClick() {
        that._callback({ "type": "click", "id": 100 });
    }
    function _onceClick() {
        that._callback({ "type": "click", "id": 101 });
    }
}

function IntentDialog_selected() { // @ret Integer - selected item id. -1 is not selected
    return this._selected;
}

function IntentDialog_isClosed() { // @ret Boolean
    return !!this._outerFrame;
}

function _setupIcons(that) {
    // --- setup icon images ---
    if (that._icons[0]) {
        that._iconNodes[0].src = that._icons[0];
        that._iconNodes[0].style.visibility = "visible";
    }
    if (that._icons[1]) {
        that._iconNodes[1].src = that._icons[1];
        that._iconNodes[1].style.visibility = "visible";
    }

    // --- setup icon button event handlers ---
    that._iconButtonNodes[0].onclick = function() {
        that._selected = 0;
        that._callback({ "type": "click", "id": 0 });
        _enableItem(that, 0);
    };
    that._iconButtonNodes[1].onclick = function() {
        that._selected = 1;
        that._callback({ "type": "click", "id": 1 });
        _enableItem(that, 1);
    };
    document.querySelector("#js-intent-dialog .icons").style.visibility = "visible";
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

