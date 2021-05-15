import Vue from 'vue'
import Vuex from 'vuex'
import themeConfig from '@/../themeConfig.js'
Vue.use(Vuex)
/* eslint-disable */
export default new Vuex.Store({
  state: {
    theme: themeConfig.theme,
  	isSidebarActive: false,
  	isSidebarReduced: themeConfig.sidebarCollapsed,
  	sidebarWidth: "default",
    themeColor: themeConfig.themeColor
  },
  mutations: {
  	//This is for Sidbar trigger in mobile
  	TOGGLE_SIDEBAR_ACTIVE(state, value) {
        state.isSidebarActive = value;
    },
    //This is for Sidebar toggle in desktop
    TOGGLE_REDUCE_SIDEBAR(state, val) {
        state.isSidebarReduced = val;
    },
    UPDATE_THEME(state, val) {
        state.theme = val;
    },
    UPDATE_THEME_COLOR(state, val) {
        state.themeColor = val;
    },
    UPDATE_SIDEBAR_WIDTH(state, width) {
        state.sidebarWidth = width;
    },
  },  
  actions: {
  	updateSidebarWidth({ commit }, width) {
        commit('UPDATE_SIDEBAR_WIDTH', width);
    }
  },
  getters:{
  	
  }
})
