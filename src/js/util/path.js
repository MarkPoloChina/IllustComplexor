// import path from 'path';
import { app } from "electron";
import config from "@/api/config";
import store from "@/store/index";
import { FilenameResolver } from "./filename";

const remote = require("@electron/remote");

const APP = process.type === "renderer" ? remote.app : app; // 根据process.type来分辨在哪种模式使用哪种模块
const STORE_PATH = APP.getPath("userData"); // 获取electron应用的用户目录

const ihs_pixiv_base = store.state.localIHS
  ? config.ihs_pixiv_base.replace(config.ihs_root, store.state.localIHS)
  : config.ihs_pixiv_base;

const ihs_base = store.state.localIHS
  ? config.ihs_base.replace(config.ihs_root, store.state.localIHS)
  : config.ihs_base;

const ihs_pixiv_origin = store.state.localIHS
  ? config.ihs_pixiv_origin.replace(config.ihs_root, store.state.localIHS)
  : config.ihs_pixiv_origin;

export class PathHelper {
  static getBaseUrl = () => {
    return STORE_PATH;
  };
}

export class UrlGenerator {
  static getBlobUrl(obj, type) {
    if (type == "original") return this.getBlobOriginUrl(obj);
    let base_url;
    if (obj.type == "pixiv") {
      if (store.state.useIhsForPixiv ^ obj.err)
        return `${ihs_pixiv_base}/${FilenameResolver.generatePixivWebFilename(
          obj.meta.pid,
          obj.meta.page,
          "jpg"
        )}`;
      else return this.getPixivBlobUrl(obj.meta.pid, obj.meta.page, type);
    } else if (obj.remote_type == "mpihs") base_url = ihs_base;
    else if (obj.remote_type == "cos") base_url = config.cos_base;
    if (obj.thum_base) {
      return `${base_url}${obj.thum_base.url}/${encodeURIComponent(
        obj.thum_endpoint
      )}`;
    } else return "";
  }

  static getBlobOriginUrl(obj) {
    let base_url;
    if (obj.type == "pixiv") {
      if (store.state.useIhsForPixiv ^ obj.err)
        return `${ihs_pixiv_origin}/${encodeURIComponent(
          obj.meta.page == 0
            ? FilenameResolver.generatePxderSingleFilename(
                obj.meta.pid,
                obj.meta.title,
                null
              )
            : FilenameResolver.generatePxderMultipleFilename(
                obj.meta.pid,
                obj.meta.page,
                obj.meta.title,
                null
              )
        )}`;
      else return this.getPixivBlobUrl(obj.meta.pid, obj.meta.page, "original");
    } else if (obj.remote_type == "mpihs") base_url = ihs_base;
    else if (obj.remote_type == "cos") base_url = config.cos_base;
    if (obj.remote_base)
      return `${base_url}${obj.remote_base.url}/${encodeURIComponent(
        obj.remote_endpoint
      )}`;
    else return "";
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
}
