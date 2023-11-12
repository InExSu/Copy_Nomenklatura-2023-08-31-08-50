const SPREAD = SpreadsheetApp.getActive();

const SHEET_PIVOT = SPREAD.getSheetByName('сводная таблица');
const SHEET_PARTNER = SPREAD.getSheetByName('Прайс партнеры без НДС');
const SHEET_PRICE_NDS_NO = SPREAD.getSheetByName('Прайс без НДС');

/**
 * На листе "сводная таблица" обновить столбец 
  "Цена для партнеров, руб (Без НДС)" ценами из листа
  "Прайс партнеры без НДС" по артикулам.
 */
function pivotColumnPricePartnerNDSno() {
  // Сложность - на листе "Прайс партнеры без НДС" нет артикулов. 
  // Но диапазон цен C:H листа "Прайс партнеры без НДС" обновляется из (является копией) диапазона C:H листа "Прайс без НДС", в котором в диапазне L:Q находятся артикулы соответственно ценам в диапазоне C:H.

  // Поэтому из листа "Прайс партнеры без НДС" беру 
  // диапазон B в массив partnerB.
  // Из листа "Прайс без НДС" беру столбец B массив priceB и сравниваю массивы - они должны совпасть, иначе выход.

  // Из листа "Прайс без НДС" беру столбцы артикулов L:Q в массив LQ_SKU.
  // Сравниваю строки 6 массивов CH_Price и LQ_SKU - они должны совпасть иначе ВЫХОД.
  // Проходом по LQ_SKU ячейки похожие на артикул кладу в  словарь артикул-цену mapSKUPrice - цену беру из такого же элемента массива CH_Price.  

  // Из листа "сводная таблица" беру столбец Артикул в массив arraySKU, столбец "Цена для партнеров, руб (Без НДС)" в массив arrayPricePartner.
  // Проходом по массиву arraySKU ставлю цены в arrayPricePartner из mapSKUPrice.

  // arrayPricePartner кладу на лист "сводная таблица" в столбец "Цена для партнеров, руб (Без НДС)"

  pricePartnerFormat(
    pricePartner2Sheet(
      pricePartnerFill(
        pricePartnerMake(
          pivotSKUMake(
            mapSKUPrice(
              cH_LQRow6Compare(
                cHMake(
                  lQMake(
                    columsBCompare(
                      partnerB(
                        priceB(SHEET_PRICE_NDS_NO)
                      )
                    )
                  )
                )
              )
            )
          )
        )
      )
    )
  )
}

function pricePartnerFormat(range) {
  range.setNumberFormat('#,##0.00');
}

function pricePartner2Sheet(column) {

  var header = 'Цена для партнеров, руб (Без НДС)';
  var columnIndex = columnByValue(SHEET_PIVOT, header, 1);

  var range = SHEET_PIVOT.getRange(1, columnIndex, column.length, 1);

  range.setValues(column);

  return range;
}

function pricePartnerFill(objectData) {

  var sku = '';
  var dict = objectData.mapSKUPrice;

  for (var i = 0; i < objectData.pivotSKU.length; i++) {

    sku = objectData.pivotSKU[i][0];

    // if (sku == '302-122-0007') debugger;

    if (dict.has(sku)) {
      objectData.pivotPartner[i][0] = dict.get(sku);
    }
  }

  return objectData.pivotPartner;
}

function pricePartnerMake(objectData) {

  var header = 'Цена для партнеров, руб (Без НДС)';

  var columnIndex = columnByValue(SHEET_PIVOT, header, 1);

  objectData.pivotPartner = formulasAndValuesToArrays(SHEET_PIVOT, columnIndex);

  return objectData;
}

function pivotSKUMake(objectData) {

  var columnIndex = columnByValue(SHEET_PIVOT, 'Артикул', 1);

  objectData.pivotSKU = SHEET_PIVOT.getRange(1, columnIndex, SHEET_PIVOT.getLastRow(), 1).getValues();

  return objectData;
}

function columnByValue(sheet, header, row) {

  //getRange(row, column, numRows, numColumns) 
  var headers = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];
  var columnIndex = headers.indexOf(header) + 1;

  if (columnIndex < 1) {
    throw new Error('На листе ' + sheet.getName() + 'НЕ найден столбец ' + header);
  }

  return columnIndex;
}

function mapSKUPriceTest() {
  const objectData = {
    LQ_SKU: [["123-4567-8901", "234-5678-9012"], ["345-6789-0123", "456-7890-1234"]],
    CH_Price: [[10, 20], [30, 40]]
  };
  const expectedMap = new Map([
    ["123-4567-8901", 10],
    ["234-5678-9012", 20],
    ["345-6789-0123", 30],
    ["456-7890-1234", 40]
  ]);

  const resultMap = mapSKUPrice(objectData).mapSKUPrice;

  if (resultMap.size !== expectedMap.size) {
    console.error("Test failed: map sizes do not match");
    return;
  }

  for (const [key, value] of expectedMap) {
    if (!resultMap.has(key) || resultMap.get(key) !== value) {
      console.error("Test failed: key ${ key } or value ${ value } not found in result map");
      return;
    }
  }
}

function mapSKUPrice(objectData) {

  const regex = /\d{3}-\d{3}-\d{4}/;

  var sku = objectData.LQ_SKU;
  var skuValue = '';
  var arrayPrice = objectData.CH_Price;
  var map1 = new Map();
  var price = '';

  for (let row = 0; row < sku.length; row++) {
    for (let col = 0; col < sku[0].length; col++) {

      skuValue = sku[row][col];

      if (regex.test(skuValue)) {

        price = arrayPrice[row][col];

        map1.set(skuValue, price);
      }
    }
  }

  objectData.mapSKUPrice = map1;

  if (map1.size < 1) {
    throw new Error('map1.size < 1');
  }

  return objectData;
}

/** 
 * Сравниваю строки 6 массивов CH_Price и LQ_SKU - они должны совпасть иначе ВЫХОД.
 */
function cH_LQRow6Compare(objectData) {

  var rowCH = objectData.CH_Price[6];
  var rowLQ = objectData.LQ_SKU[6]

  var stringCH = JSON.stringify(rowCH);
  var stringLQ = JSON.stringify(rowLQ);

  if (stringCH !== stringLQ) {
    throw new Error("Заголовки не совпадают!");
  }

  return objectData;
}

function cHMake(objectData) {
  var ch = SHEET_PARTNER.getRange('C:H').getValues();
  objectData.CH_Price = ch;
  return objectData;
}

function lQMake(objectData) {
  objectData.LQ_SKU = SHEET_PRICE_NDS_NO.getRange('L:Q').getValues()
  return objectData;
}

function columsBCompare(objectData) {
  //сравниваю массивы - они должны совпасть, иначе выход
  if (JSON.stringify(objectData.partnerB) !== JSON.stringify(objectData.priceB)) {
    throw new Error("ОШИБКА! \n НЕ совпали столбцы B листов \n 'Прайс без НДС' и \n 'Прайс партнеры без НДС'");
  }

  return objectData;
}

function partnerB(rangeValues) {

  var b = arrayTrimDown(SHEET_PARTNER.getRange('B:B').getValues());

  return {
    partnerB: b,
    priceB: rangeValues,
  };
}
function priceB(sheet) {
  return arrayTrimDown(sheet.getRange('B:B').getValues());
}

/**
 * Массиву из столбца отсечь нижние пустые элементы
 */
function arrayTrimDown(array) {
  for (var i = array.length - 1; i >= 0; i--) {
    if (array[i][0] !== "") {
      break;
    }
    array.splice(i, 1);
  }
  return array;
}