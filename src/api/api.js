import axios from "axios";
import config from "./config";
import store from "@/store";
const ax = axios.create({
  baseURL: store.state.localApi ? config.baseURL : config.baseURL_mpi3s,
});
const ax_local = axios.create({ responseType: "arraybuffer" });

/**
 * API Class
 * get - fetch info;
 * new - create info while no conflict data;
 * update - find and update or not found error;
 * cover - find and update or not found but create;
 * @class
 */
export class API {
  static async getEnumTimeline() {
    const resp = await ax.get("/illust/base/enum", {
      params: {
        row: "date",
        desc: 1,
      },
    });
    return resp.data;
  }
  static async getEnumPolyParent(requiredType) {
    const resp = await ax.get("/illust/poly/enum", {
      params: {
        requiredType: requiredType,
        row: "parent",
        desc: 0,
      },
    });
    return resp.data;
  }
  static async getIllusts(conditionJson, limit, offset, orderJson) {
    const resp = await ax.get("/illust/base/list", {
      params: {
        orderAs: orderJson,
        offset: offset,
        limit: limit,
        conditionJson: conditionJson,
      },
    });
    return resp.data;
  }
  static async getIllustsCount(conditionJson) {
    const resp = await ax.get("/illust/base/count", {
      params: {
        conditionJson: conditionJson,
      },
    });
    return resp.data;
  }
  static async newIllusts(illustList) {
    const resp = await ax.post("/illust/bases", illustList);
    return resp.data;
  }
  static async updateIllusts(illustList) {
    const resp = await ax.put("/illust/bases", illustList);
    return resp.data;
  }
  static async updateIllust(illustList, addIfNotFound) {
    const resp = await ax.put("/illust/base", illustList, {
      params: {
        addIfNotFound: addIfNotFound,
      },
    });
    return resp.data;
  }
  static async getPoly(type) {
    const resp = await ax.get("/illust/poly/list", {
      params: {
        withIllust: 0,
        type: type,
      },
    });
    return resp.data;
  }
  static async getPolyWithIllust(type) {
    const resp = await ax.get("/illust/poly/list", {
      params: {
        withIllust: 1,
        type: type,
      },
    });
    return resp.data;
  }
  static async addPoly(illustList) {
    const resp = await ax.post("/illust/poly/bases", illustList);
    return resp.data;
  }
  static async removePolyById(polyId, illustList) {
    const resp = await ax.delete("/illust/poly/bases", {
      params: {
        polyId: polyId,
        illustList: illustList,
      },
    });
    return resp.data;
  }
  static async deletePoly(polyId) {
    const resp = await ax.delete("/illust/poly", {
      params: {
        polyId: polyId,
      },
    });
    return resp.data;
  }
  static async getBookmark(isPrivate) {
    const resp = await ax.get("/pixiv-api/pixiv-json/latest", {
      params: {
        isPrivate: isPrivate ? 1 : 0,
      },
    });
    return resp.data;
  }
  static async getPixivImageUrl(pid, page, type) {
    const resp = await ax.get("/pixiv-api/url", {
      params: {
        pid: pid,
        page: page,
        type: type,
      },
    });
    return resp.data;
  }
  static async updatePixivMeta(illust) {
    const resp = await ax.put("/pixiv-api/pixiv-json/list", illust);
    return resp.data;
  }
  static async getRemoteBase() {
    const resp = await ax.get("/illust/remote-base/list", {
      params: {
        withIllust: 0,
      },
    });
    return resp.data;
  }
  static async coverRemoteBase(rb) {
    const resp = await ax.post("/illust/remote-base", rb);
    return resp.data;
  }
  static async coverIllustToday(date, illustId) {
    const resp = await ax.put("/illust/illust-today", null, {
      params: {
        date: date,
        illustId: illustId,
      },
    });
    return resp.data;
  }
  static async getPixivInfo(pid) {
    const resp = await ax.get("/pixiv-api/pixiv-json", {
      params: {
        pid: pid,
      },
    });
    return resp;
  }
}

export class APIProxy {
  static async getLocalBlob(url) {
    const resp = await ax_local.get(url);
    let ext = null;
    switch (resp.headers["content-type"]) {
      case "image/jpeg":
        ext = "jpg";
        break;
      case "image/png":
        ext = "png";
        break;
    }
    return { data: resp.data, ext: ext };
  }
}
