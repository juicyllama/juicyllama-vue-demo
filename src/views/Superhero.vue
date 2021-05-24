<template>
 <vs-row>

     <vs-col class="mb-4" type="flex" vs-lg="12" vs-xs="12">

     Choose your superhero character:

     </vs-col>

    <vs-col
        type="flex"
        vs-lg="2"
        vs-xs="4"
        v-for="(superhero, index) in superheros"
        :key="index"
        vs-justify="center"
        vs-align="center"
    >
      <vs-card actionable class="cardx">
          <vs-row vs-justify="center">
                <img
                    :src="require(`@/assets/images/superheros/${superhero.avatar}-superhero.svg`)"
                    width="70"
                    height="70"
                    @click="setSuperhero(index)"
                >
          </vs-row>

              <vs-row vs-justify="center" class="mt-2">
          <span>{{ superhero.name }}</span>
          </vs-row>
        
      </vs-card>
    </vs-col>

  </vs-row>
</template>

<script>
import {auth} from "@/functions/auth";
import superheros from "@/assets/superheros.json"
import storage from "@/store/storage";
import {online} from "@/functions/activity";

export default {
	name : 'Superhero',
    data:() => ({
        superheros: superheros,
        superhero_selected: Number(storage.get('superhero_avatar'))
    }),
    created() {
        auth(this.$router)
    },
    methods: {
        setSuperhero(index) {
            storage.set('superhero_name', superheros[index].name)
            storage.set('superhero_avatar', superheros[index].avatar)
            online(superheros[index].name, {avatar: superheros[index].avatar})

            //todo invalidate all cache items (_*)

            this.$router.replace('/home')
            this.$router.go(0)
        }
    }
}
</script>
