import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    data: {},
    userInfo: {},
    haveLogined: false,
    boardList: [],
  },
  mutations: {
    // 登录注册时调用
    saveUserInfo(state, userInfo) {
      state.haveLogined = true;
      state.userInfo = userInfo;
      if (userInfo instanceof Object) {
        // 引用类型，包括 Object 和 Array
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
      } else {
        // 注意如果不是 string 类型，则会调用 toString 方法尝试转为 string
        localStorage.setItem("userInfo", userInfo);
      }
    },
    // 登出
    logout(state) {
        state.userInfo = {};
        state.haveLogined = false;
        localStorage.clear();
    },
    // 将token存在vuex
    setToken(state, token) {
      console.log("token存进去了吗");
      state.token = token;
      localStorage.setItem("token", token);
    },
  },
})
