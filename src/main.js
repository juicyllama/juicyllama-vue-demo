import Vue from 'vue'
import Vuesax from 'vuesax'
import App from './App.vue'

import 'vuesax/dist/vuesax.css' //Vuesax styles
import 'material-icons/iconfont/material-icons.css';

// Vuex Store
import store from './store/store'
// Theme Configurations
import '../themeConfig.js'
// Perfectscrollbar
// import PerfectScrollbar from "vue2-perfect-scrollbar";
// import "vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css";
// Vue.use(PerfectScrollbar);
import VueQuillEditor from 'vue-quill-editor'
import Vuebar from 'vuebar';
Vue.use(Vuebar);
// Theme Configurations
import 'prismjs'
import 'prismjs/themes/prism.css'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import VsPrism from './components/prism/VsPrism.vue';
Vue.component(VsPrism.name, VsPrism);
import VsSidebarGroup from './components/vs-sidebar-group/Sidebar-Group.vue';
Vue.component(VsSidebarGroup.name, VsSidebarGroup);
// i18n
import i18n from './i18n/i18n.js'
// Vue Router
import router from './router'
Vue.config.productionTip = false

Vue.use(Vuesax)
Vue.use(VueQuillEditor)

new Vue({
  store,
  router,
  i18n,
  render: h => h(App),
}).$mount('#app')
import '@/assets/scss/style.scss'
