
export type Vector2 = [number, number]
export type CoordinateSystem = [number, number, number] // x_base_center, y_base_center, zoom

export function fromPolar(
angle: number,
radius: number
): Vector2 {
    return [
        Math.sin((angle / 180) * Math.PI) * radius,
        -Math.cos((angle / 180) * Math.PI) * radius,
    ];
}

export function toBaseCoordinates(point: Vector2, coordinateSystem: CoordinateSystem): Vector2 {
    return [
        coordinateSystem[0] + point[0] / coordinateSystem[2],
        coordinateSystem[1] + point[1] / coordinateSystem[2],
      ]
}

export function translateCoordinateSystem(oldCS: CoordinateSystem, moveVector: Vector2): CoordinateSystem {
    return [oldCS[0] + moveVector[0], oldCS[1] + moveVector[1], oldCS[2]]
}

export function vectorMultiply(vec: Vector2, factor: number): Vector2 {
    return [vec[0]*factor, vec[1]*factor]
}

export function csCenter(coordinateSystem: CoordinateSystem): Vector2 {
    return [coordinateSystem[0], coordinateSystem[1]]
}

export function vectorDiff(v1: Vector2, v2: Vector2): Vector2 {
    return [v1[0]-v2[0],v1[1]-v2[1]]
}