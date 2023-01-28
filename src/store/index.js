import { createStore } from "vuex";
import { ConfigDB } from "@/js/local/DBService";
const defaultSetting = {
  username: "MarkPolo",
  useIhsForPixiv: false,
};

export default createStore({
  state: {
    username: "",
    useIhsForPixiv: false,
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
        if (value === null) {
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
