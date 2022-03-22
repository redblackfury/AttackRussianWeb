<template>
  <div class="log-wrapper">
    <div class="log__items">
      <div class="help__button">
        <!-- <div @click="getActualLogs" class="btn__refresh">
          <img src="@/assets/refresh.svg" alt="" />
        </div> -->
        <div>
          <span @click="$emit('close')" class="close"></span>
        </div>
      </div>
      <div class="headline">{{ $t('log.__websites_attack') }}</div>
      <div class="table-wrapper">
        <table class="table-logs">
          <tr class="header">
            <th class="column-name host-name">{{ $t('log.__target_host') }}</th>
            <th class="column-name">{{ $t('log.__protocol') }}</th>
            <th class="column-name">{{ $t('log.__first_attack') }}</th>
            <th class="column-name">{{ $t('log.__last_attack') }}</th>
            <th class="column-name">{{ $t('log.__requests_count') }}</th>
          </tr>
          <tr v-for="item in arrayLogs" :key="`log-${item._id}`">
            <td
              @click="
                () => {
                  openWebsite(`${item.proto}://${item.host}`);
                }
              "
              class="host-link"
            >
              {{ item.host }}
            </td>
            <td class="protocol">{{ { http: 80, https: 443 }[item.proto] }}/{{ item.proto }}</td>
            <td class="first-attack">{{ getTimeFormat(item.startAttack) }}</td>
            <td class="last-attack">{{ getTimeFormat(item.lastAttack) }}</td>
            <td class="count-request">{{ getNumberFormat(item.count) }}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import state from '@/utils/state';
import { humanNumberFormat, humanTimeFormat } from '@/utils/helper';
import { invoke } from '@tauri-apps/api/tauri';

export default {
  data() {
    return {
      currentLog: [],
    };
  },
  computed: {
    arrayLogs() {
      return Object.keys(this.currentLog).reduce((acc, item) => {
        return [...acc, { ...this.currentLog[item] }];
      }, []);
    },
  },
  mounted() {
    this.getActualLogs();
  },
  methods: {
    getActualLogs() {
      this.currentLog = { ...state.log };
    },
    getNumberFormat(value) {
      return humanNumberFormat(value);
    },
    getTimeFormat(value) {
      return humanTimeFormat(value);
    },
    openWebsite(website) {
      invoke('open_website', { link: website });
    },
  },
};
</script>

<style lang="scss" scoped>
.log-wrapper {
  position: absolute;
  right: 0;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 9;
}
.help__button {
  position: absolute;
  top: 10px;
  right: 18px;
  display: flex;
  align-items: center;
}
.close {
  width: 17px;
  height: 17px;
  position: relative;
  margin-left: 10px;
  padding: 10px;
  cursor: pointer;
  &::after,
  &::before {
    content: '';
    position: absolute;
    width: 3px;
    height: 17px;
    background: $clickableColor;
  }
  &::after {
    transform: rotate(45deg);
  }
  &::before {
    transform: rotate(-45deg);
  }
}

.log__items {
  width: 100%;
  position: absolute;
  right: 0;
  background: $logColor;
  top: 0;
  bottom: 0;
  box-sizing: border-box;
  padding: 10px 10px 10px 0;
  height: 100%;
  box-shadow: 0px 0px 10px 0px #000000;
}
.headline {
  font-size: 12px;
  color: $textColor;
  margin-bottom: 10px;
  margin-left: 15px;
}
.table-wrapper {
  width: 100%;
  max-height: 330px;
  overflow-y: scroll;
  margin-top: 20px;
  box-sizing: border-box;
  &::-webkit-scrollbar {
    width: 6px;
    border-radius: 3px;
  }
  &::-webkit-scrollbar-track {
    border-radius: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: $textColor !important;
    &:hover {
      background: $textColor !important;
    }
  }
}
.table-logs {
  border-spacing: 15px 5px;
  th,
  td {
    font-size: 12px;
    white-space: nowrap;
    box-sizing: border-box;
  }
}

.column-name {
  text-align: left;
  color: $textColor;
}
.host {
  $widthColumnName: 100px;
  &-name {
    width: $widthColumnName;
    max-width: $widthColumnName;
  }
  &-link {
    color: $clickableColor;
    cursor: pointer;
    max-width: $widthColumnName;
    width: $widthColumnName;
    padding-right: 10px;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.protocol,
.first-attack,
.last-attack,
.count-request {
  color: $textColor;
  text-align: right;
}
.btn__refresh {
  cursor: pointer;
}
</style>
