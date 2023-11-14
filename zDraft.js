function SKUs_Date_Newest(SKUs_History, column, SKUs) {
  const filteredRows = SKUs_History.filter(row => SKUs.includes(row[column]));

  if (filteredRows.length > 0) {
    const dates = filteredRows.map(row => new Date(row[0]));
    const newestDate = new Date(Math.max.apply(null, dates));
    return newestDate.toISOString().slice(0, 10);
  }

  return null;
}

// Пример использования
const mySKUs_History = [
  ['2023-11-14', '102-132-0002'],
  ['2023-11-14', '102-131-0004'],
  ['2023-11-14', '102-131-0005'],
  ['2023-11-13', '102-132-0002'],
  ['2023-11-13', '102-131-0004']
];

const myColumn = 0;
const mySKUs = ['102-132-0002', '102-131-0005'];

const newestDate = SKUs_Date_Newest(mySKUs_History, myColumn, mySKUs);
console.log('Самая свежая дата для указанных SKU:', newestDate);
