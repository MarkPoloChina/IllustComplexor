// import path from 'path';
import { ipcRenderer } from "electron";
import store from "@/store/index";
import path from "path";

const STORE_PATH = ipcRenderer.sendSync("app:getPath");

const ihs_base = store.state.useLocal
  ? store.state.localIHS
  : store.state.remoteIHS;

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
    if (
      obj.remote_base.type == "pixiv" &&
      !(store.state.useIhsForPixiv ^ obj.err)
    )
      return this.getPixivBlobUrl(obj.meta.pid, obj.meta.page, type);
    else
      return `${obj.remote_base.type == "cos" ? store.state.cos : ihs_base}${
        type != "original" && obj.remote_base.thum_url
          ? obj.remote_base.thum_url
          : obj.remote_base.origin_url
      }/${encodeURIComponent(
        type != "original" && obj.thumb_endpoint
          ? obj.thumb_endpoint
          : obj.remote_endpoint
      )}`;
  }

  static getPixivBlobUrl(pid, page, type) {
    let url = new URL(`${store.state.api}/pixiv-api/blob`);
    url.searchParams.append("pid", pid);
    url.searchParams.append("page", page);
    url.searchParams.append("type", type);
    return url.href;
  }
}
