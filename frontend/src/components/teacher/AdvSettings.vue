<template>
  <v-list-item
    @click="
      show = true;
      getAdvs();
    "
  >
    <v-list-item-icon>
      <v-icon>mdi-settings</v-icon>
    </v-list-item-icon>
    <v-list-item-content>Task Settings</v-list-item-content>

    <v-dialog persistent v-model="show" max-width="900">
      <v-card v-if="show" :loading="loading">
        <v-card-title class="headline">
          Task Settings
          <v-spacer></v-spacer>
          <v-btn class="ma-1" @click="uploadTasksClick">
            <v-icon>mdi-upload</v-icon>Upload Config
          </v-btn>

          <input
            accept="application/json"
            type="file"
            style="display:none"
            @change="uploadTasks"
            ref="fileUpload"
          />
          <v-btn class="ma-1" @click="saveFile">
            <v-icon>mdi-download</v-icon>Download Config
          </v-btn>
        </v-card-title>

        <v-list v-if="!loading">
          <v-list-item v-for="adv in advs" :key="adv.key">
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <h3 v-if="!editAdvTitle[adv.key]">
                    {{ adv.level }} - {{ adv.title }}
                    <v-icon class="mx-2" @click="flipAdv(adv.key)">
                      mdi-pencil
                    </v-icon>
                    <v-icon class="mx-2" @click="delAdv(adv.key)">
                      mdi-delete
                    </v-icon>
                  </h3>
                  <v-row v-else>
                    <v-col cols="5">
                      <v-text-field
                        label="Level"
                        v-model="adv.level"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="1">
                      -
                    </v-col>
                    <v-col cols="5">
                      <v-text-field
                        label="Title"
                        v-model="adv.title"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="1">
                      <v-icon @click="flipAdv(adv.key)">
                        mdi-check
                      </v-icon>
                    </v-col>
                  </v-row>
                </v-list-item-content>
              </v-list-item>
              <v-list-item style="width: 860px">
                <v-list-item-content>
                  <v-slide-group show-arrows>
                    <v-slide-item v-for="task in adv.tasks" :key="task.key">
                      <TaskSettings
                        :task="task"
                        :advKey="adv.key"
                        :updateTask="updateTask"
                        :delTask="delTask"
                      ></TaskSettings>
                    </v-slide-item>
                    <v-slide-item>
                      <v-card
                        class="ma-3"
                        height="60"
                        @click="newTask(adv.key)"
                      >
                        <v-card-actions>
                          <span class="pa-1">
                            <v-icon large>mdi-plus-circle-outline</v-icon>
                          </span>
                        </v-card-actions>
                      </v-card>
                    </v-slide-item>
                  </v-slide-group>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-list-item>

          <v-list-item @click="newAdv">
            <v-list-item-content>
              <h3>New Adventure</h3>
              <span class="pa-1">
                <v-icon large>mdi-plus-circle-outline</v-icon>
              </span>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            :disabled="!updates"
            text
            @click="
              setAdvs();
              show = false;
              updates = false;
            "
          >
            Publish all changes
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="
              getAdvs();
              show = false;
              updates = false;
            "
          >
            Cancel changes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-list-item>
</template>

<script>
import { getAllAdventures, setAllAdventures } from "@/apiCalls";
import TaskSettings from "@/components/teacher/TaskSettings";

export default {
  components: { TaskSettings },
  data() {
    return {
      show: false,
      advs: [],
      updates: false,
      editAdvTitle: {},
      loading: false
    };
  },
  mounted() {
    this.getAdvs();
  },
  watch: {
    advs: {
      deep: true,
      handler(advs, oldAdvs) {
        if (advs.length != oldAdvs.length) {
          this.editAdvTitle = {};
          advs.forEach(adv => (this.editAdvTitle[adv.key] = false));
        }
      }
    }
  },
  methods: {
    delAdv(advKey) {
      this.updates = true;
      this.advs = this.advs.filter(adv => adv.key != advKey);
    },
    flipAdv(advKey) {
      this.updates = true;
      this.editAdvTitle[advKey] = !this.editAdvTitle[advKey];
      this.editAdvTitle = { ...this.editAdvTitle };
    },
    newTask(advKey) {
      const adv = this.advs.find(adv => adv.key === advKey);
      let NewTaskNumber;
      if (adv.tasks.length > 0) {
        const lastTaskKey = adv.tasks[adv.tasks.length - 1].key;
        NewTaskNumber = parseInt(lastTaskKey.substr(4), 10) + 1;
      } else {
        NewTaskNumber = 1;
      }
      const newKey = "task" + NewTaskNumber;
      const newLevel = "Level " + NewTaskNumber;
      this.updates = true;
      adv.tasks.push({
        level: newLevel,
        key: newKey,
        title: "New",
        summary: "",
        description: "",
        environments: [],
        requirements: []
      });
    },
    newAdv() {
      let newAdvKeyNumber;
      if (this.advs.length > 0) {
        const lastAdvKey = this.advs[this.advs.length - 1].key;
        newAdvKeyNumber = parseInt(lastAdvKey.substr(9), 10) + 1;
      } else {
        newAdvKeyNumber = 1;
      }
      const newKey = "adventure" + newAdvKeyNumber;
      const newLevel = "Adventure " + newAdvKeyNumber;
      this.updates = true;
      this.advs.push({
        key: newKey,
        level: newLevel,
        title: "New",
        tasks: []
      });
    },
    getAdvs() {
      this.loading = true;
      this.advs = [];
      getAllAdventures()
        .then(advs => {
          this.advs = advs;
          this.loading = false;
        })
        .catch(err => alert(err));
    },
    setAdvs() {
      setAllAdventures(this.advs)
        .then((this.show = false))
        .catch(err => alert(err));
    },
    updateTask(advKey, taskKey, internalTask) {
      this.updates = true;
      const adv = this.advs.find(adv => adv.key === advKey);
      const indexOfTask = adv.tasks.findIndex(task => task.key === taskKey);
      adv.tasks[indexOfTask] = JSON.parse(JSON.stringify(internalTask));
    },
    delTask(advKey, taskKey) {
      this.updates = true;
      const adv = this.advs.find(adv => adv.key === advKey);
      adv.tasks = adv.tasks.filter(task => task.key != taskKey);
    },
    saveFile: function() {
      // Download the advs data field
      const data = JSON.stringify(this.advs);
      const blob = new Blob([data], { type: "application/json" });
      const e = document.createEvent("MouseEvents"),
        a = document.createElement("a");
      a.download = "tasks.json";
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ["application/json", a.download, a.href].join(
        ":"
      );
      e.initEvent(
        "click",
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      );
      a.dispatchEvent(e);
    },
    uploadTasksClick() {
      this.$refs.fileUpload.click();
    },
    uploadTasks() {
      this.updates = true;
      this.loading = true;
      const file = this.$refs.fileUpload.files[0];
      const reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = evt => {
        this.advs = JSON.parse(evt.target.result);
        this.loading = false;
      };
    }
  }
};
</script>
