// Autogenerated with DRAKON Editor 1.31


function AATests_RUN() {
    // item 192
    // Чистые функции
    string_Filter_Test();
    table_Copy_Test();
    table_Row_by_Column_Value_Test();
    SKUs_Hystory_Row_Add_Test();
    // item 169
    // Функции данных
    ranges_2_NS_Test();
    SKUs_History_Update_Test();
    cellS_Has_SKU_Test();
}

function AMain_Drakon(cell) {
    var _sw150000_ = 0;
    // item 150000
    _sw150000_ = cellS_Has_SKU(cell, 
    	/\d{3}-\d{3}-\d{4}/);
    // item 150001
    if (_sw150000_ === true) {
        // item 144
        ranges_2_NS();
        // item 23
        SKUs_History_Update();
        // item 123
        NS.range_Prices
        	.getBackgrounds(
        		NS.array_Prices_BackGrounds);
    } else {
        // item 150002
        if (_sw150000_ === false) {
            
        } else {
            // item 150003
            throw "Unexpected switch value: " + _sw150000_;
        }
    }
}

function NS() {
    // item 37
    /**
    В JS функция это глобальная переменная
    */
}

function SKUs_History_Update() {
    // item 97
    const column_SKUs = 1;
    // item 920001
    let row = 0;
    while (true) {
        // item 920002
        if (row < NS.array_SKUs_3D) {
            
        } else {
            break;
        }
        // item 96
        var array_SKUs = 
        	string_Filter(
        		row[column_SKUs],
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
            // item 163
            //TODO: продолжи
            // item 219
            const row_SKU = table_Row_by_Column_Value(
            		NS.array_SKUs_History,
            		1,
            		SKU);
            // item 173
            if (row_SKU > -1) {
                // item 220
                const column_Price = column_SKUs - 9;
                // item 218
                const price = NS.array_Prices[row][column_Price];
                // item 217
                SKUs_Hystory_Row_Add(table, price);
            } else {
                
            }
            // item 940003
            i++;
        }
        // item 920003
        row ++;
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
      var testTable = [
        ["2023-11-12", "SKU1", 20.99, "user1@example.com"],
        ["2023-11-13", "SKU2", 30.99, "user2@example.com"],
        // ... другие строки
      ];
    
      //  глобальный объект table)
      table = testTable;
    
      // Задаем SKU и price для теста
      var testSKU = "TestSKU";
      var testPrice = 99.99;
    
      // Вызываем функцию добавления строки
      SKUs_Hystory_Row_Add(table, testSKU, testPrice);
    // item 235
    if (table.length === 
testTable.length + 1) {
        
    } else {
        // item 238
        Logger.log(
        	'Ошибка в ' + 
        	'SKUs_Hystory_Row_Add_Test');
    }
}

function array_Trim(array) {
    // item 116
    return array.map(
    		item => item.toString().trim()
    		);
}

function assert(condition) {
    // item 118
    if (condition) {
        // item 122
        Logger.log(
        	'Test Passed!')
    } else {
        // item 121
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
            // item 127
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
    // item 105
    return string
    	.split(',')
    	.filter(
    		item => regex.test(item)
    		);
}

function string_Filter_Test() {
    
}

function table_Copy(table) {
    // item 181
    return table.map(row => [...row]);
}

function table_Copy_Test() {
    // item 187
      // Указываем тестовые данные
      const table = [[1, 2], [3, 4]];
    
      // Вызываем функцию копирования
      const table_New = table_Copy(table);
    
      // Ожидаемый результат
      const wanted = [[1, 2], [3, 4]];
    // item 188
    if (JSON.stringify(wanted) === 
JSON.stringify(table_New)) {
        
    } else {
        // item 191
        Logger.Log(
        	'Ошибка в table_Copy_Test');
    }
}

function table_Row_by_Column_Value(table, column_Number, needle) {
    // item 2150001
    let row = 0;
    while (true) {
        // item 2150002
        if (row < table.length) {
            
        } else {
            break;
        }
        // item 210
        if (table[row][column_Number] === needle) {
            // item 213
            return row;
        } else {
            
        }
        // item 2150003
        row++;
    }
    // item 214
    return -1;
}

function table_Row_by_Column_Value_Test() {
    // item 204
    const table = [[1, 2], [3, 4]];
    
    const result = table_Row_by_Column_Value(
    		table, 0, 3);
    // item 205
    if (result === 1) {
        
    } else {
        // item 208
        Logger.log(
          'Ошибка в ' +
          'table_Row_by_Column_Value_Test'
        );
    }
}



