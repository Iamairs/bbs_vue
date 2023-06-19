<template>
  <div id="app">
    <!-- 顶部栏 -->
    <topbar/>
    <!-- 包裹层 -->
    <wrapper>
      <!-- 导航栏 -->
      <!-- <Navbar  v-show="showNavbar"/> -->
      <!-- 具体内容 -->
      <router-view/>
    </wrapper>
  </div>
</template>

<script>
import Topbar from './components/topbar/Topbar.vue'

import Wrapper from './components/Wrapper.vue'

// 导入vuex
import { mapMutations } from 'vuex';

export default {
  name: 'App',
  components: {
    Topbar,
    Wrapper,
  },
  data() {
    return {
      showNavbar: true,
    }
  },
  created() {
    // 测试请求
    this.$http.testRequest().then(res => {
      console.log("测试接口成功：", res);
    }).catch(err => {
      console.log("测试接口失败：", err);
    })
    // 刷新仍保存登录
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));
    console.log("APP.vue获取localStorage: ", userInfo);
    if(userInfo) {
      // 存入vuex
      this.saveUserInfo(userInfo);
      console.log("App中token: ", localStorage.getItem("token"));
      this.setToken(localStorage.getItem("token"));
      console.log("APP.vue获取vuex: ", this.$store.state);
    }
  },
  watch: {
    "$route": function(val) {
      if(val.name == "postInfo") {
        this.showNavbar = false;
      } else {
        this.showNavbar = true;
      }
    }
  },
  methods: {
    ...mapMutations(['saveUserInfo', "setToken"]),
  }
}
</script>

<style>
  @import url("./assets/css/base.css");
  @import url("./assets/css/font.css");
  #app {
    background-color: #fafafa;
  }
</style>
