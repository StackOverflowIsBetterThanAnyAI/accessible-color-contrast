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
        expect(output).toContain(
            'Your colors meet the WCAG 2.2 AA and AAA contrast conditions.'
        )
    })
})

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
        expect(output).toContain(
            'Your colors meet the WCAG 2.2 AA and AAA contrast conditions.'
        )
    })
})

describe('Return the correct WCAG 2.2 fulfillments', () => {
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

    it('fullfils the whole AA and AAA requirements', () => {
        const result = spawnSync(
            'node',
            ['./index.js', 'rgb(0, 97, 123)', 'rgb(255, 255, 255)'],
            { encoding: 'utf-8' }
        )

        const output = result.stdout

        expect(output).toContain('Accessible Color Contrast')
        expect(output).toContain('Ratio: 7:1')
        expect(output).toContain(
            'Your colors meet the WCAG 2.2 AA and AAA contrast conditions.'
        )
    })

    it('fullfils the whole AA requirements, and meets AAA for large text', () => {
        const result = spawnSync(
            'node',
            ['./index.js', 'rgb(0, 97, 124)', 'rgb(255, 255, 255)'],
            { encoding: 'utf-8' }
        )

        const output = result.stdout

        expect(output).toContain('Accessible Color Contrast')
        expect(output).toContain('Ratio: 6.99:1')
        expect(output).toContain(
            'Your colors meet the WCAG 2.2 AA contrast conditions, and also the AAA conditions for large text.'
        )
    })

    it('fullfils the whole AA requirements, and meets AAA for large text', () => {
        const result = spawnSync(
            'node',
            ['./index.js', 'rgb(117, 119, 119)', 'rgb(255, 255, 255)'],
            { encoding: 'utf-8' }
        )

        const output = result.stdout

        expect(output).toContain('Accessible Color Contrast')
        expect(output).toContain('Ratio: 4.5:1')
        expect(output).toContain(
            'Your colors meet the WCAG 2.2 AA contrast conditions, and also the AAA conditions for large text.'
        )
    })

    it('fullfils the the requirements for AA for large text', () => {
        const result = spawnSync(
            'node',
            ['./index.js', 'rgb(118, 119, 119)', 'rgb(255, 255, 255)'],
            { encoding: 'utf-8' }
        )

        const output = result.stdout

        expect(output).toContain('Accessible Color Contrast')
        expect(output).toContain('Ratio: 4.49:1')
        expect(output).toContain(
            'Your colors meet the WCAG 2.2 AA contrast conditions only for large text.'
        )
    })

    it('fullfils the the requirements for AA for large text', () => {
        const result = spawnSync(
            'node',
            ['./index.js', 'rgb(0, 153, 254)', 'rgb(255, 255, 255)'],
            { encoding: 'utf-8' }
        )

        const output = result.stdout

        expect(output).toContain('Accessible Color Contrast')
        expect(output).toContain('Ratio: 3:1')
        expect(output).toContain(
            'Your colors meet the WCAG 2.2 AA contrast conditions only for large text.'
        )
    })

    it('fullfils no requirements', () => {
        const result = spawnSync(
            'node',
            ['./index.js', 'rgb(0, 153, 255)', 'rgb(255, 255, 255)'],
            { encoding: 'utf-8' }
        )

        const output = result.stdout

        expect(output).toContain('Accessible Color Contrast')
        expect(output).toContain('Ratio: 2.99:1')
        expect(output).toContain('Your colors are not accessible at all.')
    })

    it('fullfils no requirements', () => {
        const result = spawnSync(
            'node',
            ['./index.js', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)'],
            { encoding: 'utf-8' }
        )

        const output = result.stdout

        expect(output).toContain('Accessible Color Contrast')
        expect(output).toContain('Ratio: 1:1')
        expect(output).toContain('Your colors are not accessible at all.')
    })
})
