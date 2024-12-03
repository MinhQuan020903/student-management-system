import axios from 'axios';

const config = {
  baseURL:
    process.env.API_HOST ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'http://localhost:3000',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

const axiosClient = axios.create(config);

axiosClient.interceptors.response.use(
  (res: any) => Promise.resolve(res.data),
  async (err: any) => {
    // const originalRequest = err.config;
    // console.log('err.response.status', err.response.status, err.config.__isRetryRequest);

    if (
      err &&
      err.response &&
      err.response.status === 401 &&
      !err.config.__isRetryRequest
    ) {
    }
    return Promise.reject(((err || {}).response || {}).data);
  }
);

export default axiosClient;
