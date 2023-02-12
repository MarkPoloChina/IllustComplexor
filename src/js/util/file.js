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

export class FileExplorer {
  /**
   * @summary 从指定目录解析文件
   * @param {string} [path] 文件路径
   */
  static parseFilenamesFromDirectory = (path) => {
    return fs.readdirSync(path);
  };

  /**
   * @summary 从指定目录异步解析文件
   * @param {string} [path] 文件路径
   */
  static parseFilenamesFromDirectoryAsync = (path) => {
    return fs.readdir(path);
  };
}
