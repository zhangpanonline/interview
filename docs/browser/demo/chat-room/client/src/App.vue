
<template>
  <ChatWindow :users="users" :history="history" :me="me" @chat="onChat" />
</template>
<script>
import { io } from "socket.io-client";
import ChatWindow from "./ChatWindow.vue";
export default {
  components: { ChatWindow },
  data() {
    return {
      users: [],
      history: [],
      me: "",
      socket: io("ws://localhost:9528"),
    };
  },
  created() {
    this.socket.on("$updateUser", (users) => {
      this.users = users;
    });
    this.socket.on("$name", (me) => {
      this.me = me;
    });
    this.socket.on("$history", (history) => {
      this.history = history;
    });
    this.socket.on("$message", (content) => {
      this.history.push(content);
    });
  },
  unmounted() {
    this.socket.close();
  },
  methods: {
    onChat({ name, content, date }) {
      this.history.push({ name, content, date });
      this.socket.emit("$message", content);
    },
  },
};
</script>
