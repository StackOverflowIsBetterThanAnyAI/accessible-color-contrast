import * as prompts from '@clack/prompts'
import colors from '@colors/colors'

import { calculateContrastRatio } from './lib/calculateContrastRatio.js'
import { createTable } from './lib/createTable.js'
import { displayOutro } from './lib/displayOutro.js'
import { fillTable } from './lib/fillTable.js'
import {
    convertColorToRgb,
    formatColor,
    isValidColor,
    isValidStartingParameter,
    stripQuotes,
} from './lib/utils.js'

const promptColor = async (type, version) => {
    let color

    while (!isValidColor(color, version)) {
        const input = await prompts.text({
            message: `Enter an RGB, Hex or TailwindCSS value of the ${type}.`,
            validate: (value) =>
                isValidColor(stripQuotes(value ?? ''), version)
                    ? undefined
                    : 'Please enter a valid RGB, Hex or TailwindCSS value.',
        })

        if (prompts.isCancel(input)) {
            prompts.cancel('Process cancelled.')
            process.exit(0)
        }

        color = stripQuotes(input ?? '')
    }

    return color
}

export const main = async (props) => {
    const args = props.slice(2)
    const params = args.filter((item) => isValidStartingParameter(item))
    const version = params.some((item) => /^--tailwind-v3$/i.test(item)) ? 3 : 4
    let [foreground, background] = args.filter((item) =>
        isValidColor(item, version)
    )

    prompts.intro('Accessible Color Contrast')

    if (version === 3) {
        prompts.log.info('Using the TailwindCSS v3 color palette.')
    }

    if (!isValidColor(foreground, version)) {
        foreground = await promptColor('foreground', version)
    }
    if (!isValidColor(background, version)) {
        background = await promptColor('background', version)
    }

    const contrastRatio = calculateContrastRatio(
        convertColorToRgb(foreground, version),
        convertColorToRgb(background, version)
    )

    const table = createTable()
    fillTable(table, contrastRatio)

    if (params.some((item) => /^(-s|--suppress)$/i.test(item))) {
        prompts.note(
            `Color Contrast: ${formatColor(foreground, version)} - ${formatColor(
                background,
                version
            )} - ${colors.bold(`Ratio: ${contrastRatio}:1`)}`
        )
    } else {
        prompts.note(
            table.toString(),
            `Color Contrast: ${formatColor(foreground, version)} - ${formatColor(
                background,
                version
            )} - ${colors.bold(`Ratio: ${contrastRatio}:1`)}`
        )
    }

    prompts.outro(displayOutro(contrastRatio))
}
