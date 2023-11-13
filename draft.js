function maps_Equal_Test() {
    // Тестовые Map
    var map_1 = new Map([
      [1, 'apple'],
      [2, 'banana'],
      [3, 'orange']
    ]);
  
    var map_2 = new Map([
      [1, 'apple'],
      [2, 'banana'],
      [3, 'orange']
    ]);
  
    var map_3 = new Map([
      [1, 'apple'],
      [2, 'banana'],
      [3, 'grape'] // изменено значение
    ]);
  
    var map_4 = new Map([
      [1, 'apple'],
      [2, 'banana'],
      [4, 'orange'] // изменен ключ
    ]);
  
    // Проверка равенства двух одинаковых Map
    assert(
      maps_Equal(map_1, map_2),
      'Тест не пройден: Map1 и Map2 должны быть равны.'
    );
  
    // Проверка неравенства Map с разными значениями
    assert(
      !maps_Equal(map_1, map_3),
      'Тест не пройден: Map1 и Map3 должны быть неравны из-за разных значений.'
    );
  
    // Проверка неравенства Map с разными ключами
    assert(
      !maps_Equal(map_1, map_4),
      'Тест не пройден: Map1 и Map4 должны быть неравны из-за разных ключей.'
    );
  
    console.log('Все тесты завершены.');
  }
  
  // Вспомогательная функция для проверки условия и вывода сообщения об ошибке
  function assert(condition, message) {
    if (!condition) {
      console.error('Ошибка в тесте:', message);
    } else {
      console.log('Тест пройден!');
    }
  }
  
  // Запуск теста
  maps_Equal_Test();
  