function findRowByArticle(table, column, needle) {
    return table.findIndex(row => row[column] === needle);
}
