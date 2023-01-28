// import path from 'path';
import { app } from "electron";
import config from "@/api/config";
const remote = require("@electron/remote");

const APP = process.type === "renderer" ? remote.app : app; // 根据process.type来分辨在哪种模式使用哪种模块
const STORE_PATH = APP.getPath("userData"); // 获取electron应用的用户目录

export class PathHelper {
  static getBaseUrl = () => {
    return STORE_PATH;
  };
}

export class UrlGenerator {
  static getBlobThumUrl(obj) {
    let base_url;
    if (obj.type == "pixiv")
      return this.getPixivBlobSquareUrl(obj.meta.pid, obj.meta.page);
    else if (obj.remote_type == "mpihs") base_url = config.ihs_base;
    else if (obj.remote_type == "cos") base_url = config.cos_base;
    if (obj.thum_base) {
      return `${base_url}${obj.thum_base.url}/${encodeURIComponent(
        `${obj.thum_endpoint}`
      )}`;
    } else return "";
  }

  static getBlobOriginUrl(obj) {
    let base_url;
    if (obj.type == "pixiv")
      return this.getPixivBlobOriginUrl(obj.meta.pid, obj.meta.page);
    else if (obj.remote_type == "mpihs") base_url = config.ihs_base;
    else if (obj.remote_type == "cos") base_url = config.cos_base;
    if (obj.remote_base)
      return `${base_url}${obj.remote_base.url}/${obj.remote_endpoint}`;
    else return "";
  }

  static getPixivBlobThumUrl(pid, page) {
    let url = new URL(`${config.baseURL}/pixiv-api/blob/thum`);
    url.searchParams.append("pid", pid);
    url.searchParams.append("page", page);
    return url.href;
  }
  static getPixivBlobOriginUrl(pid, page) {
    let url = new URL(`${config.baseURL}/pixiv-api/blob/origin`);
    url.searchParams.append("pid", pid);
    url.searchParams.append("page", page);
    return url.href;
  }
  static getPixivBlobSquareUrl(pid, page) {
    let url = new URL(`${config.baseURL}/pixiv-api/blob/square`);
    url.searchParams.append("pid", pid);
    url.searchParams.append("page", page);
    return url.href;
  }
}
