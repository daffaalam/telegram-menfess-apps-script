# Telegram Auto Base Library for GAS (Google Apps Script)

Installation
============

Go to Resources then Libraries in your GAS (Google Apps Script) project menus, and add this `1qsU5g_0LEEeDBLv0MUU1Noh90zIsJSdFVg9vU7uheC34Mn5_-tFN5Adk` to your library, don't forget to choose the latest version.

Copy this code to your project.

```js
const tg = TelegramAutoBase.init({
    token: 'BOT-TOKEN',
    channel: 'CHANNEL-USERNAME',
    exec: 'WEB-APP-DEPLOY-ID',
    admin: -1001342301032
});

function doGet(e) { return tg.doGet(e) }

function doPost(e) { return tg.doPost(e) }

function setWebhook() { return tg.setWebhook() }
```

Change `BOT-TOKEN`, `CHANNEL-USERNAME`, `WEB-APP-DEPOY-ID`, and admin with your own.

Required data on `init`:
- `token`, your API Token (Telegram Bot).
- `channel`, your channel username (without @).
- `exec`, your script executable id (get from URL after you Deploy As Web App).

Optional:
- `creator`, your user or private group ID.  
default is -1001385703290 (my group [@telefessbeta](https://t.me/telefessbeta)).
- `trigger`, your trigger message will be forwarded.  
default is '' (no trigger, all message will forwarded).
- `thanks`, your feedback message after the message is forwarded to `channel`.  
default is 'Thanks for using this bot, your message will be sent immediately to @channel'.
- `report`, your feedback message after the message is forwarded to `creator`.  
default is 'Thanks for using this bot, your message will be sent immediately to Admin.'.
- `invalid`, your feedback message if the trigger is set and user send the message without trigger.  
default is 'Your message does not contain trigger words.'.

Then run or execute `setWebhook` function.

Example
=======

This is an [example](samples/Code.js).

Author
======

* [Abiyyu Daffa Alam](https://github.com/daffaalam) - https://daffaalam.com/

Donations
=========

Saweria - [daffaalam](https://saweria.co/daffaalam)

License
=======

This is free and unencumbered public domain software. For more information, see https://unlicense.org/ or the accompanying [UNLICENSE](LICENSE) file.
