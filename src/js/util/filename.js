import path from "path";
import fs from "fs-extra";

const extAllow = ["jpg", "png", "gif"];

// const sleep = async () => {
//   return await new Promise((resolve) => {
//     setTimeout(resolve, 1);
//   });
// };

const getEXt = (filename) => {
  return extAllow.find((str) => "." + str == path.extname(filename));
};

const getBasename = (filename) => {
  return filename.substring(0, filename.lastIndexOf("."));
};

const possibleMatch = {
  web: (basename) => {
    if (/^\d+_p\d+$/.test(basename)) {
      return {
        title: null,
        pid: /^(\d+)_p\d+$/.exec(basename)[1],
        page: /^\d+_p(\d+)$/.exec(basename)[1],
      };
    } else return null;
  },
  pxderMultiple: (basename) => {
    if (/^\(\d+\)/.test(basename) && /_p\d+$/.test(basename)) {
      return {
        title: /^\(\d+\)(.*)?_p\d+$/.exec(basename)[1] || "",
        pid: /^\((\d+)\)/.exec(basename)[1],
        page: /_p(\d+)$/.exec(basename)[1],
      };
    } else return null;
  },
  pxderSingle: (basename) => {
    if (/^\(\d+\)/.test(basename)) {
      return {
        title: /^\(\d+\)(.*)?$/.exec(basename)[1] || "",
        pid: /^\((\d+)\)/.exec(basename)[1],
        page: "0",
      };
    } else return null;
  },
};

export class FilenameResolver {
  static getObjFromFilename(filename) {
    const extname = getEXt(filename);
    if (!extname) return null;
    for (let match of Object.keys(possibleMatch)) {
      const res = possibleMatch[match](getBasename(filename));
      if (res) {
        return {
          extname: extname,
          match: match,
          ...res,
        };
      }
    }
    return null;
  }
  static generatePxderSingleFilename(pid, title, ext) {
    if (pid && pid != "" && ext && ext != "")
      return `(${pid})${title || ""}.${ext}`;
    else return null;
  }
  static generatePxderMultipleFilename(pid, page, title, ext) {
    if (pid && pid != "" && page !== null && page !== "" && ext && ext != "")
      return `(${pid})${title || ""}_p${page}.${ext}`;
    else return null;
  }
  static generatePixivWebFilename(pid, page, ext) {
    if (pid && pid != "" && page !== null && page !== "" && ext && ext != "")
      return `${pid}_p${page}.${ext}`;
    else return null;
  }
}

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
    let logs = [];
    let index = 0;
    for (const item of paths) {
      const filename = path.basename(item);

      let log = {
        oriIdx: index,
        filename: filename,
        status: "ready",
        dto: null,
        message: "OK",
      };
      const reso = FilenameResolver.getObjFromFilename(filename);
      if (reso) {
        const dto = {
          meta: {
            pid: reso.pid,
            page: reso.page,
            title: autoList.includes("meta.title") ? reso.title : null,
          },
        };
        const ti = logs.findIndex((value) => {
          if (!value.dto) return false;
          return (
            value.dto.meta.pid == dto.meta.pid &&
            value.dto.meta.page == dto.meta.page
          );
        });
        if (ti != -1) {
          if (autoList.includes("meta.title")) {
            // 需要扩展时修改这里
            logs[ti].status = "conflict";
            logs[ti].message = `与文件${log.filename}发生冲突`;
            logs[ti].compareId = index;
            log.status = "conflict";
            log.message = `与文件${logs[ti].filename}发生冲突`;
            log.compareId = ti;
            log.dto = dto;
          } else {
            log.status = "ignore";
            log.message = "重复识别";
          }
        } else log.dto = dto;
      } else {
        log.status = "ignore";
        log.message = "不可识别的文件";
      }
      logs.push(log);
      index++;
      // await sleep();
    }
    return logs;
  };

  /**
   * @summary 从指定目录解析文件
   * @param {string} [path] 文件路径
   */
  static parseBaseFilenamesFromDirectory = (path) => {
    return fs.readdirSync(path);
  };

  /**
   * @summary 从指定目录异步解析文件
   * @param {string} [path] 文件路径
   */
  static parseBaseFilenamesFromDirectoryAsync = (path) => {
    return fs.readdir(path);
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
