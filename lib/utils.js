export const formatColor = (color) => {
    return color.replace(/\s/g, '').split(',').join(', ')
}

export const isValidHex = (color) =>
    /^\s*#([0-9a-f]{3}|[0-9a-f]{6})\s*$/i.test(color)

export const isValidRGB = (color) => {
    return /^\s*rgb\((\s*(2((5[0-5])|([0-4][0-9]))|(1[0-9]{2})|([0-9]?[0-9]))\s*,){2}\s*(2((5[0-5])|([0-4][0-9]))|(1[0-9]{2})|([0-9]?[0-9]))\s*\)\s*$/i.test(
        color
    )
}

export const isValidStartingParameter = (args) => {
    return /^(-(g|s)|--(generate|suppress))$/i.test(args)
}

export const isValidTailwind = (color) => {
    return /^\s*(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone)-(5|10|20|30|40|50|60|70|80|90|95)0\s*$/i.test(
        color
    )
}
