import axios from 'axios';
import { lerToken } from './sessao';

const baseURL = process.env.EXPO_PUBLIC_API_URL;

if (!baseURL) {
  console.warn('EXPO_PUBLIC_API_URL não definida. Confira o arquivo .env do frontend.');
}

export const api = axios.create({
  baseURL,
  timeout: 15000,
});

// anexa o token em toda chamada, quando a pessoa estiver logada
api.interceptors.request.use(async (config) => {
  const token = await lerToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});