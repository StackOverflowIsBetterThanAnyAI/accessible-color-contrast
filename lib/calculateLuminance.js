export const calculateLuminance = (color) => {
    const rgb = color.replace(/[a-z()\s]/g, '').split(',')
    const sRed = rgb[0] / 255
    const sGreen = rgb[1] / 255
    const sBlue = rgb[2] / 255

    const red = sRed <= 0.04045 ? sRed / 12.92 : ((sRed + 0.055) / 1.055) ** 2.4
    const green =
        sGreen <= 0.04045 ? sGreen / 12.92 : ((sGreen + 0.055) / 1.055) ** 2.4
    const blue =
        sBlue <= 0.04045 ? sBlue / 12.92 : ((sBlue + 0.055) / 1.055) ** 2.4

    return 0.2126 * red + 0.7152 * green + 0.0722 * blue
}
