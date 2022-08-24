/**
 *
 */
import { promises as Fs } from "fs";
import { log } from "dbc-node-logger";
const path = "/tmp/errorcount";

/**
 * Get error count
 * @returns {Promise<*>}
 */
export async function getErrorCount() {
  if (await exists()) {
    return await read();
  } else {
    return "0";
  }
}

/**
 * helper function to check if the file is there ?
 * @returns {Promise<boolean>}
 */
async function exists() {
  try {
    await Fs.access(path);
    return true;
  } catch {
    return false;
  }
}

/**
 * helper function to read the file
 * @returns {Promise<string>}
 */
async function read() {
  try {
    return await Fs.readFile(path, { encoding: "utf8" });
  } catch (e) {
    log.error(`Read errorcount failed:`, {
      error: String(e),
      stacktrace: e.stack,
    });
  }
}

/**
 * helper function to write the file
 * @param count
 * @returns {Promise<void>}
 */
async function write(count) {
  try {
    // write the file - overwrite existing - create if not exists (w+)
    await Fs.writeFile(path, count, { flag: "w+" });
  } catch (e) {
    log.error(`Write errorcount failed:`, {
      error: String(e),
      stacktrace: e.stack,
    });
  }
}

/**
 * Increase error count
 * @returns {Promise<void>}
 */
export async function incErrorCount() {
  const count = await getErrorCount();
  let errorCount = parseInt(count);

  await write((++errorCount).toString());
}

/**
 * Reset error count
 */
export async function resetErrorCount() {
  await write("0");
}
