import { spawnSync } from 'child_process'

describe('Suppresses the tabular output', () => {
    it('suppresses the tabular output with -s flag at the end', () => {
        const result = spawnSync(
            'node',
            ['./index.js', 'rgb(0, 0, 0)', 'rgb(255, 255, 255)', '-s'],
            { encoding: 'utf-8' }
        )

        const output = result.stdout

        expect(output).toContain('Accessible Color Contrast')
        expect(output).toContain('rgb(0, 0, 0)')
        expect(output).toContain('rgb(255, 255, 255)')
        expect(output).toContain('Ratio: 21:1')
        expect(output).not.toContain('Required Contrast Ratio')
        expect(output).not.toContain('Required Font Size')
        expect(output).not.toContain('WCAG 2.2 Conditions')
        expect(output).toContain(
            'Your colors meet the WCAG 2.2 AA and AAA contrast conditions.'
        )
    })

    it('suppresses the tabular output with -s flag at the beginning', () => {
        const result = spawnSync(
            'node',
            ['./index.js', '-s', 'rgb(0, 0, 0)', 'rgb(255, 255, 255)'],
            { encoding: 'utf-8' }
        )

        const output = result.stdout

        expect(output).toContain('Accessible Color Contrast')
        expect(output).toContain('rgb(0, 0, 0)')
        expect(output).toContain('rgb(255, 255, 255)')
        expect(output).toContain('Ratio: 21:1')
        expect(output).not.toContain('Required Contrast Ratio')
        expect(output).not.toContain('Required Font Size')
        expect(output).not.toContain('WCAG 2.2 Conditions')
        expect(output).toContain(
            'Your colors meet the WCAG 2.2 AA and AAA contrast conditions.'
        )
    })

    it('suppresses the tabular output with -s flag between two given values', () => {
        const result = spawnSync(
            'node',
            ['./index.js', 'rgb(0, 0, 0)', '-s', 'rgb(255, 255, 255)'],
            { encoding: 'utf-8' }
        )

        const output = result.stdout

        expect(output).toContain('Accessible Color Contrast')
        expect(output).toContain('rgb(0, 0, 0)')
        expect(output).toContain('rgb(255, 255, 255)')
        expect(output).toContain('Ratio: 21:1')
        expect(output).not.toContain('Required Contrast Ratio')
        expect(output).not.toContain('Required Font Size')
        expect(output).not.toContain('WCAG 2.2 Conditions')
        expect(output).toContain(
            'Your colors meet the WCAG 2.2 AA and AAA contrast conditions.'
        )
    })

    it('suppresses the tabular output with -S flag', () => {
        const result = spawnSync(
            'node',
            ['./index.js', 'rgb(0, 0, 0)', 'rgb(255, 255, 255)', '-S'],
            { encoding: 'utf-8' }
        )

        const output = result.stdout

        expect(output).toContain('Accessible Color Contrast')
        expect(output).toContain('rgb(0, 0, 0)')
        expect(output).toContain('rgb(255, 255, 255)')
        expect(output).toContain('Ratio: 21:1')
        expect(output).not.toContain('Required Contrast Ratio')
        expect(output).not.toContain('Required Font Size')
        expect(output).not.toContain('WCAG 2.2 Conditions')
        expect(output).toContain(
            'Your colors meet the WCAG 2.2 AA and AAA contrast conditions.'
        )
    })

    it('suppresses the tabular output with --suppress flag', () => {
        const result = spawnSync(
            'node',
            ['./index.js', 'rgb(0, 0, 0)', 'rgb(255, 255, 255)', '--suppress'],
            { encoding: 'utf-8' }
        )

        const output = result.stdout

        expect(output).toContain('Accessible Color Contrast')
        expect(output).toContain('rgb(0, 0, 0)')
        expect(output).toContain('rgb(255, 255, 255)')
        expect(output).toContain('Ratio: 21:1')
        expect(output).not.toContain('Required Contrast Ratio')
        expect(output).not.toContain('Required Font Size')
        expect(output).not.toContain('WCAG 2.2 Conditions')
        expect(output).toContain(
            'Your colors meet the WCAG 2.2 AA and AAA contrast conditions.'
        )
    })

    it('suppresses the tabular output with --SUPPRESS flag', () => {
        const result = spawnSync(
            'node',
            ['./index.js', 'rgb(0, 0, 0)', 'rgb(255, 255, 255)', '--SUPPRESS'],
            { encoding: 'utf-8' }
        )

        const output = result.stdout

        expect(output).toContain('Accessible Color Contrast')
        expect(output).toContain('rgb(0, 0, 0)')
        expect(output).toContain('rgb(255, 255, 255)')
        expect(output).toContain('Ratio: 21:1')
        expect(output).not.toContain('Required Contrast Ratio')
        expect(output).not.toContain('Required Font Size')
        expect(output).not.toContain('WCAG 2.2 Conditions')
        expect(output).toContain(
            'Your colors meet the WCAG 2.2 AA and AAA contrast conditions.'
        )
    })
})

describe('Ignores unsupported flags', () => {
    it('suppresses the tabular output, although there is an additional unsupported flag', () => {
        const result = spawnSync(
            'node',
            ['./index.js', 'rgb(0, 0, 0)', 'rgb(255, 255, 255)', '-s', '-x'],
            { encoding: 'utf-8' }
        )

        const output = result.stdout

        expect(output).toContain('Accessible Color Contrast')
        expect(output).toContain('rgb(0, 0, 0)')
        expect(output).toContain('rgb(255, 255, 255)')
        expect(output).toContain('Ratio: 21:1')
        expect(output).not.toContain('Required Contrast Ratio')
        expect(output).not.toContain('Required Font Size')
        expect(output).not.toContain('WCAG 2.2 Conditions')
        expect(output).toContain(
            'Your colors meet the WCAG 2.2 AA and AAA contrast conditions.'
        )
    })

    it('shows the expected output, although there is an additional unsupported flag', () => {
        const result = spawnSync(
            'node',
            ['./index.js', 'rgb(0, 0, 0)', 'rgb(255, 255, 255)', '-x'],
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
})
