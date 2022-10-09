import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//全局引入Elementui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI)

//全局引入axios
//导入axios
import axios from 'axios';
//设置访问跟路径
axios.defaults.baseURL='http://localhost:8082/';
//挂载axios
Vue.prototype.$axios = axios;

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
