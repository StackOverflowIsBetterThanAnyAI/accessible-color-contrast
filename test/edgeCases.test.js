import { spawnSync } from 'child_process'

describe('Return the expected values for edge cases', () => {
    it('fulfills the whole AA and AAA requirements', () => {
        const result = spawnSync(
            'node',
            ['./index.js', 'rgb(0, 0, 0)', 'rgb(255, 255, 255)'],
            { encoding: 'utf-8' }
        )

        const output = result.stdout

        expect(output).toContain('Accessible Color Contrast')
        expect(output).toContain('Ratio: 21:1')
        expect(output).toContain(
            'Your colors meet the WCAG 2.2 AA and AAA contrast conditions.'
        )
    })

    it('fulfills the whole AA and AAA requirements', () => {
        const result = spawnSync(
            'node',
            ['./index.js', 'rgb(0, 97, 123)', 'rgb(255, 255, 255)'],
            { encoding: 'utf-8' }
        )

        const output = result.stdout

        expect(output).toContain('Accessible Color Contrast')
        expect(output).toContain('Ratio: 7:1')
        expect(output).toContain('Required Contrast Ratio')
        expect(output).toContain('Required Font Size')
        expect(output).toContain('WCAG 2.2 Conditions')
        expect(output).toContain(
            'Your colors meet the WCAG 2.2 AA and AAA contrast conditions.'
        )
    })

    it('fulfills the whole AA requirements, and meets AAA for large text', () => {
        const result = spawnSync(
            'node',
            ['./index.js', 'rgb(0, 97, 124)', 'rgb(255, 255, 255)'],
            { encoding: 'utf-8' }
        )

        const output = result.stdout

        expect(output).toContain('Accessible Color Contrast')
        expect(output).toContain('Ratio: 6.99:1')
        expect(output).toContain('Required Contrast Ratio')
        expect(output).toContain('Required Font Size')
        expect(output).toContain('WCAG 2.2 Conditions')
        expect(output).toContain(
            'Your colors meet the WCAG 2.2 AA contrast conditions, and also the AAA conditions for large text.'
        )
    })

    it('fulfills the whole AA requirements, and meets AAA for large text', () => {
        const result = spawnSync(
            'node',
            ['./index.js', 'rgb(117, 119, 119)', 'rgb(255, 255, 255)'],
            { encoding: 'utf-8' }
        )

        const output = result.stdout

        expect(output).toContain('Accessible Color Contrast')
        expect(output).toContain('Ratio: 4.5:1')
        expect(output).toContain('Required Contrast Ratio')
        expect(output).toContain('Required Font Size')
        expect(output).toContain('WCAG 2.2 Conditions')
        expect(output).toContain(
            'Your colors meet the WCAG 2.2 AA contrast conditions, and also the AAA conditions for large text.'
        )
    })

    it('fulfills the the requirements for AA for large text', () => {
        const result = spawnSync(
            'node',
            ['./index.js', 'rgb(118, 119, 119)', 'rgb(255, 255, 255)'],
            { encoding: 'utf-8' }
        )

        const output = result.stdout

        expect(output).toContain('Accessible Color Contrast')
        expect(output).toContain('Ratio: 4.49:1')
        expect(output).toContain('Required Contrast Ratio')
        expect(output).toContain('Required Font Size')
        expect(output).toContain('WCAG 2.2 Conditions')
        expect(output).toContain(
            'Your colors meet the WCAG 2.2 AA contrast conditions only for large text.'
        )
    })

    it('fulfills the the requirements for AA for large text', () => {
        const result = spawnSync(
            'node',
            ['./index.js', 'rgb(0, 153, 254)', 'rgb(255, 255, 255)'],
            { encoding: 'utf-8' }
        )

        const output = result.stdout

        expect(output).toContain('Accessible Color Contrast')
        expect(output).toContain('Ratio: 3:1')
        expect(output).toContain('Required Contrast Ratio')
        expect(output).toContain('Required Font Size')
        expect(output).toContain('WCAG 2.2 Conditions')
        expect(output).toContain(
            'Your colors meet the WCAG 2.2 AA contrast conditions only for large text.'
        )
    })

    it('fulfills no requirements', () => {
        const result = spawnSync(
            'node',
            ['./index.js', 'rgb(0, 153, 255)', 'rgb(255, 255, 255)'],
            { encoding: 'utf-8' }
        )

        const output = result.stdout

        expect(output).toContain('Accessible Color Contrast')
        expect(output).toContain('Ratio: 2.99:1')
        expect(output).toContain('Required Contrast Ratio')
        expect(output).toContain('Required Font Size')
        expect(output).toContain('WCAG 2.2 Conditions')
        expect(output).toContain('Your colors are not accessible at all.')
    })

    it('fulfills no requirements', () => {
        const result = spawnSync(
            'node',
            ['./index.js', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)'],
            { encoding: 'utf-8' }
        )

        const output = result.stdout

        expect(output).toContain('Accessible Color Contrast')
        expect(output).toContain('Ratio: 1:1')
        expect(output).toContain('Required Contrast Ratio')
        expect(output).toContain('Required Font Size')
        expect(output).toContain('WCAG 2.2 Conditions')
        expect(output).toContain('Your colors are not accessible at all.')
    })
})
