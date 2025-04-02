export const displayOutro = (contrastRatio) => {
    if (contrastRatio < 3) {
        return 'Your colors are not accessible at all.'
    } else if (contrastRatio < 4.5) {
        return 'Your colors meet the WCAG 2.2 AA contrast conditions only for large text.'
    } else if (contrastRatio < 7) {
        return 'Your colors meet the WCAG 2.2 AA contrast conditions, and also the AAA conditions for large text.'
    } else
        return 'Your colors meet the WCAG 2.2 AA and AAA contrast conditions.'
}
