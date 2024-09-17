<template>
  <v-app>
    <v-app-bar app flat absolute color="teal darken-1" dark>
      <v-btn class="ma-2" text icon @click="router.push('/explore')">
        <v-icon left>mdi-arrow-left</v-icon>Back
      </v-btn>
      <v-spacer></v-spacer>
      <v-toolbar-title>Adventures</v-toolbar-title>
      <v-spacer></v-spacer>
      <TeamDetailMenu :logout-color="'teal darken-1'" />
    </v-app-bar>
    <v-content>
      <div v-if="tasks.length > 0">
        <carousel-3d
          :controls-visible="true"
          :height="660"
          :width="510"
          :display="3"
          :border="0"
        >
          <slide v-for="(task, i) in tasks" :key="task.key" :index="i">
            <router-link :to="`${task.key}`" append>
              <v-card :height="660" :width="510" :img="pics[i % 5]" tile>
                <v-layout class="pa-2 d-flex align-center flex-column mb-6">
                  <v-flex class="pa-3 mt-12 mb-4 level">
                    {{ task.level }}
                  </v-flex>
                  <v-flex class="pa-3 mt-1 adv-title">
                    {{ task.title }}
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
import router from "@/router.js";
import TeamDetailMenu from "../components/TeamDetailMenu";
import { getAllTasksInAdventure } from "@/apiCalls";
import { Carousel3d, Slide } from "vue-carousel-3d";

export default {
  components: {
    Carousel3d,
    Slide,
    TeamDetailMenu
  },
  mounted() {
    getAllTasksInAdventure(this.advId)
      .then(adv => {
        this.tasks = adv.tasks;
      })
      .catch(err => alert(err));
  },
  props: {
    advId: { type: String, required: true }
  },
  data: () => ({
    tasks: [],
    pics: [
      require("../assets/drone_1.png"),
      require("../assets/drone_2.png"),
      require("../assets/drone_3.png"),
      require("../assets/drone_4.png"),
      require("../assets/drone_5.png")
    ],
    router: router
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
