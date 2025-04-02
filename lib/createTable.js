import colors from '@colors/colors'
import Table from 'cli-table3'

export const createTable = () => {
    const table = new Table({
        head: [
            '',
            { hAlign: 'center', content: colors.bold('AA Large Text') },
            { hAlign: 'center', content: colors.bold('AA Normal Text') },
            { hAlign: 'center', content: colors.bold('AAA Large Text') },
            { hAlign: 'center', content: colors.bold('AAA Normal Text') },
        ],
        style: { head: [] },
        colWidths: [25, 25, 25, 25, 25],
    })

    table.push([
        'Required Contrast Ratio',
        { hAlign: 'center', content: '3:1' },
        { hAlign: 'center', content: '4.5:1' },
        { hAlign: 'center', content: '4.5:1' },
        { hAlign: 'center', content: '7:1' },
    ])

    table.push([
        'Required Font Size',
        { hAlign: 'center', content: '1.17rem / 1.5rem + bold' },
        { hAlign: 'center', content: '' },
        { hAlign: 'center', content: '1.17rem / 1.5rem + bold' },
        { hAlign: 'center', content: '' },
    ])

    return table
}
