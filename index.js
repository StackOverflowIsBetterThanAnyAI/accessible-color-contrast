#!/usr/bin/env node

import * as prompts from '@clack/prompts'
import colors from '@colors/colors'

import { calculateContrastRatio } from './lib/calculateContrastRatio.js'
import { convertHexToRgb } from './lib/convertHexToRgb.js'
import { createTable } from './lib/createTable.js'
import { displayOutro } from './lib/displayOutro.js'
import { fillTable } from './lib/fillTable.js'
import { formatColor, isValidHex, isValidRGB } from './lib/utils.js'

const main = async (colorForeground, colorBackground) => {
    prompts.intro('Accessible Color Contrast')

    let foreground = colorForeground
    let background = colorBackground

    while (!isValidRGB(foreground) && !isValidHex(foreground)) {
        foreground = await prompts.text({
            message: 'Enter an RGB or a Hex value of the foreground.',
        })

        if (prompts.isCancel(foreground)) {
            prompts.cancel('Process cancelled.')
            process.exit(0)
        }
    }
    while (!isValidRGB(background) && !isValidHex(background)) {
        background = await prompts.text({
            message: 'Enter an RGB or a Hex value of the background.',
        })

        if (prompts.isCancel(background)) {
            prompts.cancel('Process cancelled.')
            process.exit(0)
        }
    }

    const contrastRatio = calculateContrastRatio(
        isValidHex(foreground) ? convertHexToRgb(foreground) : foreground,
        isValidHex(background) ? convertHexToRgb(background) : background
    )

    const table = createTable()
    fillTable(table, contrastRatio)

    prompts.note(
        table.toString(),
        `Color Contrast: ${formatColor(foreground)} - ${formatColor(
            background
        )} - ${colors.bold(`Ratio: ${contrastRatio}:1`)}`
    )

    prompts.outro(displayOutro(contrastRatio))
}

main(process.argv[2] || '', process.argv[3] || '').catch(console.error)
