import { calculateLuminance } from './calculateLuminance.js'

export const calculateContrastRatio = (colorForeground, colorBackground) => {
    const lumForeground = calculateLuminance(colorForeground)
    const lumBackground = calculateLuminance(colorBackground)

    const lighterLuminance =
        lumForeground > lumBackground ? lumForeground : lumBackground
    const darkerLuminance =
        lighterLuminance === lumForeground ? lumBackground : lumForeground

    const ratio = (lighterLuminance + 0.05) / (darkerLuminance + 0.05)

    return parseInt(ratio * 100) / 100
}
