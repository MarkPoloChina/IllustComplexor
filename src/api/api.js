import axios from "axios";
import config from "./config";
import store from "@/store";
const ax = axios.create({
  baseURL: store.state.localApi ? config.baseURL : config.baseURL_mpi3s,
});

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
        desc: 1,
        requiredType: "pixiv",
      },
    });
    return resp.data;
  }
  static async getEnumSource() {
    const resp = await ax.get("/illust/enum", {
      params: {
        row: "type",
        desc: 0,
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
        byMatch: 1,
        addIfNotFound: 0,
      },
    });
    return resp.data;
  }
  static async coverIllustsByMatch(illustList) {
    const resp = await ax.put("/illust/list", illustList, {
      params: {
        byMatch: 1,
        addIfNotFound: 0,
      },
    });
    return resp.data;
  }
  static async updateIllustsById(illustList) {
    const resp = await ax.put("/illust/list", illustList, {
      params: {
        byMatch: 0,
        addIfNotFound: 0,
      },
    });
    return resp.data;
  }
  static async updateIllustsByCondition(conditionObj, illustDto) {
    const resp = await ax.put("/illust/list", [illustDto], {
      params: {
        addIfNotFound: 0,
        byCondition: 1,
        conditionJson: conditionObj,
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
  static async addPolyByMatch(type, parent, name, illustList) {
    const resp = await ax.post("/illust/poly/list", illustList, {
      params: {
        byMatch: 1,
        type: type,
        parent: parent,
        name: name,
      },
    });
    return resp.data;
  }
  static async addPolyById(type, parent, name, illustList) {
    const resp = await ax.post("/illust/poly/list", illustList, {
      params: {
        type: type,
        parent: parent,
        name: name,
      },
    });
    return resp.data;
  }
  static async addPolyByCondition(type, parent, name, conditionObj) {
    const resp = await ax.post("/illust/poly/list", null, {
      params: {
        byCondition: 1,
        type: type,
        parent: parent,
        name: name,
        conditionJson: conditionObj,
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
  static async getRemoteBase() {
    const resp = await ax.get("/illust/remote-base/list", {
      params: {
        withIllust: 0,
      },
    });
    return resp.data;
  }
}
