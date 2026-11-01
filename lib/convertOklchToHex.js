// Converts an OKLCH color to sRGB as described in CSS Color 4. Colors outside
// of the sRGB gamut are clipped, which is what browsers render on sRGB screens.
export const convertOklchToHex = (color) => {
    const match = color.match(
        /^\s*oklch\(\s*([\d.]+)%\s+([\d.]+)\s+([\d.]+|none)\s*\)\s*$/i
    )

    if (!match) {
        throw new Error(`Invalid OKLCH value: ${color}`)
    }

    const lightness = Number(match[1]) / 100
    const chroma = Number(match[2])
    const hue = match[3].toLowerCase() === 'none' ? 0 : Number(match[3])

    const a = chroma * Math.cos((hue * Math.PI) / 180)
    const b = chroma * Math.sin((hue * Math.PI) / 180)

    const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3
    const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3
    const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3

    const linear = [
        4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
        -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
        -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
    ]

    return `#${linear
        .map((value) => {
            const clipped = Math.min(1, Math.max(0, value))
            const srgb =
                clipped <= 0.0031308
                    ? clipped * 12.92
                    : 1.055 * clipped ** (1 / 2.4) - 0.055
            return Math.round(srgb * 255)
                .toString(16)
                .padStart(2, '0')
        })
        .join('')}`
}
