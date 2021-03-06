import { reactive } from 'vue';

const state = reactive({
  totalRequests: 0,
  limitRequestsPerSecond: 300,
  country: 'UA',
  ipAddress: '0.0.0.0',
  tasks: [],
  weight: [],
  startWorker: undefined,
  userAgents: '',
  log: {},
  startApp: new Date(),
  currentRPS: 0,
  changeLimit(value) {
    this.limitRequestsPerSecond = value;
  },
  setCountry(isoCode) {
    this.country = isoCode;
  },
  setIpAddress(ip) {
    this.ipAddress = ip;
  },
  setTasks(data) {
    this.tasks = data.filter((x) => {
      if (!x.enabled) {
        return false;
      }
      if (this.country === 'UA' && !x.uaAllowed) {
        return false;
      }
      return true;
    });
    this.weight = this.tasks.map((x) => x.weight || 0.5);

    this.log = data.reduce((acc, item) => {
      if (!Object.keys(acc).includes(item._id)) {
        return {
          ...acc,
          [item._id]: {
            host: item.host,
            proto: item.proto,
            startAttack: new Date(),
            lastAttack: undefined,
            count: 0,
          },
        };
      } else {
        return acc;
      } 
    }, this.log);
  },
  setUserAgents(data) {
    this.userAgents = data[Math.floor(Math.random() * data.length)].string;
  },
});

window.stt = state;

export default state;
