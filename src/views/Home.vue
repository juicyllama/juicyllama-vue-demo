<template>
    <section>
    <UnreadMessages></UnreadMessages>

 <vs-row vs-justify="center">

    <WhosOnlineComponent></WhosOnlineComponent>

     <LatestTopics></LatestTopics>

  </vs-row>
    </section>
</template>

<script>
import {auth, superhero} from "@/functions/auth";
import {online} from "@/functions/activity";
import WhosOnlineComponent from "@/views/_components/WhosOnline";
import UnreadMessages from "@/views/_components/UnreadMessages";
import LatestTopics from "@/views/_components/LatestTopics";

export default {
	name : 'Home',
    components: {LatestTopics, UnreadMessages, WhosOnlineComponent},
    data:() => ({
        superhero: {}
    }),
    created() {
        auth(this.$router)
        this.superhero = superhero(this.$router)
        online(this.superhero.name)
    }
}
</script>
