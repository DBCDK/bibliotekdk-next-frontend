import fs from "fs";
let errorCount = 0;
const path = "/tmp/errorcount";

console.log("INTIERRORCOUNT");

export function getErrorCount() {
  console.log("GETERROR -- errorCount");
  fs.readFile(path, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(data, "DATA ERRORCOUNT");
    return data;
  });
}

export function incErrorCount() {
  fs.writeFile(path, (errorCount++).toString(), { flag: "w+" }, function (err) {
    if (err) {
      console.log(err, "WRITE ERROR");
      throw err;
    }
    console.log("It's saved!");
  });
}

export function resetErrorCount() {
  errorCount = 0;
  incErrorCount();
}
