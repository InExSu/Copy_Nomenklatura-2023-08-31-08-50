// Autogenerated with DRAKON Editor 1.31


function AATests_RUN() {
    // item 169
    ranges_2_NS_Test();
    SKUs_History_Update_Test();
    cellS_Has_SKU_Test();
    string_Filter_Test();
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
    column_SKUs = 1
    // item 920001
    var _ind92 = 0;
    var _col92 = NS.array_SKUs_3D;
    var _len92 = _col92.length;
    while (true) {
        // item 920002
        if (_ind92 < _len92) {
            
        } else {
            break;
        }
        // item 920004
        var row = _col92[_ind92];
        // item 96
        array_SKUs = 
        	string_Filter(
        		row[column_SKUs],
        		NS.sku_Regex);
        // item 99
        array_SKUs = 
        	array_Trim(
        		array_SKUs);
        // item 940001
        var _ind94 = 0;
        var _col94 = array_SKUs;
        var _len94 = _col94.length;
        while (true) {
            // item 940002
            if (_ind94 < _len94) {
                
            } else {
                break;
            }
            // item 940004
            var sku = _col94[_ind94];
            // item 163
            //TODO: продолжи
            // item 940003
            _ind94++;
        }
        // item 920003
        _ind92++;
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
    table_Decision = [ 
    	['A1',    false],
    	['D8',    true],
    	['Q1123', true]];
    // item 49
    regex = /\d{3}-\d{3}-\d{4}/;
    
    sheet = SpreadsheetApp
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
        cell = sheet.getRange(row[0]);
        result = cellS_Has_SKU(cell);
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



