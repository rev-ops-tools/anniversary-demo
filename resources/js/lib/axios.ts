import axios from 'axios';

const baseURL =
    typeof document !== 'undefined'
        ? ''
        : (import.meta.env.VITE_APP_URL ?? 'http://localhost');

export const api = axios.create({
    baseURL,
    withCredentials: true,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
});
