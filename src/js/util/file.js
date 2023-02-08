import fs from "fs-extra";
import path from "path";

export class FileTransfer {
  static saveArrayBufferTo = (ab, filename, _path) => {
    return new Promise((resolve, reject) => {
      fs.outputFile(path.join(_path, filename), Buffer.from(ab), (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  };
}
