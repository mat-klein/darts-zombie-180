
export type Color = {
    red: number,
    green:number,
    blue: number,
    alpha: number
}

export function newColor(red: number, green: number, blue: number, alpha: number = 1): Color {
    return {
        red,
        green,
        blue,
        alpha
    }
}

export function colorMultiply(colBackground: Color, colOverlay: Color): Color {
    const red = (1 - colOverlay.alpha)*(colBackground.alpha)*(colBackground.red) + (colOverlay.alpha)*(colOverlay.red)
    const green = (1 - colOverlay.alpha)*(colBackground.alpha)*(colBackground.green) + (colOverlay.alpha)*(colOverlay.green)
    const blue = (1 - colOverlay.alpha)*(colBackground.alpha)*(colBackground.blue) + (colOverlay.alpha)*(colOverlay.blue)
    const alpha = 1 - (1 - colOverlay.alpha)*(1 - colBackground.alpha)
    return {
        red,
        green,
        blue,
        alpha
    }
}

export function colorToString(color: Color) {
    return `rgba(${color.red},${color.green},${color.blue},${color.alpha})`
}