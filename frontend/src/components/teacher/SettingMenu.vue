<template>
  <div class="text-center">
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :nudge-width="100"
      offset-x
      offset-y
      slide-y
    >
      <template v-slot:activator="{ on }">
        <v-btn icon dark v-on="on">
          <v-icon>mdi-wrench</v-icon>
        </v-btn>
      </template>

      <v-card elevation="24">
        <v-list shaped>
          <v-list-item @click="logoutAllStudents">
            <v-list-item-icon>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-content>Logout All Students</v-list-item-content>
          </v-list-item>

          <v-list-item v-if="loginEnabled" @click="disableLogin">
            <v-list-item-icon>
              <v-icon>mdi-lock</v-icon>
            </v-list-item-icon>
            <v-list-item-content>Disable Login</v-list-item-content>
          </v-list-item>

          <v-list-item v-else @click="enableLogin">
            <v-list-item-icon>
              <v-icon>mdi-lock-open</v-icon>
            </v-list-item-icon>
            <v-list-item-content>Enable Login</v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-icon style="margin-top: 6px;">mdi-account-alert</v-icon>
            </v-list-item-icon>
            <v-list-item-content>Attention</v-list-item-content>
            <v-switch v-model="attentionOn" inset @change="updateAttention" />
          </v-list-item>

          <DroneSettings></DroneSettings>

          <AdvSettings></AdvSettings>
        </v-list>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import { socket } from "@/apiCalls";
import DroneSettings from "@/components/teacher/DroneSettings";
import AdvSettings from "@/components/teacher/AdvSettings";

export default {
  name: "SettingMenu",
  components: {
    DroneSettings,
    AdvSettings
  },
  data: () => ({
    on: true,
    menu: false,
    loginEnabled: true,
    attentionOn: false
  }),
  methods: {
    logoutAllStudents() {
      socket.emit("LOGOUT_ALL_STUDENTS");
    },
    disableLogin() {
      socket.emit("DISABLE_LOGIN");
      this.loginEnabled = false;
    },
    enableLogin() {
      socket.emit("ENABLE_LOGIN");
      this.loginEnabled = true;
    },
    updateAttention() {
      if (this.attentionOn) {
        socket.emit("ATTENTION_TURN_ON");
      } else {
        socket.emit("ATTENTION_TURN_OFF");
      }
    }
  },
  mounted() {
    socket.emit("LOGIN_STATUS");
    socket.on("LOGIN_ENABLED", () => {
      this.loginEnabled = true;
    });
    socket.on("LOGIN_DISABLED", () => {
      this.loginEnabled = false;
    });
  }
};
</script>

<style scoped></style>
