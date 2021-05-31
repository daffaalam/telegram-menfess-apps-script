const version = 1205312000;

/**
 * @param {object} e
 * @return {HtmlService.HtmlOutput}
 */
function doGet(e) { return HtmlService.createHtmlOutput(this.alert) }

/**
 * @param {object} e
 * @return {ContentService.TextOutput}
 */
function doPost(e) {
  if (!e.postData) return;
  if (e.postData.type != 'application/json') return;
  let data = JSON.parse(e.postData.contents);
  data.version = version;
  try {
    let message = data.message;
    if (!message) return;
    if (message.chat.type == 'supergroup') return;
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
    else sendMessage('`' + JSON.stringify(message, null, 2) + '`', this.admin);
    if (sent) sendMessage(this.thanks, message.from.id);
  } catch (error) {
    error = 'ERROR @' + this.channel + '\n\n' + error.toString();
    error += '\n\n`' + JSON.stringify(data, null, 2) + '`';
    sendMessage(error, this.admin);
  }
  let output = ContentService.createTextOutput(JSON.stringify(data, null, 2));
  return output.setMimeType(ContentService.MimeType.JSON);
}

/**
 * @param {object} data
 * @param {string} data.token
 * @param {number} data.admin
 * @param {string} data.trigger
 * @param {string} data.channel
 * @param {string} data.exec
 * @param {string} data.thanks
 * @param {string} data.report
 * @param {string} data.invalid
 * contact me at Telegram.
 * username: daffaalam
 * id: 256902271
 * @return {this}
 */
function init(data) {
  if (!data || data == {}) throw 'data must not be null or empty';
  if (!data.token) throw 'data token must not be null or empty';
  if (!data.exec) throw 'data exec must not be null or empty';
  if (!data.channel) throw 'data channel must not be null or empty';
  let thanks = 'Thanks for using this bot, your message will be sent immediately to ';
  this.token = data.token;
  this.botUrl = 'https://api.telegram.org/bot' + this.token;
  this.admin = data.admin || -1001385703290;
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
 * @param {string} endPoint
 * @param {object} data
 * @return {object}
 */
function request(endPoint, data = {}) {
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
 * @param {object} entities
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
 * @param {string} text
 * @return {boolean}
 */
function isValidTrigger(text) {
  if (!this.trigger) return true;
  if (!text) return false;
  if (text.toLowerCase().includes(this.trigger)) return true;
  return false;
}

/**
 * @param {string} text
 * @return {object}
 */
function parseMessage(text) {
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
 * @param {string} command
 * @return {boolean}
 */
function sendBotCommand(command) {
  if (!command.toLowerCase().includes(' ')) return false;
  sendMessage(command, this.admin);
  this.thanks = this.report;
  return true;
}

/**
 * @param {string} message
 * @param {string | number} id
 * @param {boolean} preview
 * @param {string} parse
 * @return {object}
 */
function sendMessage(message, id = this.username, preview = false, parse = 'Markdown') {
  let msg = parseMessage(message);
  let params = {
    chat_id: id,
    text: msg.text,
    parse_mode: parse,
    disable_web_page_preview: preview,
    reply_to_message_id: msg.id
  };
  let response = request('/sendMessage', params);
  return response.result;
}

/**
 * @param {string} image
 * @param {string | number} id
 * @return {object}
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
 * @param {string} image
 * @param {string} message
 * @param {string | number} id
 * @param {string} parse
 * @return {object}
 */
function sendPhoto(image, message, id = this.username, parse = 'Markdown') {
  let msg = parseMessage(message);
  let params = {
    chat_id: id,
    photo: image,
    caption: msg.text,
    parse_mode: parse,
    reply_to_message_id: msg.id
  };
  let response = request('/sendPhoto', params);
  return response.result;
}

/**
 * @param {string} image
 * @param {string} message
 * @param {string | number} id
 * @param {string} parse
 * @return {object}
 */
function sendAnimation(image, message, id = this.username, parse = 'Markdown') {
  let msg = parseMessage(message);
  let params = {
    chat_id: id,
    animation: image,
    caption: msg.text,
    parse_mode: parse,
    reply_to_message_id: msg.id
  };
  let response = request('/sendAnimation', params);
  return response.result;
}

/**
 * @param {string} vid
 * @param {string} message
 * @param {string | number} id
 * @param {string} parse
 * @return {object}
 */
function sendVideo(vid, message, id = this.username, parse = 'Markdown') {
  let msg = parseMessage(message);
  let params = {
    chat_id: id,
    video: vid,
    caption: msg.text,
    parse_mode: parse,
    reply_to_message_id: msg.id
  };
  let response = request('/sendVideo', params);
  return response.result;
}

/**
 * @param {string} music
 * @param {string} message
 * @param {string | number} id
 * @param {string} parse
 * @return {object}
 */
function sendAudio(music, message, id = this.username, parse = 'Markdown') {
  let msg = parseMessage(message);
  let params = {
    chat_id: id,
    audio: music,
    caption: msg.text,
    parse_mode: parse,
    reply_to_message_id: msg.id
  };
  let response = request('/sendAudio', params);
  return response.result;
}

/**
 * @param {string} doc
 * @param {string} message
 * @param {string | number} id
 * @param {string} parse
 * @return {object}
 */
function sendDocument(doc, message, id = this.username, parse = 'Markdown') {
  let msg = parseMessage(message);
  let params = {
    chat_id: id,
    document: doc,
    caption: msg.text,
    parse_mode: parse,
    reply_to_message_id: msg.id
  };
  let response = request('/sendDocument', params);
  return response.result;
}

/**
 * @param {object} poll
 * @param {string | number} id
 * @param {string} parse
 * @return {object}
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
 * @param {string} dice
 * @param {string | number} id
 * @return {object}
 */
function sendDice(dice, id = this.username) {
  let params = {
    chat_id: id,
    emoji: dice
  };
  let response = request('/sendDice', params);
  return response.result;
}

/**
 * @return {object}
 */
function setWebhook() {
  request('/deleteWebhook');
  let params = {
    url: 'https://script.google.com/macros/s/' + this.idExec + '/exec',
    allowed_updates: ['message', 'poll']
  };
  return request('/setWebhook', params);
}
