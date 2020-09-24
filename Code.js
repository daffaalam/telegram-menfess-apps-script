function doGet(e) {
  return HtmlService.createHtmlOutput(alert);
}

function doPost(e) {
  if (!e.postData) return;
  if (e.postData.type != 'application/json') return;
  let data = JSON.parse(e.postData.contents);
  let message = data.message;
  let idFrom = message.from.id;
  let idChat = message.chat.id;
  if (idFrom == idChat && !isJoin(idFrom)) {
    let params = {
      chat_id: idFrom,
      text: 'Please join to @' + channel + ' first.'
    };
    request('/sendMessage', params);
    return;
  }
  try {
    if (message.media_group_id) Utilities.sleep(1000);
    if (isBotCommand(message.entities)) return;
    else if (message.text) sendMessage(message.text);
    else if (message.sticker) sendSticker(message.sticker);
    else if (message.photo) sendPhoto(message.photo, message.caption);
    else if (message.animation) sendAnimation(message.animation, message.caption);
    else if (message.video) sendVideo(message.video, message.caption);
    else if (message.audio) sendAudio(message.audio, message.caption);
    else if (message.document) sendDocument(message.document, message.caption);
    else if (message.poll) sendPoll(message.poll);
    else if (message.dice) sendDice(message.dice);
  } catch (error) {
    let params = {
      chat_id: creator,
      text: error
    };
    request('/sendMessage', params);
  }
  /*
  let result = ContentService.createTextOutput(e.postData.contents);
  result.setMimeType(ContentService.MimeType.JSON);
  return result;
  */
}

function request(endPoint, data) {
  Utilities.sleep(1000);
  let params = {
    'contentType': 'application/json',
    'method': 'post',
    'payload': JSON.stringify(data),
    'muteHttpExceptions': true
  };
  let request = UrlFetchApp.fetch(botUrl + endPoint, params);
  let response = JSON.parse(request.getContentText());
  if (response.ok) return response;
  else throw response;
}

function isJoin(id) {
  try {
    let params = {
      chat_id: '@' + channel,
      user_id: id
    };
    let response = request('/getChatMember', params);
    return response.result ? true : false;
  } catch (e) {
    return false;
  }
}

function isBotCommand(entities) {
  if (!entities) return false;
  let command = entities[0].type == 'bot_command';
  let offset = entities[0].offset == 0;
  if (command && offset) return true;
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

function sendMessage(msg) {
  let message = parseMessage(msg);
  let params = {
    chat_id: '@' + channel,
    text: message.text,
    parse_mode: 'Markdown',
    reply_to_message_id: message.id
  };
  let response = request('/sendMessage', params);
  return response.result;
}

function sendSticker(img) {
  let params = {
    chat_id: '@' + channel,
    sticker: img.file_id,
  };
  /* TODO : reply_to_message_id */
  let response = request('/sendSticker', params);
  return response.result;
}

function sendPhoto(img, msg) {
  let message = parseMessage(msg);
  let params = {
    chat_id: '@' + channel,
    photo: img[0].file_id,
    caption: message.text,
    parse_mode: 'Markdown',
    reply_to_message_id: message.id
  };
  let response = request('/sendPhoto', params);
  return response.result;
}

function sendAnimation(anim, msg) {
  let message = parseMessage(msg);
  let params = {
    chat_id: '@' + channel,
    animation: anim.file_id,
    caption: message.text,
    parse_mode: 'Markdown',
    reply_to_message_id: message.id
  };
  let response = request('/sendAnimation', params);
  return response.result;
}

function sendVideo(vid, msg) {
  let message = parseMessage(msg);
  let params = {
    chat_id: '@' + channel,
    video: vid.file_id,
    caption: message.text,
    parse_mode: 'Markdown',
    reply_to_message_id: message.id
  };
  let response = request('/sendVideo', params);
  return response.result;
}

function sendAudio(music, msg) {
  let message = parseMessage(msg);
  let params = {
    chat_id: '@' + channel,
    audio: music.file_id,
    caption: message.text,
    parse_mode: 'Markdown',
    reply_to_message_id: message.id
  };
  let response = request('/sendAudio', params);
  return response.result;
}

function sendDocument(doc, msg) {
  let message = parseMessage(msg);
  let params = {
    chat_id: '@' + channel,
    document: doc.file_id,
    caption: message.text,
    parse_mode: 'Markdown',
    reply_to_message_id: message.id
  };
  let response = request('/sendDocument', params);
  return response.result;
}

function sendPoll(poll) {
  let answers = [];
  for (let i in poll.options) answers.push(poll.options[i].text);
  let params = {
    chat_id: '@' + channel,
    question: poll.question,
    options: answers,
    type: poll.type,
    allows_multiple_answers: poll.allows_multiple_answers,
    correct_option_id: poll.correct_option_id,
    explanation: poll.explanation,
    explanation_parse_mode: 'Markdown'
  };
  /* TODO : reply_to_message_id */
  let response = request('/sendPoll', params);
  return response.result;
}

function sendDice(dice) {
  let params = {
    chat_id: '@' + channel,
    emoji: dice.emoji
  };
  /* TODO : reply_to_message_id */
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
