import axios from "axios";
import config from "./config";
const ax = axios.create({ baseURL: config.baseURL });
export class API {
  static async getEnumTimeline() {
    const resp = await ax.get("/illust/enum", {
      params: {
        row: "date",
        desc: true,
        requiredType: "pixiv",
      },
    });
    return resp.data;
  }
  static async getEnumSource() {
    const resp = await ax.get("/illust/enum", {
      params: {
        row: "type",
        desc: false,
      },
    });
    return resp.data;
  }
  static async getIllusts(conditionJson, limit, offset, orderAs, orderDesc) {
    const resp = await ax.get("/illust/list", {
      params: {
        orderAs: orderAs,
        orderDesc: orderDesc,
        offset: offset,
        limit: limit,
        conditionJson: conditionJson,
      },
    });
    return resp.data;
  }
  static async getIllustsCount(conditionJson) {
    const resp = await ax.get("/illust/list/count", {
      params: {
        conditionJson: conditionJson,
      },
    });
    return resp.data;
  }
  static async newIllusts(illustList) {
    const resp = await ax.post("/illust/list", illustList);
    return resp.data;
  }
  static async updateIllustsByMatch(illustList) {
    const resp = await ax.put("/illust/list", illustList, {
      params: {
        byMatch: true,
        addIfNotFound: false,
      },
    });
    return resp.data;
  }
  static async coverIllustsByMatch(illustList) {
    const resp = await ax.put("/illust/list", illustList, {
      params: {
        byMatch: true,
        addIfNotFound: true,
      },
    });
    return resp.data;
  }
  static async getPoly(type) {
    const resp = await ax.get("/illust/poly/list", {
      params: {
        withIllust: false,
        type: type,
      },
    });
    return resp.data;
  }
  static async getPolyWithIllust(type) {
    const resp = await ax.get("/illust/poly/list", {
      params: {
        withIllust: true,
        type: type,
      },
    });
    return resp.data;
  }
  static async getBookmark(isPrivate) {
    const resp = await ax.get("/pixiv-api/pixiv-json/latest", {
      params: {
        private: isPrivate,
      },
    });
    return resp.data;
  }
}

export class UrlGenerator {
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
