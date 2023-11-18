// Autogenerated with DRAKON Editor 1.31


function AATests_RUN() {
    // item 192
    // Тесты чистых функций
    /**
    SKUs_Date_Newest_Test();
    SKUs_History_Date_Update_If_Test();
    SKUs_History_Row_Add_Test();
    maps_Equal_Test();
    string_Filter_Test();
    table_2_Map_Test()
    table_Copy_Test();
    table_Row_by_Column_Value_Test();
    table_Rows_Filter_Test(); */
    // item 501
    AMain_Drakon_All();
    
    // AMain_Drakon_TestS();
    // item 169
    // Тесты функций данных
    
    /**
    ranges_2_NS_Test();
    SKUs_History_Update_Test();
    cellS_Has_SKU_Test(); */
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

function AMain_Drakon_All() {
    // item 804
    // чтобы eslint не ругался
    /* global debugger, Logger, 
    MailApp, SpreadsheetApp, Session, Utilities */
    // item 802
    // Лист истории артикулов есть?
    // item 665
    if (SpreadsheetApp
	.getActive()
	.getSheetByName(
	'Прайс без НДС Артикулы история')) {
        // item 855
        let timer = time_Measure();
        // item 670
        ranges_2_NS();
        // item 856
        console.log(
        	`range_2_NS: ' +
        	'${timer()} миллисек`);
        // item 857
        timer = time_Measure();
        // item 862
        const date_New = new Date()
        		.toISOString()
        		.slice(0, 10);
        
        const user_Email = 
        	Session.getActiveUser()
        		.getEmail();
        // item 698
        // копию массива, чтобы не делать
        // лишних сохранений на лист
        const array_SKUs_History_Copy =
        	 NS.table_SKUs_History
        	.map(row_Story => [...row_Story]);
        // item 830
        const col_Max = 
        	NS.table_SKUs_3D[0].length;
        // item 6780001
        // проход по массиву
        // артикулов прайса
        let row = 0;
        while (true) {
            // item 6780002
            if (row < NS.table_SKUs_3D.length) {
                
            } else {
                break;
            }
            // item 6800001
            let col = 0;
            while (true) {
                // item 6800002
                if (col < col_Max) {
                    
                } else {
                    break;
                }
                // item 692
                const SKUs_1D = NS.table_SKUs_3D[row][col]
                  .replace(/\s/g, "")
                  .split(',')
                  .filter(element => NS.sku_Regex.test(element));
                // item 691
                const price = 
                	NS.table_Prices[row][col];
                // item 6890001
                var _ind689 = 0;
                var _col689 = SKUs_1D;
                var _len689 = _col689.length;
                while (true) {
                    // item 6890002
                    if (_ind689 < _len689) {
                        
                    } else {
                        break;
                    }
                    // item 6890004
                    var SKU = _col689[_ind689];
                    // item 751
                    const row_History = SKU_History_Row(SKU);
                    // item 693
                    if (row_History === -1) {
                        // item 696
                        // ДатаВремя Артикул Цена Пользователь
                        
                        const row_1D = [];
                        
                        row_1D[0] = date_New;
                        
                        row_1D[1] = SKU;
                        
                        row_1D[2] = price;
                        
                        row_1D[3] = user_Email;
                        // item 697
                        NS.table_SKUs_History
                        	.push(row_1D);
                    } else {
                        // item 765
                        SKUs_History_Row_Update(
                        	row_History, price, date_New, user_Email);
                    }
                    // item 6890003
                    _ind689++;
                }
                // item 6800003
                col++;
            }
            // item 6780003
            row++;
        }
        // item 699
        if (arrays_Equal(
	array_SKUs_History_Copy,
	NS.table_SKUs_History)) {
            
        } else {
            // item 863
            // Удалить строки с 3 по последнюю
             NS.sheet_SKUs_History
            	.deleteRows(3, 
            		NS.sheet_SKUs_History
            		.getLastRow() - 2);
            // item 803
            const a2 = table_Copy(
            	NS.table_SKUs_History);
            // item 781
            NS.sheet_SKUs_History
            	.getRange('A1')
            	.offset(0, 0, 
            	a2.length, 
            	a2[0].length)
            	.setValues(a2);
        }
        // item 858
        console.log(
        	`История обновилась: ' +
        	'${timer()} миллисек`);
        // item 861
        const date_Paint = 
        	NS.date_Paint_Start
            	.toISOString()
            	.slice(0, 10);
        // item 7240001
        // проход по массиву
        // артикулов прайса
        row = 0;
        while (true) {
            // item 7240002
            if (row < NS.table_SKUs_3D.length) {
                
            } else {
                break;
            }
            // item 7220001
            let col = 0;
            while (true) {
                // item 7220002
                if (col < col_Max) {
                    
                } else {
                    break;
                }
                // item 726
                const SKUs_1D = NS.table_SKUs_3D[row][col]
                  .replace(/\s/g, "")
                  .split(',')
                  .filter(element => NS.sku_Regex.test(element));
                // item 782
                /** проход по 
                 артикулам ячейки */
                // item 7270001
                var _ind727 = 0;
                var _col727 = SKUs_1D;
                var _len727 = _col727.length;
                while (true) {
                    // item 7270002
                    if (_ind727 < _len727) {
                        
                    } else {
                        break;
                    }
                    // item 7270004
                    var SKU_i = _col727[_ind727];
                    // item 752
                    const date_History = SKU_History_Date(SKU_i);
                    // item 742
                    if (date_History === undefined) {
                        
                    } else {
                        // item 745
                        if (date_History >= date_Paint) {
                            // item 748
                            NS.table_Prices_BackGrounds[row][col] =
                            	'yellow';
                        } else {
                            // item 749
                            NS.table_Prices_BackGrounds[row][col] =
                            	'white';
                        }
                    }
                    // item 7270003
                    _ind727++;
                }
                // item 7220003
                col++;
            }
            // item 7240003
            row++;
        }
        // item 859
        const backGrounds =
        	NS.table_Prices_BackGrounds;
        debugger;
        // item 750
        NS.range_Prices
        	.setBackgrounds(
        		backGrounds);
    } else {
        // item 677
        log_Toast_SendEmail(
        	'НЕ найден лист ' + 
        	'истории артикулов');
    }
}

function AMain_Drakon_TestS() {
    // item 967
    let state = 'Начало';
    // item 955
    if (/** лист История найди
Артикул случайный */) {
        // item 958
        if (/** лист Прайс 
найди Артикул */) {
            // item 965
            /** артикул дата запомни
            // item 964
            /** ячейка цены
            цвет фона запомни */
            // item 962
            /** артикулу поставь дату
            древнюю */
            // item 961
            /** ячейке цены
            фон жёлтый */
            // item 963
            AMain_Drakon_All();
            // item 969
            if (/** фон ячейки БЕЛЫЙ */) {
                
            } else {
                // item 973
                state = 
                `❌ Фон ячейки прайса
                НЕ белый`;
            }
        } else {
            // item 968
            state = 
            `❌ Артикул на листе Прайс
            НЕ найден`;
        }
    } else {
        // item 966
        state = 
        `❌ Артикул на листе История 
        НЕ найден`
    }
    // item 972
    Logger.log(state);
}

function AOnEdit_Check(event) {
    // item 788
    const cell = event.range;
    // item 789
    //TODO
    // item 800
    // Ячейка имеет артикул?
    // item 790
    if (true) {
        // item 799
        Logger.log();
        // item 793
        // Историю артикулов обновить
        // с датой ранее окраски
    } else {
        // item 801
        // Ячейка сама цена?
        // item 795
        if (true) {
            // item 798
            Logger.log();
            // item 794
            // История артикулов обновить
            // ценой и датой
            // item 797
            // ячейку красить
        } else {
            
        }
    }
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

function SKU_History_Date(SKU) {
    // item 838
    /** 
    Искать артикул, вернуть дату */
    // item 772
    return table_Find_Shift(
    	NS.table_SKUs_History,
    	SKU,
    	1, 0);
}

function SKU_History_Row(SKU) {
    // item 766
    /**
    вернуть номер строки или
    undefined */
    // item 821
    if (SKU === '') {
        // item 824
        return -1;
    } else {
        // item 780
        return NS.table_SKUs_History
        	.findIndex(row => row[1] === SKU);
    }
}

function SKU_History_Row_Test() {
    // item 810
    NS.spread = SpreadsheetApp.getActive();
    
    NS.sheet_SKUs_History = 
    NS.spread.getSheetByName('Прайс без НДС Артикулы история');
    
    NS.range_SKUs_History = NS.sheet_SKUs_History.getRange('A1:D');
    NS.table_SKUs_History = NS.range_SKUs_History.getValues();
    // item 811
    let result = SKU_History_Row('102-132-0002');
    // item 812
    if (result > 0) {
        
    } else {
        // item 815
        Logger.log(
        	'Ошибка в SKU_History_Row_Test' +
        	'Артикул не найден');
    }
    // item 816
    result = SKU_History_Row('');
    // item 817
    if (result === -1) {
        
    } else {
        // item 820
        Logger.log(
        	'Ошибка в SKU_History_Row_Test ' +
        	'для пусто ожидалось -1 \n' + 
        	'получено: ' + result);
    }
    // item 825
    result = SKU_History_Row('102');
    // item 826
    if (result == -1) {
        
    } else {
        // item 829
        Logger.log(
        	'Ошибка в SKU_History_Row_Test' +
        	'для 102 ожидалось -1 \n' +
        	'вернулось ' + result);
    }
}

function SKUs_Date_Newest(SKUs_History, SKUs, column_Date = 0, column_SKUs = 1) {
    // item 638
    /**
    Вернуть самую свежую дату для артикулов из SKUs
    */
    // item 619
    const rows_Filtered = 
    	SKUs_History.filter(
    		row => SKUs.includes(
    			row[column_SKUs]));
    // item 620
    if (rows_Filtered.length > 0) {
        // item 623
        const dates = 
        	rows_Filtered.map(
        		row => new Date(row[column_Date]));
        
        const newestDate = 
        	new Date(
        		Math.max.apply(null, dates));
        // item 625
        return newestDate
        		.toISOString()
        		.slice(0, 10);
    } else {
        
    }
    // item 624
    return false
}

function SKUs_Date_Newest_Test() {
    // item 631
      const mySKUs_History = [
        ['2023-11-14', '102-132-0002'],
        ['2023-11-14', '102-131-0004'],
        ['2023-11-14', '102-131-0005'],
        ['2023-11-13', '102-132-0002'],
        ['2023-11-13', '102-131-0004']
      ];
    // item 632
      const myColumnDate = 0;
      const myColumnSKUs = 1;
      const mySKUs = ['102-132-0002', '102-131-0005'];
    // item 633
    const newestDate = 
    	SKUs_Date_Newest(
    		mySKUs_History, 
    		mySKUs, 
    		myColumnDate, 
    		myColumnSKUs);
    // item 634
    if (newestDate === '2023-11-14') {
        
    } else {
        // item 637
        Logger.log(
        	'Ошибка в SKUs_Date_Newest_Test');
    }
}

function SKUs_History_Date_Update_If(table, row, price_New) {
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

function SKUs_History_Date_Update_If_Test() {
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
    
      SKUs_History_Date_Update_If(table, row, price);
    // item 259
    const price_New = table[row][2];
    // item 260
    if (price_New === price_Old) {
        // item 264
        Logger.log(
        	'Ошибка в ' + 
        	'SKUs_History_Date_Update_If_Test');
    } else {
        
    }
}

function SKUs_History_Row_Add(table, SKU, price) {
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

function SKUs_History_Row_Add_Test() {
    // item 234
      // Создаем временный массив для тестов
    const table = [
        ["2023-11-12", "SKU1", 20.99, "user1@example.com"],
        ["2023-11-13", "SKU2", 30.99, "user2@example.com"],
      ];
    
      // Задаем SKU и price для теста
      var testSKU = "TestSKU";
      var testPrice = 99.99;
    
      // Вызываем функцию добавления строки
      SKUs_History_Row_Add(table, testSKU, testPrice);
    // item 235
    if (table.length === 3) {
        
    } else {
        // item 238
        Logger.log(
        	'Ошибка в ' + 
        	'SKUs_History_Row_Add_Test');
    }
}

function SKUs_History_Row_Update(row, price_New, date_New, user_Email) {
    // item 720
    // Обновить, если цены разные
    // item 718
    const price_Old = 
    	NS.table_SKUs_History[row][2];
    // item 911
    if (numbers_Strings_Equal(
	price_Old,
	price_New)) {
        // item 914
        // Обновление НЕ нужно
    } else {
        // item 719
        NS.table_SKUs_History[row][0] = 
        	date_New;
        
        // артикул без изменений
        
        NS.table_SKUs_History[row][2] = 
        	price_New;
        
        NS.table_SKUs_History[row][3] = 
        	user_Email;
    }
}

function SKUs_History_Update() {
    // item 265
    const array_SKUs_History_Old = 
    	table_Copy(
    		NS.table_SKUs_History);
    // item 599
    const rows_Max = NS.table_SKUs_3D.length;
    const cols_Max = NS.table_SKUs_3D[0].length;
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
            		NS.table_SKUs_3D[row][col],
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
                
                const price = NS.table_Prices[row][column_Price];
                
                const SKU = array_SKUs[i];
                // item 219
                const row_SKU = table_Row_by_Column_Value(
                		NS.table_SKUs_History,
                		1,
                		SKU);
                // item 173
                if (row_SKU > -1) {
                    // item 240
                    SKUs_History_Date_Update_If(NS.table_SKUs_History, 
                    			   row_SKU, 
                    			   price);
                } else {
                    // item 217
                    SKUs_History_Row_Add(
                    	NS.table_SKUs_History, 
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
	NS.table_SKUs_History, 
	array_SKUs_History_Old)) {
        
    } else {
        // item 283
        const cell = 
        	NS.sheet_SKUs_History
        	.getRange('A1');
        // item 282
        table_2_Range(
        	NS.table_SKUs_History,
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

function assert(condition, logger_log = 'assert fail') {
    // item 346
    if (condition) {
        // item 350
        // Logger.log(
        //	'Test Passed!')
    } else {
        // item 349
        Logger.log(
        	logger_log);
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

function isNumeric(num) {
    // item 871
    // является ли num числом
    // item 870
      try {
    
        num = num
    	.toString()
    	.replace(' ', '')
    	.replace(',', '.');
        return !isNaN(num);
    
      } catch (error) {
    
        return false;
    
      }
}

function isNumeric_Test() {
    // item 877
      const tests = [
        ['3200,00',true],
        [42, true],
        ["42", true],
        ["abc", false],
        [true, false],
        [false, false],
        [null, false],
        [undefined, false],
        [[], true],
        [{}, false],
        ["10.5", true],
        [NaN, false]
      ];
    // item 8780001
    let i = 0;
    while (true) {
        // item 8780002
        if (i < tests.length) {
            
        } else {
            break;
        }
        // item 880
            const [input, expected] = tests[i];
            const result = isNumeric(input);
            // ✅
        // item 881
        if (expected === result) {
            
        } else {
            // item 884
            Logger.log(
            `❌ для i = ${i}, ${tests[i][0]}` + 
            ` Ожидалось ${expected}, пришло ${result}`)
        }
        // item 8780003
        i++;
    }
}

function log_Toast_SendEmail(subject, message, to = 'mihail.popov@zelinskygroup.com') {
    // item 676
      Logger.log(message);
      SpreadsheetApp.getActive().toast(message);
      MailApp.sendEmail({
        to: to,
        subject: subject,
        body: message
      });
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

function numbers_Strings_Equal(left_, right) {
    // item 935
    // сранивать числа, строки,
    // строки как числа
    // item 922
    if ((isNumeric(left_)) && (isNumeric(right))) {
        // item 928
        left_ = 
        	toNumber(left_);
        
        right = 
        	toNumber(right);
    } else {
        // item 931
        left_ = left_
        		.toString()
        		.trim();
        
        right = right
        		.toString()
        		.trim();
    }
    // item 934
    return left_ == right;
}

function numbers_Strings_Equal_Test() {
    // item 949
    // таблица решений теста
    // item 941
        const table = [
            [0, 0, true],
            ['0', 0, true],
            [0, '1', false],
            ['1 000,00', 1000, true],
        ];
    // item 9420001
    let i = 0;
    while (true) {
        // item 9420002
        if (i < table.length) {
            
        } else {
            break;
        }
        // item 944
        let result =
              numbers_Strings_Equal(
                table[i][0],
                table[i][1]);
        // item 945
        if (result === table[i][2]) {
            
        } else {
            // item 948
            Logger.log(
            	'Ошибка: для ' +
            	table[i][0] + ' и ' +
            	table[i][1] + ' ждал ' +
            	table[i][2] + 'прибыл ' +
            	result);
        }
        // item 9420003
        i++;
    }
}

function price_BackGrounds_Paint() {
    // item 384
    const price_BackGrounds_Old = 
    	table_Copy(
    		NS.table_Prices_BackGrounds);
    // item 389
    const rows_Max = NS.table_SKUs_3D.length;
    const cols_Max = NS.table_SKUs_3D[0].length;
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
            		NS.table_SKUs_3D[row][col],
            		NS.sku_Regex);
            // item 366
            array_SKUs = 
            	array_Trim(
            		array_SKUs);
            // item 370
            if (array_SKUs.length === 0) {
                
            } else {
                // item 374
                const date_Newest = 
                	SKUs_Date_Newest(
                		NS.table_SKUs_History,
                		array_SKUs);
                // item 375
                if (date_Newest >= 
NS.date_Paint) {
                    // item 383
                    NS.table_Prices_BackGrounds[row][col - 9] =
                    'yellow';
                } else {
                    // item 378
                    NS.table_Prices_BackGrounds[row][col - 9] =
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
	NS.table_Prices_BackGrounds)) {
        
    } else {
        // item 388
        NS.range_Prices
        	.setBackgrounds(
        		NS.table_Prices_BackGrounds);
    }
}

function ranges_2_NS() {
    // item 83
    NS.date_Paint_Start =   
    	new Date(
    		new Date().getTime() - 
    		30 * 24 * 60 * 60 * 1000);
    
    Logger.log(NS.date_Paint_Start
    	.toISOString()
    	.slice(0, 10));
    
    NS.sku_Regex = /\d{3}-\d{3}-\d{4}/;
    
    NS.spread = SpreadsheetApp.getActive();
    
    NS.sheet_Price_NDS_NO = NS.spread.getSheetByName('Прайс без НДС');
    NS.sheet_SKUs_History = NS.spread.getSheetByName('Прайс без НДС Артикулы история');
    
    NS.range_Prices = NS.sheet_Price_NDS_NO.getRange('C1:H');
    NS.table_Prices = NS.range_Prices.getValues();
    NS.table_Prices_BackGrounds = NS.range_Prices.getBackgrounds();
    
    NS.range_SKUs_3D = NS.sheet_Price_NDS_NO.getRange('L1:Q');
    NS.table_SKUs_3D = NS.range_SKUs_3D.getValues();
    NS.SKUs_3D_col_Start = NS.range_SKUs_3D.getColumn() - 1;
    
    NS.range_SKUs_History = NS.sheet_SKUs_History.getRange('A1:D');
    NS.table_SKUs_History = NS.range_SKUs_History.getValues();
}

function ranges_2_NS_Test() {
    // item 151
    console.time('range_2_NS');
    // item 153
    ranges_2_NS();
    // item 152
    console.timeEnd('range_2_NS');
}

function sheet_Name_Exists(name) {
    // item 688
    return SpreadsheetApp
    	.getActive()
    	.getSheetByName(name) !== null;
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

function table_Column_Search(table, column, needle) {
    // item 778
    /**
     искать в столбце	
     вернуть номер строки или 
     undefined */
    // item 779
    return table
    	.findIndex(row => row[column] === needle);
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

function table_Find_Shift(table, needle, column_Needle, column_Return) {
    // item 764
    /**
    Искать в столбце column_Needle,
    вернуть из column_Return или
    undefined */
    // item 8310001
    let i = 0;
    while (true) {
        // item 8310002
        if (i < table.length) {
            
        } else {
            break;
        }
        // item 833
        if (table[i][column_Needle] === needle) {
            // item 836
            return table[i][column_Return]
        } else {
            
        }
        // item 8310003
        i++;
    }
    // item 837
    return undefined;
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

function table_Rows_Filter_Test() {
    // item 614
      var testCases = [
        {
          table: [['apple', 'red', 5], ['banana', 'yellow', 3], ['cherry', 'red', 8], ['orange', 'orange', 4]],
          needles: ['red'],
          column_Number: 1,
          expected: [['apple', 'red', 5], ['cherry', 'red', 8]]
        },
        {
          table: [['apple', 'red', 5], ['banana', 'yellow', 3], ['cherry', 'red', 8], ['orange', 'orange', 4]],
          needles: ['red', 'yellow'],
          column_Number: 1,
          expected: [['apple', 'red', 5], ['banana', 'yellow', 3], ['cherry', 'red', 8]]
        },
        {
          table: [['apple', 'red', 5], ['banana', 'yellow', 3], ['cherry', 'red', 8], ['orange', 'orange', 4]],
          needles: ['blue'],
          column_Number: 1,
          expected: []
        }
      ];
    // item 6150001
    var i = 0;
    while (true) {
        // item 6150002
        if (i < testCases.length) {
            
        } else {
            break;
        }
        // item 617
        var testCase = testCases[i];
        
        var result = 
        	table_Rows_Filter(
        		testCase.table, 
        		testCase.needles, 
        		testCase.column_Number);
        // item 618
        assert(
              arrays_Equal(result, testCase.expected),
              `Тест ${i + 1} не пройден. Получено: 
        ${JSON.stringify(result)}, 
        Ожидалось: 
        ${JSON.stringify(testCase.expected)}`
            );
        // item 6150003
        i++;
    }
}

function time_Measure() {
    // item 848
    /**
    Одна функция для запуска останова таймера */
    // item 846
    /**
    При инициации
    let timer = time_Measure();
    создаcться startTune */
    // item 844
    let startTime = new Date().getTime();
    // item 847
    /**
    Чтобы узнать прошедшее время
    нужно вызвать
    let elapsedTime = timer(); */
    // item 845
    return () => {
        let endTime = new Date().getTime();
        let elapsedTime = endTime - startTime;
        return elapsedTime;
      };
}

function time_Measure_Test() {
    // item 854
      let timer = time_Measure();
    
      Utilities.sleep(2000); // Пауза на 2 секунды
    
      let elapsedTime = timer();
      console.log(`Elapsed time: ${elapsedTime} milliseconds`);
    
      timer = time_Measure();
    
      Utilities.sleep(2000); // Пауза на 2 секунды
    
      elapsedTime = timer();
      console.log(`Elapsed time: ${elapsedTime} milliseconds`);
}

function toNumber(string) {
    // item 910
    // почти число превратить
    // в число
    // item 909
    return parseFloat(string
    		.toString()
    		.replace(' ', '')
    		.replace(',', '.'));
}



