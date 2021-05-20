<template lang="html">
   <div id="parentx">
    
    <vs-sidebar default-index="1" :parent="parent" :hiddenBackground="doNotClose" color="primary" class="left-sidebar" spacer v-model="isSidebarActive" :click-not-close="doNotClose" :reduce="isSidebarReduced">
      
      <div class="header-sidebar text-center" slot="header" v-if="superhero_name">
          <router-link :to="`/profile/${superhero_name}`">
                <vs-avatar size="70px" :src="require(`@/assets/images/superheros/${superhero_avatar}-superhero.svg`)"/>
                <h4 style="color: var(--dark)">{{ superhero_name }}<br/>
                    <router-link to="/superhero"><small>Switch Superhero</small></router-link>
                </h4>
          </router-link>
      </div>
      
      <div v-bar class="vs-scrollable">
      <div>
      <template v-for="(sidebarLink, index) in sidebarLinks">

        <!-- Small Cap -->
        <span v-if="sidebarLink.title"  :key="index + '.' + index" class="small-cap">{{ $t(sidebarLink.i18n) || sidebarLink.title }}</span>
        <template v-else-if="!sidebarLink.title">
          <!-- Single Menu -->
          <vs-sidebar-item :key="sidebarLink.index" :icon-pack="sidebarLink.icon" :index="sidebarLink.index" v-if="!sidebarLink.child" :to="sidebarLink.url">
            <span class="hide-in-minisidebar">{{ $t(sidebarLink.i18n) || sidebarLink.name }}</span>
          </vs-sidebar-item>
          <!-- Dropdown Menu -->
          <template v-else >
            <vs-sidebar-group :title="sidebarLink.name" :key="sidebarLink.index" :icon-pack="sidebarLink.icon" :open="isSubLinkActive(sidebarLink)">
              <li v-for="(subLink) in sidebarLink.child" :key="subLink.index">
                  <vs-sidebar-item :icon-pack="subLink.icon" :to="subLink.url" :index="subLink.index">
                    <span class="hide-in-minisidebar">{{ $t(subLink.i18n) || subLink.name }}</span>
                  </vs-sidebar-item>
              </li>
          </vs-sidebar-group>
          <!-- /Dropdown Menu -->  
        </template>
        </template>
         
      </template> 
      </div>
      </div>
      
      <div class="footer-sidebar" slot="footer">
        <vs-button icon="reply" color="danger" type="flat" @click="logout"><span class="hide-in-minisidebar">log out</span></vs-button>
      </div>
      
    </vs-sidebar>

  </div>


</template>

<script>
import storage from "@/store/storage";
export default {
  name: "SideBar",
  props: {
    parent: {
      type: String
    },
    sidebarLinks: {
      type: Array,
      required: true
    },
    subLink: {
      type: Object
    },
    index: {
      default: null,
      type: [String, Number]
    }
  },
  data: () => ({
      superhero_name: false,
      superhero_avatar: false,
    doNotClose: false,
    windowWidth: window.innerWidth,
    round: true
  }),
  computed: {
    //This is for mobile trigger
    isSidebarActive: {
      get() {
        return this.$store.state.isSidebarActive;
      },
      set(val) {
        this.$store.commit("TOGGLE_SIDEBAR_ACTIVE", val);
      }
    },
    getActive: function getActive() {
      return this.$destroy();
    },
    //This is for mini sidebar
    reduceSidebar() {
      return Boolean(this.isSidebarReduced);
    },
    isSidebarReduced: {
      get() {
        return this.$store.state.isSidebarReduced;
      },
      set(val) {
        this.$store.commit("TOGGLE_REDUCE_SIDEBAR", val);
      }
    },
    //This is for active group link
    isSubLinkActive() {
      return sidebarLink => {
        let open = false;
        if (sidebarLink.child) {
          sidebarLink.child.forEach(link => {
            if (this.$route.fullPath == link.url) {
              open = true;
            }
          });
        }
        return open;
      };
    }
  },
  watch: {},
  methods: {
      logout(){
          localStorage.clear()
          this.$router.push('/login')
      },
    handleWindowResize(event) {
      this.windowWidth = event.currentTarget.innerWidth;
      this.setSidebarWidth();
    },
    setSidebarWidth() {
      if (this.windowWidth < 1170) {
        this.$store.commit("TOGGLE_SIDEBAR_ACTIVE", false);
        (this.doNotClose = false),
          this.$store.dispatch("updateSidebarWidth", "no-sidebar");
      } else {
        this.$store.commit("TOGGLE_SIDEBAR_ACTIVE", true);
        this.doNotClose = true;
        if (this.isSidebarReduced)
          this.$store.dispatch("updateSidebarWidth", "mini");
        else this.$store.dispatch("updateSidebarWidth", "default");
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener("resize", this.handleWindowResize);
    });
    this.setSidebarWidth();

    this.$set(this, 'superhero_name', storage.get('superhero_name'))
      this.$set(this, 'superhero_avatar', storage.get('superhero_avatar'))

  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleWindowResize);
    this.setSidebarWidth();
  }
};
</script>