import { Axios } from "axios";
const baseURL = "http://localhost:8988/api"
const api = new Axios({ baseURL:baseURL  });
export class API {
  static async getTimelineEnum() {
    const resp = await api.get("/json/enum/timeline");
    return JSON.parse(resp.data);
  }
  static async getTimelineIllusts(query) {
    const resp = await api.get("/json/list/illust", { params: query });
    return JSON.parse(resp.data);
  }
  static async getThum(query) {
    const resp = await api.get('/blob/thum',{params:query})
    return URL.createObjectURL(resp.data)
  }
  static getThumUrl(pid) {
    let url = new URL(`${baseURL}/blob/thum`) 
    url.searchParams.append('pid',pid)
    return url.href
  }
}
