const SHEET_ID = '1V8pdRSN41t1BiAeApMeECNFgfVLA0XCGBHArrLwhUqM';
const SHEET_NAME = '申し込み';

const HEADERS = [
  '受付日時',
  '会社名',
  '姓',
  '名',
  'フリガナ（姓）',
  'フリガナ（名）',
  'メールアドレス',
  '電話番号',
  '参加予定人数',
  '希望ツール',
  'ご質問・備考',
  '送信日時',
];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);

    // シートがなければ作成してヘッダーを設定
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length)
        .setFontWeight('bold')
        .setBackground('#d97757')
        .setFontColor('#ffffff');
      sheet.setFrozenRows(1);
    }

    const row = [
      new Date(),
      data.companyName || '',
      data.lastName    || '',
      data.firstName   || '',
      data.lastNameKana  || '',
      data.firstNameKana || '',
      data.email        || '',
      data.phone        || '',
      data.participants || '',
      data.tools        || '',
      data.notes        || '',
      data.submittedAt  || '',
    ];

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// CORS対応（OPTIONS プリフライト）
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}
