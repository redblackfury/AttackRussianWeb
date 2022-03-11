<template>
  <div class="wrapper-content">
    <div class="wrapper-headline">
      {{ $t('address.__headline') }}
      <div @click="() => (showFirstPopup = true)" class="info-popup">?</div>
    </div>
    <div class="wrapper-section-1">
      <div class="section-name pt-5">
        {{ $t('address.__you_ip') }}
      </div>
      <div class="ipAddress-info">
        <div class="flag-ip">
          <div class="flag">
            <img
              v-if="state.country"
              :src="require(`@/assets/country/${state.country}.svg`)"
              :alt="state.country"
            />
            <Loader v-else />
          </div>
          <div class="ip">{{ state.ipAddress }}</div>
        </div>
        <div class="helper-info">
          <div v-if="state.country === 'UA'" class="helper__item">
            {{ $t('address.__helper_text_1') }}
            <div @click="() => (showSecondPopup = true)" class="info-popup">?</div>
          </div>
        </div>
      </div>
    </div>
    <div class="wrapper-section-2">
      <div class="section-name">{{ $t('address.__request_limit') }}</div>
      <div class="request-limit">
        <div class="change-limit">
          <div
            class="btn-limit btn-minus"
            @click="() => changeLimitRequestsPerSecond(-stepLimit)"
          ></div>
          <div class="current-limit">{{ state.limitRequestsPerSecond }}</div>
          <div
            class="btn-limit btn-plus"
            @click="() => changeLimitRequestsPerSecond(stepLimit)"
          ></div>
        </div>
        <div class="helper-info">
          <div class="helper__item">{{ $t('address.__helper_text_3') }}</div>
        </div>
      </div>
    </div>
    <div class="wrapper-section-3">
      <div class="section-name">{{ $t('address.__current_requests') }}</div>
      <div class="request-limit">
        <div class="change-limit">
          <div class="current-limit">{{ currentRPS }}</div>
        </div>
        <div class="helper-info">
          <div style="display: none" class="helper__item">{{ $t('address.__helper_text_4') }}</div>
          <div style="display: none" class="helper__item">{{ $t('address.__helper_text_5') }}</div>
        </div>
      </div>
    </div>
    <Popup
      v-if="showFirstPopup"
      :text="$t('address.__info_text_1')"
      @close="() => (showFirstPopup = false)"
    >
    </Popup>
    <Popup
      v-if="showSecondPopup"
      :text="$t('address.__info_text_2')"
      @close="() => (showSecondPopup = false)"
    >
    </Popup>
  </div>
</template>

<script>
import Loader from '@/components/Loader.vue';
import Popup from '@/components/Popup.vue';
import { state } from '@/utils/worker.js';

export default {
  components: {
    Loader,
    Popup,
  },
  computed: {},
  data() {
    return {
      currentRPS: 0,
      stepLimit: 100,
      maxLimit: 5000,
      showFirstPopup: false,
      showSecondPopup: false,
      state,
    };
  },
  mounted() {
    setInterval(() => {
      this.currentRPS = Math.ceil(state.totalRequests / ((+new Date() - state.startWorker) / 1000));
    }, 2000);
  },
  methods: {
    changeLimitRequestsPerSecond(value) {
      const tempData = state.limitRequestsPerSecond + value;
      if (tempData > this.maxLimit || tempData < 0) {
        return false;
      }
      state.changeLimit(tempData);
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper-headline {
  display: flex;
  justify-content: center;
  margin: 30px 0 10px 0;
  font-size: 16px;
  color: $textColor;
  position: relative;
}
.pt-5 {
  padding-top: 5px;
}
.wrapper-content {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
.wrapper-section {
  &-1,
  &-2,
  &-3 {
    width: 380px;
    margin-top: 25px;
    display: flex;
    gap: 10px;
  }
}

.section-name {
  width: 130px;
  min-width: 130px;
  max-width: 130px;
  font-size: 12px;
  text-align: end;
  color: $textColor;
  position: relative;
}
.ipAddress-info {
  display: flex;
  flex-direction: column;
}

.flag-ip {
  display: flex;
  align-items: center;
  .flag {
    width: 25px;
    height: 25px;
    margin-right: 5px;
    display: flex;
    align-items: center;
  }
  .ip {
    color: $textColor;
    font-size: 12px;
  }
}
.helper__item {
  font-size: 12px;
  margin-top: 5px;
  padding-left: 7px;
  position: relative;
  color: #bbb;
  max-width: 220px;
  &::after {
    content: '*';
    display: flex;
    position: absolute;
    color: $textColor;
    left: 0;
    top: 0;
  }
}
.change-limit {
  display: flex;
  align-items: center;
  gap: 10px;
}
.btn-limit {
  width: 15px;
  height: 15px;
  cursor: pointer;
  position: relative;
  &::after {
    content: '';
    display: flex;
    width: 100%;
    height: 3px;
    position: absolute;
    background: $clickableColor;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 2px;
  }
  &.btn-plus {
    &::before {
      content: '';
      display: flex;
      width: 100%;
      height: 3px;
      position: absolute;
      background: $clickableColor;
      top: 50%;
      transform: translateY(-50%) rotate(90deg);
      border-radius: 2px;
    }
  }
}
.current-limit {
  font-size: 12px;
  color: $textColor;
}
.info-popup {
  padding: 10px;
  position: absolute;
  right: -10px;
  top: -5px;
  font-size: 12px;
  color: $clickableColor;
  cursor: pointer;
}
.info-popup:hover {
  transform: scale(1.2);
}

</style>
