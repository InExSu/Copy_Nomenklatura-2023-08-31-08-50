
function table_2_Map_Test() {
    // Тестовый массив
    var testTable = [
      { id: 1, value: 'apple' },
      { id: 2, value: 'banana' },
      { id: 3, value: 'orange' },
      { id: 4, value: 'grape' }
    ];
  
    // Вызываем функцию преобразования в Map
    var resultMap = table_2_Map(testTable, 'id', 'value');
  
    // Ожидаемый результат
    var expectedMap = new Map([
      [1, 'apple'],
      [2, 'banana'],
      [3, 'orange'],
      [4, 'grape']
    ]);
  
    // Проверка результата
    assert(
      maps_Equal(resultMap, expectedMap),
      'Тест не пройден: результат не соответствует ожидаемому.'
    );
  }
  
  // Вспомогательная функция для проверки равенства двух Map
  function maps_Equal(map_1, map_2) {
    if (map_1.size !== map_2.size) {
      return false;
    }
    for (let [key, value] of map_1) {
      if (!map_2.has(key) || map_2.get(key) !== value) {
        return false;
      }
    }
    return true;
  }
  
  // Вспомогательная функция для проверки условия и вывода сообщения об ошибке
  function assert(condition, message) {
    if (!condition) {
      console.error('Ошибка в тесте:', message);
    } else {
      console.log('Тест пройден!');
    }
  }
  