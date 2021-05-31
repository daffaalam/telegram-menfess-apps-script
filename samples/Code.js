/**
 * 1. Add this to Library and set library id or name as `TelegramAutoBase`
 * 1qsU5g_0LEEeDBLv0MUU1Noh90zIsJSdFVg9vU7uheC34Mn5_-tFN5Adk
 * 2. Set your `token`, `channel`, and `admin` id
 * 3. Deploy your project as Web App
 * 4. Copy your deploy id or id from your web app url to `exec`
 * 5. Run `setWebhook` functions
 */

const tg = TelegramAutoBase.init({
    token: 'YOUR-BOT-TOKEN',
    channel: 'YOUR-CHANNEL-USERNAME',
    exec: 'YOUR-WEB-APP-DEPLOY-ID',
    admin: -1001342301032
});

function doGet(e) { return tg.doGet(e) }

function doPost(e) { return tg.doPost(e) }

function setWebhook() { return tg.setWebhook() }
