// import path from 'path';
import { ipcRenderer } from "electron";
import config from "@/api/config";
import store from "@/store/index";
import path from "path";
import { FilenameResolver } from "./filename";

const STORE_PATH = ipcRenderer.sendSync("app:getPath");

const ihs_base = store.state.localIHS ? store.state.localIHS : config.ihs_base;

export class PathHelper {
  static getBaseUrl = () => {
    return STORE_PATH;
  };
  static joinFilenamePath = (...paths) => {
    return path.join(...paths);
  };
  static getExtNameWithDot = (_path) => {
    return path.extname(_path);
  };
  static getBasename = (_path) => {
    return path.basename(_path);
  };
  static getPrefixName = (_path) => {
    const basename = path.basename(_path);
    return basename.substring(0, basename.lastIndexOf("."));
  };
}

export class UrlGenerator {
  static getBlobUrl(obj, type) {
    if (obj.remote_base.type == "pixiv") {
      if (store.state.useIhsForPixiv ^ obj.err)
        return `${ihs_base}${
          type == "original"
            ? obj.remote_base.origin_url
            : obj.remote_base.thum_url
        }/${this.getPixivIHSUrl(
          obj.meta.pid,
          obj.meta.page
          // obj.meta.title,
          // type
        )}`;
      else return this.getPixivBlobUrl(obj.meta.pid, obj.meta.page, type);
    } else
      return `${obj.remote_base.type == "mpihs" ? ihs_base : config.cos_base}${
        type == "original"
          ? obj.remote_base.origin_url
          : obj.remote_base.thum_url
      }/${encodeURIComponent(
        obj.remote_endpoint.substring(0, obj.remote_endpoint.lastIndexOf("."))
      )}`;
  }

  static getPixivBlobUrl(pid, page, type) {
    let url = new URL(
      `${
        store.state.localApi ? config.baseURL : config.baseURL_mpi3s
      }/pixiv-api/blob`
    );
    url.searchParams.append("pid", pid);
    url.searchParams.append("page", page);
    url.searchParams.append("type", type);
    return url.href;
  }

  // static getPixivIHSUrl(pid, page, title, type) {
  //   if (type == "original") {
  //     return encodeURIComponent(
  //       page == 0
  //         ? FilenameResolver.generatePxderSingleFilename(
  //             pid,
  //             title.replace(/[\x7F]/g, "").replace(/[/\\:*?"<>|.&$]/g, ""),
  //             null
  //           )
  //         : FilenameResolver.generatePxderMultipleFilename(
  //             pid,
  //             page,
  //             title.replace(/[\x7F]/g, "").replace(/[/\\:*?"<>|.&$]/g, ""),
  //             null
  //           )
  //     );
  //   } else {
  //     return FilenameResolver.generatePixivWebFilename(pid, page, null);
  //   }
  // }

  static getPixivIHSUrl(pid, page) {
    return FilenameResolver.generatePixivWebFilename(pid, page, null);
  }
}
