/* TODO : rename this file to Config.js */
const baseUrl = 'https://api.telegram.org/bot';
const apiToken = ''; // TODO : your bot api token
const botUrl = baseUrl + apiToken;
const creator = 256902271; // TODO : your id user Telegram (Optional)
const trigger = ''; // TODO : your own (lowercase, leave blank to not use trigger)
const channel = ''; // TODO : your channel username (without @)
const username = '@' + channel;
const alert = '<script>window.open("https://t.me/' + channel + '","_top")</script>';
const idExec = ''; // TODO : your id web app url (deploy script as web app)
const thanks = 'Thanks for using this bot, your message will be sent immediately to ' + username;
