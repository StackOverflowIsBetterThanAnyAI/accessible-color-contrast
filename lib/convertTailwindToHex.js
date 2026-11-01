import { convertOklchToHex } from './convertOklchToHex.js'
import { tailwindV3 } from './tailwindV3.js'
import { tailwindV4 } from './tailwindV4.js'

export const tailwindPalettes = { 3: tailwindV3, 4: tailwindV4 }

export const convertTailwindToHex = (color, version = 4) => {
    const [col, num] = [...color.toLowerCase().replace(/\s/g, '').split('-')]

    if (col === 'black' && num === undefined) return '#000000'
    if (col === 'white' && num === undefined) return '#ffffff'

    const value = tailwindPalettes[version]?.[col]?.[num]

    if (!value) {
        throw new Error(`Unknown TailwindCSS v${version} color: ${color}`)
    }

    return value.startsWith('#') ? value : convertOklchToHex(value)
}
