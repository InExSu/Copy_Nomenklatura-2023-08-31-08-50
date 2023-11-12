function rangePriceColumnUpdate() {
  // обновить сводная таблица из Прайс без НДС

  const spread = SpreadsheetApp.getActive();
  const sheet_Price_bez_NDS = spread.getSheetByName('Прайс без НДС');
  const sheet_Price_Partner_bez_NDS = spread.getSheetByName('Прайс партнеры без НДС');
  const sheet_Svodnaya = spread.getSheetByName('сводная таблица');
  const sheet_Log = spread.getSheetByName('Log');

  if (headersOk(sheet_Price_bez_NDS, sheet_Svodnaya) === false) {
    throw new Error('Ожидаемые заголовки НЕ совпали. \n Выход!');
  }

  const msg = "Обновляю цены листа " + sheet_Svodnaya + " в столбце Цена, руб (Без НДС), ценами из листа " + sheet_Price_bez_NDS;
  spread.toast(msg);

  const a2_Price_bez_NDS_Prices_CH = sheet_Price_bez_NDS.getRange('C:H').getValues();
  const a2_Price_Partner_bez_NDS_Prices_CH = sheet_Price_Partner_bez_NDS.getRange('C:H').getValues();
  const a2_Price_bez_NDS_Artics_LQ = sheet_Price_bez_NDS.getRange('L:Q').getValues();

  const a2_Column_B_SKUs = sheet_Svodnaya.getRange('B:B').getValues();
  const map_Artics_Svodnaya_B = array3D_2_Map(a2_Column_B_SKUs); // Array2D_2_Map(a2_Column_B_SKUs);

  const range_NameFull = sheet_Svodnaya.getRange('D:D');
  const range_Svodnaya_J = sheet_Svodnaya.getRange('J:J');
  const range_Svodnaya_M = sheet_Svodnaya.getRange('M:M');

  let a2_Column_J_Price_New = range_Svodnaya_J.getValues();
  let a2_Column_M_Partner_New = range_Svodnaya_M.getValues();

  // для вывода в лог 
  const a2_Column_D_NameFull = range_NameFull.getValues();
  const a2_Column_J_Price_Old = range_Svodnaya_J.getValues();
  const a2_Column_M_Partner_Old = range_Svodnaya_M.getValues();

  a2_Column_J_Price_New = a2PriceColumnUpdate(
    a2_Price_bez_NDS_Artics_LQ,
    a2_Price_bez_NDS_Prices_CH,
    map_Artics_Svodnaya_B,
    a2_Column_J_Price_New);

  spread.toast(
    "Обновляю цены листа " + sheet_Price_Partner_bez_NDS.getName() + " ценами из листа " + sheet_Price_bez_NDS.getName());

  a2_Column_M_Partner_New = a2PriceColumnUpdate(
    a2_Price_bez_NDS_Artics_LQ,
    a2_Price_Partner_bez_NDS_Prices_CH,
    map_Artics_Svodnaya_B,
    a2_Column_M_Partner_New);

  // const a2_Svodnya_BD =
  //   arrayGrowth2Right(
  //     sheet_Svodnaya.getRange('B:D').getValues(),
  //     2);

  // a2_Column_J_Price_New = priceGrowths(a2_Price_bez_NDS_Artics_LQ, a2_Svodnya_BD, a2_Column_J_Price_New);
  // a2_Column_M_Partner_New = priceGrowths(a2_Price_bez_NDS_Artics_LQ, a2_Svodnya_BD, a2_Column_M_Partner_New);

  range_Svodnaya_J.setValues(a2_Column_J_Price_New);
  range_Svodnaya_M.setValues(a2_Column_M_Partner_New);

  spread.toast('Обновляю на листе ' + sheet_Svodnaya.getName() + ' столбец "Цена для партнеров, руб (Без НДС)" из листа ' + sheet_Price_Partner_bez_NDS.getName());

  pivotColumnPricePartnerNDSno();

  rangePriceColumnUpdate_Log(
    sheet_Log,
    a2_Column_B_SKUs,
    a2_Column_D_NameFull,
    a2_Column_J_Price_Old,
    a2_Column_J_Price_New,
    a2_Column_M_Partner_Old,
    a2_Column_M_Partner_New);
}

function rangePriceColumnUpdate_Test() {

  const sheet = SpreadsheetApp.getActive().getSheetByName('сводная таблица');
  sheet.getRange('J362:J364').clearContent();
  sheet.getRange('M361:M364').clearContent();

  // rangePriceColumnUpdate();

}

function priceGrowths_Test() {
  let a2_Price_bez_NDS_Artics_LQ = [['0', '1', '2', '3', '4', 'z', 'артик1']];
  let a2_Svodnya_BD = [
    ['0', '1', '2'],
    ['артик1', '', 'артик1 назв рост 1'],
    ['артик2', '', 'артик1 назв рост 2'],
    ['артик3', '', 'артик3 без р о с т а']];
  let a2_Column_Prices_J = [
    [0],
    [9],
    [9],
    [3]];

  priceGrowths(a2_Price_bez_NDS_Artics_LQ, a2_Svodnya_BD, a2_Column_Prices_J);
}

function priceGrowths(
  a2_Price_bez_NDS_Artics_LQ,
  a2_Svodnya_BD,
  a2_Column_Price) {
  // Проходом по диапазону артикулов листа a2_Price_bez_NDS_Artics_LQ ,
  // найти артикул в массиве a2_Svodnya_BD,
  // взять номер строки a2_Svodnya_BD,
  // взять наименование
  // в наименовании отсечь по "рост".
  // по номеру строки a2_Svodnya_BD взять новую цену из a2_Column_Prices.
  // Проходом по столбцу название,
  // если наименование начинается со значения без роста + " рост ",
  // то в эту же строку столбца цена проставить цену

  let artic = '';
  let name_ = '';
  let price = 0;
  let row_Found = -1;

  const map_Artics_Row = Array2D_Column_2_Map(a2_Svodnya_BD, 0)
  const COL_2 = 2;

  for (let row = 0; row < a2_Price_bez_NDS_Artics_LQ.length; row++) {
    for (let col = 0; col < a2_Price_bez_NDS_Artics_LQ[0].length; col++) {

      artic = a2_Price_bez_NDS_Artics_LQ[row][col].trim();

      // if (artic === '102-027-0003') debugger;

      if (map_Artics_Row.has(artic)) {

        row_Found = map_Artics_Row.get(artic);

        name_ = a2_Svodnya_BD[row_Found][2];

        if (name_.search(/\sрост/i) > -1) {

          price = a2_Column_Price[row_Found][0];

          // проход по a2_Svodnya_BD, COL_2 - проставить price в a2_Column_Prices_J
          priceIfNameStarts(name_, a2_Svodnya_BD, COL_2, a2_Column_Price, price);
        }
      }
    }
  }

  return a2_Column_Price;
}

function arrayGrowth2Right_Test() {
  const array = [
    ['(1 рост 180'],
    ['40 рост L'],
    ['ой рост 2 ц']
  ];

  const result = arrayGrowth2Right(array, 0);

  assertEquals(result[0][0], "( 180 рост 1");

  assertEquals(result[1][0], "40  рост 2");

  assertEquals(result[2][0], 'ой  ц рост 2');
}

/** 
 * В массиве наименований переставить рост в право
 */
function arrayGrowth2Right(array, column) {

  let string = '';

  for (let row = 0; row < array.length; row++) {

    string = array[row][column];

    if (string.search(/\sрост/i) > -1) {

      array[row][column] = growth2Right(string);
    }
  }

  return array;
}

function growth2Right_Test() {
  assert(growth2Right, '', '');
  assert(growth2Right, ' рост 1 я', ' я рост 1');
  assert(growth2Right, ' (1 рост 1 я', ' (1 я рост 1');
}

/**
 * переставить рост в право
 */
function growth2Right(string) {
  return string2Right(
    growth1rost(
      growthMLX(string)));
}

function string2Right_Test() {
  assert(string2Right, '', '');
  assert(string2Right, '1 рост 1 2', '1  2 рост 1');
  assert(string2Right, 'я рост 2 ц', 'я  ц рост 2');
}

function string2Right(hayStack) {

  const needlePattern = /рост\s\d/i;
  const match = hayStack.match(needlePattern);

  if (match) {
    const needle = match[0];
    return hayStack.replace(needlePattern, '') + ' ' + needle;
  }
  return hayStack;
}

function growth1rost_Test() {

  assert(growth1rost, '', '');
  assert(growth1rost, 'рост любая строка L', 'рост любая строка L');
  assert(growth1rost, '1 Рост 1', '1 Рост 1');
  assert(growth1rost, '(2 РОст', '(рост 2');
}

/**
 * Заменить "(1 рост" на "рост 1"
 * 
 */
function growth1rost(string) {
  return string.replace(/\((\d+)\s+рост/gi, '(рост $1');
}

function growthMLX_Test() {

  assert(growthMLX, '', '');
  assert(growthMLX, 'рост любая строка L', 'рост любая строка L');
  assert(growthMLX, ' рост M', ' рост 1');
  assert(growthMLX, ' текст рост L что-то ещё', ' текст рост 2 что-то ещё');
  assert(growthMLX, ' что-то РОст XL 123', ' что-то рост 3 123');
  assert(growthMLX, '2 росТ XXL x', '2 рост 4 x');
  assert(growthMLX, ' РОСТ XXXL', ' рост 5');
}

function growthMLX(string) {
  return string
    .replace(/\sрост\sM/i, " рост 1")
    .replace(/\sрост\sL/i, " рост 2")
    .replace(/\sрост\sXL/i, " рост 3")
    .replace(/\sрост\sXXL/i, " рост 4")
    .replace(/\sрост\sXXXL/i, " рост 5");
}

function assert(func, input, expected) {
  let out = func(input);
  if (out !== expected)
    throw new Error(`${func.name}: ${out} != ${expected}`);
}

function assertEquals(left, right) {
  if (left != right)
    throw new Error(left + ' != ' + right);
}

function priceIfNameStarts_Test() {
  // Пример данных
  let a2_Svodnya_BD = [
    ['apple', 'banana', 'cherry'],
    ['apricot', 'blueberry', 'coconut'],
    ['avocado', 'blackberry', 'cranberry']
  ];

  let a2_Column_Prices_J = [
    [0],
    [0],
    [0]
  ];

  let needle = 'ap';
  let column = 0;
  let price = 10;

  // Вызываем функцию
  priceIfNameStarts(needle, a2_Svodnya_BD, column, a2_Column_Prices_J, price);

  // Ожидаемые результаты
  let expectedResults = [10, 10, 10];

  // Проверяем результаты
  let testPassed = true;

  for (let row = 0; row < a2_Column_Prices_J.length; row++) {
    if (a2_Svodnya_BD[row][column].toUpperCase().startsWith(needle.toUpperCase())) {
      if (a2_Column_Prices_J[row][0] !== expectedResults[row]) {

        console.log(`Test failed at row ${row + 1}. Expected: ${expectedResults[row]}, Actual: ${a2_Column_Prices_J[row][0]}`);
        testPassed = false;
      }
    }
  }

  return testPassed;
}

function priceIfNameStarts(
  needle,
  a2_Svodnya_BD,
  column,
  a2_Column_Prices_J,
  price) {
  // если значение начинается с needle, подставить price в a2_Column_Prices_J
  // a2_Svodnya_BD и a2_Column_Prices_J одинаковы по высоте

  let str = '';
  let lft = '';

  for (let row = 0; row < a2_Svodnya_BD.length; row++) {

    str = a2_Svodnya_BD[row][column];
    lft = str.slice(0, needle.length);

    if (lft.toUpperCase() === needle.toUpperCase()) {

      a2_Column_Prices_J[row][0] = price;

    }
  }
}

function console_log(a2_Column_Prices_J) {
  console.log('a2_Column_Prices_J[0] = ' + a2_Column_Prices_J[0]);
  console.log('a2_Column_Prices_J[1] = ' + a2_Column_Prices_J[1]);
  console.log('a2_Column_Prices_J[2] = ' + a2_Column_Prices_J[2]);
  console.log('a2_Column_Prices_J[3] = ' + a2_Column_Prices_J[3]);

}
function nameGrowths_Test() {
  const tests = [
    { input: " Товар Рост 3", expected: " Товар" },
    { input: "", expected: "" },
    { input: "рост", expected: "" },
    { input: "Товар 1 РОСТ ", expected: "Товар " },
    { input: "1РОСТСлово", expected: "" },
    { input: "Нет роста здесь", expected: "" }
  ];

  let passedAllTests = true;

  for (let i = 0; i < tests.length; i++) {
    const result = nameGrowths(tests[i].input);
    if (result !== tests[i].expected) {
      console.error(`Тест ${i + 1} не пройден.`);
      console.error(`  Входные данные: "${tests[i].input}"`);
      console.error(`  Ожидаемый результат: "${tests[i].expected}"`);
      console.error(`  Фактический результат: "${result}"`);
      passedAllTests = false;
    }
  }

  return passedAllTests;
}

function nameGrowths(stringIn) {

  const regex = /\sрост\s/i;
  const match = stringIn.match(regex);

  if (match && match.index > -1) {
    return stringIn.substring(0, match.index);
  }

  return '';
}



function a2PriceColumnUpdate_Test() {

  let a2_Arti_Range = [
    ['', '111-111-1111, 555-555-5555'],
    ['333-333-3333', '444-444-4444']];
  let a2_Price_Range = [
    [11, 55],
    [33, 44]];

  let a2_Arti__Colum = ['555-555-5555', '444-444-4444', '333-333-3333', '222-111-1111', '111-111-1111'];
  let a2_Price_Colum = [5, 4, 3, 2, 1];

  let map_Arti = Array3D_Column_2_Map(a2_Arti__Colum, 0);

  const wanted = a2PriceColumnUpdate(a2_Arti_Range, a2_Price_Range, map_Arti, a2_Price_Colum);

  if (wanted[0][0] !== 55) {
    Logger.log('wanted[0][0] !== 55');
  }
  if (wanted[4][0] !== 11) {
    Logger.log('wanted[4][0] !== 11');
  }
}


function a2PriceColumnUpdate(a2_Arti_Range, a2_Price_Range, map_Arti, a2_Price_Colum) {
  // map_Arti Словарь артикулов - артикул: номер строки

  // Проходом по массиву артикулов a2_Arti_Range
  // 	Если артикул есть в словаре
  // 		Взять цену из массива цен в координатах артикула
  // 			Взять номер строки из словаря
  // 				Вставить в массив цен цену по номеру строки

  let artic = '';

  for (let row = 0; row < a2_Arti_Range.length; row++) {
    for (let col = 0; col < a2_Arti_Range[0].length; col++) {

      let sKUs = String(a2_Arti_Range[row][col]).split(',').map(sku => sku.trim());

      for (let i = 0; i < sKUs.length; i++) {

        artic = sKUs[i];

        if (artic.search(/\d{3}-\d{3}-\d{4}/) > -1) {

          if (map_Arti.has(artic)) {

            let row_Price = map_Arti.get(artic);
            let price = a2_Price_Range[row][col];

            a2_Price_Colum[row_Price][0] = convert2FloatCommaPointIfPossible(price);
          }
        }
      }
    }
  }

  return a2_Price_Colum;
}

function rangePriceColumnUpdate_Log_Test() {
  // Создаем тестовые данные
  const spread = SpreadsheetApp.getActive();
  const sheet_Logg = spread.getSheetByName('Log');

  const a2_Column_Artics = [['12345'], ['67890']];
  const a2_Column_Names = [['Product A'], ['Product B']];
  const a2_Column_Prices_Old = [['100'], ['150']];
  const a2_Column_Prices_New = [['120'], ['150']];
  const a2_Column_Partner_Old = [['90'], ['140']];
  const a2_Column_Partner_New = [['95'], ['140']];

  // Запускаем тестируемую функцию
  rangePriceColumnUpdate_Log(
    sheet_Logg,
    a2_Column_Artics,
    a2_Column_Names,
    a2_Column_Prices_Old,
    a2_Column_Prices_New,
    a2_Column_Partner_Old,
    a2_Column_Partner_New
  );
}

function rangePriceColumnUpdate_Log(
  sheet_Log,
  a2_Column_Artics,
  a2_Column_Names,
  a2_Column_Prices_Old,
  a2_Column_Prices_New,
  a2_Column_Partner_Old,
  a2_Column_Partner_New) {

  const dateTime = Utilities.formatDate(
    new Date(), "GMT", "yyyy-MM-dd HH:mm");
  const user = Session.getEffectiveUser().getUsername();

  const a2_Column_DateTime = a2_Column_Artics.map(item => [dateTime]);
  const a2_Column_User = a2_Column_Artics.map(item => [user]);

  const array = rangePriceColumnUpdateArraysMixFilter(
    a2_Column_DateTime,
    a2_Column_User,
    a2_Column_Artics,
    a2_Column_Names,
    a2_Column_Prices_Old,
    a2_Column_Prices_New,
    a2_Column_Partner_Old,
    a2_Column_Partner_New);

  if (array.length > 0) {

    const cell = sheet_Log.getRange('A6');

    array2d2Range(cell,  // массив вставить на лист
      rowsAdd4Array(cell, array));

    sheetRowsKeep(100000, sheet_Log);

    sheet_Log.activate();

  } else {

    SpreadsheetApp.getActive().toast("Обновлений нет");
  }
}

/** 
 * На листе оставить колво строк
 */
function sheetRowsKeep(rowsMax, sheet) {
  const rowLast = sheet.getLastRow();
  if (rowLast > rowsMax) {
    sheet.deleteRows(rowsMax + 1, rowLast - rowsMax);
  }
}

/** 
 * Добавит строк по длине массивав, начиная с cell
 * вернёт массив
 */
function rowsAdd4Array(cell, array) {

  cell.getSheet().insertRowsBefore(cell.getRow() + 1, array.length);

  return array
}

/**
 * вставить ниже ячейки cell
 * необходимое количество строк для
 * размещения массива array
 */
function insertRowsAfter(cell, array) {

  cell.getSheet().insertRowsAfter(cell.getRow(), array.length);

}

function rangePriceColumnUpdateArraysMixFilter_Test() {
  // Создаем тестовые данные
  const a2_Column_DateTime = [['2023-08-19 10:00'], ['2023-08-20 14:30']];
  const a2_Column_User = [['User'], ['Admin']];
  const a2_Column_Artics = [['12345'], ['67890']];
  const a2_Column_Names = [['Product A'], ['Product B']];
  const a2_Column_Prices_Old = [['100'], ['150']];
  const a2_Column_Prices_New = [['120'], ['150']];
  const a2_Column_Partner_Old = [['90'], ['140']];
  const a2_Column_Partner_New = [['95'], ['140']];

  // Вызываем тестируемую функцию
  const result = rangePriceColumnUpdateArraysMixFilter(
    a2_Column_DateTime,
    a2_Column_User,
    a2_Column_Artics,
    a2_Column_Names,
    a2_Column_Prices_Old,
    a2_Column_Prices_New,
    a2_Column_Partner_Old,
    a2_Column_Partner_New
  );

  // Ожидаемый результат
  const expected = [
    ['2023-08-19 10:00', 'User', '12345', 'Product A', '100', '120', '90', '95']
  ];

  // Проверяем, что результат соответствует ожиданиям
  let testPassed = true;

  for (let i = 0; i < expected.length; i++) {
    if (JSON.stringify(result[i]) !== JSON.stringify(expected[i])) {
      testPassed = false;
      break;
    }
  }

  if (!testPassed) {
    throw new Error();
  }
}

function rangePriceColumnUpdateArraysMixFilter(
  a2_Column_DateTime,
  a2_Column_User,
  a2_Column_Artics,
  a2_Column_Names,
  a2_Column_Prices_Old,
  a2_Column_Prices_New,
  a2_Column_Partner_Old,
  a2_Column_Partner_New) {

  let differentValues = [];

  // Потом удали
  const priceDiff = googleArraysDiff(a2_Column_Prices_Old, a2_Column_Prices_New);
  if (priceDiff.length == 0) {
    let stop = true;
  }

  for (let row = 0; row < a2_Column_Prices_Old.length; row++) {

    if (
      a2_Column_Prices_Old[row][0] !== a2_Column_Prices_New[row][0] ||
      a2_Column_Partner_Old[row][0] !== a2_Column_Partner_New[row][0]) {

      differentValues.push([
        a2_Column_DateTime[row][0],
        a2_Column_User[row][0],
        a2_Column_Artics[row][0],
        a2_Column_Names[row][0],
        a2_Column_Prices_Old[row][0],
        a2_Column_Prices_New[row][0],
        a2_Column_Partner_Old[row][0],
        a2_Column_Partner_New[row][0]
      ]);
    }
  }

  return differentValues;
}

function googleArraysDiff_Test() {

  const array1 = [['a'], ['b']];
  const array2 = [['a'], ['a']];

  const differ = googleArraysDiff(array1, array2);
  const wanted = [[1, 'b', 'a']];

  const stringDiffer = JSON.stringify(differ);
  const stringWanted = JSON.stringify(wanted);

  if (stringDiffer !== stringWanted)
    throw new Error('googleArraysDiff_Test: ' + 'stringDiffer !== stringWanted');
}

function googleArraysDiff(array1, array2) {

  const diff = [];

  for (let i = 0; i < array1.length; i++) {
    const item1 = array1[i];
    const item2 = array2[i];

    if (JSON.stringify(item1) !== JSON.stringify(item2)) {
      diff.push([i, item1[0], item2[0]]);
    }
  }

  return diff;
}

/** 
 * Диапазон от ячейки и вниз вправо 
 */
function rangeFromCellAddress2DownRight(sheet, cellAddress) {

  const cell = sheet.getRange(cellAddress);

  const cell_Row = cell.getRow();
  const cell_Col = cell.getColumn();

  const rowsNumb = sheet.getLastRow() - cell_Row + 1;
  const colsNumb = sheet.getLastColumn() - cell_Col + 1;

  return sheet.getRange(
    cell_Row, cell_Col,
    rowsNumb, colsNumb);
};

function arrayColumFillFormula(a2, rowStart, col, shift) {
  // заменить в столбце все значения на формулу

  for (let row = rowStart; row < a2.length; row++) {
    let rowFormu = row + shift;
    let formula_ = '=B' + rowFormu + '=C' + rowFormu;
    a2[row][col] = formula_;
  }
}

function headersOk(sheet_Sour, sheet_Dest) {
  // проверка значений ячеек

  return cell_Value(sheet_Dest.getRange('B1'), 'Артикул') &&
    cell_Value(sheet_Dest.getRange('J1'), 'Цена, руб (Без НДС)') &&
    cell_Value(sheet_Sour.getRange('C7'), 'ШМП-1') &&
    cell_Value(sheet_Sour.getRange('L7'), 'ШМП-1')

}

function cell_Value_Test() {

  const sheet = SpreadsheetApp.getActive().getSheetByName('Прайс без НДС');
  const cell_ = sheet.getRange('C7')

  let value = 'ШМП-1';
  let resul = cell_Value(cell_, value);
  Logger.log(resul);

  value = '';
  resul = cell_Value(cell_, value);
  Logger.log(resul);
}

function cell_Value(cell, value) {
  if (cell.getValue() !== value) {
    const sheet = sheetByRange(cell);
    Logger.log('На листе ' + sheet.getName() + ' в ячейке ' +
      cell.getA1Notation() + ' !== ' + value);
    return false;
  }
  return true;
}

function sheetByRange(cell) {
  // вернуть лист по диапазону
  // как в Excel range.Parent

  return sheetById(cell.getGridId());
}


function sheetById(id) {
  // вернуть лист по id

  return SpreadsheetApp.getActive().getSheets().filter(
    function (s) {
      return s.getSheetId() === id;
    }
  )[0];
}



function price2VendorCode_Test() {

  cell = SpreadsheetApp.getActive().getSheetByName('Прайс без НДС (копия) с формулами').getRange(8, 4).getFormula();

  price2VendorCode(cell);
}

function price2VendorCode(formu) {
  // Разовый этап создания из таблицы с формулами таблицы с артикулами
  // UDF из тексту формулы извлекает код 1С,
  // по коду 1С ищет на листе строку с этим кодом,
  // если в строке есть артикул вернёт его или cell
  // формула на листе, использующая эту формулу
  // =ЕСЛИ(ЕОШИБКА(FORMULATEXT(C4));C4;
  //    ПОДСТАВИТЬ(
  //      price2VendorCode(FORMULATEXT(C4));
  // СИМВОЛ(34);""))

  // нужны формулы без пробелов
  formu.replaceAll(' ', '');
  let code1 = extractBetween(formu, 'MATCH(', ";'");
  if (code1 == '') {
    code1 = formu;
  }
  else {
    //Logger.log('code1 = ' + code1);
  }
  return code1;
}

function extractBetween_Test() {

  let result = extractBetween('123', '0', '3');
  if (result !== '') {
    Logger.log('extractBetween_Test ошибка: ждал пусто, пришло ' + result);
  }

  result = extractBetween('123', '1', '3');
  if (result !== '2') {
    Logger.log('extractBetween_Test ошибка: ждал 2, пришло ' + result);
  }
  result = extractBetween('12345', '12', '45');
  if (result !== '3') {
    Logger.log('extractBetween_Test ошибка: ждал 3, пришло ' + result);
  }
}

function extractBetween(sMain, sLeft, sRigh) {
  // из строки извлечь строку между подстроками
  // InExSu 

  // добавил 1, чтобы стало возможным условие проверки на 0
  let idxBeg = sMain.indexOf(sLeft) + 1;
  let idxEnd = sMain.indexOf(sRigh) + 1;
  let strOut = '';

  if ((idxBeg * idxEnd) > 0) {
    idxBeg = idxBeg + sLeft.length - 1;
    idxEnd = idxEnd - 1;
    strOut = sMain.slice(idxBeg, idxEnd);
  }
  return strOut;
}

function Array3D_Column_2_Map_Test() {
  const array3d = [
    ['Artic', 'Price', 'SKU'],
    ['123-456-7890', '$10', 'sku1'],
    ['234-567-8901', '$20', 'sku2'],
    ['345-678-9012', '$30', 'sku3'],
    ['444-678-9012, 555-678-9012 ', '$40', 'sku3'],
    ['345-678-901', '$30', 'sku3'],];

  // Тест 1: проверка корректности создания словаря
  const map_Arti = Array3D_Column_2_Map(array3d, 0);
  const expected_map_Arti = new Map([
    ['123-456-7890', 1],
    ['234-567-8901', 2],
    ['345-678-9012', 3],
    ['444-678-9012', 4],
    ['555-678-9012', 4],]);

  if (JSON.stringify([...map_Arti]) !== JSON.stringify([...expected_map_Arti]))
    Logger.log(
      'Error: expected ${JSON.stringify([...expected_map_Arti])}, but got ${JSON.stringify([...map_Arti])}'
    );

  // Тест 2: проверка получения значения по ключу
  const artic = '555-678-9012';
  const row_Price = map_Arti.get(artic) !== undefined ? array3d[map_Arti.get(artic)][1] : null;
  const expected_row_Price = '$40';

  if (row_Price !== expected_row_Price)
    Logger.log(
      'Error: expected ${expected_row_Price}, but got ${row_Price}'
    );
}

function Array3D_Column_2_Map(array2d, column_key) {
  // из массива 2мерного вернуть словарь - массив ассоциативный: 
  // значение столбца и номер строки

  let map_return = new Map();
  let val = '';

  for (let row = 0; row < array2d.length; row++) {

    let sKUs = String(array2d[row][column_key]).split(',').map(sku => sku.trim());

    for (let i = 0; i < sKUs.length; i++) {

      val = sKUs[i];

      if (/\d{3}-\d{3}-\d{4}/.test(val)) {
        // если ключ повторяется, то обновится значение
        map_return.set(val, row);
      }
    }
  }

  return map_return;
}

function Array2D_Column_2_Map(array2d, column_key) {
  // из массива 2мерного вернуть словарь - массив ассоциативный: 
  // значение столбца и номер строки

  let map_return = new Map();
  let val = '';

  for (let row = 0; row < array2d.length; row++) {

    val = String(array2d[row][column_key]);

    if (val.length > 0) {
      // если ключ повторяется, то обновится значение
      map_return.set(val, row);
    }
  }
  return map_return;
}

function array2D_2_Map_Test() {
  var arr = [["A", "B", "C"], ["D", "E", "F"], ["G", "H", "I"]];
  var result = Array2D_2_Map(arr);

  // Проверяем результаты
  assert(result.size === 9, "Размер словаря должен быть равен 9");
  assert(result.get("A") === 0 && result.get("B") === 0 && result.get("C") === 0, "Неверное значение для ключей A, B, C");
  assert(result.get("D") === 1 && result.get("E") === 1 && result.get("F") === 1, "Неверное значение для ключей D, E, F");
  assert(result.get("G") === 2 && result.get("H") === 2 && result.get("I") === 2, "Неверное значение для ключей G, H, I");
}

// Функция для проверки условия и вывода сообщения об ошибке
function assert(condition, message = '') {
  if (!condition) {
    console.error(message);
  }
}

function Array2D_2_Map(array2d) {
  // из массива 2мерного вернуть словарь массив ассоциативный

  let map_return = new Map();
  let val = '';

  for (let row = 0; row < array2d.length; row++) {
    for (let col = 0; col < array2d[0].length; col++) {

      val = String(array2d[row][col]);

      if (val.length > 0) {
        // если ключ повторяется, то обновится значение
        map_return.set(val, row);
      }
    }
  }
  return map_return;
}

function array3D_2_Map_Test() {
  const array3d = [
    ["123-456-7890, 111-222-3333"],
    ["444-555-6666, "]];

  const result = array3D_2_Map(array3d);

  const wanted = new Map([
    ["123-456-7890", 0],
    ["111-222-3333", 0],
    ["444-555-6666", 1]
  ]);

  // Проверяем размерность Map
  if (result.size !== wanted.size) {
    console.log("Test failed: Map sizes are different");
    return;
  }

  // Проверяем каждую пару ключ-значение
  for (let [key, value] of wanted) {
    if (!result.has(key)) {
      console.log('Test failed: Key ${ key } is missing from result');
      return;
    }
    if (result.get(key) !== value) {
      console.log('Test failed: Value for key ${ key } is different');
      return;
    }
  }
}

function array3D_2_Map(array3d) {
  let map_return = new Map();

  for (let row = 0; row < array3d.length; row++) {
    for (let col = 0; col < array3d[0].length; col++) {

      let sKUs = String(array3d[row][col]).split(',').map(sku => sku.trim());

      for (let i = 0; i < sKUs.length; i++) {

        if (/\d{3}-\d{3}-\d{4}/.test(sKUs[i])) {
          // set() automatically overwrites existing keys
          map_return.set(sKUs[i], row);
        }
      }
    }
  }

  return map_return;
}

function array2d2Range(cell, a2d) {

  // массив 2мерный вставить на лист

  let sheet_id = cell.getGridId();
  let sheet_ob = sheetById(sheet_id);
  const row_numb = cell.getRow();
  const col_numb = cell.getColumn();

  sheet_ob.getRange(row_numb, col_numb, a2d.length, a2d[0].length).setValues(a2d);
}

function artiCoolsCheck() {
  // проверить артикулы листа "Прайс без НДС" в листе "сводная таблица"

  const sheetPivot = SpreadsheetApp.getActive().getSheetByName('сводная таблица');
  const sheetPrice = SpreadsheetApp.getActive().getSheetByName('Прайс без НДС');
  const rangeArticPivot = sheetPivot.getRange("B:B");
  const rangeArticPrice = sheetPrice.getRange("L:Q");
  const a2Pivot = rangeArticPivot.getValues();
  const a2Price = rangeArticPrice.getValues();

  let artics = '';
  let value = ''

  const a2Map = Array3D_Column_2_Map(a2Pivot, 0);

  for (let row = 0; row < a2Price.length; row++) {
    for (let col = 0; col < a2Price[0].length; col++) {

      let sKUs = String(a2Price[row][col]).split(',').map(sku => sku.trim());

      for (let i = 0; i < sKUs.length; i++) {

        value = sKUs[i];

        if (/\d{3}-\d{3}-\d{4}/.test(value)) {

          if (a2Map.has(value) == false) {

            artics += value + "; ";

          }
        }
      }
    }
  }
  if (artics.length === 0) {
    Browser.msgBox("Артикулы все найдены");
    console.log("Артикулы из 'Прайс без НДС' все найдены в 'сводная таблица'")
  } else {
    Browser.msgBox("Отсутствуют в 'сводная таблица:\n" + artics);
    console.log("Отсутствуют в 'сводная таблица:\n" + artics);
  }
}

// function artiCoolsPriceOne_Test() {

//   const a2ColumnArtics = [['102-052-0025'], ['102-052-0022']];
//   let a2ColumnPrices = [[25], [22]];
//   let a2Artics = a2Artics4One();

//   artiCoolsPriceOne(a2ColumnArtics, a2ColumnPrices, a2Artics);

//   if (a2ColumnPrices[1][0] == 25) {
//     throw new Error('artiCoolsPriceOne_Test OK!', a2ColumnPrices);
//   } 
// }

// /**
//  * @return a2ColumnPrices
//  */
// function artiCoolsPriceOne(a2ColumnArtics, a2ColumnPrices, a2Artics) {
//   // проходом по столбцу 0 артикулов цен одинаковых a2Artics
//   // найти артикул в столбце артикулов, взять номер строки
//   // взять цену из строки массива цен по номеру строки
//   // проходом по вложенному массиву по столбцу артикулов
//   // проставить цену в столбец цен

//   let artic = '';
//   let a1Art = [];
//   let price = 0;
//   let rowA = 0;
//   let mapArtics = Array2D_2_Map(a2ColumnArtics);

//   for (let row = 0; row < a2Artics.length; row++) {

//     artic = a2Artics[row][0];

//     if (mapArtics.has(artic)) {

//       a1Art = a2Artics[row];

//       if (typeof a1Art === 'object') {

//         rowA = mapArtics.get(artic);
//         price = a2ColumnPrices[rowA][0];
//         // основное действие
//         price2Artics(mapArtics, a2ColumnPrices, a1Art, price);

//       } else {
//         throw new Error('artiCoolsPriceOne:', 'a1Art !== object');
//       }

//     } else {
//       throw new Error('artiCoolsPriceOne:', artic, 'НЕ найден в mapArtics');
//     }
//   }

//   return a2ColumnPrices;
// }

// function price2Artics_Test() {
//   const a2Artics = [['1-1'], ['2-2']];
//   const mapArtics = Array2D_2_Map(a2Artics);
//   let a2ColumnPrices = [[11], [22]];;
//   const a1Art = ['3-3', '2-2'];
//   const price = 1;
//   price2Artics(mapArtics, a2ColumnPrices, a1Art, price);
//   if (a2ColumnPrices[1][0] !== price) {
//     throw new Error('price2Artics_Test, ошибка ожидалось 1, получил' + a2ColumnPrices[1][0]);
//   }
// }

// function price2Artics(mapArtics, a2ColumnPrices, a1Art, price) {
//   // расставить артикулам цены

//   let artic = '';
//   let row = -1;

//   for (let index = 0; index < a1Art.length; index++) {

//     artic = a1Art[index];

//     if (mapArtics.has(artic)) {

//       row = mapArtics.get(artic);

//       a2ColumnPrices[row][0] = price;

//     } else {
//       console.log('price2Artics: mapArtics.has(', artic, ') = false');
//     }
//   }

//   return a2ColumnPrices;
// }


// function a2Artics4One() {
//   // вернуть массив артикулов одинаковых цен
//   return [
//     ['102-142-0008', '102-142-0005'],
//     ['102-142-0009', '102-142-0006', '102-142-0010'],
//     ['102-052-0020', '102-052-0021'],
//     ['102-142-0001', '102-142-0002'],
//     ['102-052-0025', '102-052-0022'],
//     ['102-011-0017', '102-011-0056'],
//     ['102-011-0012', '102-011-0079'],
//     ['101-011-0003', '101-011-0004'],
//     ['101-011-0005', '101-011-0006'],
//     ['101-011-0007', '101-011-0008'],
//     ['102-044-0001', '102-044-0002'],
//     ['102-044-0003', '102-044-0004'],
//     ['102-044-0005', '102-044-0006'],
//     ['102-044-0007', '102-044-0008'],
//     ['102-044-0009', '102-044-0010'],
//     ['102-044-0011', '102-044-0012'],
//     ['102-044-0013', '102-044-0014'],
//     ['102-044-0015', '102-044-0016'],
//     ['102-044-0017', '102-044-0018'],
//     ['102-024-0003', '102-024-0004', '102-024-0005'],
//     ['102-025-0001', '102-025-0002', '102-025-0003'],
//     ['102-025-0004', '102-025-0005', '102-025-0006'],
//     ['102-025-0007', '102-025-0008', '102-025-0009'],
//     ['302-122-0001', '302-122-0002', '302-122-0003', '302-122-0004', '302-122-0005'],
//     ['302-122-0006', '302-122-0007', '302-122-0008', '302-122-0009'],
//     ['302-122-0010', '302-122-0011', '302-122-0012', '302-122-0013'],
//     ['302-123-0003', '302-123-0004', '302-123-0005', '302-123-0006', '302-123-0007'],
//     ['302-123-0008', '302-123-0009'],
//     ['202-007-0001', '202-007-0002', '202-007-0003', '202-007-0004', '202-007-0005', '202-007-0006']
//   ];
// }

function pricesAllUpdate_Test() {
  // так как при обновлении происходит сначала очистка, то
  // можно следить за значениями ячеек

  let spread = SpreadsheetApp.getActive();

  let cellD8BezNDS = spread.getSheetByName('Прайс без НДС').getRange("D8").getValue();
  cellD8BezNDS = convert2FloatCommaPointIfPossible(cellD8BezNDS);

  pricesAllUpdate();

  let cellD8WthNDS_ = spread.getSheetByName('Прайс с НДС').getRange("D8").getValue();
  pricesAllUpdateCells_Console(cellD8BezNDS, cellD8WthNDS_, 'cellD8WthNDS_', 1.2);

  let cellD8ParBNDS = spread.getSheetByName('Прайс партнеры без НДС').getRange("D8").getValue();
  pricesAllUpdateCells_Console(cellD8BezNDS, cellD8ParBNDS, 'cellD8ParBNDS', 1.00);

  let cellD8ParWNDS = spread.getSheetByName('Прайс партнеры c НДС').getRange("D8").getValue();
  pricesAllUpdateCells_Console(cellD8BezNDS, cellD8ParWNDS, 'cellD8ParWNDS', 1.2);

  let cellD8SNGPric = spread.getSheetByName('Прайс СНГ').getRange("D8").getValue();
  let mult = spread.getSheetByName('ПрайсыНастройки').getRange('SNG_Multi').getValue();
  mult = mult.toString().replace(',', '.');
  pricesAllUpdateCells_Console(cellD8BezNDS, cellD8SNGPric, 'cellD8SNGPric', mult);

  let cellD8SNGPart = spread.getSheetByName('Прайс СНГ партнеры').getRange("D8").getValue();
  pricesAllUpdateCells_Console(cellD8BezNDS, cellD8SNGPart, 'cellD8SNGPart', mult);

}

function pricesAllUpdateCells_Console_Test() {
  pricesAllUpdateCells_Console('лев', 10, "12", 1.2);
}

function pricesAllUpdateCells_Console(leftValue, rightValue, rightName, multi) {

  let res = 'OK';
  let sym = '=='

  console.log(parseFloat(leftValue * multi).toFixed(2), rightValue)
  console.log(typeof parseFloat(leftValue * multi).toFixed(2), typeof rightValue)

  if (rightName.indexOf('SNG') > 0) {
    if (Math.round(leftValue * multi) != rightValue) {
      res = 'Error';
      sym = '!==';
    }
  } else {
    if (parseFloat(leftValue * multi).toFixed(2) != rightValue) {
      res = 'Error';
      sym = '!==';
    }
  }

  if (res === 'Error') {
    console.log(
      `pricesAllUpdate_Test ${rightName} ${res}: ` +
      `${leftValue} * ${multi} ${sym} ${rightValue}`);
  } else {
    console.log('pricesAllUpdate_Test OK');
  }
}

function pricesAllUpdate() {
  // прайсы обновить ВСЕ из "Прайс без НДС"
  // вызываю по кнопке листа

  let spread = SpreadsheetApp.getActive();
  let sheetBezNDS_ = spread.getSheetByName('Прайс без НДС');

  spread.toast('Собираю высоты строк ... Несколько минут ...');
  let a1RowsHeights = rowsHeightsGet(sheetBezNDS_.getRange("A:A"), true);

  spread.toast('Обновляю Прайс с НДС ...');
  priceSNDSUpdate(a1RowsHeights);

  spread.toast('Обновляю Прайс партнеры без НДС ...');
  priceUpdateDogovornaya(a1RowsHeights, 'Прайс без НДС', 'Прайс партнеры без НДС');

  spread.toast('Обновляю Прайс партнеры с НДС ...');
  pricePartnersSNDSUpdate(a1RowsHeights);

  spread.toast('Обновляю Прайс СНГ ...');
  priceSNGUpdate(a1RowsHeights);

  spread.toast('Обновляю Прайс СНГ партнеры ...');
  priceUpdateDogovornaya(a1RowsHeights, 'Прайс СНГ', 'Прайс СНГ партнеры');

  spread.toast('Цены обновлены.');

}

function priceUpdateDogovornaya_Test() {
  // priceUpdateDogovornaya([], 'Прайс без НДС', 'Прайс партнеры без НДС');
  priceUpdateDogovornaya([48], 'Прайс СНГ', 'Прайс СНГ партнеры');
}

function priceUpdateDogovornaya(a1RowsHeights, sheet_Sour_Name, sheet_Dest_Name) {
  // Прайс обновить и заменить числа в некоторых строках.

  let spread = SpreadsheetApp.getActive();

  let sheet_Sour = spread.getSheetByName(sheet_Sour_Name);
  let sheet_Dest = spread.getSheetByName(sheet_Dest_Name);

  let range = sheet_Dest.getDataRange();
  range.clear();

  sheet_Sour.getRange("A:I").copyTo(sheet_Dest.getRange("A1"), SpreadsheetApp.CopyPasteType.PASTE_NORMAL,
    false);
  sheet_Sour.getRange("A:I").copyTo(sheet_Dest.getRange("A1"), SpreadsheetApp.CopyPasteType.PASTE_COLUMN_WIDTHS,
    false);

  if (typeof a1RowsHeights === 'undefined') {
    spread.toast(sheet_Sour.getName() + ' собираю высоты строк ... несколько минут ...');
    a1RowsHeights = rowsHeightsGet(sheet_Sour.getRange("A:I"), true);
  }

  spread.toast('Строки высоту ставлю, лист: ' + sheet_Dest.getName());
  rowsHeightsSet(a1RowsHeights, sheet_Dest.getRange("A:I"), true);

  let sheetSetting = spread.getSheetByName('ПрайсыНастройки');
  let rangeSetting = sheetSetting.getRange("A:A");
  let rangePartner = sheet_Dest.getRange("B:I");

  // spread.toast('Цены заменяю, лист: ' + rangePartner.getSheet().getName());
  rangeReplacebyMap(rangePartner, rangeSetting);

  // Обработка специальных случаев
  // spread.toast('Замена специальная, лист: ' + rangePartner.getSheet().getName());
  priceNumber2DogovorSpecial(rangePartner);
}


function priceNumber2DogovorSpecial_Test() {

  let spread = SpreadsheetApp.getActive();
  let sheetPartner = spread.getSheetByName('ПрайсПартнёрыБезНДСТест');
  sheetPartner.getRange("F399").setValue(123);
  // sheetPartner.getRange("H434").setValue(123);
  // sheetPartner.getRange("H435").setValue(123);
  let rangePartner = sheetPartner.getRange("B:I")

  priceNumber2DogovorSpecial(rangePartner);

  if (sheetPartner.getRange("F399").getValue() === "Договорная") {
    console.log('priceNumber2DogovorSpecial OK');
  } else {
    console.log('priceNumber2DogovorSpecial Error!');
  }
}

function priceNumber2DogovorSpecial(rangePrice) {
  // Дополнительный патрон ДПГ-3 производства АРТИ и заменить на "Договорная"
  // ПДУ-5 одну цену заменить на "Договорная";

  let a2 = rangePrice.getValues();

  for (row = 0; row < a2.length; row++) {

    if (a2[row][0].indexOf('Дополнительный патрон ДПГ-3 ') > -1) {
      if (a2[row][7] === 'АРТИ') {
        a2[row][6] = "Договорная";
      }
    }
    if (a2[row][0] === 'ПДУ-5') {
      a2[row][4] = 'Договорная';
    }
  }
  rangePrice.setValues(a2);
}

function rangeReplacebyMap_Test() {
  let spread = SpreadsheetApp.getActive();
  let sheetPartner = spread.getSheetByName('ПрайсПартнёрыБезНДСТест');
  let sheetSetting = spread.getSheetByName('ПрайсыНастройки');
  sheetPartner.getRange("D16").setValue(123);
  let rangePrice = sheetPartner.getRange("B:I")
  let rangeSetti = sheetSetting.getRange("A:A");

  rangeReplacebyMap(rangePrice, rangeSetti);

  if (sheetPartner.getRange("D16").getValue() === "Договорная") {
    console.log('priceNumber2DogovorSpecial OK');
  } else {
    console.log('priceNumber2DogovorSpecial Error!');
  }
}

function rangeReplacebyMap(rangePrice, rangeSetti) {
  // на листе заменить некоторые цены по названию

  let ar2DPrices = rangePrice.getValues();
  let ar2DNames_ = rangeSetti.getValues();
  //TODO может нужно заменить на 3d
  let dictiNames = Array2D_Column_2_Map(ar2DNames_, 0);

  a2NumbersReplaceByMap(ar2DPrices, 0, dictiNames, "Договорная");

  rangePrice.setValues(ar2DPrices);

}


function priceSNDSUpdate_Test() {

  let spread = SpreadsheetApp.getActive();

  let sheetBezNDS_ = spread.getSheetByName('Прайс без НДС');

  spread.toast(sheetBezNDS_.getName() + ' собираю высоты строк ... несколько минут ...');
  let a1RowsHeights = rowsHeightsGet(sheetBezNDS_.getRange("A:A"), true);

  priceSNDSUpdate([]);


}

function priceSNDSUpdate(a1RowsHeights) {
  // Прайс "Прайс с НДС" данные обновить из "Прайс без НДС"

  let spread = SpreadsheetApp.getActive();

  let sheetBezNDS_ = spread.getSheetByName('Прайс без НДС');
  let sheetWithNDS = spread.getSheetByName('Прайс с НДС');

  if (typeof a1RowsHeights === 'undefined') {
    spread.toast(sheetBezNDS_.getName() + ' собираю высоты строк ... несколько минут ...');
    a1RowsHeights = rowsHeightsGet(sheetBezNDS_.getRange("A:A"), true);
  }

  rangePriceUpdateMulti(sheetBezNDS_, sheetWithNDS, a1RowsHeights, 1.2, 2);

}


function pricePartnersSNDSUpdate(a1RowsHeights) {
  // Прайс "Прайс с НДС" данные обновить из "Прайс без НДС"

  let spread = SpreadsheetApp.getActive();

  let sheetBezNDS_ = spread.getSheetByName('Прайс партнеры без НДС');
  let sheetWithNDS = spread.getSheetByName('Прайс партнеры c НДС');

  if (typeof a1RowsHeights === 'undefined') {
    spread.toast(sheetBezNDS_.getName() + ' собираю высоты строк ... несколько минут ...');
    a1RowsHeights = rowsHeightsGet(sheetBezNDS_.getRange("A:I"), true);
  }

  rangePriceUpdateMulti(sheetBezNDS_, sheetWithNDS, a1RowsHeights, 1.2, 2, false);

}


function rangePriceUpdateMulti(sheetBezNDS_, sheetWithNDS, a1RowsHeights, multiplier, toFix, mathRound) {
  // Универсальный обновитель прайсов
  // "с НДС" из "Прайс без НДС"
  // взять данные и числа умножить на multiplier
  // или MathRound

  if (multiplier === 'undefined') {
    Browser.msgBox('multiplier === undefined, будет 1');
    multiplier = 1;
  }

  if (toFix === 'undefined') {
    toFix = 2;
  }

  let range = sheetWithNDS.getDataRange();
  range.clear();

  sheetBezNDS_.getRange("A:I").copyTo(sheetWithNDS.getRange("A:I"), SpreadsheetApp.CopyPasteType.PASTE_NORMAL,
    false);
  sheetBezNDS_.getRange("A:I").copyTo(sheetWithNDS.getRange("A:I"), SpreadsheetApp.CopyPasteType.PASTE_COLUMN_WIDTHS,
    false);

  rowsHeightsSet(a1RowsHeights, sheetWithNDS.getRange("A:I"), true);

  range = sheetWithNDS.getRange("C:H");
  let a2Price = range.getValues();

  a2Price = Array2DNumbersMultiToFixed(a2Price, multiplier, toFix, mathRound);

  range.setValues(a2Price);

  let cell = sheetWithNDS.getRange("E2");
  cellReplace(cell, ' без ', ' с ');

}

function priceSNGUpdate_Test() {

  let spread = SpreadsheetApp.getActive();

  let sheetBezNDS_ = spread.getSheetByName('Прайс без НДС');

  spread.toast(sheetBezNDS_.getName() + ' собираю высоты строк ... несколько минут ...');
  let a1RowsHeights = rowsHeightsGet(sheetBezNDS_.getRange("A:A"), true);

  priceSNGUpdate([]);

}

function priceSNGUpdate(a1RowsHeights) {
  // Прайс "Прайс СНГ" обновить из "Прайс без НДС"

  let spread = SpreadsheetApp.getActive();

  let sheetBezNDS_ = spread.getSheetByName('Прайс без НДС');
  let sheetSNG = spread.getSheetByName('Прайс СНГ');

  let mult = spread.getSheetByName('ПрайсыНастройки').getRange('SNG_Multi').getValue();
  mult = mult.toString().replace(',', '.');

  if (typeof a1RowsHeights === 'undefined') {
    spread.toast(sheetBezNDS_.getName() + ' собираю высоты строк ... несколько минут ...');
    a1RowsHeights = rowsHeightsGet(sheetBezNDS_.getRange("A:I"), true);
  }

  rangePriceUpdateMulti(sheetBezNDS_, sheetSNG, a1RowsHeights, mult, true, true);
}

function priceUpdateFromPivot_RUN() {
  // обновить цены из "Прайс без НДС" из "сводная таблица"

  const spread = SpreadsheetApp.getActive();
  // const sheet_Pivot = spread.getSheetByName('сводная таблица (копия)');
  // const sheet_Price = spread.getSheetByName('Прайс без НДС (копия)');
  const sheet_Pivot = spread.getSheetByName('сводная таблица');
  const sheet_Price = spread.getSheetByName('Прайс без НДС');

  priceUpdateFromPivot(sheet_Pivot, sheet_Price);
}

function priceUpdateFromPivot(sheet_Pivot, sheet_Price) {
  // 2022-04-29
  // обновить "Прайс без НДС" из "сводная таблица"

  // Лист "сводная таблица" столбцы Артикул, Цена в массивы a2PivotArtic, a2PivotPrice
  // Лист "Прайс без НДС" столбцы Артикулы, Цены в массивы a2PriceArtics, a2PricePrices

  // Массивы a2PriceArtics, a2PricePrices должны быть одинаковой размерности.

  // Массив a2PriceArtics в словарь mapPriceArticRowCol: ключ - артикул, значение {строка, столбец}

  // Проходом по a2PivotArtic
  // 	Если артикул в mapPriceArticRowCol
  // 		взять цену из a2PivotPrice
  // 		взять строку, столбец из mapPriceArticRowCol
  // 		поставить цену в a2PricePrices[row][col]
  // 		записать в лог

  // лог на лист
  // a2PricePrices на лист "Прайс без НДС"

  const spread = SpreadsheetApp.getActive();

  // if (typeof(sheet_Pivot) === 'undefined') {
  //   sheet_Pivot = spread.getSheetByName('сводная таблица (копия)');
  // }
  // if (typeof(sheet_Price) === 'undefined') {
  //   sheet_Price = spread.getSheetByName('Прайс без НДС (копия)');
  // }

  const sheet_Log_2 = spread.getSheetByName('Log 02');

  // сделай проверку на названия столбцов
  const a2PivotPrice = sheet_Pivot.getRange('J:J').getValues();
  const a2PivotArtic = sheet_Pivot.getRange('B:B').getValues();

  // сделай проверку на названия столбцов
  const a2PricePrices = sheet_Price.getRange('C:H').getValues();
  const a2PriceArtics = sheet_Price.getRange('L:Q').getValues();

  const reg = /\d{3}-\d{3}-\d{4}/;
  const mapPriceArticsRowCol = Array2D_Row_Column_2_Map(a2PriceArtics, reg);
  let a2Log = [];

  forA2PriceUpdateArtic(a2PivotArtic, a2PivotPrice, a2PricePrices, mapPriceArticsRowCol, a2Log, sheet_Price.getName(), reg);

  // положи на лист
  sheet_Price.getRange('C:H').setValues(a2PricePrices);

  // запиши в лог
  sheetAddA2(sheet_Log_2, a2Log);
  sheet_Log_2.activate();
}

function forA2PriceUpdateArtic(a2PivotArtic, a2PivotPrice, a2PricePrices, mapPriceArticsRowCol, a2Log, sheetName4Log, reg) {
  // 2022-04-29
  // Проходом по a2PivotArtic
  // 	Если артикул в mapPriceArticRowCol
  // 		взять цену из a2PivotPrice
  // 		взять строку, столбец из mapPriceArticRowCol
  // 		поставить цену в a2PricePrices[row][col]
  // 		записать в массив лога

  // let a1Log = [];
  // let priceOld, priceNew;

  for (let row = 0; row < a2PivotArtic.length; row++) {

    let artic = a2PivotArtic[row][0];

    if (reg.test(artic)) {

      if (mapPriceArticsRowCol.has(artic)) {

        let a1RowCol = mapPriceArticsRowCol.get(artic);
        let rowPrice = a1RowCol[0];
        let colPrice = a1RowCol[1];

        let priceOld = a2PricePrices[rowPrice][colPrice];
        priceOld = convert2FloatCommaPointIfPossible(priceOld);

        let priceNew = a2PivotPrice[row][0];
        priceNew = convert2FloatCommaPointIfPossible(priceNew);

        if (priceOld !== priceNew) {

          a2PricePrices[rowPrice][colPrice] = priceNew;

          // ДатаВремя	Лист	Строка	Столбец	Было	Стало
          let a1Log = [];
          a1Log[0] = dateFormatYMDHMS(new Date());
          a1Log[1] = sheetName4Log;
          a1Log[2] = rowPrice + 1;
          a1Log[3] = columnNumber2Letter(colPrice + 3);
          a1Log[4] = priceOld;
          a1Log[5] = priceNew;

          a2Log.push(a1Log);
        }
      }
    }
  }
}

function sheetAddA2(sheet, a2) {
  // добавить массив к строкам листа вниз
  // найти последнюю пустую строку
  // вставить массив

  if (Array.isArray(a2)) {
    if (a2.length > 0 && a2[0].length > 0) {
      let row = sheet.getDataRange().getLastRow() + 1;
      sheet.getRange(row, 1, a2.length, a2[0].length).setValues(a2);
    }
  }
}

function Array2D_Row_Column_2_Map_Test() {
  // 2022-04-29
  const spread = SpreadsheetApp.getActive();
  const sheet_Price = spread.getSheetByName('Прайс без НДС (копия)');
  const a2 = sheet_Price.getRange('O8:P9').getValues();

  const reg = /\d{3}-\d{3}-\d{4}/

  const mapArtic = Array2D_Row_Column_2_Map(a2, reg);
}

function Array2D_Row_Column_2_Map(array2d, regexp) {
  // 2022-04-29
  // из массива 2мерного вернуть словарь - массив ассоциативный: 
  // ключ - значение по регулярному, значение -  номер строки и номер столбца

  let map_return = new Map();
  let val = '';

  for (let row = 0; row < array2d.length; row++) {
    for (let col = 0; col < array2d[row].length; col++) {

      val = String(array2d[row][col]);

      if (regexp.test(val)) {
        // если ключ повторяется, то обновится значение
        map_return.set(val, [row, col]);
      }
    }
  }
  return map_return;
}
