// import path from 'path';
import { app } from "electron";
import config from "@/api/config";
import store from "@/store/index";
import { FilenameResolver } from "./filename";

const remote = require("@electron/remote");

const APP = process.type === "renderer" ? remote.app : app; // 根据process.type来分辨在哪种模式使用哪种模块
const STORE_PATH = APP.getPath("userData"); // 获取electron应用的用户目录

export class PathHelper {
  static getBaseUrl = () => {
    return STORE_PATH;
  };
}

export class UrlGenerator {
  static getBlobThumUrl(obj, noSquare = false) {
    let base_url;
    if (obj.type == "pixiv") {
      if (!store.state.useIhsForPixiv)
        return noSquare
          ? this.getPixivBlobThumUrl(obj.meta.pid, obj.meta.page)
          : this.getPixivBlobSquareUrl(obj.meta.pid, obj.meta.page);
      else
        return `${
          config.ihs_pixiv_base
        }/${FilenameResolver.generatePixivWebFilename(
          obj.meta.pid,
          obj.meta.page,
          "jpg"
        )}`;
    } else if (obj.remote_type == "mpihs") base_url = config.ihs_base;
    else if (obj.remote_type == "cos") base_url = config.cos_base;
    if (obj.thum_base) {
      return `${base_url}${obj.thum_base.url}/${encodeURIComponent(
        obj.thum_endpoint
      )}`;
    } else return "";
  }

  static getBlobThumUrlWhenErr(obj, noSquare = false) {
    let base_url;
    if (obj.type == "pixiv") {
      if (store.state.useIhsForPixiv)
        return noSquare
          ? this.getPixivBlobThumUrl(obj.meta.pid, obj.meta.page)
          : this.getPixivBlobSquareUrl(obj.meta.pid, obj.meta.page);
      else
        return `${
          config.ihs_pixiv_base
        }/${FilenameResolver.generatePixivWebFilename(
          obj.meta.pid,
          obj.meta.page,
          "jpg"
        )}`;
    } else if (obj.remote_type == "mpihs") base_url = config.ihs_base;
    else if (obj.remote_type == "cos") base_url = config.cos_base;
    if (obj.thum_base) {
      return `${base_url}${obj.thum_base.url}/${encodeURIComponent(
        obj.thum_endpoint
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
      return `${base_url}${obj.remote_base.url}/${encodeURIComponent(
        obj.remote_endpoint
      )}`;
    else return "";
  }

  static getPixivBlobThumUrl(pid, page) {
    let url = new URL(
      `${
        store.state.localApi ? config.baseURL : config.baseURL_mpi3s
      }/pixiv-api/blob/thum`
    );
    url.searchParams.append("pid", pid);
    url.searchParams.append("page", page);
    return url.href;
  }
  static getPixivBlobOriginUrl(pid, page) {
    let url = new URL(
      `${
        store.state.localApi ? config.baseURL : config.baseURL_mpi3s
      }/pixiv-api/blob/origin`
    );
    url.searchParams.append("pid", pid);
    url.searchParams.append("page", page);
    return url.href;
  }
  static getPixivBlobSquareUrl(pid, page) {
    let url = new URL(
      `${
        store.state.localApi ? config.baseURL : config.baseURL_mpi3s
      }/pixiv-api/blob/square`
    );
    url.searchParams.append("pid", pid);
    url.searchParams.append("page", page);
    return url.href;
    // return await API.getThumUrl(pid, page);
  }
}
