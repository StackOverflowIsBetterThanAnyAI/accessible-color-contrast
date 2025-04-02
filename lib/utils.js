export const formatColor = (color) => {
    return color.replace(
        /(^\s*)|((?<=\()\s*)|((?<=,\s)\s*)|(\s*(?=,\s))|(\s*(?=\)))|(\s*$)/g,
        ''
    )
}

export const isValidHex = (color) =>
    /^\s*#([0-9a-f]{3}|[0-9a-f]{6})\s*$/i.test(color)

export const isValidRGB = (color) => {
    return /^\s*rgb\((\s*(2((5[0-5])|([0-4][0-9]))|(1[0-9]{2})|([0-9]?[0-9]))\s*,){2}\s*(2((5[0-5])|([0-4][0-9]))|(1[0-9]{2})|([0-9]?[0-9]))\s*\)\s*$/i.test(
        color
    )
}
