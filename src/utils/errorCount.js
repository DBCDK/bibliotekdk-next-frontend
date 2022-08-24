import fs from "fs";
let errorCount = 0;
const path = "/tmp/errorcount";

export function getErrorCount() {
  fs.readFile(path, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("it has been read", data);
    return data;
  });
}

export function incErrorCount() {
  fs.writeFile(path, (errorCount++).toString(), { flag: "w+" }, function (err) {
    if (err) {
      throw err;
    }
    console.log(errorCount);
    console.log("It's saved!");
  });
}

export function resetErrorCount() {
  errorCount = 0;
  incErrorCount();
}
