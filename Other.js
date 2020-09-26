function sendCoronaUpdate() {
  let base = 'covid19.go.id';
  let url = 'https://data.' + base + '/public/api/update.json';
  let request = UrlFetchApp.fetch(url);
  let response = JSON.parse(request.getContentText());
  let updateDate = response.update.penambahan.created;
  let allPositive = response.update.total.jumlah_positif;
  let allTreated = response.update.total.jumlah_dirawat;
  let allRecover = response.update.total.jumlah_sembuh;
  let allDied = response.update.total.jumlah_meninggal;
  let message = 'COVID19 UPDATE\n\n*' + updateDate + '*\n';
  message += '\nTotal Positif : *' + allPositive + '*';
  message += '\nTotal Dirawat : *' + allTreated + '*';
  message += '\nTotal Sembuh : *' + allRecover + '*';
  message += '\nTotal Meninggal : *' + allDied + '*';
  message += '\n\n#PakaiMasker #JagaJarak #DiRumahAja #StaySave';
  message += '\n\nSumber : ' + base;
  sendMessage(message, username, true);
}
