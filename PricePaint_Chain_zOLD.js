/**Обновить историю артикулов
 Создать массив  артикул-цена из листа Прайс без НДС

 Проходом по массиву
 Артикул в истории есть
 Цена изменилась
 обновить цену, дату, пользователя
 Артикула в истории нет
 Добавить Артикул, цену, дату, пользователя

 Историю артикулов на лист

 // красить все ячейки цены
 Проход по ячейкам артикулов Прайс без НДС
 Получить свежую дату артикулов ячейки
 Дата древнее Даты краски
 ячейку цены в белый
 Дата моложе  Даты краски
 ячейку цены в белый

 диапазон Цены обновить backGrounds
 */

// var NS = {};

function cell_Price_Paint_onEdit_Test() {

  let cell = SPREAD.getSheetByName('Прайс без НДС').getRange('D8');

  let event = {
    range: cell,
    oldValue: cell.getValue(),
    value: 1 + cell.getValue(),
  };

  // event.range.setBackground('white');

  cell_Price_Paint_onEdit(event);

  let color_New = cell.getBackground();
  if (color_New !== "#ffff00") throw new Error('ожидался жёлтый');

  let value = table_Intersect_Value(
    SPREAD.getSheetByName('Прайс без НДС Артикулы история').getDataRange().getValues(),
    1, 2, '102-132-0002');

  if (value != event.value) 
    Logger.log(value + ' != ' + event.value);

  // тест измененя ячейки артикула
  const sheet_SKUs_History = SPREAD.getSheetByName('Прайс без НДС Артикулы история');
  const sheet_Price = SPREAD.getSheetByName('Прайс без НДС');
  cell = sheet_Price.getRange("M8");
  const cell_Value = cell.getValue();
  const sku = '123-123-1234';

  cell.setValue(cell_Value + ', ' + sku);

  event.range = cell;

  cell_Price_Paint_onEdit(event);

  cell.setValue(cell_Value);

  const table = sheet_SKUs_History.getDataRange().getValues();

  const result = table_Intersect_Value(table, 1, 2, sku);

  const wanted = SPREAD.getSheetByName('Прайс без НДС').getRange('D8').getValue();

  sheet_Row_Delete_by_Value(sheet_SKUs_History, sku);

  if (result !== wanted) throw new Error(result + ' !== ' + wanted);
}

/** на листе найти значение и удалить строки с этим значением */
function sheet_Row_Delete_by_Value(sheet, needle) {
  var data = sheet.getDataRange().getValues();

  for (var i = data.length - 1; i > 0; i--) {
    if (data[i].indexOf(needle) !== -1) {
      sheet.deleteRow(i + 1); // Индекс строки на листе начинается с 1
    }
  }
}

function sKUS_History_2_Sheet_onEdit(obj) {

  if (!obj.state) return obj;

  const sheet = obj.cell_Changed.getSheet();
  const cell = sheet.getRange(1, 1);

  table_2_Range(obj.sKUs_History, cell);
}

function skus_History_Update_onEdit_Test() {

  let obj = { state: false }

  let result = skus_History_Update_onEdit(obj);

  if (result.sKUs_History !== undefined) throw new Error('obj.sKUs_History !== undefined');

  const sheet = SPREAD.getSheetByName('Прайс без НДС Артикулы история');
  const sKUs_History = sheet.getDataRange().getValues();

  obj.state = true
  obj.sKUs_1D = [sKUs_History[1][1], sKUs_History[2][1]];
  obj.price = 9;

  result = skus_History_Update_onEdit(obj);
  if (result.sKUs_History === undefined) throw new Error('obj.sKUs_History === undefined');

  if (obj.sKUs_History[1][2] !== obj.price) throw new Error(obj.sKUs_History[1][2] !== obj.price);
  if (obj.sKUs_History[2][2] !== obj.price) throw new Error(obj.sKUs_History[2][2] !== obj.price);
}

function skus_History_Update_onEdit(obj) {

  if (!obj.state) return obj;

  const sKUs_History = SPREAD.getSheetByName('Прайс без НДС Артикулы история').getDataRange().getValues();

  const map_SKUs_History = sKUs_History_2_Map(sKUs_History, /\d{3}-\d{3}-\d{4}/);

  // массив артикул, прайс
  const sku_price = obj.sKUs_1D.map(item => [item, obj.price]);

  obj.sKUs_History =
    sKUs_History_Update(
      sKUs_History,
      map_SKUs_History,
      sku_price)

  return obj;
}

function skus_History_Update_on_Edit_State_Test() {
  const sheet = SPREAD.getSheetByName('Прайс без НДС');
  let cell = sheet.getRange("A1");
  let result = skus_History_Update_on_Edit_State(cell);
  if (result.state) throw new Error('result.state ожидался false');

  cell = sheet.getRange("Q123");
  result = skus_History_Update_on_Edit_State(cell);
  if (!result.state) throw new Error('result.state ожидался true');
  if (result.sKUs_1D.length !== 2) throw new Error('sKUs_1D.length !== 2');
}

function skus_History_Update_on_Edit_State(cell) {

  const sKUs_1D = cell.getValue().split(',').filter(item => /\d{3}-\d{3}-\d{4}/.test(item));

  return {
    cell_Changed: cell,
    sKUs_1D: sKUs_1D,
    price: cell.offset(0, 9).getValue(),
    state: (sKUs_1D.length > 0) ?
      true :
      false
  };
}

/** находится ли ячейка в диапазоне цен */
function cell_In_Range_Price(cell) {

  const col = cell.getColumn();
  const row = cell.getRow();

  // ячейка находится в диапазоне C8:H
  return (col >= 3 && col <= 8 && row >= 8) ?
    true :
    false;
}

/** находится ли ячейка в диапазоне артикулов */
function cell_In_Range_SKUs(cell) {

  const col = cell.getColumn();
  const row = cell.getRow();

  // ячейка находится в диапазоне L8:Q
  return (col >= 12 && col <= 17 && row >= 8) ?
    true :
    false;
}


function sKUs_History_Update_If(obj, regex = /\d{3}-\d{3}-\d{4}/) {

  if (obj.paint_State === false)
    return;

  let sKUs_1D = obj.sKUs_1D.filter(item => regex.test(item));

  const sheet = SPREAD.getSheetByName('Прайс без НДС Артикулы история');
  const range = sheet.getRange('A1:D');
  let sKUs_History = range.getValues();

  for (let row = 1; row < sKUs_History.length; row++) {

    sku = sKUs_History[row][1];

    if (regex.test(sku)) {

      for (let i = 0; i < sKUs_1D.length; i++) {

        if (sKUs_1D[i] === sku) {

          sKUs_History[row][0] = new Date().toISOString().slice(0, 10);
          sKUs_History[row][2] = obj.price_New;
          sKUs_History[row][3] = Session.getActiveUser().getEmail();
        }
      }
    }
  }

  //TODO НЕ обновил
  range.setValues(sKUs_History);

}

function cells_Paint_If_SKUs(price_Old, price_New, cell_Price, sKUs_1D) {

  let paint_State = false;

  if (price_Old != price_New) {

    if (array1D_Regex_Has(
      sKUs_1D,
      /\d{3}-\d{3}-\d{4}/)) {

      cell_Price.setBackground('yellow');

      paint_State = true;

    }
  }

  const obj = {
    sKUs_1D: sKUs_1D,
    paint_State: paint_State,
    price_New: price_New
  };

  return obj;
}

/** в массиве есть элементы по regex */
function array1D_Regex_Has(array, regex) {
  return array.filter(
    element => regex.test(element))
    .length > 0;
}

function aChain_Prices_Backgrounds_Update() {

  SPREAD.toast('Крашу цены изменённые за 30 дней ...');

  NS_Load();

  NS.prices_Range.setBackgrounds(
    backGrounds_Update(
      NS.prices_BackGrounds,
      NS.skus_3D,
      sKUS_History_2_Sheet(
        NS.skus_History_Range,
        sKUs_History_Update(
          NS.sKUs_History,
          sKUs_History_2_Map(NS.sKUs_History, NS.sku_Regex),
          skus_Price_Make(NS.prices, NS.skus_3D))))); // массив артикул-цена

  SPREAD.toast('покраска цен завершена');
}

function NS_Load() {

  NS.sku_Regex = /\d{3}-\d{3}-\d{4}/;

  NS.price_Sheet = SPREAD.getSheetByName('Прайс без НДС');
  NS.skusHistorySheet = SPREAD.getSheetByName('Прайс без НДС Артикулы история');

  NS.prices_Range = NS.price_Sheet.getRange('C1:H');
  NS.prices = NS.prices_Range.getValues();
  NS.prices_BackGrounds = NS.prices_Range.getBackgrounds();

  NS.skus_3D_Range = NS.price_Sheet.getRange('L1:Q');
  NS.skus_3D = NS.skus_3D_Range.getValues();

  NS.skus_History_Range = NS.skusHistorySheet.getRange('A1:D');

  // беру строку загололовков и строки с артикулами по регулярному
  const sku_Column_1 = 1;
  NS.sKUs_History =
    table_Duplicates_Remove(
      table_Filter_Rows_by_Column_Regex(
        NS.skus_History_Range.getValues(),
        sku_Column_1, 1, NS.sku_Regex), sku_Column_1);

  Logger.log(NS.sKUs_History[0]);
  Logger.log('NS.sKUs_History.length = ' + NS.sKUs_History.length);

  const nsForDebug = NS;

  let date = new Date();
  date.setDate(date.getDate() - 30);
  // NS.date_Paint_Start = date.toISOString().slice(0, 10);
  NS.date_Paint_Start = date;
  // Logger.log(NS.date_Paint_Start);
}

function table_Filter_Rows_by_Column_Regex_Test() {
  let sku_History = [
    ['Дата-Время', 'Артикул', 'Цена', 'Пользователь'],
    ['2023-11-02', '102-132-0002', 123, ''],
    ['2023-11-04', '102-zzz-0003', 323, ''],
    ['2023-11-03', '102-131-0005', 234, 'Некто']];

  const column = 1; // Индекс столбца, который будет фильтроваться
  const sku_Regex = /\d{3}-\d{3}-\d{4}/; // Регулярное выражение для артикула

  // Вызываем функцию и сохраняем результат
  let result = table_Filter_Rows_by_Column_Regex(sku_History, column, 1, sku_Regex);

  // Ожидаем, что результат будет содержать только строки с артикулами, соответствующими sku_Regex
  let expected = [
    ['Дата-Время', 'Артикул', 'Цена', 'Пользователь'],
    ['2023-11-02', '102-132-0002', 123, ''],
    ['2023-11-03', '102-131-0005', 234, 'Nekto']];

  if (arrays_Equals(result, expected))
    throw new Error();
}

/** фильтр строк массив-таблица по регулярному в столбце с заголовками */
function table_Filter_Rows_by_Column_Regex(sku_History, column, row_Start = 1, sku_Regex = /\d{3}-\d{3}-\d{4}/) {
  return [
    sku_History[0], // Сохраняем заголовки
    ...sku_History.slice(row_Start).filter(row => sku_Regex.test(row[column]))
  ];
}

function sku_Price_Color_Get(sheet, sku) {
  const cell = cell_By_Value(sheet, sku);
  return cell.offset(0, -9).getBackground();
}

/** найти артикул в истории, изменить дату на древнюю  */
function sku_History_Date_Change(sku, date) {
  const cells = cellS_Containing_Value(NS.skusHistorySheet, sku);
  сells_Separated_Value(cells, date);
}

/** присвоить значение несмежным ячейкам */
function сells_Separated_Value(cells, values) {
  for (var i = 0; i < cells.length; i++) {
    cells[i].setValue(values[i]);
  }
}

/** цвет несмежным ячейкам */
function cells_BackGround(cells, color) {
  for (var i = 0; i < cells.length; i++) {
    cells[i].setBackground(color);
  }
}

function price_Color_Set_by_SKU(sheet, sku, color) {
  const cell = cell_By_Value(sheet, sku);
  cell.offset(0, -9).setBackground(color);
}

/** найти ячейку по значению */
function cell_By_Value(sheet, value) {
  var dataRange = sheet.getDataRange();
  var values = dataRange.getValues();

  for (var row = 0; row < values.length; row++) {
    for (var col = 0; col < values[0].length; col++) {
      if (values[row][col].toString().includes(value)) {
        return sheet.getRange(row + 1, col + 1);
      }
    }
  }

  // Если значение не найдено, вернуть null или можно выбрать другое значение по умолчанию.
  return null;
}

/** ячейки содержащие value */
function cellS_Containing_Value(sheet, value) {
  var dataRange = sheet.getDataRange();
  var values = dataRange.getValues();
  var foundCells = [];

  for (var row = 0; row < values.length; row++) {
    for (var col = 0; col < values[0].length; col++) {
      if (values[row][col].toString().includes(value)) {
        var cell = sheet.getRange(row + 1, col + 1);
        foundCells.push(cell);
      }
    }
  }

  return foundCells;
}

/** 
 *  красить все ячейки цены
 Проход по ячейкам артикулов Прайс без НДС
 Получить свежую дату артикулов ячейки
 Дата древнее Даты краски
 ячейку цены в белый
 Дата моложе  Даты краски
 ячейку цены в белый
 */
function backGrounds_Update(prices_BackGrounds, skus_3D, sKUs_History) {

  for (let row = 0; row < prices_BackGrounds.length; row++) {
    for (let col = 0; col < prices_BackGrounds[0].length; col++) {

      let skus_String = skus_3D[row][col]

      if (isSKU(skus_String)) {

        // if (skus_String.includes('102-132-0002')) debugger;

        const date_Fresh = sKUs_Date_Fresh(skus_String.split(','), sKUs_History);

        if (date_Fresh !== '') {

          prices_BackGrounds[row][col] =
            new Date(date_Fresh) < NS.date_Paint_Start ?
              'white' :
              'yellow';
        }
      }
    }
  }

  return prices_BackGrounds;
}

function dates_Compare_Test() {
  // Тест на сравнение двух равных дат
  var dateStr1 = "2023-10-01";
  var dateStr2 = "2023-10-01";
  assert(dates_Compare(dateStr1, dateStr2) === 0);

  // Тест на сравнение dateStr1 меньше dateStr2
  dateStr1 = "2023-09-01";
  dateStr2 = "2023-10-01";
  assert(dates_Compare(dateStr1, dateStr2) === -1);

  // Тест на сравнение dateStr1 больше dateStr2
  dateStr1 = "2023-11-01";
  dateStr2 = "2023-10-01";
  assert(dates_Compare(dateStr1, dateStr2) === 1);
}

function dates_Compare(dateStr1, dateStr2) {
  var date1 = new Date(dateStr1);
  var date2 = new Date(dateStr2);

  if (date1 < date2) {
    return -1; // dateStr1 меньше dateStr2
  } else if (date1 > date2) {
    return 1; // dateStr1 больше dateStr2
  } else {
    return 0; // dateStr1 и dateStr2 равны
  }
}

function sKUs_Date_Fresh_Test() {
  let sKUs_History = [
    ['Дата-Время', 'Артикул', 'Цена', 'Пользователь'],
    ['2023-11-02', '102-132-0002', 123, ''],
    ['2023-11-02', '102-zzz-0002', 123, ''],
    ['2023-11-04', '102-132-0003', 323, ''],
    ['2023-11-03', '102-131-0005', 234, 'Некто']];

  const sKUs_1D = ['102-131-0005', '102-132-0002'];
  const sku_Column = 1;

  // Вызываем функцию и сохраняем результат
  let result = sKUs_Date_Fresh(sKUs_1D, sKUs_History);

  // Ожидаем, что результат будет "2023-11-03"
  assert(result === "2023-11-03");

  sKUs_History = [
    ['Дата-Время', 'Артикул', 'Цена', 'Пользователь'],
    ['', '102-132-0002', 123, ''],
    ['2023-11-04', '102-132-0003', 323, ''],
    ['23', '102-131-0005', 234, 'Некто']
  ];

  result = sKUs_Date_Fresh(sKUs_1D, sKUs_History, 0, 1);

  assert(result === "");
}

/** вернуть свежую дату из столбца column_Date, если в column_SKU артикул из sKUs_1D */
function sKUs_Date_Fresh(
  sKUs_1D, sKUs_History,
  column_Date = 0, column_SKU = 1,
  date_Regex = /\d{4}-\d{2}-\d{2}/,
  sku_Regex = /\d{3}-\d{3}-\d{4}/) {

  let freshestDate = '';

  for (let i = 1; i < sKUs_History.length; i++) { // Начинаем с 1, пропуская заголовок

    const sku = sKUs_History[i][column_SKU].toString().trim();

    if (sKUs_1D.indexOf(sku) > -1) {

      const cellValue = sKUs_History[i][column_Date];

      if (!isNaN(Date.parse(cellValue))) {

        if (freshestDate === '' || cellValue > freshestDate) {

          freshestDate = cellValue;

        }
      }
    }
  }

  return freshestDate;
}

function isSKU(sKUs_1D) {
  array = sKUs_1D.match(/(\d{3}-\d{3}-\d{4})/g) ?? [];
  return array.length > 0;
}

function sKUS_History_2_Sheet(range, sKUs_History) {

  var sheet = range.getSheet();
  var lastRow = sheet.getLastRow();

  // оставляю заголовки, на случай неправильного массива
  if (lastRow > 1) {
    var range_Clear = sheet.getRange(2, 1, lastRow - 2 + 1, sheet.getLastColumn());
    range_Clear.clearContent();
  }

  if (lastRow > 2)
    sheet.deleteRows(3, lastRow - 3 + 1); // Удаление строк с 3 по последнюю

  table_2_Range(sKUs_History, range.getCell(1, 1));

  return sKUs_History;
}

function table_2_Range_Test() {

  const sheetName = 'Test';

  var sheet = SPREAD.getSheetByName(sheetName);

  if (!sheet) {
    // Если лист не существует, создаем его
    sheet = SPREAD.insertSheet(sheetName);
  }

  sheet.getDataRange().clearContent();

  let array = [
    [1, 2],
    [3, 4]];

  table_2_Range(array, sheet.getRange("d4:F").getCell(1, 1));
}

/** массив в диапазон, начиная с ячейки */
function table_2_Range(a2, cell) {
  cell.offset(0, 0, a2.length, a2[0].length).setValues(a2);
}

function sKUs_History_Update_Test() {
  const sKUs_History = [
    ['Дата-Время', 'Артикул', 'Цена', 'Пользователь'],
    ['2023-11-02', '102-132-0002', 123, ''],
    ['2023-11-02', '102-131-0005', 234, 'Некто']
  ];

  const map = new Map([
    ['102-132-0002', ['2023-11-02', 1, 123, '']],
    ['102-131-0005', ['2023-11-02', 2, 234, 'Некто']]
  ]);

  const sku_price = [
    ['102-132-0002', 100],
    ['102-131-0006', 200]
  ];

  const date_Current = new Date().toISOString().slice(0, 10);

  const expectedOutput = [
    ['Дата-Время', 'Артикул', 'Цена', 'Пользователь'],
    ['2023-11-03', '102-132-0002', 100, ''],
    ['2023-11-02', '102-131-0005', 234, 'Некто'],
    [date_Current, '102-131-0006', 200, 'mihail.popov@zelinskygroup.com']
  ];

  NS.sku_Regex = /\d{3}-\d{3}-\d{4}/g;
  sKUs_History_Update(sKUs_History, map, sku_price);

  for (let i = 0; i < expectedOutput.length; i++) {
    for (let j = 0; j < expectedOutput[i].length; j++) {

      let history = sKUs_History[i][j];
      let wanted = expectedOutput[i][j];

      if (history !== wanted)
        Logger.log('в строке ' + i + ', столбце ' + j +
          "\n ожидалось: " + wanted + "\n пришло: " + history);
    }
  }
}

/** на вход 
  const sKUs_History = [
    ['Дата-Время', 'Артикул', 'Цена', 'Пользователь'],
    ['2023-11-02', '102-132-0002', 123, ''],
    ['2023-11-02', '102-131-0005', 234, 'Некто'],
  ];
 *   const map = new Map([
    ['102-132-0002', ['2023-11-02', 1, 123, '']],
    ['102-131-0005', ['2023-11-02', 2, 234, 'Некто']]
  ]);
  const sku_price = [
    ['102-132-0002', 100],
    ['102-132-0006', 200]
  ];
  Проходом по артикулам в sku_price, сверяясь с map: 
  обновить цены и даты в sKUs_History.
  Если артикула в sKUs_History нет - добавить (дата текущая, пользователя взять из системы) 
  Должен получиться такой массив:
  [
    ['Дата-Время', 'Артикул', 'Цена', 'Пользователь'],
    ['2023-11-02', '102-132-0002', 100, ''],
    ['2023-11-02', '102-131-0005', 234, 'Некто'],
    ['2023-11-03', '102-131-0006', 200, 'из ситемы']
  ];
 */
function sKUs_History_Update(sKUs_History, map_skus_History, sku_price) {

  const currentDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format
  const currentUser = Session.getActiveUser().getEmail();

  const sku_Column = sKUs_History[0].indexOf('Артикул');
  if (sku_Column === -1) {
    toast_email_Throw('sKUs_History_Update, sku_Column === -1');
  }

  for (let [sku, price] of sku_price) {

    sku = sku.toString().trim();

    // if (sku.includes('102-011-0079')) debugger;

    if (map_skus_History.has(sku)) {
      // Update the price and date in sKUs_History
      const index = map_skus_History.get(sku)[sku_Column];

      if (sKUs_History[index][2] != price) {
        sKUs_History[index][2] = price;
        sKUs_History[index][0] = currentDate;
      }

    } else {
      // Add a new entry to sKUs_History
      sKUs_History.push([currentDate, sku, price, currentUser]);
    }
  }

  return sKUs_History;
}

function table_Duplicates_Remove_Test() {
  var inputTable = [
    ['Header1', 'Header2', 'Header3'],
    ['A', 'B', 'C'],
    ['X', 'Y', 'Z'],
    ['A', 'B', 'D'],
    ['P', 'Q', 'R'],
  ];

  var expectedOutput = [
    ['Header1', 'Header2', 'Header3'],
    ['A', 'B', 'C'],
    ['X', 'Y', 'Z'],
    ['P', 'Q', 'R'],
  ];

  var outputTable = table_Duplicates_Remove(inputTable, 0);

  // Сравниваем ожидаемый результат с полученным результатом
  arrays_Equals(outputTable, expectedOutput);

}

/** принимает таблицу и номер столбца, и возвращает таблицу с заголовками без повторов в указанном столбце*/
function table_Duplicates_Remove(table, column) {
  var result = [];

  // Добавляем заголовки в результирующую таблицу
  result.push(table[0]);

  // Создаем объект для отслеживания уже встреченных значений
  var uniqueValues = {};

  // Проходим по каждой строке таблицы, начиная с индекса 1 (пропуская заголовки)
  for (var i = 1; i < table.length; i++) {
    var value = table[i][column];

    // Если значение в текущей строке не было встречено ранее
    if (!uniqueValues[value]) {
      // Добавляем строку в результирующую таблицу и отмечаем значение как встреченное
      result.push(table[i]);
      uniqueValues[value] = true;
    }
  }

  return result;
}

function skus_History_2_Map_Test02() {
  const testInput = [
    ['Дата-Время', 'Артикул', 'Цена', 'Пользователь'],
    ['2023-11-02', '102-132-0002', 123, ''],
    ['2023-11-02', ' -131-0005', 234, 'Некто'],
    ['2023-11-03', '103-133-0003', 345, 'Кто-то']
  ];

  const regex = /\d{3}-\d{3}-\d{4}/g;

  const expectedOutput = new Map([
    ['102-132-0002', ['2023-11-02', '102-132-0002', 123, '']],
    ['103-133-0003', ['2023-11-03', '103-133-0003', 345, 'Кто-то']]]);

  const result = sKUs_History_2_Map(testInput, regex);

  for (const [key, value] of expectedOutput) {
    const actualValue = result.get(key);

    if (!arrays_Equals(actualValue, value)) {
      console.log(`Test Failed for key: ${key}`);
    }
  }

  console.log("All tests completed.");
}

/** массив вида const data = [
  ['Дата-Время', 'Артикул', 'Цена', 'Пользователь'],
  ['2023-11-02', '102-132-0002', 123, ''],
  ['2023-11-02', '102-131-0005', 234, 'Некто']
];
 * преобразовать в map - артикулы ключи, значение ключа масссив одномерный других значений строки артикула и индекс строки 
 */
function sKUs_History_2_Map(sKUs_History, regex) {

  const sku_Column = sKUs_History[0].indexOf('Артикул');
  if (sku_Column === -1) {
    toast_email_Throw('sKUs_History_2_Map, sku_Column === -1)');
  }
  const map = new Map();

  for (let row = 1; row < sKUs_History.length; row++) {

    let sku = sKUs_History[row][1].toString().trim();

    if (regex.test(sku)) {

      // Создаем копию строки из sKUs_History
      let skus_History_Row = sKUs_History[row].slice();

      // на месте артикула будет номер строки
      skus_History_Row[sku_Column] = row;

      map.set(sku, skus_History_Row);
    }
  }

  return map;
}

function toast_email_Throw(message) {
  SPREAD.toast(message);
  GmailApp.sendEmail(
    'mihail.popov@zelinskygroup.com',
    'Ошибка таблица Номенклатура',
    message);
  throw new Error(message);
}

function skus_Price_Make_Test() {
  const prices = [
    [10, 20, 30],
    [15, 25, 35],
    [12, 22, 32]
  ];

  const skus_3D = [
    ['123-456-7890', '234-567-8901', '345-678-9012'],
    ['456-789-0123', '', '678-901-2345'],
    ['789-012-3456', '890-123-4567', '901-234-5678']
  ];

  const expected = [
    ['123-456-7890', 10],
    ['234-567-8901', 20],
    ['345-678-9012', 30],
    ['456-789-0123', 15],
    ['678-901-2345', 35],
    ['789-012-3456', 12],
    ['890-123-4567', 22],
    ['901-234-5678', 32]
  ];

  const result = skus_Price_Make(prices, skus_3D, true);

  for (let i = 0; i < result.length; i++) {
    assert(result[i][0] === expected[i][0]);
    assert(result[i][1] === expected[i][1]);
  }

  Logger.log("skus_Price_Make_Test Passed!");
}

/** Создать массив артикул-цена из массивов цен и артикулов листа Прайс без НДС */
function skus_Price_Make(prices, skus_3D, debug = false) {

  if (debug) {
    if (prices.length < 100) throw new Error('prices.length < 100');
    if (skus_3D.length < 100) throw new Error('prices.length < 100');
  }

  let skus_Price = [];
  const regex = /(\d{3}-\d{3}-\d{4})/g;

  for (let row = 0; row < skus_3D.length; row++) {
    for (let col = 0; col < skus_3D[0].length; col++) {

      let string = skus_3D[row][col].toString();

      let sKUs_1D = string.match(regex) ?? [];

      let price = prices[row][col];

      // к артикулам добавить цену и добавить к массиву
      let cell_skus_Price = sKUs_1D.map(item => [item, price]);
      skus_Price.push(...cell_skus_Price);
    }
  }
  return skus_Price;
}

/** массивы сравнить */
function arrays_Equals(array_1, array_2) {

  const string_1 = JSON.stringify(array_1);
  const string_2 = JSON.stringify(array_2);

  return string_1 === string_2;
}

// Maps сравнить
function assertMapsEqual(map1, map2, errorMessage) {
  if (map1.size !== map2.size) {
    return false;
  }

  for (const [key, value] of map1) {
    if (!map2.has(key) || map2.get(key) !== value) {
      return false;
    }
  }

  return true;
}

function table_Intersect_Value_Test() {
  let table = [
    ['Name', 'Age', 'Country'],
    ['Alice', 25, 'USA'],
    ['Bob', 30, 'Canada'],
    ['Charlie', 28, 'UK'],
    ['David', 35, 'Australia'],
  ];

  const columnFind = 0; // Индекс столбца для поиска (Name)
  const columnReturn = 2; // Индекс столбца для возврата (Country)
  const needle = 'Bob';

  // Вызываем функцию и сохраняем результат
  let result = table_Intersect_Value(table, columnFind, columnReturn, needle);

  // Ожидаем, что результат будет равен 'Canada'
  let expected = 'Canada';

  if (result !== expected) throw new Error(result + ' !== ' + expected);

}

/** искать в одном столбце вернуть из другого */
function table_Intersect_Value(table, column_find, column_Return, needle) {
  const row = table.find(row => row[column_find] === needle);
  return row ? row[column_Return] : undefined;
}

/** если для ячейки есть артикул, 
 *    покрасить ячейку,
 *    артикулам на листе артикулов изменить дату
 *  если нет - toast
 */
function cell_Price_Paint_onEdit(event) {

  // Logger.log(JSON.stringify(event, null, 2));
  // {value=2, range=Range, oldValue=1.0, source=Spreadsheet, user=mihail.popov@zelinskygroup.com, authMode=LIMITED}

  if (cell_In_Range_Price(event.range)) {
    sKUs_History_Update_If(
      cells_Paint_If_SKUs(
        event.oldValue,
        event.value,
        event.range,
        event.range.offset(0, 9).getValue().split(',')),
      /\d{3}-\d{3}-\d{4}/);
  }

  if (cell_In_Range_SKUs(event.range)) {
    sKUS_History_2_Sheet_onEdit(
      skus_History_Update_onEdit(
        skus_History_Update_on_Edit_State(event.range)));
  }
}

