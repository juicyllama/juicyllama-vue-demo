<template>
	<div id="customizer-panel">
	<vs-button @click.stop="active=!active" color="primary" class="btn-customizer" type="filled"><vs-icon icon="settings"></vs-icon></vs-button>
	<vs-sidebar position-right parent="body" default-index="1"  color="primary" class="customizer-panel" spacer v-model="active">
		<div class="d-flex">
			<h4 class="font-weight-bold">Theme Settings</h4>
			<span @click.stop="active=!active" class="cursor-pointer ml-auto"><vs-icon icon="close"></vs-icon></span>
		</div>
    <vs-divider></vs-divider>
    <h5 class="mt-4">Topbar Colors</h5>
    <ul class="clearfix common-list inline-list customizer-list mt-3 mb-4">
      <li @click="topbarColorControl ='white'"></li>
      <li @click="topbarColorControl = color" v-for="color in themeColors" :style="{backgroundColor: color}" :key="color"></li>
      <li @click="topbarColorControl = topbarColor" :style="{backgroundColor: topbarColor}" :class="{'shadow-outline': topbarColor == topbarColorControl}"></li>
      <li><input class="input-color" v-model="topbarColor" type="color" name="" value=""></li>
    </ul>
    <vs-divider></vs-divider>
    <!-- THEME -->
    <div class="mt-4">
        <!-- <vs-switch v-model="theme_dark" vs-icon-off="wb_sunny" vs-icon-on="brightness_2" color="dark" /> -->
        <h5 class="mb-2">Theme Mode</h5>
        <div class="d-flex">
            <vs-radio class="mr-4" v-model="theme" vs-value="light">Light</vs-radio>
            <vs-radio class="mr-4" v-model="theme" vs-value="dark">Dark</vs-radio>
        </div>
    </div>
    <vs-divider></vs-divider>
    <h5 class="mt-4">Theme Colors</h5>
    <ul class="clearfix common-list inline-list customizer-list mt-3 mb-4">
      <li @click="themeColorControl(color)" v-for="color in themeColors" :style="{backgroundColor: color}" :key="color"></li>
      <li @click="themeColorControl(updatedThemeColor)" :style="{backgroundColor: updatedThemeColor}" :class="{'shadow-outline': updatedThemeColor == themeColorControl}"></li>
      <li><input class="input-color" v-model="updatedThemeColor" type="color" name="" value=""></li>
    </ul>
    </vs-sidebar>
  </div>

</template>

<script>
	export default {
	name : 'Customizer',
	data:()=>({
		themeColors: ['#4e31ef', '#36bea6', '#f62d51', '#ffbc34', '#212529'],
		topbarColor: '#2962ff',
		updatedThemeColor: '#2962ff',
		active:false
	}),

	computed: {
		topbarColorControl: {
            get() { return this.topbarColor; },
            set(val) { this.$emit('updateTopbarColor', val) }
        },
        theme: {
            get() {
                return this.$store.state.theme;
            },
            set(val) {
                this.$store.commit('UPDATE_THEME', val);
            }
        },
        themeColor: {
            get() { return this.$store.state.themeColor },
            set(val) { this.$store.commit('UPDATE_THEME_COLOR', val) }
        },
	},
	methods: {
		themeColorControl(color) {
            this.themeColor = color;
            this.$vs.theme({ primary: color });
        }
	}
}
</script>
