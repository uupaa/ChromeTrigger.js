(function(global) {
"use strict";

// --- dependency modules ----------------------------------
// --- define / local variables ----------------------------
//var _runOnNode = "process" in global;
//var _runOnWorker = "WorkerLocation" in global;
//var _runOnBrowser = "document" in global;

var _storage = global["localStorage"] || null;

var LOCAL_STORAGE_KEY = "CHROME_TRIGGER_ALWAYS";

// --- class / interfaces ----------------------------------
function ChromeTrigger() {
}

//{@dev
ChromeTrigger["repository"] = "https://github.com/uupaa/ChromeTrigger.js"; // GitHub repository URL. http://git.io/Help
//}@dev

ChromeTrigger["ready"]              = ChromeTrigger_ready;              // ChromeTrigger.ready(callback:Function):void
ChromeTrigger["open"]               = ChromeTrigger_open;               // ChromeTrigger.open(param:Object, callback:Function):void
ChromeTrigger["resetAlwaysSetting"] = ChromeTrigger_resetAlwaysSetting; // ChromeTrigger.resetAlwaysSetting():void

// --- implements ------------------------------------------
function ChromeTrigger_ready(callback) { // @arg Function - callback():void
    if (document.readyState === "complete") {
        callback();
    } else {
        global.addEventListener("load", callback);
    }
}

function ChromeTrigger_open(param,      // @arg Object = null - { url, lang, delay, icons, redirect }
                            callback) { // @arg Function = null - browser selected callback(always:Boolean):void
                                        // @param.url URLString = location.href - intent url.
                                        // @param.lang String = navigator.language - content language. "en", "ja"
                                        // @param.delay Integer = 2000 - redirect dialog auto close time (unit: ms)
                                        // @param.icons URLStringArray = ["./chrome.png", "./browser.png"] - 64 x 64 png icon url.
                                        // @param.redirect Boolean = false - open redirect dialog
//{@dev
    $valid($type(param,    "Object|omit"),   ChromeTrigger_open, "param");
    $valid($type(callback, "Function|omit"), ChromeTrigger_open, "callback");
    $valid($keys(param,    "url|lang|delay|icons|redirect"), ChromeTrigger_open, "param");
//}@dev

    param = param || {};

    var url      = param["url"] || location.href;
    var lang     = param["lang"] || global["navigator"]["language"];
    var delay    = "delay" in param ? param["delay"] : 2000;
    var icons    = param["icons"] || ["./chrome.png", "./browser.png"];
    var redirect = param["redirect"] || false;

    if ( _getAlwaysSetting() ) {
        redirect = true;
    }

    lang = lang.split("-", 1)[0];
    if ( !/en|ja/.test(lang) ) {
        lang = "en";
    }

    var dialog = new global["IntentDialog"](lang, _handleClickEvent);

    dialog["setItem"](0, icons[0], { "en": "Chrome",  "ja": "Chrome"   }, "com.android.chrome");
    dialog["setItem"](1, icons[1], { "en": "Browser", "ja": "ブラウザ" }, "");

    if (redirect) {
        dialog["setCaption"]({
            "en": "Redirect to Google Chrome...",
            "ja": "Google Chrome で開きます..."
        }).open(true);

        setTimeout(function() {
            dialog["close"]()["jump"](0, url);
        }, delay);
    } else {
        dialog["open"]();
    }

    function _handleClickEvent(event) {
        var id = event["id"];

        switch (id) {
        case 0: break; // chrome icon clicked
        case 1: break; // browser icon clicked
        case 100: // always button clicked
        case 101: // once button clicked
            var always = id === 100;
            var selectedIcon = dialog["selected"]();

            if (selectedIcon >= 0) {
                dialog["close"]();

                if (selectedIcon === 0) {
                    if (always) { // always -> save settings
                        _saveAlwaysSetting();
                    }
                    dialog["jump"](0, url);
                } else {
                    if (callback) {
                        callback(always); // browser selected callback
                    }
                }
            }
        }
    }
}

function _saveAlwaysSetting() {
    if (_storage) {
        _storage[LOCAL_STORAGE_KEY] = "YES";
    }
}

function _getAlwaysSetting() { // @ret Boolean
    if (_storage) {
        if (_storage[LOCAL_STORAGE_KEY] === "YES") {
            return true;
        }
    }
    return false;
}

function ChromeTrigger_resetAlwaysSetting() {
    delete _storage[LOCAL_STORAGE_KEY];
}

// --- validate / assertions -------------------------------
//{@dev
function $valid(val, fn, hint) { if (global["Valid"]) { global["Valid"](val, fn, hint); } }
function $type(obj, type) { return global["Valid"] ? global["Valid"].type(obj, type) : true; }
function $keys(obj, str) { return global["Valid"] ? global["Valid"].keys(obj, str) : true; }
//function $some(val, str, ignore) { return global["Valid"] ? global["Valid"].some(val, str, ignore) : true; }
//function $args(fn, args) { if (global["Valid"]) { global["Valid"].args(fn, args); } }
//}@dev

// --- exports ---------------------------------------------
if ("process" in global) {
    module["exports"] = ChromeTrigger;
}
global["ChromeTrigger" in global ? "ChromeTrigger_" : "ChromeTrigger"] = ChromeTrigger; // switch module. http://git.io/Minify

})((this || 0).self || global); // WebModule idiom. http://git.io/WebModule

