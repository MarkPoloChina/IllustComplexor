import fs from "fs-extra";
import path from "path";

export class FileTransfer {
  static copyFilesTo = (files, _path, style) => {
    return new Promise((resolve) => {
      resolve({ status: 200, message: "" });
    });
  };
}
