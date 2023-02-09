import { createStore } from "vuex";
import { ConfigDB } from "@/js/local/DBService";
const defaultSetting = {
  username: "MarkPolo",
  useIhsForPixiv: false,
  localApi: true,
  localIHS: "",
};

export default createStore({
  state: {
    username: "",
    useIhsForPixiv: false,
    localApi: true,
    localIHS: "",
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
