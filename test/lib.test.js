import { calculateContrastRatio } from '../lib/calculateContrastRatio.js'
import { calculateLuminance } from '../lib/calculateLuminance.js'
import { convertHexToRgb } from '../lib/convertHexToRgb.js'
import { convertOklchToHex } from '../lib/convertOklchToHex.js'
import { convertTailwindToHex } from '../lib/convertTailwindToHex.js'
import { displayOutro } from '../lib/displayOutro.js'
import {
    convertColorToRgb,
    formatColor,
    isValidColor,
    isValidHex,
    isValidRGB,
    isValidStartingParameter,
    isValidTailwind,
    stripQuotes,
} from '../lib/utils.js'

const TAILWIND_V3_COLORS = [
    'red',
    'orange',
    'amber',
    'yellow',
    'lime',
    'green',
    'emerald',
    'teal',
    'cyan',
    'sky',
    'blue',
    'indigo',
    'violet',
    'purple',
    'fuchsia',
    'pink',
    'rose',
    'slate',
    'gray',
    'zinc',
    'neutral',
    'stone',
]
const TAILWIND_V4_COLORS = [
    ...TAILWIND_V3_COLORS,
    'mauve',
    'mist',
    'olive',
    'taupe',
]
const TAILWIND_SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

describe('calculateLuminance', () => {
    it('returns 0 for black and 1 for white', () => {
        expect(calculateLuminance('rgb(0,0,0)')).toBe(0)
        expect(calculateLuminance('rgb(255,255,255)')).toBeCloseTo(1, 10)
    })

    it('weights the channels according to WCAG', () => {
        expect(calculateLuminance('rgb(255,0,0)')).toBeCloseTo(0.2126, 10)
        expect(calculateLuminance('rgb(0,255,0)')).toBeCloseTo(0.7152, 10)
        expect(calculateLuminance('rgb(0,0,255)')).toBeCloseTo(0.0722, 10)
    })

    it('uses the linear part of the sRGB curve for dark values', () => {
        expect(calculateLuminance('rgb(10,10,10)')).toBeCloseTo(
            10 / 255 / 12.92,
            10
        )
        expect(calculateLuminance('rgb(128,128,128)')).toBeCloseTo(0.2158605, 6)
    })

    it('ignores whitespace and letter case', () => {
        expect(calculateLuminance('  RGB( 128 , 128 , 128 ) ')).toBe(
            calculateLuminance('rgb(128,128,128)')
        )
    })
})

describe('calculateContrastRatio', () => {
    it('returns 21 for black and white and 1 for identical colors', () => {
        expect(calculateContrastRatio('rgb(0,0,0)', 'rgb(255,255,255)')).toBe(
            21
        )
        expect(calculateContrastRatio('rgb(12,34,56)', 'rgb(12,34,56)')).toBe(1)
    })

    it('is symmetric', () => {
        expect(
            calculateContrastRatio('rgb(0,97,123)', 'rgb(255,255,255)')
        ).toBe(calculateContrastRatio('rgb(255,255,255)', 'rgb(0,97,123)'))
    })

    it('matches well-known reference values', () => {
        // #767676 is the lightest gray passing AA on white, #777777 fails
        expect(
            calculateContrastRatio('rgb(118,118,118)', 'rgb(255,255,255)')
        ).toBe(4.54)
        expect(
            calculateContrastRatio('rgb(119,119,119)', 'rgb(255,255,255)')
        ).toBe(4.47)
        // Tailwind blue-500 on white, 3.678... is truncated (WebAIM rounds to 3.68)
        expect(
            calculateContrastRatio('rgb(59,130,246)', 'rgb(255,255,255)')
        ).toBe(3.67)
    })

    it('truncates instead of rounding, so a ratio never passes too early', () => {
        // the exact ratio is 4.4987..., rounding would wrongly report 4.5
        expect(
            calculateContrastRatio('rgb(118,119,119)', 'rgb(255,255,255)')
        ).toBe(4.49)
        expect(
            calculateContrastRatio('rgb(0,153,255)', 'rgb(255,255,255)')
        ).toBe(2.99)
    })
})

describe('convertHexToRgb', () => {
    it('converts six-digit hex values', () => {
        expect(convertHexToRgb('#000000')).toBe('rgb(0,0,0)')
        expect(convertHexToRgb('#ffffff')).toBe('rgb(255,255,255)')
        expect(convertHexToRgb('#3b82f6')).toBe('rgb(59,130,246)')
    })

    it('expands three-digit hex values', () => {
        expect(convertHexToRgb('#000')).toBe('rgb(0,0,0)')
        expect(convertHexToRgb('#fff')).toBe('rgb(255,255,255)')
        expect(convertHexToRgb('#a1b')).toBe('rgb(170,17,187)')
    })

    it('ignores letter case and surrounding whitespace', () => {
        expect(convertHexToRgb('  #3B82F6 ')).toBe('rgb(59,130,246)')
        expect(convertHexToRgb('#ABC')).toBe('rgb(170,187,204)')
    })
})

describe('convertOklchToHex', () => {
    it('converts achromatic colors', () => {
        expect(convertOklchToHex('oklch(100% 0 0)')).toBe('#ffffff')
        expect(convertOklchToHex('oklch(0% 0 0)')).toBe('#000000')
        expect(convertOklchToHex('oklch(98.5% 0 none)')).toBe('#fafafa')
    })

    it('converts chromatic colors inside the sRGB gamut', () => {
        expect(convertOklchToHex('oklch(62.8% 0.2577 29.23)')).toBe('#ff0000')
        expect(convertOklchToHex('oklch(86.6% 0.2948 142.5)')).toBe('#00ff00')
        expect(convertOklchToHex('oklch(45.2% 0.3132 264.05)')).toBe('#0000ff')
    })

    it('clips colors outside of the sRGB gamut', () => {
        // Tailwind v4 red-500 lies outside of sRGB
        expect(convertOklchToHex('oklch(63.7% 0.237 25.331)')).toBe('#fb2c36')
        expect(convertOklchToHex('oklch(70% 0.4 150)')).toMatch(
            /^#[0-9a-f]{6}$/
        )
    })

    it('ignores letter case and whitespace', () => {
        expect(convertOklchToHex('  OKLCH( 98.5%  0  NONE ) ')).toBe('#fafafa')
    })

    it('throws for invalid values', () => {
        expect(() => convertOklchToHex('oklch(50 0 0)')).toThrow(
            'Invalid OKLCH value: oklch(50 0 0)'
        )
        expect(() => convertOklchToHex('#fff')).toThrow()
    })
})

describe('convertTailwindToHex', () => {
    it('uses the TailwindCSS v4 palette by default', () => {
        expect(convertTailwindToHex('red-500')).toBe('#fb2c36')
        expect(convertTailwindToHex('green-500')).toBe('#00c950')
        expect(convertTailwindToHex('blue-500')).toBe('#2b7fff')
        expect(convertTailwindToHex('zinc-50')).toBe('#fafafa')
        expect(convertTailwindToHex('zinc-950')).toBe('#09090b')
        expect(convertTailwindToHex('mauve-500')).toBe(
            convertTailwindToHex('mauve-500', 4)
        )
    })

    it('uses the TailwindCSS v3 palette on demand', () => {
        expect(convertTailwindToHex('red-500', 3)).toBe('#ef4444')
        expect(convertTailwindToHex('blue-500', 3)).toBe('#3b82f6')
        expect(convertTailwindToHex('slate-900', 3)).toBe('#0f172a')
        expect(convertTailwindToHex('zinc-50', 3)).toBe('#fafafa')
        expect(convertTailwindToHex('stone-950', 3)).toBe('#0c0a09')
    })

    it('supports black and white in both versions', () => {
        for (const version of [3, 4]) {
            expect(convertTailwindToHex('black', version)).toBe('#000000')
            expect(convertTailwindToHex('White', version)).toBe('#ffffff')
        }
    })

    it('ignores letter case and whitespace', () => {
        expect(convertTailwindToHex('  Blue-500 ')).toBe('#2b7fff')
        expect(convertTailwindToHex('  Blue-500 ', 3)).toBe('#3b82f6')
    })

    it.each([
        [3, TAILWIND_V3_COLORS],
        [4, TAILWIND_V4_COLORS],
    ])(
        'knows every color and shade of TailwindCSS v%p',
        (version, tailwindColors) => {
            for (const color of tailwindColors) {
                for (const shade of TAILWIND_SHADES) {
                    const name = `${color}-${shade}`
                    expect(isValidTailwind(name, version)).toBe(true)
                    expect(
                        isValidHex(convertTailwindToHex(name, version))
                    ).toBe(true)
                }
            }
        }
    )

    it('orders every v4 color from light to dark', () => {
        for (const color of TAILWIND_V4_COLORS) {
            const luminances = TAILWIND_SHADES.map((shade) =>
                calculateLuminance(
                    convertHexToRgb(convertTailwindToHex(`${color}-${shade}`))
                )
            )
            expect(luminances).toEqual([...luminances].sort((a, b) => b - a))
        }
    })

    it('throws a readable error for unknown colors', () => {
        expect(() => convertTailwindToHex('black-500')).toThrow(
            'Unknown TailwindCSS v4 color: black-500'
        )
        expect(() => convertTailwindToHex('mauve-500', 3)).toThrow(
            'Unknown TailwindCSS v3 color: mauve-500'
        )
        expect(() => convertTailwindToHex('red-550')).toThrow()
    })
})

describe('displayOutro', () => {
    it.each([
        [1, 'Your colors are not accessible at all.'],
        [2.99, 'Your colors are not accessible at all.'],
        [
            3,
            'Your colors meet the WCAG 2.2 AA contrast conditions only for large text.',
        ],
        [
            4.49,
            'Your colors meet the WCAG 2.2 AA contrast conditions only for large text.',
        ],
        [
            4.5,
            'Your colors meet the WCAG 2.2 AA contrast conditions, and also the AAA conditions for large text.',
        ],
        [
            6.99,
            'Your colors meet the WCAG 2.2 AA contrast conditions, and also the AAA conditions for large text.',
        ],
        [7, 'Your colors meet the WCAG 2.2 AA and AAA contrast conditions.'],
        [21, 'Your colors meet the WCAG 2.2 AA and AAA contrast conditions.'],
    ])('returns the correct message for a ratio of %p', (ratio, message) => {
        expect(displayOutro(ratio)).toBe(message)
    })
})

describe('isValidHex', () => {
    it.each(['#000', '#FFF', '#a1B2c3', '  #ffffff  '])(
        'accepts %p',
        (value) => {
            expect(isValidHex(value)).toBe(true)
        }
    )

    it.each(['000', '#00', '#0000', '#00000', '#0000000', '#ggg', '# fff', ''])(
        'rejects %p',
        (value) => {
            expect(isValidHex(value)).toBe(false)
        }
    )
})

describe('isValidRGB', () => {
    it.each([
        'rgb(0,0,0)',
        'rgb(255, 255, 255)',
        'RGB(1,22,199)',
        '  rgb(  0   , 0 ,     0   )  ',
        'rgb(09,9,250)',
    ])('accepts %p', (value) => {
        expect(isValidRGB(value)).toBe(true)
    })

    it.each([
        'rgb(256,0,0)',
        'rgb(0,0)',
        'rgb(0,0,0,0)',
        'rgb(-1,0,0)',
        'rgb(1.5,0,0)',
        'rgb(000,0,0)',
        'rgba(0,0,0)',
        'rgb 0,0,0',
        '',
    ])('rejects %p', (value) => {
        expect(isValidRGB(value)).toBe(false)
    })
})

describe('isValidTailwind', () => {
    it.each([
        'zinc-50',
        'Zinc-950',
        '  red-500 ',
        'black',
        'WHITE',
        'mauve-500',
    ])('accepts %p', (value) => {
        expect(isValidTailwind(value)).toBe(true)
    })

    it.each([
        'zinc-55',
        'zinc-1000',
        'zinc',
        'black-500',
        'zinc 50',
        'bg-zinc-50',
        'zinc-50-50',
        '',
    ])('rejects %p', (value) => {
        expect(isValidTailwind(value)).toBe(false)
    })

    it('only accepts the new v4 colors without the v3 flag', () => {
        for (const color of ['mauve', 'mist', 'olive', 'taupe']) {
            expect(isValidTailwind(`${color}-500`, 4)).toBe(true)
            expect(isValidTailwind(`${color}-500`, 3)).toBe(false)
        }
        expect(isValidTailwind('black', 3)).toBe(true)
        expect(isValidTailwind('zinc-50', 3)).toBe(true)
    })

    it('does not throw for non-string values', () => {
        expect(isValidTailwind(undefined)).toBe(false)
        expect(isValidTailwind(null)).toBe(false)
    })
})

describe('isValidColor', () => {
    it('accepts all supported color formats', () => {
        expect(isValidColor('rgb(0,0,0)')).toBe(true)
        expect(isValidColor('#fff')).toBe(true)
        expect(isValidColor('zinc-50')).toBe(true)
    })

    it('rejects everything else without throwing', () => {
        expect(isValidColor(undefined)).toBe(false)
        expect(isValidColor(null)).toBe(false)
        expect(isValidColor(Symbol('cancel'))).toBe(false)
        expect(isValidColor('-s')).toBe(false)
        expect(isValidColor('')).toBe(false)
    })
})

describe('isValidStartingParameter', () => {
    it.each([
        '-s',
        '-S',
        '--suppress',
        '--SUPPRESS',
        '--tailwind-v3',
        '--TAILWIND-V3',
    ])('accepts %p', (value) => {
        expect(isValidStartingParameter(value)).toBe(true)
    })

    it.each([
        '-x',
        's',
        '--s',
        '-suppress',
        '--suppressed',
        '-g',
        '--generate',
        '--tailwind-v4',
        '--tailwind',
        'rgb(0,0,0)',
    ])('rejects %p', (value) => {
        expect(isValidStartingParameter(value)).toBe(false)
    })
})

describe('stripQuotes', () => {
    it.each([
        ['"#fff"', '#fff'],
        ["'#fff'", '#fff'],
        ['`#fff`', '#fff'],
        ['´#fff´', '#fff'],
        ['  "rgb(0, 0, 0)"  ', 'rgb(0, 0, 0)'],
        ['#fff', '#fff'],
    ])('turns %p into %p', (value, expected) => {
        expect(stripQuotes(value)).toBe(expected)
    })
})

describe('formatColor', () => {
    it('normalizes whitespace in all color formats', () => {
        expect(formatColor('  rgb(  0   , 0 ,     0   )  ')).toBe(
            'rgb(0, 0, 0)'
        )
        expect(formatColor(' #ffffff  ')).toBe('#ffffff')
    })

    it('adds the resolved hex value to TailwindCSS colors', () => {
        expect(formatColor('  zinc-50 ')).toBe('zinc-50 (#fafafa)')
        expect(formatColor('red-500')).toBe('red-500 (#fb2c36)')
        expect(formatColor('red-500', 3)).toBe('red-500 (#ef4444)')
        expect(formatColor('black')).toBe('black (#000000)')
    })
})

describe('convertColorToRgb', () => {
    it('converts every supported format to the same RGB string format', () => {
        expect(convertColorToRgb('#fff')).toBe('rgb(255,255,255)')
        expect(convertColorToRgb('rgb(255, 255, 255)')).toBe(
            'rgb(255, 255, 255)'
        )
        expect(convertColorToRgb('zinc-50')).toBe('rgb(250,250,250)')
    })

    it('respects the TailwindCSS version', () => {
        expect(convertColorToRgb('red-500')).toBe('rgb(251,44,54)')
        expect(convertColorToRgb('red-500', 3)).toBe('rgb(239,68,68)')
        expect(() => convertColorToRgb('mauve-500', 3)).toThrow(
            'Invalid color value: mauve-500'
        )
    })

    it('throws for invalid colors', () => {
        expect(() => convertColorToRgb('nope')).toThrow(
            'Invalid color value: nope'
        )
    })
})
