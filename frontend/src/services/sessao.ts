
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export type Usuario = {
  id: number;
  nome: string;
  email: string;
  tipo: string;
};

const CHAVE_TOKEN = 'rolesp.token';
const CHAVE_USUARIO = 'rolesp.usuario';

export async function salvarSessao(token: string, usuario: Usuario) {
  if (Platform.OS === 'web') {
    localStorage.setItem(CHAVE_TOKEN, token);
    localStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuario));
    return;
  }

  await SecureStore.setItemAsync(CHAVE_TOKEN, token);
  await SecureStore.setItemAsync(CHAVE_USUARIO, JSON.stringify(usuario));
}

export async function lerToken(): Promise<string | null> {
  if (Platform.OS === 'web') {
    return localStorage.getItem(CHAVE_TOKEN);
  }

  return SecureStore.getItemAsync(CHAVE_TOKEN);
}

export async function limparSessao() {
  if (Platform.OS === 'web') {
    localStorage.removeItem(CHAVE_TOKEN);
    localStorage.removeItem(CHAVE_USUARIO);
    return;
  }

  await SecureStore.deleteItemAsync(CHAVE_TOKEN);
  await SecureStore.deleteItemAsync(CHAVE_USUARIO);
}
