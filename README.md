# Accessible Color Contrast

![npm Downloads Last Year](https://img.shields.io/npm/dy/accessible-color-contrast)

Accessible Color Contrast is a CLI tool which checks two colors for a high enough contrast in the context of WCAG 2.2's success criteria [1.4.3 AA](https://www.w3.org/TR/WCAG22/#contrast-minimum) and [1.4.6 AAA](https://www.w3.org/TR/WCAG22/#contrast-enhanced).

## Installation

```
npm i -g accessible-color-contrast
```

## Usage

You can also use the CLI with npx:

```
npx accessible-color-contrast [flags] [foreground] [background] [flags]
```

## Parameters

### Foreground and Background

For the Foreground and Background colors, you are allowed to pass any valid RGB or Hex value. Additionally, you can also use any valid TailwindCSS color class name.

```
"rgb(0,0,0)"
"rgb(255, 255, 255)"

"#000"
"#ffffff"

"zinc-50"
"zinc-950"
```

If you decide to pass no colors, miss one color, or provide a wrong format, the CLI will ask you for the specific color at runtime.

Any amount of provided colors, which is larger than two, will be ignored.

### Flag

As an optional flag, you can either use

```
-s
```

or

```
--suppress
```

This suppresses the tabular output, and only logs the color contrast and the success criteria fulfillments.

## Examples

```
npx accessible-color-contrast -s "rgb(0,0,0)" "#ffffff"

npx accessible-color-contrast "rgb(255, 255, 255)" "zinc-50" -s

npx accessible-color-contrast "rgb(255, 255, 255)" "zinc-50" --suppress

npx accessible-color-contrast "zinc-50" "zinc-950"

npx accessible-color-contrast -s

npx accessible-color-contrast
```

## Difference Tabular / Non-Tabular Output

### Tabular Output

![Tabular Output](https://github.com/user-attachments/assets/faaecb0f-fbbd-4760-9ad7-889efb43cbbd)

### Non-Tabular Output

![Non-Tabular Output](https://github.com/user-attachments/assets/3a6b6da2-c8b5-495d-ac10-7489d73662f9)
