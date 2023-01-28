import axios from "axios";
import config from "./config";
const ax = axios.create({ baseURL: config.baseURL });

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
  static async getEnumPolyParent(requiredType) {
    const resp = await ax.get("/illust/poly/enum", {
      params: {
        requiredType: requiredType,
        row: "parent",
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
  static async coverPolyByMatch(type, parent, name, illustList) {
    const resp = await ax.post("/illust/poly/list", illustList, {
      params: {
        byMatch: true,
        type: type,
        parent: parent,
        name: name,
      },
    });
    return resp.data;
  }
  static async removePolyById(polyId, illustList) {
    const resp = await ax.delete("/illust/poly/list", {
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
        private: isPrivate,
      },
    });
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
}
