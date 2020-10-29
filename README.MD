# Telegram Library for GAS (Google Apps Script)

Go to Resources then Libraries in your GAS (Google Apps Script) project menus, and add this `MrViK_Ss2PSCLEtzBY2O-iv3JWjb9ElsQ` to your library, don't forget to choose the latest version.

Required data on `init`:
- `token`, your API Token (Telegram Bot).
- `channel`, your channel username (without @).
- `exec`, your script executable id (get from URL after you Deploy As Web App).

Optional:
- `creator`, your user or private group ID, default is -1001385703290 (my group [@telefessbeta](https://t.me/telefessbeta)).
- `trigger`, your trigger message will be forwarded, default is '' (no trigger, all message will forwarded).
- `thanks`, your feedback message after the message is forwarded to `channel`, default is 'Thanks for using this bot, your message will be sent immediately to @channel'.
- `report`, your feedback message after the message is forwarded to `creator`, default is 'Thanks for using this bot, your message will be sent immediately to Admin.'.
- `invalid`, your feedback message if the trigger is set and user send the message without trigger, default is 'Your message does not contain trigger words.'.

```js
const telegram = Telegram.init({
  token: '',
  channel: '',
  exec: ''
});

function doGet(e) { telegram.doGet(e) }

function doPost(e) { telegram.doPost(e) }

function setWebhook() { telegram.setWebhook() }
```
