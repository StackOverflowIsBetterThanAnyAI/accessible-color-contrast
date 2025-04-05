import { spawnSync } from 'child_process'

describe('Compare two values of the different color types', () => {
    it('calculates the contrast ratio for an RGB and a Hex value', () => {
        const result = spawnSync(
            'node',
            ['./index.js', 'rgb(0, 0, 0)', '#ffffff'],
            { encoding: 'utf-8' }
        )

        const output = result.stdout

        expect(output).toContain('Accessible Color Contrast')
        expect(output).toContain('rgb(0, 0, 0)')
        expect(output).toContain('#ffffff')
        expect(output).toContain('Ratio: 21:1')
        expect(output).toContain('Required Contrast Ratio')
        expect(output).toContain('Required Font Size')
        expect(output).toContain('WCAG 2.2 Conditions')
        expect(output).toContain(
            'Your colors meet the WCAG 2.2 AA and AAA contrast conditions.'
        )
    })

    it('calculates the contrast ratio for an RGB and a TailwindCSS value', () => {
        const result = spawnSync(
            'node',
            ['./index.js', 'rgb(0, 0, 0)', 'zinc-50'],
            { encoding: 'utf-8' }
        )

        const output = result.stdout

        expect(output).toContain('Accessible Color Contrast')
        expect(output).toContain('rgb(0, 0, 0)')
        expect(output).toContain('zinc-50')
        expect(output).toContain('Ratio: 20.11:1')
        expect(output).toContain('Required Contrast Ratio')
        expect(output).toContain('Required Font Size')
        expect(output).toContain('WCAG 2.2 Conditions')
        expect(output).toContain(
            'Your colors meet the WCAG 2.2 AA and AAA contrast conditions.'
        )
    })

    it('calculates the contrast ratio for a Hex and a TailwindCSS value', () => {
        const result = spawnSync(
            'node',
            ['./index.js', '#ffffff', 'zinc-950'],
            { encoding: 'utf-8' }
        )

        const output = result.stdout

        expect(output).toContain('Accessible Color Contrast')
        expect(output).toContain('#ffffff')
        expect(output).toContain('zinc-950')
        expect(output).toContain('Ratio: 19.89:1')
        expect(output).toContain('Required Contrast Ratio')
        expect(output).toContain('Required Font Size')
        expect(output).toContain('WCAG 2.2 Conditions')
        expect(output).toContain(
            'Your colors meet the WCAG 2.2 AA and AAA contrast conditions.'
        )
    })
})
