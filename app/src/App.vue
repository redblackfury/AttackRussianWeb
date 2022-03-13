<template>
  <div class="main-container">
    <Header />
    <Content />
    <div class="git" @click="openWebsite">
      <img src="@/assets/git.svg" alt="git" />
      Website
    </div>
  </div>
</template>

<script>
import Header from '@/elements/Header.vue';
import Content from '@/elements/Content.vue';
import api from '@/utils/api.js';
import { state, startWorker } from '@/utils/worker.js';
import { appWindow } from '@tauri-apps/api/window'
import humanFormat from 'human-format';


export default {
  components: {
    Header,
    Content,
  },
  mounted() {
    this.initConnection();
    console.log('humanFormat(1337)', humanFormat(1337));
    console.log('humanFormat(133132137)', humanFormat(133132137));
    console.log('humanFormat(321)', humanFormat(321));


  },
  methods: {
    nextUpdate() {
      setTimeout(() => {
        this.initConnection();
      }, 60_000 * 20);
    },
    openWebsite() {
      appWindow.emit('open-website');
    },
    async initConnection() {
      const data = await api({ endpoint: '/get_targets/' });
      state.setIpAddress(data.ip);
      state.setCountry(data.countryISO);
      state.setTasks(data.result);
      startWorker();
      this.nextUpdate();
    },
  },
};
</script>

<style lang="scss">
.main-container {
  padding: 5px 10px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #c00000 0%, #000000 100%);
  display: flex;
  flex-direction: column;
}
.git {
  cursor: pointer;
  position: absolute;
  bottom: 15px;
  right: 15px;
  color: $clickableColor;
  font-size: 12px;
  display: flex;
  align-items: center;
  img {
    margin-right: 5px;
  }
}
</style>
