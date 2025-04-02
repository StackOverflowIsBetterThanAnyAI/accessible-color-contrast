export const convertHexToRgb = (color) => {
    const raw = color.replace(/[\s#]/g, '')
    let hex = []

    if (raw.length === 3) {
        hex = Array.from(raw).map((item) => item.toLowerCase().repeat(2))
    } else {
        let str = ''
        for (let i = 0; i < raw.length; i++) {
            str += raw.charAt(i)
            if (str.length % 2 === 0) {
                hex.push(str.toLowerCase())
                str = ''
            }
        }
    }

    const rgb = hex.map((item) => {
        let value = 0
        let it = item.toString()
        for (let i = 0; i < it.length; i++) {
            let val = 0
            switch (it.charAt(i)) {
                case 'a':
                    val = 10
                    break
                case 'b':
                    val = 11
                    break
                case 'c':
                    val = 12
                    break
                case 'd':
                    val = 13
                    break
                case 'e':
                    val = 14
                    break
                case 'f':
                    val = 15
                    break
                default:
                    val = parseInt(it.charAt(i))
                    break
            }
            value += parseInt(val) * 16 ** (it.length - i - 1)
        }
        return value
    })

    return `rgb(${rgb})`
}
