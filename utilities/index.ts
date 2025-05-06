export default function roundOff(num: number): number {
    return Math.round((num + Number.EPSILON) * 100) / 100;
}
