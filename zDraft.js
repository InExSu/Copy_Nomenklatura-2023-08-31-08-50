function table_Rows_Filter_Test() {
  // Тестовая таблица
  var table = [
    ['apple', 'red', 5],
    ['banana', 'yellow', 3],
    ['cherry', 'red', 8],
    ['orange', 'orange', 4]
  ];

  // Фильтрация по одному значению
  var result1 = table_Rows_Filter(table, ['red'], 1);
  assert(
    result1.length === 2 && result1[0][1] === 'red' && result1[1][1] === 'red',
    'Тест не пройден: Неверный результат для фильтрации по одному значению.'
  );

  // Фильтрация по нескольким значениям
  var result2 = table_Rows_Filter(table, ['red', 'yellow'], 1);
  assert(
    result2.length === 3 &&
    result2[0][1] === 'red' &&
    result2[1][1] === 'yellow' &&
    result2[2][1] === 'red',
    'Тест не пройден: Неверный результат для фильтрации по нескольким значениям.'
  );

  // Фильтрация без найденных значений
  var result3 = table_Rows_Filter(table, ['blue'], 1);
  assert(
    result3.length === 0,
    'Тест не пройден: Неверный результат для фильтрации без найденных значений.'
  );
}
