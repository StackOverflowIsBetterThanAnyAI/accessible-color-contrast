# Accessible Color Contrast

![npm Downloads Last Year](https://img.shields.io/npm/dy/accessible-color-contrast)

Accessible Color Contrast is a CLI tool which checks two colors for a high enough contrast in the context of WCAG 2.2's success criteria [1.4.3 AA](https://www.w3.org/TR/WCAG22/#contrast-minimum) and [1.4.6 AAA](https://www.w3.org/TR/WCAG22/#contrast-enhanced).

## Installation

```
npm i -g accessible-color-contrast

...

accessible-color-contrast [flags] [foreground] [background] [flags]
```

## Usage

You can also use the CLI with npx, without downloading this package beforehand:

```
npx accessible-color-contrast [flags] [foreground] [background] [flags]
```

## Parameters

### Foreground and Background

For the Foreground and Background colors, you are allowed to pass any valid RGB or Hex value. Additionally, you can also use any valid **TailwindCSS** color class name.

By default, the TailwindCSS colors are based on the default color palette of **TailwindCSS v4**, including `black`, `white` and the new colors `mauve`, `mist`, `olive` and `taupe`. If you still use **TailwindCSS v3**, add the `--tailwind-v3` flag, as many colors differ slightly between both versions. The CLI always shows the Hex value it used for a TailwindCSS color.

> [!NOTE]
> TailwindCSS v4 defines its colors in OKLCH, and some of them lie outside of the sRGB color space, which WCAG 2.2 is based on. These colors are converted to sRGB by clipping, which is what browsers display on sRGB screens.

As long as the values are not torn apart, the CLI also reacts very gently to additional spaces within the values.

Do not forget to add quotation marks if you provide the colors via the CLI call.

```
"rgb(0,0,0)"
"  rgb(  0,0 ,0 )  "
"rgb(255, 255, 255)"

"#000"
"   #ffffff "

"zinc-50"
"zinc-950  "
```

If you decide to pass no colors, miss one color, or provide a wrong format, the CLI will ask you for the specific color at runtime.

At this point, you should not add any quotation marks to your values.

Any amount of provided colors, which is larger than two, will be ignored.

### Flags

As an optional flag, you can either use

```
-s
```

or

```
--suppress
```

This suppresses the tabular output, and only logs the color contrast and the success criteria fulfillments.

Additionally, you can use

```
--tailwind-v3
```

to use the default color palette of TailwindCSS v3 instead of v4.

## Examples

```
npx accessible-color-contrast -s "rgb(0,0,0)" "#ffffff"

npx accessible-color-contrast "rgb(255, 255, 255)" "zinc-50" -s

npx accessible-color-contrast "rgb(255, 255, 255)" "zinc-50" --suppress

npx accessible-color-contrast "zinc-50" "zinc-950"

npx accessible-color-contrast "red-500" "white" --tailwind-v3

npx accessible-color-contrast -s

npx accessible-color-contrast
```

## Difference Tabular / Non-Tabular Output

### Tabular Output

![Tabular Output](https://github.com/user-attachments/assets/6a26f7fb-fc43-4a90-98bd-b3c7d9128bcd)

### Non-Tabular Output

![Non-Tabular Output](https://github.com/user-attachments/assets/a00efbf3-886e-44e6-9f15-9a137860b069)
