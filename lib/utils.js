import { convertHexToRgb } from './convertHexToRgb.js'
import {
    convertTailwindToHex,
    tailwindPalettes,
} from './convertTailwindToHex.js'

export const formatColor = (color, version = 4) => {
    const formatted = color.replace(/\s/g, '').split(',').join(', ')

    return isValidTailwind(color, version)
        ? `${formatted} (${convertTailwindToHex(color, version)})`
        : formatted
}

export const isValidHex = (color) =>
    /^\s*#([0-9a-f]{3}|[0-9a-f]{6})\s*$/i.test(color)

export const isValidRGB = (color) => {
    return /^\s*rgb\((\s*(2((5[0-5])|([0-4][0-9]))|(1[0-9]{2})|([0-9]?[0-9]))\s*,){2}\s*(2((5[0-5])|([0-4][0-9]))|(1[0-9]{2})|([0-9]?[0-9]))\s*\)\s*$/i.test(
        color
    )
}

export const isValidStartingParameter = (args) => {
    return /^(-s|--suppress|--tailwind-v3)$/i.test(args)
}

export const isValidTailwind = (color, version = 4) => {
    const match = /^\s*([a-z]+)(?:-(\d+))?\s*$/i.exec(color)
    if (!match) return false

    const [, col, num] = match.map((item) => item?.toLowerCase())
    if (num === undefined) return col === 'black' || col === 'white'

    return Boolean(tailwindPalettes[version]?.[col]?.[num])
}

export const isValidColor = (color, version = 4) =>
    typeof color === 'string' &&
    (isValidRGB(color) || isValidHex(color) || isValidTailwind(color, version))

export const stripQuotes = (value) => {
    return String(value)
        .trim()
        .replace(/^['"`´]/, '')
        .replace(/['"`´]$/, '')
}

export const convertColorToRgb = (color, version = 4) => {
    if (isValidHex(color)) return convertHexToRgb(color)
    if (isValidRGB(color)) return color
    if (isValidTailwind(color, version)) {
        return convertHexToRgb(convertTailwindToHex(color, version))
    }

    throw new Error(`Invalid color value: ${color}`)
}
