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
<script src="../lib/IntentDialog.js"></script>
<script src="../lib/IntentDialogTemplate.js"></script> <!-- dialog html fragment -->
<script src="../lib/lang/en.js"></script> <!-- lang pack -->
<script src="../lib/lang/ja.js"></script> <!-- lang pack -->
<script src="../lib/ChromeTrigger.js"></script>


```js
<script>
var goodbye = ChromeTrigger.AOSP ||
              confirm("This is not a AOSP(Android) browser. Do you want to simulate that?");

if (goodbye) {
  //var trigger = new ChromeTrigger("CHROME", "APP");  // Chrome and APP
  //var trigger = new ChromeTrigger("AOSP",   "AOSP"); // AOSP and APP
    var trigger = new ChromeTrigger("CHROME", "AOSP"); // Chrome and AOSP

    // if ( confirm("Reset always open setting?") ) {
    //     trigger.reset();
    // }

    trigger.open(function(always) {
        alert("You are selected AOSP(Android) browser. " + (always ? "open always" : "open once"));
    });
}
</script>
```

