import { createStore } from "vuex";
import { ConfigDB } from "@/js/local/DBService";
const defaultSetting = {
  username: "MarkPolo",
  localIHS: "",
  remoteIHS: "",
  useIhsForPixiv: false,
  api: "",
  apiOptions: [],
  cos: "",
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
