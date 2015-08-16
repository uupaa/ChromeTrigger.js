GLOBAL["WebModule"]["IntentDialog"]["template"] = (function multiline() {/*
  <div id="js-intent-dialog" style="display:none">
    <style>
      #js-intent-dialog .frame {
        color: #1a1a1a;
        margin: 0;
        padding: 0;
        font-size: 12pt;
        font-family: sans-serif;
      }
      #js-intent-dialog .modal-mask {
        position: absolute;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 32766;
      }
      #js-intent-dialog .dialog {
        width: 320px;
        height: 240px;
        z-index: 32767;
        padding: 0;
        position: absolute;
        background-color: white;
      }
      #js-intent-dialog .centering {
        top: 50%; left: 50%; margin: -120px 0 0 -160px;
      }
      #js-intent-dialog .inner-frame {
        display: table;
        width: 100%;
        margin: 0;
        padding: 0;
      }
      #js-intent-dialog .caption {
        display:table-caption;
        color: #32b6e7;
        margin: 0;
        padding: 14px;
        border-bottom: 2px solid #32b6e7;
      }
      #js-intent-dialog .icons {
        visibility: hidden;
        display: table-row;
        height: 146px
      }
      #js-intent-dialog .icon {
        display: table-cell;
        width: 50%;
        text-align: center;
        vertical-align: middle;
      }
      #js-intent-dialog .icon-button {
        color: #666;
        margin: 0 12px;
        padding: 15px 0;
        font-size: 10pt;
        cursor: default;
      }
      #js-intent-dialog .selected {
        background-color: #b9e1ef;
        border: 3px solid #54bfe8;
        border-radius: 5px;
      }
      #js-intent-dialog .buttons {
        visibility: hidden;
        display: table-row;
        height: 40px
      }
      #js-intent-dialog .button {
        display: table-cell;
        width: 50%;
        text-align: center;
        vertical-align: middle;
        border-top: 1px solid #e8e8e8;
        border-left: 1px solid #e8e8e8;
        color: #c3c3c3;
        font-size: 10pt;
        cursor: default;
      }
      #js-intent-dialog .enable {
        color: #333;
      }
    </style>

    <div class="frame">
      <div class="modal-mask"></div>
      <div class="dialog centering">
        <div class="inner-frame">
          <div class="caption">DIALOG.CAPTION</div>
          <div class="icons">
            <div class="icon">
              <div class="icon-button">
                <img src="APP.ICON"><br />APP.CAPTION
              </div>
            </div>
            <div class="icon">
              <div class="icon-button">
                <img src="APP.ICON"><br />APP.CAPTION
              </div>
            </div>
          </div>
          <div class="buttons">
            <div class="button">DIALOG.ALWAYS_BUTTON</div>
            <div class="button">DIALOG.JUST_ONCE_BUTTON</div>
          </div>
        </div>
      </div>
    </div>
  </div>
*/} + "").split("\n").slice(1, -1).join("\n");

