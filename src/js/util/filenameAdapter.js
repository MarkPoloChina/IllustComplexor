import fs from "fs-extra";
import path from "path";
import { FilenameResolver } from "./filenameResolver";

// const sleep = async () => {
//   return await new Promise((resolve) => {
//     setTimeout(resolve, 1);
//   });
// };

/**
 * Used to start load from file system.
 * @class
 */
export class FilenameAdapter {
  /**
   * @summary 从指定文件列表解析DTO
   * @param {Array<string>} [paths] 文件路径
   * @param {Array<string} [autoList] 请求注入字段
   */
  static getPixivDtoList = async (paths, autoList) => {
    let list = [];
    let logs = [];
    let index = 0;
    for (const item of paths) {
      const filename = path.basename(item);
      index++;
      let log = { filename: filename, status: "ready", bid: index };
      const reso = FilenameResolver.getObjFromFilename(filename);
      if (reso) {
        const dto = {
          meta: {
            pid: reso.pid,
            page: reso.page,
            title: autoList.includes("meta.title") ? reso.title : null,
          },
          bid: index,
        };
        const ti = list.findIndex((value) => {
          return (
            value.meta.pid == dto.meta.pid && value.meta.page == dto.meta.page
          );
        });
        if (ti != -1) {
          const fi = logs.findIndex((value) => {
            return value.bid == list[ti].bid;
          });
          if (autoList.includes("meta.title")) {
            // 需要扩展时修改这里
            logs[fi].status = "conflict";
            logs[fi].message = `与文件${log.filename}发生冲突`;
            logs[fi].compareBid = log.bid;
            log.status = "conflict";
            log.message = `与文件${logs[fi].filename}发生冲突`;
            log.compareBid = logs[fi].bid;
            list.push(dto);
          } else {
            log.status = "ignore";
            log.message = "重复识别";
          }
        } else list.push(dto);
      } else {
        log.status = "ignore";
        log.message = "不可识别的文件";
      }
      logs.push(log);
      // await sleep();
    }
    return { dto: list, log: logs };
  };

  /**
   * @summary 从指定目录解析文件
   * @param {string} [path] 文件路径
   */
  static parseBaseFilenamesFromDirectory = (path) => {
    return fs.readdirSync(path);
  };

  /**
   * @summary 从指定文件列表解析DTO, 但只用于确定Illust
   * @param {Array<string>} [paths] 文件路径
   */
  static getPixivDtoSet = async (paths) => {
    let list = [];
    let logs = [];
    let index = 0;
    for (const item of paths) {
      const filename = path.basename(item);
      index++;
      let log = { filename: filename, status: "ready", bid: index };
      const reso = FilenameResolver.getObjFromFilename(filename);
      if (reso) {
        const dto = {
          meta: {
            pid: reso.pid,
            page: reso.page,
          },
          bid: index,
        };
        const ti = list.findIndex((value) => {
          return (
            value.meta.pid == dto.meta.pid && value.meta.page == dto.meta.page
          );
        });
        if (ti != -1) {
          log.status = "ignore";
          log.message = "重复识别";
        } else list.push(dto);
      } else {
        log.status = "ignore";
        log.message = "不可识别的文件";
      }
      logs.push(log);
      // await sleep();
    }
    return { dto: list, log: logs };
  };

  /**
   * @summary 从指定文件列表解析DTO, 但只用于确定文件名
   * @param {Array<string>} [paths] 文件路径
   */
  static getOtherDtoSet = async (paths) => {
    let list = [];
    let logs = [];
    let index = 0;
    for (const item of paths) {
      const filename = path.basename(item);
      index++;
      let log = { filename: filename, status: "ready", bid: index };
      if ([".jpg", ".png", ".gif"].includes(path.extname(filename))) {
        const dto = {
          remote_info: {
            remote_endpoint: filename,
            thum_endpoint: filename.replace(path.extname(filename), ".jpg"),
          },
          bid: index,
        };
        list.push(dto);
      } else {
        log.status = "ignore";
        log.message = "不可识别的文件";
      }
      logs.push(log);
      // await sleep();
    }
    return { dto: list, log: logs };
  };
}
