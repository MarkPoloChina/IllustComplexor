import { createStore } from 'vuex'
import { ConfigDB } from "@/js/local/DBService";
import { PathHelper } from '@/js/util/pathHelper';

export default createStore({
  state: {
    username: "",
    basePath: ""
  },
  getters: {
  },
  mutations: {
    reviseUsername(state, username) {
      state.username = username
    },
    reviseBasePath(state, basePath) {
      state.basePath = basePath
    },
    saveToDB(state) {
      ConfigDB.setByKey('username', state.username)
    },
    initStore() {
      let username = ConfigDB.getByKey("username");
      if (!username) {
        ConfigDB.setByKey("username", "MarkPolo");
        username = "MarkPolo";
      }
      this.commit("reviseUsername", username)
      this.commit("reviseBasePath", PathHelper.getBaseUrl());
    }
  },
  actions: {
  },
  modules: {
  }
})
