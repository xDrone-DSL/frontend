<template>
  <div>
    <v-card class="ma-3" height="60" @click="show = true">
      <v-card-title primary-title>
        {{ internalTask.level }} - {{ internalTask.title }}
      </v-card-title>
    </v-card>
    <v-dialog persistent v-model="show" max-width="930">
      <v-card>
        <v-card-title class="headline">
          Modify task
        </v-card-title>
        <v-row class="ma-2">
          <v-col>
            <v-text-field
              v-model="internalTask.level"
              label="Level"
            ></v-text-field>
            <v-text-field
              v-model="internalTask.key"
              disabled
              label="Key"
            ></v-text-field>
            <v-text-field
              v-model="internalTask.title"
              label="Title"
            ></v-text-field>
            <v-textarea
              v-model="internalTask.summary"
              label="Summary"
            ></v-textarea>
            <v-textarea
              auto-grow
              v-model="internalTask.description"
              label="Description"
            ></v-textarea>
          </v-col>
          <v-col>
            <v-card height="380">
              <v-card-title primary-title>
                Simulator
              </v-card-title>
              <v-card-text>
                <Simulator
                  v-if="sim"
                  :demo="true"
                  :animation="[]"
                  :environments="internalTask.environments"
                ></Simulator>
              </v-card-text>
            </v-card>
            <v-row wrap>
              <v-col
                cols="6"
                v-for="(environment, i) in internalTask.environments"
                :key="i"
              >
                <v-card height="300">
                  <v-card-text class="pb-1">
                    <v-select
                      :items="models"
                      v-model="environment.object"
                      label="Model"
                    ></v-select>
                    <v-row wrap>
                      <v-col class="py-1" cols="6">
                        <v-text-field
                          v-model="environment.position.x"
                          label="X"
                          type="number"
                        ></v-text-field>
                      </v-col>
                      <v-col class="py-1" cols="6">
                        <v-text-field
                          v-model="environment.position.y"
                          label="Y"
                          type="number"
                        ></v-text-field>
                      </v-col>

                      <v-col class="py-1" cols="6">
                        <v-text-field
                          v-model="environment.rotation"
                          label="Rotation"
                          type="number"
                        ></v-text-field>
                      </v-col>
                      <v-col class="py-1" cols="6">
                        <v-text-field
                          v-model="environment.scale"
                          label="Scale"
                          type="number"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="error"
                      text
                      @click="internalTask.environments.pop(i)"
                    >
                      Delete
                      <v-icon>
                        mdi-delete
                      </v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
              <v-col cols="6">
                <v-card height="300" @click="newObject()">
                  <v-layout
                    class="justify-center align-center"
                    style="height:100%"
                  >
                    <v-flex>
                      <v-icon class="ma-auto" x-large>
                        mdi-plus-circle-outline
                      </v-icon>
                    </v-flex>
                  </v-layout>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-card-actions>
          <v-btn
            color="error"
            @click="
              delTask(advKey, task.key);
              show = false;
            "
          >
            Delete Task
            <v-icon class="mx-2">
              mdi-delete
            </v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="
              updateTask(advKey, task.key, internalTask);
              show = false;
            "
          >
            <div v-if="JSON.stringify(task) != JSON.stringify(internalTask)">
              Save Locally and Close
            </div>
            <div v-else>Close</div>
          </v-btn>
          <v-btn
            v-if="JSON.stringify(task) != JSON.stringify(internalTask)"
            color="primary"
            text
            @click="
              show = false;
              internalTask = JSON.parse(JSON.stringify(task));
            "
          >
            Undo all changes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Simulator from "@/components/Simulator";

export default {
  components: { Simulator },
  props: {
    task: { type: Object, required: true },
    advKey: { type: String, required: true },
    updateTask: { type: Function, required: true },
    delTask: { type: Function, required: true }
  },
  data() {
    return {
      sim: true,
      show: false,
      internalTask: {},
      models: ["house", "forest", "fireStation", "barn", "warehouse", "fire"]
    };
  },
  watch: {
    internalTask: {
      deep: true,
      handler() {
        this.sim = false;
        setTimeout(() => {
          this.sim = true;
        }, 1000);
      }
    }
  },
  mounted() {
    this.internalTask = JSON.parse(JSON.stringify(this.task));
  },
  methods: {
    newObject() {
      this.internalTask.environments.push({
        object: "house",
        position: {
          x: 0,
          y: 0
        },
        rotation: 0,
        scale: 1
      });
    }
  }
};
</script>
