// Autogenerated with DRAKON Editor 1.31


function AATests_RUN() {
    // item 501
    AMain_Drakon_TestS();
    // item 192
    // Тесты чистых функций
    /**
    SKUs_Hystory_Date_Update_If_Test();
    SKUs_Hystory_Row_Add_Test();
    maps_Equal_Test();
    string_Filter_Test();
    table_2_Map_Test()
    table_Copy_Test();
    table_Row_by_Column_Value_Test(); */
    // item 169
    // Тесты функций данных
    
    // должен быть первым
    /**
    ranges_2_NS_Test();
    
    SKUs_History_Update_Test();
    cellS_Has_SKU_Test();*/
}

function AMain_Drakon(cell) {
    // item 391
    if (cellS_Has_SKU(
	cell, 
	/\d{3}-\d{3}-\d{4}/)) {
        // item 144
        ranges_2_NS();
        // item 23
        SKUs_History_Update();
        // item 373
        NS.date_Paint_Start =   
        	new Date(
        		new Date().getTime() - 
        		30 * 24 * 60 * 60 * 1000);
        // item 357
        price_BackGrounds_Paint();
    } else {
        
    }
}

function AMain_Drakon_TestS() {
    // item 500
    // Тесты общие
    
    /** 
      const spread = SpreadsheetApp.getActive()  	
      const sheet_Price = spread
    		.getSheetByName('Прайс без НДС');
      
      let cell = sheet_Price.getRange('A1');
      console.time('Ячейка НЕ нужная');
      AMain_Drakon(cell);
      console.timeEnd('Ячейка НЕ нужная');
    
      cell = sheet_Price.getRange('D8');
      console.time('Ячейка нужная');
      AMain_Drakon(cell);
      console.timeEnd('Ячейка нужная');*/
    // item 554
    const SKU_HIstory_Row_2 = 2;
    
    const SKU_Date_Origin = 
    	SKU_Date_Get(
    		SKU_HIstory_Row_2);
    
    const date_New = 
    	new Date()
    	.toISOString()
    	.slice(0, 10);
    
    SKU_Date_Set(
    	SKU_HIstory_Row_2,
    	date_New);
    // item 597
    Logger.log(
    	'Запуск AMain_Drakon ...');
    // item 596
    const cell_Price = 
    	SpreadsheetApp.getActive()
    	.getSheetByName('Прайс без НДС')
    	.getRange('D8');
    
    AMain_Drakon(cell_Price);
    // item 561
    cell_Price_BackGround =
    	cell_Price_BackGround_Get(
    		SKU_HIstory_Row_2);
    // item 555
    if (cell_Price_BackGround ===
	'yellow') {
        
    } else {
        // item 558
        Logger.log(
        	'Ошибка в ' +
        	'AMain_Drakon_TestS ' +
        	'ячейка не стала жёлтой');
    }
    // item 560
    const SKU_Date_New = 
    	new Date()
    	.toISOString()
    	.slice(0, 10);
    
    SKU_Date_Set(
    	SKU_HIstory_Row_2,
    	SKU_Date_New);
    // item 598
    Logger.log(
    	'Запуск AMain_Drakon ...');
    
    AMain_Drakon(cell_Price);
    // item 562
    cell_Price_BackGround =
    	cell_Price_BackGround_Get(
    		SKU_HIstory_Row_2);
    // item 563
    if (cell_Price_BackGround ===
	'white') {
        
    } else {
        // item 566
        Logger.log(
        	'Ошибка в ' +
        	'AMain_Drakon_TestS ' +
        	'ячейка не стала белой');
    }
    // item 567
    SKU_Date_Set(
    	SKU_HIstory_Row_2,
    	SKU_Date_Origin);
}

function NS() {
    
}

function SKU_Date_Get(row) {
    // item 573
    return SpreadsheetApp.getActive()
    	.getSheetByName('Прайс без НДС Артикулы история')
    	.getRange('A' + row)
    	.getValue();
}

function SKU_Date_Set(row, date) {
    // item 579
    SpreadsheetApp.getActive()
    	.getSheetByName('Прайс без НДС Артикулы история')
    	.getRange('A' + row)
    	.setValue(date);
}

function SKUs_Date_Newest(SKUs_History, SKUs) {
    // item 439
    const column_Key = 1;
    const column_Item = 0;
    // item 445
    if (NS.map_SKUs_Dates === undefined) {
        // item 438
        NS.map_SKUs_Dates = 
        	table_2_Map(
        		SKUs_History,
        		column_Key,
        		column_Item);
    } else {
        
    }
    // item 601
    const SKUs_Filtered = 
    	table_Rows_Filter(
    		SKUs_History,
    		SKUs,
    		1);
    // TODO
}

function SKUs_History_Update() {
    // item 265
    const array_SKUs_History_Old = 
    	table_Copy(
    		NS.array_SKUs_History);
    // item 599
    const rows_Max = NS.array_SKUs_3D.length;
    const cols_Max = NS.array_SKUs_3D[0].length;
    // item 920001
    let row = 0;
    while (true) {
        // item 920002
        if (row < rows_Max) {
            
        } else {
            break;
        }
        // item 3790001
        let col = 0;
        while (true) {
            // item 3790002
            if (col < cols_Max) {
                
            } else {
                break;
            }
            // item 96
            var array_SKUs = 
            	string_Filter(
            		NS.array_SKUs_3D[row][col],
            		NS.sku_Regex);
            // item 99
            array_SKUs = 
            	array_Trim(
            		array_SKUs);
            // item 940001
            let i = 0;
            while (true) {
                // item 940002
                if (i < array_SKUs.length) {
                    
                } else {
                    break;
                }
                // item 220
                const column_Price = col - 9;
                
                const price = NS.array_Prices[row][column_Price];
                
                const SKU = array_SKUs[i];
                // item 219
                const row_SKU = table_Row_by_Column_Value(
                		NS.array_SKUs_History,
                		1,
                		SKU);
                // item 173
                if (row_SKU > -1) {
                    // item 240
                    SKUs_Hystory_Date_Update_If(NS.array_SKUs_History, 
                    			   row_SKU, 
                    			   price);
                } else {
                    // item 217
                    SKUs_Hystory_Row_Add(
                    	NS.array_SKUs_History, 
                    	price);
                }
                // item 940003
                i++;
            }
            // item 3790003
            col ++;
        }
        // item 920003
        row ++;
    }
    // item 272
    if (arrays_Equal(
	NS.array_SKUs_History, 
	array_SKUs_History_Old)) {
        
    } else {
        // item 283
        const cell = 
        	NS.sheet_SKUs_History
        	.getRange('A1');
        // item 282
        table_2_Range(
        	NS.array_SKUs_History,
        	cell);
    }
}

function SKUs_History_Update_Test() {
    // item 159
    console.time(
    	'SKUs_History_Update');
    // item 161
    SKUs_History_Update();
    // item 160
    console.timeEnd(
    	'SKUs_History_Update');
}

function SKUs_Hystory_Date_Update_If(table, row, price_New) {
    // item 251
    const price_Old = table[row][2];
    // item 248
    if (price_Old !== price_New) {
        // item 252
        table[row][0] = new Date().toISOString().slice(0, 10);
        
        // артикул без изменений
        
        table[row][2] = price_New;
        
        table[row][3] = Session.getActiveUser().getEmail();
    } else {
        
    }
}

function SKUs_Hystory_Date_Update_If_Test() {
    // item 258
      var table = [
        ["2023-11-12", "SKU1", 20.99, "user1@ex.com"],
        ["2023-11-13", "SKU2", 30.99, "user2@ex.com"],
        // ... другие строки
      ];
    
      var row = 1;
      var price = 40.99; // новая цена
    
      // Получаем старую цену для сравнения
      var price_Old = table[row][2];
    
      SKUs_Hystory_Date_Update_If(table, row, price);
    // item 259
    const price_New = table[row][2];
    // item 260
    if (price_New === price_Old) {
        // item 264
        Logger.log(
        	'Ошибка в ' + 
        	'SKUs_Hystory_Date_Update_If_Test');
    } else {
        
    }
}

function SKUs_Hystory_Row_Add(table, SKU, price) {
    // item 227
    // ДатаВремя	Артикул	Цена	Пользователь
    
    const row_1D = [];
    
    row_1D[0] = new Date().toISOString().slice(0, 10);
    
    row_1D[1] = SKU;
    
    row_1D[2] = price;
    
    row_1D[3] = Session.getActiveUser().getEmail();
    // item 228
    table.push(row_1D);
}

function SKUs_Hystory_Row_Add_Test() {
    // item 234
      // Создаем временный массив для тестов
        table = [
        ["2023-11-12", "SKU1", 20.99, "user1@example.com"],
        ["2023-11-13", "SKU2", 30.99, "user2@example.com"],
      ];
    
      // Задаем SKU и price для теста
      var testSKU = "TestSKU";
      var testPrice = 99.99;
    
      // Вызываем функцию добавления строки
      SKUs_Hystory_Row_Add(table, testSKU, testPrice);
    // item 235
    if (table.length === 3) {
        
    } else {
        // item 238
        Logger.log(
        	'Ошибка в ' + 
        	'SKUs_Hystory_Row_Add_Test');
    }
}

function array_Trim(array) {
    // item 290
    return array.map(
    		item => item.toString().trim()
    		);
}

function arrays_Equal(left, right) {
    // item 356
    return  JSON.stringify(left) === 
    	JSON.stringify(right)
}

function assert(condition) {
    // item 346
    if (condition) {
        // item 350
        // Logger.log(
        //	'Test Passed!')
    } else {
        // item 349
        Logger.log(
        	'Test Failed!');
    }
}

function cellS_Has_SKU(cell, regex) {
    // item 72
    if (cell === undefined) {
        // item 75
        return false
    } else {
        // item 124
        if (regex.test(
	cell.getValue())) {
            // item 394
            return true
        } else {
            // item 128
            if (regex.test(
	cell.offset(0,9)
		.getValue())) {
                // item 131
                return true
            } else {
                // item 132
                return false
            }
        }
    }
}

function cellS_Has_SKU_Test() {
    // item 134
    const table_Decision = [ 
    	['A1',    false],
    	['D8',    true],
    	['Q123', true]];
    // item 49
    const regex = /\d{3}-\d{3}-\d{4}/;
    
    const sheet = SpreadsheetApp
    	.getActiveSpreadsheet()
    	.getSheetByName('Прайс без НДС')
    // item 1350001
    var _ind135 = 0;
    var _col135 = table_Decision;
    var _len135 = _col135.length;
    while (true) {
        // item 1350002
        if (_ind135 < _len135) {
            
        } else {
            break;
        }
        // item 1350004
        var row = _col135[_ind135];
        // item 137
        const cell = sheet.getRange(row[0]);
        
        const result = cellS_Has_SKU(
        		cell,
        		regex);
        // item 138
        if (result === row[1]) {
            
        } else {
            // item 141
            Logger.log(
            	'Ошибка в cellS_Has_SKU_Test');
        }
        // item 1350003
        _ind135++;
    }
}

function cell_Price_BackGround_Get(row) {
    // item 595
    const spread = 
    	SpreadsheetApp.getActive();
    // item 585
    const SKU = spread
    	.getSheetByName(
    	'Прайс без НДС Артикулы история')
    	.getRange('B' + row)
    	.getValue();
    // item 586
    const sheet_Price =
    	spread
    	.getSheetByName('Прайс без НДС');
    
    const table =
    	sheet_Price
    	.getRange('L1:Q')
    	.getValues();
    // item 587
    const find = table_Find(table, SKU)
    // item 588
    if (find.row > -1) {
        // item 593
        const row = find.row + 1;
        const col = find.column + 3;
        
        const color = sheet_Price
        	.getRange(row, col)
        	.getBackground();
        // item 594
        return color
    } else {
        // item 591
        Logger.log(
        	'Ошибка в ' +
        	'cell_Price_BackGround_Get: ' + 
        	'Артикул не найден');
        // item 592
        return '';
    }
}

function maps_Equal(map_1, map_2) {
    // item 494
    return JSON.stringify([...map_1]) === 
    	JSON.stringify([...map_2]);
}

function maps_Equal_Test() {
    // item 492
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
    // item 493
        // Проверка равенства двух одинаковых Map
        assert(
          maps_Equal(map_1, map_2),
          'Тест не пройден: Map1 и Map2 должны быть равны.'
        );
      
        // Проверка неравенства Map с разными значениями
        assert(
          !maps_Equal(map_1, map_3),
          'Тест не пройден: Map1 и Map3 должны быть неравны' +
    	'из-за разных значений.'
        );
      
        // Проверка неравенства Map с разными ключами
        assert(
          !maps_Equal(map_1, map_4),
          'Тест не пройден: Map1 и Map4 должны быть неравны' +
    	'из-за разных ключей.'
        );
}

function price_BackGrounds_Paint() {
    // item 384
    const price_BackGrounds_Old = 
    	table_Copy(
    		NS.array_Prices_BackGrounds);
    // item 389
    const rows_Max = NS.array_SKUs_3D.length;
    const cols_Max = NS.array_SKUs_3D[0].length;
    // item 3640001
    let row = 0;
    while (true) {
        // item 3640002
        if (row < rows_Max) {
            
        } else {
            break;
        }
        // item 3820001
        let col = 0;
        while (true) {
            // item 3820002
            if (col < cols_Max) {
                
            } else {
                break;
            }
            // item 365
            var array_SKUs = 
            	string_Filter(
            		NS.array_SKUs_3D[row][col],
            		NS.sku_Regex);
            // item 366
            array_SKUs = 
            	array_Trim(
            		array_SKUs);
            // item 370
            if (array_SKUs.length === 0) {
                
            } else {
                // item 600
                debugger;
                // item 374
                const date_Newest = 
                	SKUs_Date_Newest(
                		NS.array_SKUs_History,
                		array_SKUs);
                // item 375
                if (date_Newest >= 
NS.date_Paint) {
                    // item 383
                    NS.array_Prices_BackGrounds[row][col - 9] =
                    'yellow';
                } else {
                    // item 378
                    NS.array_Prices_BackGrounds[row][col - 9] =
                    'white';
                }
            }
            // item 3820003
            col ++;
        }
        // item 3640003
        row ++;
    }
    // item 385
    if (arrays_Equal(
	price_BackGrounds_Old, 
	NS.array_Prices_BackGrounds)) {
        
    } else {
        // item 388
        NS.range_Prices
        	.setBackgrounds(
        		NS.array_Prices_BackGrounds);
    }
}

function ranges_2_NS() {
    // item 83
    NS.sku_Regex = /\d{3}-\d{3}-\d{4}/;
    
    NS.spread = SpreadsheetApp.getActive();
    
    NS.sheet_Price_NDS_NO = NS.spread.getSheetByName('Прайс без НДС');
    NS.sheet_SKUs_History = NS.spread.getSheetByName('Прайс без НДС Артикулы история');
    
    NS.range_Prices = NS.sheet_Price_NDS_NO.getRange('C1:H');
    NS.array_Prices = NS.range_Prices.getValues();
    NS.array_Prices_BackGrounds = NS.range_Prices.getBackgrounds();
    
    NS.range_SKUs_3D = NS.sheet_Price_NDS_NO.getRange('L1:Q');
    NS.array_SKUs_3D = NS.range_SKUs_3D.getValues();
    
    NS.range_SKUs_History = NS.sheet_SKUs_History.getRange('A1:D');
    NS.array_SKUs_History = NS.range_SKUs_History.getValues();
}

function ranges_2_NS_Test() {
    // item 151
    console.time('range_2_NS');
    // item 153
    ranges_2_NS();
    // item 152
    console.timeEnd('range_2_NS');
}

function string_Filter(string, regex) {
    // item 296
    return string
    	.split(',')
    	.filter(
    		item => regex.test(item)
    		);
}

function string_Filter_Test() {
    // item 396
      var testString = 
    	"apple,banana,cherry,orange,grape";
    
      var testRegex = /^(a|b)/;
    
      var filtered = string_Filter(
    			testString, 
    			testRegex);
    
      var wanted = ["apple", "banana"];
    // item 397
    if (arrays_Equal(wanted, 
		      filtered)) {
        
    } else {
        // item 400
        Logger.log(
        	'Ошибка в string_Filter_Test');
    }
}

function table_2_Map(table, column_Key, column_Item) {
    // item 448
    var map = new Map();
    // item 4490001
    var i = 0;
    while (true) {
        // item 4490002
        if (i < table.length) {
            
        } else {
            break;
        }
        // item 454
        var key = table[i][column_Key];
        var item = table[i][column_Item];
        // item 451
        if ((key === undefined) || (item === undefined)) {
            
        } else {
            // item 458
            map.set(key, item);
        }
        // item 4490003
        i++;
    }
    // item 459
    return map;
}

function table_2_Map_Test() {
    
}

function table_2_Range(a2, cell) {
    // item 281
    cell.offset(0, 0, a2.length, a2[0].length).setValues(a2);
}

function table_Copy(table) {
    // item 307
    return table.map(row => [...row]);
}

function table_Copy_Test() {
    // item 313
      // Указываем тестовые данные
      const table = [[1, 2], [3, 4]];
    
      // Вызываем функцию копирования
      const table_New = table_Copy(table);
    
      // Ожидаемый результат
      const wanted = [[1, 2], [3, 4]];
    // item 314
    if (arrays_Equal(wanted,
	   	table_New)) {
        
    } else {
        // item 317
        Logger.log(
        	'Ошибка в table_Copy_Test');
    }
}

function table_Find(table, needle) {
    // item 5350001
    var row = 0;
    while (true) {
        // item 5350002
        if (row < table.length) {
            
        } else {
            break;
        }
        // item 5370001
        var col = 0;
        while (true) {
            // item 5370002
            if (col < table[row].length) {
                
            } else {
                break;
            }
            // item 539
            if (table[row][col]
	.toString()
	.indexOf(needle) > -1) {
                // item 542
                return { 
                	row: row, 
                	column: col };
            } else {
                
            }
            // item 5370003
            col++;
        }
        // item 5350003
        row++;
    }
    // item 543
    return { 
    	row: -1, 
    	column: -1 };
}

function table_Find_Test() {
    // item 507
      var table = [
        ['apple', 'banana', 'cherry'],
        ['date', 'fig', 'grape'],
        ['kiwi', 'lemon', 'melon']
      ];
    // item 508
    var result1 = table_Find(table, 'lemon');
    // item 518
    if (result1.row === undefined) {
        // item 521
        Logger.log(
        	'ОШибка в table_Find_Test');
    } else {
        // item 509
        if (result1.row === -1) {
            // item 512
            Logger.log(
            	'ОШибка в table_Find_Test');
        } else {
            
        }
    }
    // item 513
    var result2 = table_Find(table, 'orange');
    // item 526
    if (result2.row === undefined) {
        // item 529
        Logger.log(
        	'ОШибка в table_Find_Test');
    } else {
        // item 522
        if (result1.row === -1) {
            
        } else {
            // item 525
            Logger.log(
            	'ОШибка в table_Find_Test');
        }
    }
}

function table_Row_by_Column_Value(table, column_Number, needle) {
    // item 3290001
    let row = 0;
    while (true) {
        // item 3290002
        if (row < table.length) {
            
        } else {
            break;
        }
        // item 324
        if (table[row][column_Number] === needle) {
            // item 327
            return row;
        } else {
            
        }
        // item 3290003
        row++;
    }
    // item 328
    return -1;
}

function table_Row_by_Column_Value_Test() {
    // item 336
    const table = [[1, 2], [3, 4]];
    
    const result = table_Row_by_Column_Value(
    		table, 0, 3);
    // item 337
    if (result === 1) {
        
    } else {
        // item 340
        Logger.log(
          'Ошибка в ' +
          'table_Row_by_Column_Value_Test'
        );
    }
}

function table_Rows_Filter(table, needles, column_Number) {
    // item 607
    // В столбце таблицы (массив из диапазона)
    // искать значения вернуть строки
    // item 608
    return table.filter(
    	row => 
    	needles.includes(
    		row[column_Number]));
}



