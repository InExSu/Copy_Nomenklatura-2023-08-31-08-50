/** Лист 'сводная таблица' существует?
  Нет
    отправить e-mailы владельцу таблицы и пользователю, запустившему скрипт
    завершить скрипт
  Да
    Вернуть лист
Работаем с листом 'сводная таблица'
Строку 1 в массив1
Поиск в массив1 элементов из массивСтрок
  Элемент найден?
    Нет
      отправить e-mail владельцу таблицы 
      Пользователю показать сообщение
    Да
      По ячейке взять столбец
      Диапазон столбца в массив
        Проход по массиву */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function pivot_Links_Activate() {

  const headers = [
    'Картинки товара',
    'Руководство по эксплуатации',
    'Сертификат',
    'Описание (ТЗ)',
    // 'Ссылка на файл Руководство по эксплуатации'
  ];

  const regExps = [
    /https:\/\/cdn.*\.[a-zA-Z]{3}/gi,
    /https:\/\/[a-zA-Z0-9_\-\/~.]+/gi];

  headers_Work(headers, 1,
    sheet_Check_or_End('сводная таблица'), regExps);

}
/**
  Строку row листа sheet в массив1
  Циклом поиск в массив1 элементов из headers
  Элемент найден?
    Нет
      вызвать sheet_Check_or_End(sheetName)
    Да
      По ячейке взять диапазон столбца
      Диапазон столбца в массив values
      вызвать range_URLs{
 */
function headers_Work(headers, row, sheet, regExps) {

  var values = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];

  for (var i = 0; i < headers.length; i++) {

    var columnIndex = values.indexOf(headers[i]);

    if (columnIndex !== -1) {

      const timeStart = Date.now();

      var columnRange = sheet.getRange(row + 1,
        columnIndex + 1,
        sheet.getLastRow() - 1, 1);

      range_URLs(columnRange, regExps);

      const timeDiff = Date.now() - timeStart;
      SpreadsheetApp.getActive().toast('Столбец ' +
        headers[i] + '\n отработал за ' +
        timeDiff / 1000 + ' секунд.');

    } else {

      email_Exit(
        sheet.getName() +
        ' - столбец не найден: ' + headers[i],
        false);
    }
  }
}

/** В диапазоне сделать ссылки активными.
  Если ячейка пустая - ничего не делать.
  Если в ячейке нет строк под массив regExps - ячейку очистить, 
  иначе - сделать подстроки по regulars активными.
 */
function range_URLs(range, regExps) {

  range.setRichTextValues(range.getValues().map(row => row.map(cell => {
    let richText = string_2_RichText(cell, regExps, '\n');
    return richText || SpreadsheetApp.newRichTextValue().build();
  })));

}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function range_URLs_Test() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const range = sheet.getRange(1, 1, 3, 1);
  range.setValues([['https://www.google.com'], ['invalid url'], ['']]);
  range_URLs(range);
  const richTextValues = range.getRichTextValues();
  const expectedValues = [[SpreadsheetApp.newRichTextValue().setText('https://www.google.com').setLinkUrl(0, 23, 'https://www.google.com').build()],
  [''],
  ['']
  ];
  assertEquals(richTextValues, expectedValues);
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
function regExp_Count_Test() {
  let string = 'The quick brown fox jumps over the lazy dog';
  let regExps = ['the', 'fox'];
  let result = regExp_Count(string, regExps);
  if (result != 2) Logger.log('regExp_Count_Test ошибка');

  string = 'The quick brown fox jumps over the lazy dog';
  regExps = ['the', 'fox', 'cat'];
  const expected = 2; // 'the' appears twice ('The' and 'the'), 'fox' appears once, 'cat' doesn't appear
  result = regExp_Count(string, regExps);
  if (result !== expected) Logger.log(arguments.callee.name + 'ошибка 1');

  string = '"https://cdn-ru.bitrix24.ru/b6361393/iblock/a57/a57e309be6f642d0166cdd64e09427a2/PDF s GP-7K.jpg\nhttps://cdn-ru.bitrix24.ru/b6361393/iblock/a57/a57e309be6f642d0166cdd64e09427a2/PDF s GP-7K.jpg"';
  regExps = [
    /https:\/\/cdn.*\.[a-zA-Z]{3}/gi,
    /https:\/\/[^\s]+/gi];

  result = regExp_Count(string, regExps);

  if (result != 4) Logger.log(arguments.callee.name + 'ошибка 2');
}

/**
 * @param {String} string
 * @param {Array} regExps
 * @returns {number} сумма совпадений по регуляркам
 */
function regExp_Count(string, regExps) {
  let count = 0;
  for (let i = 0; i < regExps.length; i++) {
    const re = new RegExp(regExps[i], 'g');
    const matches = string.match(re);
    if (matches) {
      count += matches.length;
    }
  }
  return count;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function string_2_RichText_Test() {
  const string = "This is a string with some links: https://www.google.com, https://www.youtube.com, and https://www.facebook.com";
  const regExps = [
    /https:\/\/www\.[a-z]+\.[a-z]+/gi,
    /https:\/\/[^\s]+/gi
  ];
  const separ = "\n";
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const expected = SpreadsheetApp.newRichTextValue()
    .setText(string)
    .setLinkUrl(24, 40, "https://www.google.com")
    .setLinkUrl(43, 61, "https://www.youtube.com")
    .setLinkUrl(68, 88, "https://www.facebook.com")
    .build();
  const richText = string_2_RichText(string, regExps, separ);
  if (!typeof richText.copy === 'function') {
    Logger.log('Ошибка: НЕТ метода copy');
  }
}

/** Найти в строке подстроки массивом регулярных и 
 * сделать их активными ссылками,
 * 
 * @param {String} string
 * @param {Array<String>} regExps
 * @param {String} separ
 * @return RichTextValue
 */
function string_2_RichText(string, regExps, separ) {
  // return array_2_setLinkUrl(
  //   array_Unique(
  //     array_From_RegExps(string, regExps)),
  //   separ);

  return array_2_setLinkUrl(
    arrayFilter(
      array_Unique(
        stringToArray(string, "\n")),
      separ), "");
}

/**
 * очистить массив от subs
 * @param {Array} arr 
 * @param {String} subs 
 * @returns 
 */
function arrayFilter(arr, subs) {
  return arr.filter(item => item !== subs);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function array_2_setLinkUrl_Test() {
  const urls = [
    'https://www.google.com',
    'https://www.youtube.com',
    'https://www.facebook.com'
  ];
  const separ = '\n';
  const richTextValue = array_2_setLinkUrl(urls, separ);

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const cell = sheet.getRange('A1');
  cell.setRichTextValue(richTextValue);
}


/** Создать из массива строк RichTextValue - активные ссылки.
 * в setText должны быть элементы urls, разделённые separ.
 *
 * @param {Array} urls массив элементов строк типа 'https://ya.ru'
 * @param {String} separ разделитель 
 * @return {RichTextValue}
 * После вставки RichTextValue в ячейку, в ячейке должны быть 
 * все элементы массива как активные ссылки, через разделитель
 */
function array_2_setLinkUrl(urls, separ) {

  const cellText = urls.join(separ);

  const richText = SpreadsheetApp.newRichTextValue().setText(cellText);

  urls.forEach(url => {

    let start = cellText.indexOf(url);
    let stop_ = start + url.length;

    if (url.toString().length > 0)
      richText.setLinkUrl(start, stop_, url);
  });

  return richText.build();
}
/** 
 *   принимает массив и подстроку, добавляет к элементам массива подстроку, кроме последнего, возвращает массив
 */
function addSubstringToElementsExceptLast(array, substring) {
  for (var i = 0; i < array.length - 1; i++) {
    array[i] = array[i] + substring;
  }
  return array;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function array_Unique_test() {
  unique = array_Unique(['z', 'z'])
  assertEquals(unique, ['z']);
}
function array_Unique(arr) {
  return [...new Set(arr)];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function array_From_RegExps_Test() {
  const string = 'href https://cdn-ya.ru .pdf, https://go.ru href';
  const regExps = [
    /https:\/\/cdn.*\.[a-zA-Z]{3}/gi,
    /https:\/\/[^\s]+/gi
  ];
  const expectedResult = [
    'https://cdn-ya.ru .pdf',
    'https://go.ru'
  ];

  const result = array_From_RegExps(string, regExps);

  if (JSON.stringify(result) === JSON.stringify(expectedResult)) {
    Logger.log('Test passed');
  } else {
    Logger.log('Test failed');
  }
}

/** Вернуть массив подстрок, найденных массивом регулярных.
 * 
 * @param {Stting} string = 'href https://cdn-ya.ru .pdf, https://go.ru href'
 * @param {Array} regExps = [
    /https:\/\/cdn.*\.[a-zA-Z]{3}/gi,
    /https:\/\/[^\s]+/gi
  ]
  @returns {array} [
    'https://cdn-ya.ru .pdf',
    'https://go.ru']
*/
function array_From_RegExps(string, regExps) {
  let results = [];

  regExps.forEach(regExp => {
    const match = string.match(regExp);
    if (match) {
      results = results.concat(match);
      string = string.replace(new RegExp(`(${match.join('|')})`, 'g'), '');
    }
  });

  return results;
}

function testStringToArray() {
  // тест на разбиение строки на массив
  var inputString = "Hello\nworld!";
  var subString = "\n";
  var expectedResult = ["Hello", "world!"];

  var result = stringToArray(inputString, subString);

  assertEquals(result, expectedResult, "Результаты разбиения строк совпадают");

  // тест на преобразование строки в массив
  inputString = "Hello, world!";
  subString = "-";
  expectedResult = ["Hello, world!"];

  result = stringToArray(inputString, subString);

  assertEquals(result, expectedResult, "Результаты преобразования строки в массив совпадают");
}

/** 
 * если в строке есть подстрока разбивает строку подстрокой в массив, если нет, то делает строку массивом.
Возвращает массив.
 */
function stringToArray(inputString, subString) {
  var finalArray = [];

  // проверяем, содержит ли строка подстроку
  if (inputString.includes(subString)) {
    finalArray = addSubstringToElementsExceptLast(
      inputString.split(subString),
      subString); // разбиваем строку подстрокой в массив
  } else {
    finalArray.push(inputString); // делаем строку массивом
  }

  return finalArray;
}

/** Вернуть лист или завершить скрипт 
 */
function sheet_Check_or_End(sheetName) {
  // var sheetName = "сводная таблица"; // название листа, который нужно проверить
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);

  if (sheet == null) {
    email_Exit("Лист " + sheetName + " не найден в таблице " + ss.getName(),
      true);
  }
  return sheet;
}

/** Отправить письма и выйти */
function email_Exit(body, stop) {

  var ss = SpreadsheetApp.getActiveSpreadsheet();

  ss.toast(body, 'Выход');
  Logger.log(body);

  // Отправляем письма владельцу и пользователю
  // var emailOwner = ss.getOwner().getEmail();
  // var emailUser_ = Session.getActiveUser().getEmail();
  // var subject = "Номеклатура сводная - ошибка:";
  // MailApp.sendEmail(emailOwner, subject, body);
  // MailApp.sendEmail(emailUser_, subject, body);

  if (stop)
    throw new Error(msg);
}
