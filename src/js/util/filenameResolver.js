import path from "path";
const extAllow = ["jpg", "png", "gif"];
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
    if (pid && pid != "" && page && page != "" && ext && ext != "")
      return `(${pid})${title || ""}_p${page}.${ext}`;
    else return null;
  }
  static generatePixivWebFilename(pid, page, ext) {
    if (pid && pid != "" && page && page != "" && ext && ext != "")
      return `${pid}_p${page}.${ext}`;
    else return null;
  }
}
