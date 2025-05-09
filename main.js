import * as prompts from '@clack/prompts'
import colors from '@colors/colors'

import { calculateContrastRatio } from './lib/calculateContrastRatio.js'
import { convertHexToRgb } from './lib/convertHexToRgb.js'
import { convertTailwindToHex } from './lib/convertTailwindToHex.js'
import { createTable } from './lib/createTable.js'
import { displayOutro } from './lib/displayOutro.js'
import { fillTable } from './lib/fillTable.js'
import {
    formatColor,
    isValidHex,
    isValidRGB,
    isValidStartingParameter,
    isValidTailwind,
} from './lib/utils.js'

export const main = async (props) => {
    const args = props.slice(2)
    const params = args.filter((item) => isValidStartingParameter(item))
    let [foreground, background] = args.filter(
        (item) => isValidRGB(item) || isValidHex(item) || isValidTailwind(item)
    )

    prompts.intro('Accessible Color Contrast')

    while (
        !isValidRGB(foreground) &&
        !isValidHex(foreground) &&
        !isValidTailwind(foreground)
    ) {
        foreground = await prompts.text({
            message: 'Enter an RGB or a Hex value of the foreground.',
        })

        if (prompts.isCancel(foreground)) {
            prompts.cancel('Process cancelled.')
            process.exit(0)
        }
    }
    while (
        !isValidRGB(background) &&
        !isValidHex(background) &&
        !isValidTailwind(background)
    ) {
        background = await prompts.text({
            message: 'Enter an RGB or a Hex value of the background.',
        })

        if (prompts.isCancel(background)) {
            prompts.cancel('Process cancelled.')
            process.exit(0)
        }
    }

    const contrastRatio = calculateContrastRatio(
        isValidHex(foreground)
            ? convertHexToRgb(foreground)
            : isValidRGB(foreground)
            ? foreground
            : convertHexToRgb(convertTailwindToHex(foreground)),
        isValidHex(background)
            ? convertHexToRgb(background)
            : isValidRGB(background)
            ? background
            : convertHexToRgb(convertTailwindToHex(background))
    )

    const table = createTable()
    fillTable(table, contrastRatio)

    if (params.some((item) => /(-s|--suppress)/i.test(item))) {
        prompts.note(
            `Color Contrast: ${formatColor(foreground)} - ${formatColor(
                background
            )} - ${colors.bold(`Ratio: ${contrastRatio}:1`)}`
        )
    } else {
        prompts.note(
            table.toString(),
            `Color Contrast: ${formatColor(foreground)} - ${formatColor(
                background
            )} - ${colors.bold(`Ratio: ${contrastRatio}:1`)}`
        )
    }

    prompts.outro(displayOutro(contrastRatio))
}
