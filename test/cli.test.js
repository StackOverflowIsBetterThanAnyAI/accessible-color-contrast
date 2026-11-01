import { count, runCli, runCliWithPrompts } from './helpers.js'

describe('Runs without errors', () => {
    it('exits with code 0 and writes nothing to stderr', () => {
        const { status, stdout, stderr } = runCli(['#000', '#fff'])

        expect(status).toBe(0)
        expect(stderr).toBe('')
        expect(stdout).toContain('Ratio: 21:1')
    })

    it('renders the full table including the Pass / Fail cells', () => {
        const { stdout } = runCli(['rgb(0, 97, 124)', 'rgb(255, 255, 255)'])

        expect(stdout).toContain('AA Large Text')
        expect(stdout).toContain('AAA Normal Text')
        expect(count(stdout, 'Pass')).toBe(3)
        expect(count(stdout, 'Fail !')).toBe(1)
    })

    it('does not render Pass / Fail cells with the suppress flag', () => {
        const { stdout } = runCli(['#000', '#fff', '-s'])

        expect(stdout).not.toContain('Pass')
        expect(stdout).not.toContain('Fail !')
        expect(stdout).not.toContain('AA Large Text')
    })
})

describe('Handles the passed colors', () => {
    it('returns the same ratio regardless of the color order', () => {
        const a = runCli(['zinc-500', '#fff', '-s']).stdout
        const b = runCli(['#fff', 'zinc-500', '-s']).stdout

        expect(a).toContain('Ratio: 4.82:1')
        expect(b).toContain('Ratio: 4.82:1')
    })

    it('accepts uppercase Hex, RGB and TailwindCSS values', () => {
        const { stdout } = runCli(['#FFFFFF', 'RGB(0, 0, 0)', '-s'])
        expect(stdout).toContain('Ratio: 21:1')

        const tailwind = runCli(['ZINC-50', 'Zinc-950', '-s']).stdout
        expect(tailwind).toContain('Ratio: 19.06:1')
    })

    it('ignores every color after the first two', () => {
        const { stdout } = runCli(['#000', '#fff', '#777', 'zinc-50', '-s'])

        expect(stdout).toContain('Color Contrast: #000 - #fff')
        expect(stdout).toContain('Ratio: 21:1')
        expect(stdout).not.toContain('#777')
        expect(stdout).not.toContain('zinc-50')
    })

    it('skips invalid values and uses the next valid ones', () => {
        const { stdout } = runCli([
            'rgb(256, 0, 0)',
            '#000',
            'foo',
            '#fff',
            '-s',
        ])

        expect(stdout).toContain('Color Contrast: #000 - #fff')
        expect(stdout).toContain('Ratio: 21:1')
    })
})

describe('Asks for missing colors', () => {
    it('asks for both colors if none are passed', async () => {
        const { status, stdout } = await runCliWithPrompts(
            ['-s'],
            ['#000\r', '#fff\r']
        )

        expect(status).toBe(0)
        expect(stdout).toContain('foreground')
        expect(stdout).toContain('background')
        expect(stdout).toContain('Ratio: 21:1')
        expect(stdout).toContain(
            'Your colors meet the WCAG 2.2 AA and AAA contrast conditions.'
        )
    })

    it('asks only for the background if one color is passed', () => {
        const { stdout } = runCli(['#000', '-s'], 'zinc-50\r')

        expect(stdout).not.toContain('value of the foreground')
        expect(stdout).toContain('value of the background')
        expect(stdout).toContain('Ratio: 20.11:1')
    })

    it('skips an invalid passed value and asks for the missing color', () => {
        const { stdout } = runCli(['#ggg', '#fff', '-s'], '#000\r')

        expect(stdout).not.toContain('value of the foreground')
        expect(stdout).toContain('value of the background')
        expect(stdout).toContain('Color Contrast: #fff - #000')
        expect(stdout).toContain('Ratio: 21:1')
    })

    it('removes surrounding quotation marks from the prompted values', async () => {
        const { stdout } = await runCliWithPrompts(
            ['-s'],
            ['"rgb(0, 0, 0)"\r', "'#fff'\r"]
        )

        expect(stdout).toContain('Color Contrast: rgb(0, 0, 0) - #fff')
        expect(stdout).toContain('Ratio: 21:1')
    })

    it('shows a validation message for invalid prompted values', () => {
        // type an invalid value, delete it with backspace, then enter a valid one
        const { status, stdout } = runCli(
            ['#000', '-s'],
            'foo\r\x7f\x7f\x7f#fff\r'
        )

        expect(status).toBe(0)
        expect(stdout).toContain(
            'Please enter a valid RGB, Hex or TailwindCSS value.'
        )
        expect(stdout).toContain('Ratio: 21:1')
    })

    it('renders the table after prompting if not suppressed', async () => {
        const { stdout } = await runCliWithPrompts([], ['#000\r', '#fff\r'])

        expect(stdout).toContain('Required Contrast Ratio')
        expect(count(stdout, 'Pass')).toBe(4)
    })
})

describe('Can be cancelled', () => {
    it('exits cleanly when the foreground prompt is cancelled', () => {
        const { status, stdout, stderr } = runCli([], '\x03')

        expect(status).toBe(0)
        expect(stdout).toContain('Process cancelled.')
        expect(stdout).not.toContain('Ratio')
        expect(stderr).toBe('')
    })

    it('exits cleanly when the background prompt is cancelled', () => {
        const { status, stdout, stderr } = runCli(['#000'], '\x03')

        expect(status).toBe(0)
        expect(stdout).toContain('Process cancelled.')
        expect(stdout).not.toContain('Ratio')
        expect(stderr).toBe('')
    })
})

describe('Supports TailwindCSS v3 and v4', () => {
    it('uses the v4 palette by default', () => {
        const { stdout } = runCli(['red-500', '#fff', '-s'])

        expect(stdout).toContain('red-500 (#fb2c36)')
        expect(stdout).toContain('Ratio: 3.8:1')
        expect(stdout).not.toContain('TailwindCSS v3')
    })

    it('uses the v3 palette with the --tailwind-v3 flag', () => {
        const { stdout } = runCli(['red-500', '#fff', '-s', '--tailwind-v3'])

        expect(stdout).toContain('Using the TailwindCSS v3 color palette.')
        expect(stdout).toContain('red-500 (#ef4444)')
        expect(stdout).toContain('Ratio: 3.76:1')
    })

    it('accepts the flag in any position and letter case', () => {
        const { stdout } = runCli(['--TAILWIND-V3', 'blue-500', '-s', '#fff'])

        expect(stdout).toContain('blue-500 (#3b82f6)')
        expect(stdout).toContain('Ratio: 3.67:1')
    })

    it('still renders the table with the --tailwind-v3 flag', () => {
        const { stdout } = runCli(['zinc-950', 'zinc-50', '--tailwind-v3'])

        expect(stdout).toContain('Required Contrast Ratio')
        expect(count(stdout, 'Pass')).toBe(4)
    })

    it('supports the colors which are new in v4', () => {
        const { stdout } = runCli(['mauve-900', 'olive-50', '-s'])

        expect(stdout).toContain('mauve-900')
        expect(stdout).toContain('olive-50')
        expect(stdout).not.toContain('value of the')
    })

    it('asks again for colors which do not exist in v3', () => {
        const { stdout } = runCli(
            ['mauve-900', '#fff', '-s', '--tailwind-v3'],
            '#000\r'
        )

        expect(stdout).toContain('value of the background')
        expect(stdout).toContain('Color Contrast: #fff - #000')
    })

    it('supports black and white', () => {
        const { stdout } = runCli(['black', 'white', '-s'])

        expect(stdout).toContain('black (#000000) - white (#ffffff)')
        expect(stdout).toContain('Ratio: 21:1')
    })
})
