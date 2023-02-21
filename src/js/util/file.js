import fs from "fs-extra";
import { PathHelper } from "./path";

export class FileTransfer {
  static saveArrayBufferTo = (ab, filename, path) => {
    return new Promise((resolve, reject) => {
      fs.outputFile(
        PathHelper.joinFilenamePath(path, filename),
        Buffer.from(ab),
        (err) => {
          if (err) reject(err);
          resolve();
        }
      );
    });
  };
}

export class FileExplorer {
  /**
   * @summary 从指定目录异步解析文件名
   * @param {string} [path] 文件路径
   */
  static parseFilenamesFromDirectoryAsync = (path) => {
    return fs.readdir(path);
  };

  /**
   * @summary 从指定目录异步解析完整文件路径
   * @param {string} [path] 文件路径
   */
  static parseFullPathsFromDirectoryAsync = async (path) => {
    return (await fs.readdir(path)).map((value) =>
      PathHelper.joinFilenamePath(path, value)
    );
  };
}
