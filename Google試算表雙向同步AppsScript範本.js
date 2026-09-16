// ===== 五年甲班 國語朗讀雙向雲端連動腳本 =====
// 請至 Google 試算表（五年甲班_國語朗讀成績總表_範本）
// 點選頂部「擴充功能」➔「Apps Script」
// 清空裡面的內容，完整貼上本腳本，點擊「部署」➔「新增部署作業」
// 類型選擇「網頁應用程式」，存取權限務必選擇「所有人（Anyone）」
// 將產生的 Web 應用程式網址複製起來！

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var props = PropertiesService.getScriptProperties();
  
  // 1. 取得老師最新發布的課文段落與學生指派
  var passagesJson = props.getProperty("cloud_passages_v1");
  var passages = null;
  if (passagesJson) {
    try { passages = JSON.parse(passagesJson); } catch(err){}
  }
  
  // 2. 取得全班最新成績總表
  var data = sheet.getDataRange().getValues();
  var grades = [];
  if (data.length > 1) {
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (row[0] !== "" && row[0] !== undefined) {
        grades.push({
          seatNumber: String(row[0]).padStart(2, '0'),
          name: String(row[1] || ''),
          status: String(row[2] || '未繳交'),
          time: row[3] ? Utilities.formatDate(new Date(row[3]), "GMT+8", "yyyy-MM-dd HH:mm") : (row[3] || '-'),
          score: row[4] !== undefined ? String(row[4]) : '-',
          accuracy: row[5] !== undefined ? String(row[5]) : '-',
          fluency: row[6] !== undefined ? String(row[6]) : '-',
          wpm: row[8] !== undefined ? String(row[8]) : '-',
          errors: row[9] ? String(row[9]) : ''
        });
      }
    }
  }
  
  var output = {
    status: "success",
    passages: passages,
    grades: grades
  };
  
  return ContentService.createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var props = PropertiesService.getScriptProperties();
  
  var payload = JSON.parse(e.postData.contents);
  
  // 動作 A：老師端儲存並發布課文段落
  if (payload.action === "savePassages") {
    props.setProperty("cloud_passages_v1", JSON.stringify(payload.passages));
    return ContentService.createTextOutput(JSON.stringify({ status: "success", type: "passages_saved" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  // 動作 B：學生平板送出朗讀成績
  var seatNumber = parseInt(payload.seatNumber, 10);
  var data = sheet.getDataRange().getValues();
  var targetRow = -1;
  
  for (var i = 1; i < data.length; i++) {
    if (parseInt(data[i][0], 10) === seatNumber) {
      targetRow = i + 1;
      break;
    }
  }
  
  var nowStr = Utilities.formatDate(new Date(), "GMT+8", "yyyy-MM-dd HH:mm");
  var rowValues = [
    seatNumber,
    payload.studentName,
    "已繳交",
    nowStr,
    payload.score,
    payload.accuracy,
    payload.fluency,
    100,
    payload.wpm,
    payload.errors || "無",
    0
  ];
  
  if (targetRow > 0) {
    sheet.getRange(targetRow, 1, 1, rowValues.length).setValues([rowValues]);
  } else {
    sheet.appendRow(rowValues);
  }
  
  return ContentService.createTextOutput(JSON.stringify({ status: "success", type: "grade_saved" }))
    .setMimeType(ContentService.MimeType.JSON);
}
