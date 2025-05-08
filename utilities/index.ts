import { checkForUpdate } from "./Home/checkForUpdate";
import { downloadAndPromptInstallWithProgress } from "./Home/downloadHelper";

export default function roundOff(num: number): number {
    return Math.round((num + Number.EPSILON) * 100) / 100;
}

export { checkForUpdate, downloadAndPromptInstallWithProgress };