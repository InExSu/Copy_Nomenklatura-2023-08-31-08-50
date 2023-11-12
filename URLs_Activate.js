// /** 
//  * сделать ссылки активными
//  */
// function spreadSheet_Sheets_Links_Activate(sheet) {
//   var spreadsheet = SpreadsheetApp.getActive();
//   var sheet = spreadsheet.getSheetByName('сводная таблица');
//   sheet_Links_Activate(sheet);

// }

// /**
//  * Удали
//    */
// function clearNonLinks() {
//   var sheet = SpreadsheetApp.getActiveSheet();
//   var range = sheet.getDataRange();
//   var values = range.getValues();

//   for (var i = 0; i < values.length; i++) {
//     for (var j = 0; j < values[i].length; j++) {
//       if (typeof values[i][j] === 'string' && !values[i][j].match(/http(s)?:\/\/\S+/gi)) {
//         sheet.getRange(i + 1, j + 1).clearContent();
//       }
//     }
//   }
// }

// function range_Cells_clearContent_RegEx_Test() {
//   var sheet = SpreadsheetApp.getActive().getSheetByName('Тест удалить');
//   var range = sheet.getRange("A1:B4");
//   range_Cells_clearContent_RegEx(range, /http(s)?:\/\/\S+/gi, '');
// }

// /**
//  * В диапазоне ячейки, в которых подстроки не соответствуют 
//  * регулярному выражению,
//  * заменить на repla
//  * 
//  * @param {GoogleAppsScript.Spreadsheet.Range} range 
//  * @param {RegExp} regex 
//  * @param {String} repla 
//  */
// function range_Cells_clearContent_RegEx(range, regex, repla) {

//   range.setValues(
//     array_RegEx_Replace(
//       range.getValues(),
//       regex,
//       repla));
//   // var arr = range.getValues();
//   // var arrNew = array_RegEx_Replace(arr, regex, repla);
//   // range.setValues(arrNew);
// }

// /** принимает массив двумерный, регулярное выражение и строку замены.
// * Проходом по всем элементам массива, если в элементе есть подстрока, 
// * соответствующая регулярному выражению, 
// *   то заменить элемент массива на 
// *     эту подстроку, 
// *   иначе 
// *     replacement.
// * Вернёть обновлённый массив такого же размера.
//   * 
//  * @param {Array} arr 
//  * @param {String} regExp 
//  * @param {String} replacement 
//  * @returns {Array}
//  */
// function array_RegEx_Replace(arr, regExp, replacement) {
//   return arr.map((row) => {
//     return row.map((element) => {
//       return replaceIfMatchesRegex(element, regExp, replacement);
//     });
//   });
// }

// /** если значение строка и содержит подстроку, подходящую под 
//  * регулярное выражение - заменить на подстроку, иначе - 
//  * на замену
//  * 
//  * @param {String} value 
//  * @param {String} regex 
//  * @param {Stirng} replacementString 
//  * @returns {Stirng}
//  */
// function replaceIfMatchesRegex(value, regex, replacement) {
//   var match = value.toString().match(new RegExp(regex));
//   return match ? match[0] : replacement;
// }

// function sheet_Links_Activate(sheet) {

//   let range = sheet.getDataRange();
//   let a2d = range.getValues();

//   let address = '';
//   let cell = '';
//   let value = '';

//   let spread = SpreadsheetApp.getActive();

//   for (let row = 0; row < a2d.length; row++) {

//     if (row % 100 === 0) {
//       spread.toast('Начинаю обрабатывать строки c ' + row + ' по ' + (row + 100) + ' из ' + a2d.length);
//     }

//     for (let col = 0; col < a2d[0].length; col++) {

//       value = a2d[row][col].toString();

//       // TODO value = url_Or_Empty(value);

//       if (value.startsWith('http')) {

//         address = columnToLetter(col + 1) + (row + 1);
//         cell = sheet.getRange(address);
//         cell_Link_Activate(cell);
//       }
//     }
//   }
// }
// function cell_Link_Activate_Test(range) {
//   var cell = SpreadsheetApp.getActive().getSheetByName('Лист32').getRange('B3');
//   cell_Link_Activate(cell);
// }

// function url_Or_Empty_Test() {
//   result = url_Or_Empty(' href https://cdn-ru.bitrix24.ru/b6361393/catalog/853/8534962d742a2fd9de4e95f2a2a1f498/rukovodstvo RPG-67 2017g..PDF href');
// }

//   /** Гиперссылка или пусто
//  * 
//  * @param {String} value 
//  * @returns 
//  */
// function url_Or_Empty(value) {
//   return replaceIfMatchesRegex(value, /\bhttps?:\/\/\S+\s\S+\.\w{3}\b/gi, '');
// }

// /** 
//  * Сделать ячейке активную ссылку
//  */
// function cell_Link_Activate(cell) {

//   //TODO let value = url_Or_Empty(cell.getValue());
//   let value = cell.getValue();

//   cell.setRichTextValue(SpreadsheetApp.newRichTextValue()
//     .setText(value)
//     .setLinkUrl(value)
//     .build());
// }

// function columnToLetter_Test() {
//   Logger.log(columnToLetter(27));
// }

// function columnToLetter(column) {
//   var temp, letter = '';
//   while (column > 0) {
//     temp = (column - 1) % 26;
//     letter = String.fromCharCode(temp + 65) + letter;
//     column = (column - temp - 1) / 26;
//   }
//   return letter;
// }

