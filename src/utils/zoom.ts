import { CoordinateSystem, Vector2 } from "./coordinates";


export function zoomOnPoint(oldCS: CoordinateSystem, baseCS_zoomPoint: Vector2, newScale: number): CoordinateSystem {
    const scale = oldCS[2];
    return [
        baseCS_zoomPoint[0] * (1 - scale / newScale) +
        (oldCS[0] * scale) / newScale,
        baseCS_zoomPoint[1] * (1 - scale / newScale) +
        (oldCS[1] * scale) / newScale,
        newScale
    ];
}
