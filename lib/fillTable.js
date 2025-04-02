import colors from '@colors/colors'

const fillTableCell = (contrastRatio, ratio) => {
    return {
        hAlign: 'center',
        content: `${
            contrastRatio >= ratio
                ? colors.green.bold('Pass')
                : colors.red.bold('Fail !')
        }`,
    }
}

export const fillTable = (table, contrastRatio) => {
    return table.push([
        'WCAG 2.2 Conditions',
        fillTableCell(contrastRatio, 3),
        fillTableCell(contrastRatio, 4.5),
        fillTableCell(contrastRatio, 4.5),
        fillTableCell(contrastRatio, 7),
    ])
}
