import { spawnSync } from 'child_process'

describe('Compare two values of the same color type', () => {
    it('calculates the contrast ratio for two given RGB values', () => {
        const result = spawnSync(
            'node',
            ['./index.js', 'rgb(0, 0, 0)', 'rgb(255, 255, 255)'],
            { encoding: 'utf-8' }
        )

        const output = result.stdout

        expect(output).toContain('Accessible Color Contrast')
        expect(output).toContain('rgb(0, 0, 0)')
        expect(output).toContain('rgb(255, 255, 255)')
        expect(output).toContain('Ratio: 21:1')
        expect(output).toContain('Required Contrast Ratio')
        expect(output).toContain('Required Font Size')
        expect(output).toContain('WCAG 2.2 Conditions')
        expect(output).toContain(
            'Your colors meet the WCAG 2.2 AA and AAA contrast conditions.'
        )
    })

    it('calculates the contrast ratio for two given Hex values', () => {
        const result = spawnSync('node', ['./index.js', '#000', '#ffffff'], {
            encoding: 'utf-8',
        })

        const output = result.stdout

        expect(output).toContain('Accessible Color Contrast')
        expect(output).toContain('#000')
        expect(output).toContain('#ffffff')
        expect(output).toContain('Ratio: 21:1')
        expect(output).toContain('Required Contrast Ratio')
        expect(output).toContain('Required Font Size')
        expect(output).toContain('WCAG 2.2 Conditions')
        expect(output).toContain(
            'Your colors meet the WCAG 2.2 AA and AAA contrast conditions.'
        )
    })

    it('calculates the contrast ratio for two given TailwindCSS values', () => {
        const result = spawnSync(
            'node',
            ['./index.js', 'zinc-50', 'zinc-950'],
            {
                encoding: 'utf-8',
            }
        )

        const output = result.stdout

        expect(output).toContain('Accessible Color Contrast')
        expect(output).toContain('zinc-50')
        expect(output).toContain('zinc-950')
        expect(output).toContain('Ratio: 19.06:1')
        expect(output).toContain('Required Contrast Ratio')
        expect(output).toContain('Required Font Size')
        expect(output).toContain('WCAG 2.2 Conditions')
        expect(output).toContain(
            'Your colors meet the WCAG 2.2 AA and AAA contrast conditions.'
        )
    })

    it('calculates the contrast ratio for two poorly formatted RGB values', () => {
        const result = spawnSync(
            'node',
            [
                './index.js',
                '    rgb(  0   , 0 ,     0   )  ',
                '  rgb(255,255,255) ',
            ],
            { encoding: 'utf-8' }
        )

        const output = result.stdout

        expect(output).toContain('Accessible Color Contrast')
        expect(output).toContain('rgb(0, 0, 0)')
        expect(output).toContain('rgb(255, 255, 255)')
        expect(output).toContain('Ratio: 21:1')
        expect(output).toContain('Required Contrast Ratio')
        expect(output).toContain('Required Font Size')
        expect(output).toContain('WCAG 2.2 Conditions')
        expect(output).toContain(
            'Your colors meet the WCAG 2.2 AA and AAA contrast conditions.'
        )
    })

    it('calculates the contrast ratio for two poorly formatted Hex values', () => {
        const result = spawnSync(
            'node',
            ['./index.js', ' #000   ', '    #ffffff  '],
            {
                encoding: 'utf-8',
            }
        )

        const output = result.stdout

        expect(output).toContain('Accessible Color Contrast')
        expect(output).toContain('#000')
        expect(output).toContain('#ffffff')
        expect(output).toContain('Ratio: 21:1')
        expect(output).toContain('Required Contrast Ratio')
        expect(output).toContain('Required Font Size')
        expect(output).toContain('WCAG 2.2 Conditions')
        expect(output).toContain(
            'Your colors meet the WCAG 2.2 AA and AAA contrast conditions.'
        )
    })

    it('calculates the contrast ratio for two poorly formatted TailwindCSS values', () => {
        const result = spawnSync(
            'node',
            ['./index.js', '  zinc-50    ', '   zinc-950  '],
            {
                encoding: 'utf-8',
            }
        )

        const output = result.stdout

        expect(output).toContain('Accessible Color Contrast')
        expect(output).toContain('zinc-50')
        expect(output).toContain('zinc-950')
        expect(output).toContain('Ratio: 19.06:1')
        expect(output).toContain('Required Contrast Ratio')
        expect(output).toContain('Required Font Size')
        expect(output).toContain('WCAG 2.2 Conditions')
        expect(output).toContain(
            'Your colors meet the WCAG 2.2 AA and AAA contrast conditions.'
        )
    })
})
