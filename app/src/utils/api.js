import config from '@/config/dot.env';
const url = process.env.VUE_APP_ENV === 'live' ? config.ULR_LIVE : 'http://127.0.0.1:3040';

const callAPI = async ({ endpoint }) => {
  const options = {
    method: 'get',
  };
  const response = await fetch(url + endpoint, options);
  const json = await response.json();
  return json;
};

export default callAPI;
