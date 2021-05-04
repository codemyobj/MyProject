import Vue from 'vue'
import App from './App.vue'
import router from './router'

//导入饿了么UI组件库
import ElementUI from 'element-ui';

//加载饿了么UI组件库样式
import 'element-ui/lib/theme-chalk/index.css';

//加载全局样式文件
import './assets/css/index.less'



//全局注册饿了么UI组件
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
