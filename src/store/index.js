import { createStore } from "vuex";
import { ConfigDB } from "@/js/local/DBService";
const defaultSetting = {
  username: "MarkPolo",
  localIHS: "",
  remoteIHS: "https://ihs.markpolo.cn",
  useIhsForPixiv: false,
  api: "https://mpi3s.markpolo.cn",
  apiOptions: ["https://mpi3s.markpolo.cn", "http://localhost:3000"],
  cos: "https://cloud.markpolo.cn/ICXOR",
  useLocal: false,
};

export default createStore({
  state: {
    username: "",
    useIhsForPixiv: false,
    localIHS: "",
    remoteIHS: "",
    api: "",
    apiOptions: [],
    cos: "",
    useLocal: false,
  },
  getters: {},
  mutations: {
    reviseByKey(state, { key, value }) {
      state[key] = value;
      ConfigDB.setByKey(key, value);
    },
    initStore(state) {
      Object.keys(state).forEach((key) => {
        let value = ConfigDB.getByKey(key);
        if (value === null || value === undefined) {
          ConfigDB.setByKey(key, defaultSetting[key]);
          value = defaultSetting[key];
        }
        state[key] = value;
      });
    },
  },
  actions: {},
  modules: {},
});
