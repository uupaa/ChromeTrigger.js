# ChromeTrigger.js [![Build Status](https://travis-ci.org/uupaa/ChromeTrigger.js.svg)](https://travis-ci.org/uupaa/ChromeTrigger.js)

[![npm](https://nodei.co/npm/uupaa.chrometrigger.js.svg?downloads=true&stars=true)](https://nodei.co/npm/uupaa.chrometrigger.js/)

Web Intent implementation. We will say Goodbye Android Browser!

- ChromeTrigger.js made of [WebModule](https://github.com/uupaa/WebModule).
- [Spec](https://github.com/uupaa/ChromeTrigger.js/wiki/ChromeTrigger)

## Browser and NW.js(node-webkit)

```js
<script src="../lib/WebModule.js"></script>
<script>
WebModule.publish = true;
</script>
<script src="../lib/WebGLDetector.js"></script>
<script src="../lib/UserAgent.js"></script>
<script src="../lib/WebIntent.js"></script>
<script src="../lib/IntentDialog.js"></script>
<script src="../lib/IntentDialogTemplate.js"></script> <!-- dialog html fragment -->
<script src="../lib/lang/en.js"></script> <!-- lang pack -->
<script src="../lib/lang/ja.js"></script> <!-- lang pack -->
<script src="../lib/ChromeTrigger.js"></script>


```js
<script>
// unit test for developer.

var ua = new UserAgent();
var useApp = true;
var assetsDir = "../assets";

var goodbye = ua.AOSP ||
              confirm("This is not a AOSP Stock browser. Do you want to simulate intent action?");

if (goodbye) {
    var trigger = new ChromeTrigger(useApp, assetsDir, ua.LANGUAGE);

    // if ( confirm("Reset always open setting?") ) {
    //     trigger.reset();
    // }

    trigger.open(function(always) {
        alert("You are selected AOSP Stock browser. " + (always ? "open always" : "open once"));
    });
}
</script>

<script>
// dist code

var ua = new UserAgent();
var assetsDir = "../assets";

if (ua.AOSP) {
    new ChromeTrigger(true, assetsDir).open(function() {
        alert("Sorry, This WebApp does not work in this Browser.");
        // bootStrap();
        return;
    });
} else {
    bootStrap();
}

function bootStrap() {
}
</script>
```

