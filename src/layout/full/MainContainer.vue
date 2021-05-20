<template>
	<div class="main-wrapper" :class="[mainWrapperClass, themeClass]">
		<!---Navigation-->
		<Navbar :topbarColor="topbarColor" :logo="require('@/assets/images/logo/logo-light-icon.svg')" :title="logotitle" />
		<!---Sidebar-->
		<SideBar parent=".main-wrapper" :sidebarLinks="sidebarLinks"/>
		<!---Page Container-->
		<div class="main-container-fluid">
		<Breadcrumb/>	
		<transition name="router-anim" enter-active-class="fade-enter-active fade-enter" leave-active-class="fade-leave-active fade-enter">
			
		<router-view></router-view>
		</transition>

		</div>	
	</div>
</template>

<script>
 
import Navbar from '@/layout/full/header/Navbar.vue';
import SideBar from '@/layout/full/sidebar/SideBar.vue';
import sidebarLinks from '@/layout/full/sidebar/sidebarlinks.js';
import Breadcrumb from '@/layout/full/breadcrumb/Breadcrumb.vue';
import themeConfig from '@/../themeConfig.js';

export default {
    name: "MainContainer",
    components: {
        Navbar,
        SideBar,
        Breadcrumb
    },
    data: () => ({
        topbarColor: themeConfig.topbarColor,
        logotitle: themeConfig.logotitle,
        sidebarLinks: sidebarLinks,
    }),
    methods: {
        updateTopbarColor(val) {
            this.topbarColor = val;
        }
    },
    computed: {
        sidebarWidth: function () {
            return this.$store.state.sidebarWidth;
        },
        mainWrapperClass: function () {
            if (this.sidebarWidth == "default") {
                return "main-wrapper-default"
            } else if (this.sidebarWidth == "mini") {
                return "main-wrapper-mini"
            } else if (this.sidebarWidth) {
                return "main-wrapper-full"
            }
            return "default"
        },
        themeClass: function () {
            if (this.$store.state.theme == "light") {
                return "light-theme"
            } else if (this.$store.state.theme == "dark") {
                return "dark-theme"
            }
            return "default"
        },
    }

}
</script>