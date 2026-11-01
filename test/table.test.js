import { stripVTControlCharacters } from 'util'

import { createTable } from '../lib/createTable.js'
import { fillTable } from '../lib/fillTable.js'
import { count } from './helpers.js'

// These tests guard the integration with cli-table3 and @colors/colors
const renderTable = (contrastRatio) => {
    const table = createTable()
    fillTable(table, contrastRatio)
    return stripVTControlCharacters(table.toString())
}

describe('createTable', () => {
    it('renders the header and the requirement rows', () => {
        const output = stripVTControlCharacters(createTable().toString())

        expect(output).toContain('AA Large Text')
        expect(output).toContain('AA Normal Text')
        expect(output).toContain('AAA Large Text')
        expect(output).toContain('AAA Normal Text')
        expect(output).toContain('Required Contrast Ratio')
        expect(output).toContain('Required Font Size')
        expect(output).toContain('3:1')
        expect(output).toContain('4.5:1')
        expect(output).toContain('7:1')
        expect(output).toContain('1.5rem / 1.17rem + bold')
    })

    it('uses five columns with a width of 25 characters each', () => {
        const lines = stripVTControlCharacters(createTable().toString()).split(
            '\n'
        )

        // 5 columns * 25 characters + 6 borders
        expect(lines[0]).toHaveLength(131)
        expect(lines.every((line) => line.length === 131)).toBe(true)
    })
})

describe('fillTable', () => {
    it('adds a third row to the table', () => {
        const table = createTable()
        expect(table.length).toBe(2)

        fillTable(table, 21)
        expect(table.length).toBe(3)
        expect(stripVTControlCharacters(table.toString())).toContain(
            'WCAG 2.2 Conditions'
        )
    })

    it.each([
        [1, 0, 4],
        [2.99, 0, 4],
        [3, 1, 3],
        [4.49, 1, 3],
        [4.5, 3, 1],
        [6.99, 3, 1],
        [7, 4, 0],
        [21, 4, 0],
    ])(
        'shows the correct Pass / Fail cells for a ratio of %p',
        (ratio, passes, fails) => {
            const output = renderTable(ratio)

            expect(count(output, 'Pass')).toBe(passes)
            expect(count(output, 'Fail !')).toBe(fails)
        }
    )

    it('keeps the cells in the order AA Large, AA Normal, AAA Large, AAA Normal', () => {
        const row = renderTable(4.5)
            .split('\n')
            .find((line) => line.includes('WCAG 2.2 Conditions'))
        const cells = row
            .split('│')
            .map((cell) => cell.trim())
            .filter(Boolean)

        expect(cells).toEqual([
            'WCAG 2.2 Conditions',
            'Pass',
            'Pass',
            'Pass',
            'Fail !',
        ])
    })
})
