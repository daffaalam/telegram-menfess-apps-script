function doGet(e) { return HtmlService.createHtmlOutput(alert) }

function doPost(e) {
  if (!e.postData) return;
  if (e.postData.type != 'application/json') return;
  let data = JSON.parse(e.postData.contents);
  try {
    let message = data.message;
    if (!message) return;
    let sent;
    let validTrigger = isValidTrigger(message.text) || isValidTrigger(message.caption);
    if (message.media_group_id) Utilities.sleep(2000);
    if (isBotCommand(message.entities) || !validTrigger) return;
    else if (message.text) sent = sendMessage(message.text);
    else if (message.sticker) sent = sendSticker(message.sticker.file_id);
    else if (message.photo) sent = sendPhoto(message.photo[0].file_id, message.caption);
    else if (message.animation) sent = sendAnimation(message.animation.file_id, message.caption);
    else if (message.video) sent = sendVideo(message.video.file_id, message.caption);
    else if (message.audio) sent = sendAudio(message.audio.file_id, message.caption);
    else if (message.document) sent = sendDocument(message.document.file_id, message.caption);
    else if (message.poll) sent = sendPoll(message.poll);
    else if (message.dice) sent = sendDice(message.dice.emoji);
    else sendMessage('`' + JSON.stringify(message, null, 2) + '`', creator);
    if (sent) sendMessage(thanks, message.from.id);
  } catch (error) {
    error = 'ERROR @' + channel + '\n\n' + error.toString();
    error += '\n\n`' + JSON.stringify(data, null, 2) + '`';
    sendMessage(error, creator);
  }
}

function request(endPoint, data) {
  let params = {
    'contentType': 'application/json',
    'method': 'post',
    'payload': JSON.stringify(data, null, 2),
    'muteHttpExceptions': true
  };
  let request = UrlFetchApp.fetch(botUrl + endPoint, params);
  let response = JSON.parse(request.getContentText());
  if (response.ok) return response;
  else throw response.description;
}

function isBotCommand(entities) {
  if (!entities) return false;
  let command = entities[0].type == 'bot_command';
  let offset = entities[0].offset == 0;
  if (command && offset) return true;
  return false;
}

function isValidTrigger(text) {
  if (!trigger) return true;
  if (!text) return false;
  if (text.toLowerCase().includes(trigger)) return true;
  return false;
}

function parseMessage(text) {
  let name = channel + '/';
  let separate = '.rep';
  let result = {};
  if (!text) return result;
  let end = text.indexOf(separate);
  let start = text.indexOf(name) + name.length;
  if (end == -1 || start == name.length - 1) {
    result.text = text;
  } else {
    result.id = text.substring(0, end);
    result.id = result.id.substr(start);
    result.text = text.substr(end + separate.length);
  }
  return result;
}

function sendMessage(message, id = username, preview = false) {
  message = parseMessage(message);
  let params = {
    chat_id: id,
    text: message.text,
    parse_mode: 'Markdown',
    disable_web_page_preview: preview,
    reply_to_message_id: message.id
  };
  let response = request('/sendMessage', params);
  return response.result;
}

function sendSticker(image, id = username) {
  let params = {
    chat_id: id,
    sticker: image
  };
  let response = request('/sendSticker', params);
  return response.result;
}

function sendPhoto(image, message, id = username) {
  message = parseMessage(message);
  let params = {
    chat_id: id,
    photo: image,
    caption: message.text,
    parse_mode: 'Markdown',
    reply_to_message_id: message.id
  };
  let response = request('/sendPhoto', params);
  return response.result;
}

function sendAnimation(image, message, id = username) {
  message = parseMessage(message);
  let params = {
    chat_id: id,
    animation: image,
    caption: message.text,
    parse_mode: 'Markdown',
    reply_to_message_id: message.id
  };
  let response = request('/sendAnimation', params);
  return response.result;
}

function sendVideo(vid, message, id = username) {
  message = parseMessage(message);
  let params = {
    chat_id: id,
    video: vid,
    caption: message.text,
    parse_mode: 'Markdown',
    reply_to_message_id: message.id
  };
  let response = request('/sendVideo', params);
  return response.result;
}

function sendAudio(music, message, id = username) {
  message = parseMessage(message);
  let params = {
    chat_id: id,
    audio: music,
    caption: message.text,
    parse_mode: 'Markdown',
    reply_to_message_id: message.id
  };
  let response = request('/sendAudio', params);
  return response.result;
}

function sendDocument(doc, message, id = username) {
  message = parseMessage(message);
  let params = {
    chat_id: id,
    document: doc,
    caption: message.text,
    parse_mode: 'Markdown',
    reply_to_message_id: message.id
  };
  let response = request('/sendDocument', params);
  return response.result;
}

function sendPoll(poll, id = username) {
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
    explanation_parse_mode: 'Markdown'
  };
  let response = request('/sendPoll', params);
  return response.result;
}

function sendDice(dice, id = username) {
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
    url: 'https://script.google.com/macros/s/' + idExec + '/exec',
    allowed_updates: ['message', 'poll']
  };
  let response = request('/setWebhook', params);
  return response.result;
}
