<template>
  <header class="gridx">
    <vs-navbar
      v-model="indexActive"
      :color="topbarColor"
      class="topnavbar"
      text-color="rgba(255,255,255,0.7)"
      active-text-color="rgba(255,255,255,1)"
    >
      <!---
      Template logo
      -->
      <div slot="title" class="themelogo">
        <img :src="logo" v-if="logo" alt="Dashboard" width="40" height="40" />
        <span class="logo-text" v-if="title">{{ title }}</span>
      </div>
      <!---
      Mobile toggle
      -->
      <div slot="title">
        <div class="hiddenDesktop cursor-pointer" @click.stop="activeSidebar">
          <vs-icon icon="menu"></vs-icon>
        </div>
      </div>
      <!---
      Desktop Toggle
      -->
      <div class="hiddenMobile cursor-pointer" @click="reduceSidebar" v-show="!showToggle">
        <vs-icon icon="menu"></vs-icon>
      </div>
      <div class="hiddenMobile cursor-pointer" @click="fullSidebar" v-show="showToggle">
        <vs-icon icon="menu"></vs-icon>
      </div>

      <vs-spacer></vs-spacer>


    </vs-navbar>
  </header>
</template>

<script>
export default {
  name: "Navbar",
  props: {
    topbarColor: {
      type: String,
    },
    title: {
      type: String
    },
    logo: {
      type: String
    },
    // Obj for Userdropdown
    user: Object,
    // Obj for Mail Dropdown
    mail: Object,
    // Obj for Chat Dropdown
    chat: Object
  },
  data: () => ({
    indexActive: 0,
    showToggle: false,
  }),

  methods: {
    //This is for sidebar trigger in mobile
    activeSidebar() {
      this.$store.commit("TOGGLE_SIDEBAR_ACTIVE", true);
    },
    //This is for sidebar trigger in Desktop
    reduceSidebar() {
      this.$store.commit("TOGGLE_REDUCE_SIDEBAR", true);
      this.$store.dispatch("updateSidebarWidth", "mini");
      this.showToggle = true;
    },
    fullSidebar() {
      this.$store.commit("TOGGLE_REDUCE_SIDEBAR", false);
      this.$store.dispatch("updateSidebarWidth", "default");
      this.showToggle = false;
    },
    changeLanguage(locale) {
      this.$i18n.locale = locale;
    }
  },
  computed: {
  }
};
</script>
