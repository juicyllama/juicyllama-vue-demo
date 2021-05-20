import Vue from 'vue'
import Vuesax from 'vuesax'
Vue.use(Vuesax, {
  theme:{
    colors:{
      primary:'#F9D43C',
      success:'#36bea6',
      danger:'#f62d51',
      warning:'#F9D43C',
      dark:'#212529'
    }
  }
})


// CONFIGS
const themeConfig = {
  theme: 'dark',
	logotitle: "JuicyLlama",
	sidebarCollapsed: false,			// options: true (mini-sidebar), false(default)
	topbarColor: "#F9D43C",				// options: anycolor you can use
  themeColor:"#F9D43C"
}

export default themeConfig