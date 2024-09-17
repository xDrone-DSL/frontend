<template>
  <v-app>
    <v-app-bar app flat absolute color="blue darken-2" dark>
      <v-spacer></v-spacer>
      <v-toolbar-title>Explore</v-toolbar-title>
      <v-spacer></v-spacer>
      <TeamDetailMenu :logout-color="'blue darken-2'" />
    </v-app-bar>
    <v-content>
      <div v-if="advs.length > 0">
        <carousel-3d
          :controls-visible="true"
          :height="660"
          :width="510"
          :display="3"
          :border="0"
        >
          <slide v-for="(adv, i) in advs" :key="adv.id" :index="i">
            <router-link :to="`${adv.key}`" append>
              <v-card :height="660" :width="510" :img="pics[i % 4]" tile>
                <v-layout class="pa-2 d-flex align-center flex-column mb-6">
                  <v-flex class="pa-3 mt-12 mb-7 level">
                    {{ adv.level }}
                  </v-flex>
                  <v-flex class="pa-3 mt-2 adv-title">
                    {{ adv.title }}
                  </v-flex>
                </v-layout>
              </v-card>
            </router-link>
          </slide>
        </carousel-3d>
      </div>
    </v-content>
  </v-app>
</template>

<script>
import { getAllAdventures } from "@/apiCalls";
import { Carousel3d, Slide } from "vue-carousel-3d";
import TeamDetailMenu from "../components/TeamDetailMenu";

export default {
  components: {
    Carousel3d,
    Slide,
    TeamDetailMenu
  },
  mounted() {
    getAllAdventures()
      .then(advs => (this.advs = advs))
      .catch(err => alert(err));
  },
  data: () => ({
    advs: [],
    pics: [
      require("../assets/drone_1.png"),
      require("../assets/drone_2.png"),
      require("../assets/drone_3.png"),
      require("../assets/drone_5.png")
    ]
  })
};
</script>

<style scoped>
a {
  text-decoration: none;
}

.level {
  font-size: 2rem !important;
  font-weight: 400;
  color: white;
  letter-spacing: 0.1666666667em !important;
  line-height: 1rem;
  text-transform: uppercase;
}
.adv-title {
  font-size: 2.5em !important;
  font-weight: 500;
  line-height: 2rem;
  color: white;
  letter-spacing: 0.0125em !important;
  font-family: "Roboto", sans-serif !important;
}
</style>
