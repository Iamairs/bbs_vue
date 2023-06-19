import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Api from './api/request.js';
import store from './store';


Vue.use(ElementUI);
Vue.config.productionTip = false
Vue.prototype.$http = Api;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
  //定义全局事件总线 $bus
  beforeCreate:function(){
    Vue.prototype.$bus=this;
  }
})
