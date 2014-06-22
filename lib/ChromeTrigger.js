(function(global) {
"use strict";

// --- dependency module -----------------------------------
// --- local variable --------------------------------------
//var _runOnNode = "process" in global;
//var _runOnWorker = "WorkerLocation" in global;
//var _runOnBrowser = "document" in global;

// --- define ----------------------------------------------
var LOCAL_STORAGE_KEY = "CHROME_TRIGGER_CHROME_ALWAYS";

// --- interface -------------------------------------------
function ChromeTrigger() {
}
ChromeTrigger["repository"]         = "https://github.com/uupaa/ChromeTrigger.js"; // GitHub repository URL. http://git.io/Help
ChromeTrigger["open"]               = ChromeTrigger_open;               // ChromeTrigger.open(param:Object, callback:Function):void
ChromeTrigger["resetAlwaysSetting"] = ChromeTrigger_resetAlwaysSetting; // ChromeTrigger.resetAlwaysSetting():void

// --- implement -------------------------------------------
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
    var selectedIcon = -1; // -1 = default, 0 = Always, 1 = once

    if ( _getOpenAlwaysSetting() ) {
        redirect = true;
    }

    lang = lang.split("-", 1)[0];
    if ( !/en|ja/.test(lang) ) {
        lang = "en";
    }

    var dialog = new IntentDialog(lang, _handleClickEvent);

    dialog.setIcon(0, icons[0], { "en": "Chrome",  "ja": "Chrome"   }, "com.android.chrome");
    dialog.setIcon(1, icons[1], { "en": "Browser", "ja": "ブラウザ" }, "");

    if (redirect) {
        dialog.setCaption({
            "en": "Redirect to Google Chrome...",
            "ja": "Google Chrome で開きます..."
        }).open(true);

        setTimeout(function() {
            dialog.close().jump(0, url);
        }, delay);
    } else {
        dialog.open();
    }

    function _handleClickEvent(event) {
        var id = event["id"];

        switch (id) {
        case 0: dialog.enable(selectedIcon = id); break; // chrome icon clicked
        case 1: dialog.enable(selectedIcon = id); break; // browser icon clicked
        case 100: // always button clicked
        case 101: // once button clicked
            var always = id === 100;

            if (selectedIcon >= 0) {
                dialog.close();

                if (selectedIcon === 0) {
                    if (always) { // always -> save settings
                        _saveOpenAlwaysSetting();
                    }
                    dialog.jump(0, url);
                } else {
                    if (callback) {
                        callback(always); // browser selected callback
                    }
                }
            }
        }
    }
}

function _saveOpenAlwaysSetting() {
    if (global["localStorage"]) {
        global["localStorage"][LOCAL_STORAGE_KEY] = "YES";
    }
}

function _getOpenAlwaysSetting() { // @ret Boolean
    if (global["localStorage"]) {
        if (global["localStorage"][LOCAL_STORAGE_KEY] === "YES") {
            return true;
        }
    }
    return false;
}

function ChromeTrigger_resetAlwaysSetting() {
    delete global["localStorage"][LOCAL_STORAGE_KEY];
}

//{@dev
function $valid(val, fn, hint) { if (global["Valid"]) { global["Valid"](val, fn, hint); } }
function $keys(obj, str) { return global["Valid"] ? global["Valid"].keys(obj, str) : true; }
function $type(obj, type) { return global["Valid"] ? global["Valid"].type(obj, type) : true; }
//}@dev

// --- export ----------------------------------------------
if ("process" in global) {
    module["exports"] = ChromeTrigger;
}
global["ChromeTrigger" in global ? "ChromeTrigger_" : "ChromeTrigger"] = ChromeTrigger; // switch module. http://git.io/Minify

})((this || 0).self || global); // WebModule idiom. http://git.io/WebModule

