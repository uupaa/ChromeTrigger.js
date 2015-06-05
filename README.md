# ChromeTrigger.js [![Build Status](https://travis-ci.org/uupaa/ChromeTrigger.js.svg)](https://travis-ci.org/uupaa/ChromeTrigger.js)

[![npm](https://nodei.co/npm/uupaa.chrometrigger.js.svg?downloads=true&stars=true)](https://nodei.co/npm/uupaa.chrometrigger.js/)

Web Intent implementation. We will say Goodbye Android Browser!

## Document

- ChromeTrigger.js made of [WebModule](https://github.com/uupaa/WebModule).
- [Spec](https://github.com/uupaa/ChromeTrigger.js/wiki/ChromeTrigger)

## Browser and NW.js(node-webkit)

```js
<script src="<your-install-dir>/lib/WebModule.js"></script>
<script src="<your-install-dir>/node_modules/Spec.js/lib/Spec.js"></script>
<script src="<your-install-dir>/lib/IntentDialog.js"></script>
<script src="<your-install-dir>/lib/ChromeTrigger.js"></script>
<script>
<script type="text/template" id="js-intent-dialog-template">
  <div id="js-intent-dialog" style="display:none">
    <style>
        (omit)
    </style>
    <div class="frame">
        (omit)
    </div>
  </div>
</script>
```

```js
<script>
var spec = new WebModule.Spec();

var goodbye = spec.CHROME_TRIGGER || confirm("This is not a AOSP(Android) browser. Do you want to simulate that?");

if (goodbye) {
  //var param = { url: location.href }; // Reopen this page in Chrome Browser.
    var param = { url: "http://caniuse.com/#compare=ios_saf+7.0-7.1,ios_saf+8,android+4.2-4.3,android+4.4,and_chr+0" };

    if ( confirm("Reset always open setting?") ) {
        WebModule.ChromeTrigger.resetAlwaysSetting();
    }
    WebModule.ChromeTrigger.ready(function() {
        WebModule.ChromeTrigger.open(param, function(always) {
            alert("User selected AOSP(Android) browser. " + (always ? "open always" : "open once"));
        });
    });
}
</script>
```

