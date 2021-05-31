import Vue from 'vue'
import App from './App.vue'
import elementUi from 'element-ui' 
import 'element-ui/lib/theme-chalk/index.css'
import httpRequest from '@/utils/httpRequest';

Vue.use(elementUi)

Vue.config.productionTip = false
Vue.prototype.$http = httpRequest;

if(true){
  const {mockXHR} = require('../mock');
  mockXHR();
}

new Vue({
  render: h => h(App),
}).$mount('#app')
