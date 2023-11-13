function test1() {

  const spread = SpreadsheetApp.getActive();
  const sheet_Price = spread
    .getSheetByName('Прайс без НДС');

  let cell = sheet_Price.getRange('A1');
  console.time('Ячейка НЕ нужная');
  AMain_Drakon(cell);
  console.timeEnd('Ячейка НЕ нужная');

  cell = sheet_Price.getRange('D8');
  console.time('Ячейка нужная');
  AMain_Drakon(cell);
  console.timeEnd('Ячейка нужная');

  const sheet_SKUs = spread.getSheetByName('Прайс без НДС Артикулы история');
  const cell_SKU = sheet_SKUs.getRange('B2');
  const SKU = cell_SKU.getValue();

  const regex = /\d{3}-\d{3}-\d{4}/;

  if (regex.test(SKU) === false)
    Logger.log('На листе ' +
      sheet_SKUs.getName() + ', в ячейке ' +
      cell_SKU.getA1Notation + 'ожидался артикул, ' +
      'но получено' + SKU);

  // найти ячейку с артикулом    
}

function table_Find_Test() {
  // Тестовая таблица
  var testTable = [
    ['apple', 'banana', 'cherry'],
    ['date', 'fig', 'grape'],
    ['kiwi', 'lemon', 'melon']
  ];

  // Поиск существующего значения
  var result1 = table_Find(testTable, 'lemon');
  assert(
    result1.row === 2 && result1.column === 1,
    'Тест не пройден: Неверный результат для существующего значения.'
  );

  // Поиск несуществующего значения
  var result2 = table_Find(testTable, 'orange');
  assert(
    result2.row === -1 && result2.column === -1,
    'Тест не пройден: Неверный результат для несуществующего значения.'
  );
}

// // Вспомогательная функция для проверки условия и вывода сообщения об ошибке
// function assert(condition, message) {
//   if (!condition) {
//     console.error('Ошибка в тесте:', message);
//   }
// }

// Запуск теста
table_Find_Test();

function table_Find(table, needle){
  // найти в таблице (массиве из диапазона) значение и вернуть номер строки и стобца
    for (var row = 0; row < table.length; row++) {
      for (var col = 0; col < table[row].length; col++) {
        if (table[row][col].toString().indexOf(needle) > -1) {
          return { row: row, column: col };
        }
      }
    }
  
    // Если значение не найдено, возвращаем null или другое значение по умолчанию
    return { row: -1, column: -1 };
  }
  