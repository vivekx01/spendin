import { checkForUpdate } from "./Home/checkForUpdate";
import { exportLogs } from "./Home/exportLogs";
import { openDownloadUrlInBrowser } from "./Home/openDownloadUrlInBrowser";

export default function roundOff(num: number): number {
    return Math.round((num + Number.EPSILON) * 100) / 100;
}

export { checkForUpdate, openDownloadUrlInBrowser, exportLogs };