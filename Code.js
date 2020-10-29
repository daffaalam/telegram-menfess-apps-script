/**
* @param {Object} data
*/
function doGet(e) { return HtmlService.createHtmlOutput(this.alert) }

/**
* @param {Object} data
*/
function doPost(e) {
  if (!e.postData) return;
  if (e.postData.type != 'application/json') return;
  let data = JSON.parse(e.postData.contents);
  try {
    let message = data.message;
    if (!message) return;
    let sent = false;
    let isCommand = isBotCommand(message.entities);
    let validTrigger = isValidTrigger(message.text) || isValidTrigger(message.caption);
    if (message.media_group_id) Utilities.sleep(2000);
    if (isCommand) sent = sendBotCommand(message.text);
    else if (!validTrigger) sendMessage(this.invalid, message.from.id);
    else if (message.text) sent = sendMessage(message.text);
    else if (message.sticker) sent = sendSticker(message.sticker.file_id);
    else if (message.photo) sent = sendPhoto(message.photo[0].file_id, message.caption);
    else if (message.animation) sent = sendAnimation(message.animation.file_id, message.caption);
    else if (message.video) sent = sendVideo(message.video.file_id, message.caption);
    else if (message.audio) sent = sendAudio(message.audio.file_id, message.caption);
    else if (message.document) sent = sendDocument(message.document.file_id, message.caption);
    else if (message.poll) sent = sendPoll(message.poll);
    else if (message.dice) sent = sendDice(message.dice.emoji);
    else sendMessage('`' + JSON.stringify(message, null, 2) + '`', this.creator);
    if (sent) sendMessage(this.thanks, message.from.id);
  } catch (error) {
    error = 'ERROR @' + this.channel + '\n\n' + error.toString();
    error += '\n\n`' + JSON.stringify(data, null, 2) + '`';
    sendMessage(error, this.creator);
  }
}

/**
* @param {Object} data
* token, creator, trigger, channel, exec, thanks, report, invalid.
* contact me at Telegram.
* username: daffaalam
* id: 256902271
* @return {Telegram}
*/
function init(data) {
  if (!data || data == {}) throw 'data must not be null or empty';
  if (!data.token) throw 'data token must not be null or empty';
  if (!data.exec) throw 'data exec must not be null or empty';
  if (!data.channel) throw 'data channel must not be null or empty';
  let thanks = 'Thanks for using this bot, your message will be sent immediately to ';
  this.token = data.token;
  this.botUrl = 'https://api.telegram.org/bot' + this.token;
  this.creator = data.creator || -1001385703290;
  this.trigger = data.trigger || '';
  this.channel = data.channel;
  this.username = '@' + this.channel;
  this.alert = '<script>window.open("https://t.me/s/' + this.channel + '","_top")</script>';
  this.idExec = data.exec;
  this.thanks = data.thanks || thanks + this.username;
  this.report = data.report || thanks + ' Admin.';
  this.invalid = data.invalid || 'Your message does not contain trigger words.';
  return this;
}

/**
* @param {String} endPoint
* @param {Object} data
* @return {Object}
*/
function request(endPoint, data) {
  data = JSON.stringify(data, null, 2);
  let params = {
    'contentType': 'application/json',
    'method': 'post',
    'payload': data,
    'muteHttpExceptions': true
  };
  let request = UrlFetchApp.fetch(this.botUrl + endPoint, params);
  let response = JSON.parse(request.getContentText());
  if (response.ok) return response;
  else throw response.description + '\n\n`' + data + '`';
}

/**
* @param {Object} entities
* @return {boolean}
*/
function isBotCommand(entities) {
  if (!entities) return false;
  let command = entities[0].type == 'bot_command';
  let offset = entities[0].offset == 0;
  if (command && offset) return true;
  return false;
}

/**
* @param {String} text
* @return {boolean}
*/
function isValidTrigger(text) {
  if (!this.trigger) return true;
  if (!text) return false;
  if (text.toLowerCase().includes(this.trigger)) return true;
  return false;
}

/**
* @param {String} text
* @return {Object}
*/
function parseMessage(text) {
  let name = this.channel + '/';
  let format = ['http://', 'https://', ''];
  let separate = ['.rep', '-reply!', '-reply', ' '];
  let result = {
    id: 0,
    text: text
  };
  if (!text) return result;
  for (let i in format) {
    let name = format[i] + 't.me/' + this.channel + '/';
    if (text.indexOf(name) != 0) continue;
    let start = text.indexOf(name) + name.length;
    if (start == name.length - 1) continue;
    for (let n in separate) {
      let end = text.indexOf(separate[n]);
      if (end == -1 || start == end) continue;
      result.id = parseInt(text.substring(start, end));
      result.text = text.substring(end + separate[n].length);
      return result;
    }
  }
  return result;
}

/**
* @param {String} command
* @return {boolean}
*/
function sendBotCommand(command) {
  if (!command.toLowerCase().includes(' ')) return false;
  sendMessage(command, this.creator);
  this.thanks = this.report;
  return true;
}

/**
* @param {String} message
* @param {String | Number} id
* @param {boolean} preview
* @param {String} parse
* @return {Object}
*/
function sendMessage(message, id = this.username, preview = false, parse = 'Markdown') {
  message = parseMessage(message);
  let params = {
    chat_id: id,
    text: message.text,
    parse_mode: parse,
    disable_web_page_preview: preview,
    reply_to_message_id: message.id
  };
  let response = request('/sendMessage', params);
  return response.result;
}

/**
* @param {String} image
* @param {String | Number} id
* @return {Object}
*/
function sendSticker(image, id = this.username) {
  let params = {
    chat_id: id,
    sticker: image
  };
  let response = request('/sendSticker', params);
  return response.result;
}

/**
* @param {String} image
* @param {String} message
* @param {String | Number} id
* @param {String} parse
* @return {Object}
*/
function sendPhoto(image, message, id = this.username, parse = 'Markdown') {
  message = parseMessage(message);
  let params = {
    chat_id: id,
    photo: image,
    caption: message.text,
    parse_mode: parse,
    reply_to_message_id: message.id
  };
  let response = request('/sendPhoto', params);
  return response.result;
}

/**
* @param {String} image
* @param {String} message
* @param {String | Number} id
* @param {String} parse
* @return {Object}
*/
function sendAnimation(image, message, id = this.username, parse = 'Markdown') {
  message = parseMessage(message);
  let params = {
    chat_id: id,
    animation: image,
    caption: message.text,
    parse_mode: parse,
    reply_to_message_id: message.id
  };
  let response = request('/sendAnimation', params);
  return response.result;
}

/**
* @param {String} video
* @param {String} message
* @param {String | Number} id
* @param {String} parse
* @return {Object}
*/
function sendVideo(vid, message, id = this.username, parse = 'Markdown') {
  message = parseMessage(message);
  let params = {
    chat_id: id,
    video: vid,
    caption: message.text,
    parse_mode: parse,
    reply_to_message_id: message.id
  };
  let response = request('/sendVideo', params);
  return response.result;
}

/**
* @param {String} audio
* @param {String} message
* @param {String | Number} id
* @param {String} parse
* @return {Object}
*/
function sendAudio(music, message, id = this.username, parse = 'Markdown') {
  message = parseMessage(message);
  let params = {
    chat_id: id,
    audio: music,
    caption: message.text,
    parse_mode: parse,
    reply_to_message_id: message.id
  };
  let response = request('/sendAudio', params);
  return response.result;
}

/**
* @param {String} document
* @param {String} message
* @param {String | Number} id
* @param {String} parse
* @return {Object}
*/
function sendDocument(doc, message, id = this.username, parse = 'Markdown') {
  message = parseMessage(message);
  let params = {
    chat_id: id,
    document: doc,
    caption: message.text,
    parse_mode: parse,
    reply_to_message_id: message.id
  };
  let response = request('/sendDocument', params);
  return response.result;
}

/**
* @param {Object} poll
* @param {String | Number} id
* @param {String} parse
* @return {Object}
*/
function sendPoll(poll, id = this.username, parse = 'Markdown') {
  let answers = [];
  for (let i in poll.options) answers.push(poll.options[i].text);
  let params = {
    chat_id: id,
    question: poll.question,
    options: answers,
    type: poll.type,
    allows_multiple_answers: poll.allows_multiple_answers,
    correct_option_id: poll.correct_option_id,
    explanation: poll.explanation,
    explanation_parse_mode: parse
  };
  let response = request('/sendPoll', params);
  return response.result;
}

/**
* @param {String} dice
* @param {String | Number} id
* @return {Object}
*/
function sendDice(dice, id = this.username) {
  let params = {
    chat_id: id,
    emoji: dice
  };
  let response = request('/sendDice', params);
  return response.result;
}

function setWebhook() {
  request('/deleteWebhook');
  let params = {
    url: 'https://script.google.com/macros/s/' + this.idExec + '/exec',
    allowed_updates: ['message', 'poll']
  };
  let response = request('/setWebhook', params);
  Logger.log(JSON.stringify(response, null, 2));
  return response.result;
}
