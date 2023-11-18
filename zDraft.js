function numbers_Strings_Compare_Test() {

    const table = [
        [0, 0, true],
        ['0', 0, true],
        [0, '1', false],
        ['1 000,00', 1000, true],
    ];

    for (let i = 0; i < table.length; i++) {

        let result =
            numbers_Strings_Compare(
                table[i][0],
                table[i][1]);

        if (result !== table[i][2])
            Logger.log(
                'Ошибка: для ' +
                table[0] + ' и ' +
                table[1] + ' ждал ' +
                table[2] + 'прибыл ' +
                result);
    }
}
