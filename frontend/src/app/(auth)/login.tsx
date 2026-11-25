
import { useState } from 'react';

import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Link, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Botao } from '@/components/Botao';
import { CampoTexto } from '@/components/Campo';
import { cores, fontes, tamanhos } from '@/constants/theme';
import { emailValido } from '@/utils/validacao';
import { loginUsuario, mensagemDeErro } from '@/services/auth';

type Erros = {
  email?: string;
  senha?: string;
};

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erros, setErros] = useState<Erros>({});
  const [erroGeral, setErroGeral] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function entrar() {
    setErroGeral('');

    const emailLimpo = email.trim().toLowerCase();
    const novosErros: Erros = {};

    if (!emailValido(emailLimpo)) {
      novosErros.email = 'Digite um e-mail válido.';
    }

    if (senha.length === 0) {
      novosErros.senha = 'Informe sua senha.';
    }

    setErros(novosErros);

    if (Object.keys(novosErros).length > 0) return;

    setCarregando(true);

    try {
      await loginUsuario({
        email: emailLimpo,
        senha,
      });

      router.replace('/explorar');

    } catch (erro) {
      setErroGeral(mensagemDeErro(erro));

    } finally {
      setCarregando(false);
    }
  }

  return (
    <SafeAreaView style={styles.tela}>
      <KeyboardAvoidingView
        style={styles.tela}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.conteudo}
          keyboardShouldPersistTaps="handled"
        >
          <Image
            source={require('../../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
            accessibilityLabel="Logo Rolê Sampa"
          />

          <Text style={styles.titulo}>Login</Text>

          <CampoTexto
            rotulo="E-mail"
            placeholder="seu@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            erro={erros.email}
          />

          <CampoTexto
            rotulo="Senha"
            placeholder="******"
            value={senha}
            onChangeText={setSenha}
            senha
            autoCapitalize="none"
            erro={erros.senha}
          />

          {erroGeral ? (
            <Text style={styles.erroGeral} accessibilityRole="alert">
              {erroGeral}
            </Text>
          ) : null}

          <View style={styles.acao}>
            <Botao
              titulo="Login"
              onPress={entrar}
              carregando={carregando}
            />
          </View>

          <View style={styles.rodape}>
            <Text style={styles.rodapeTexto}>
              Ainda não tem conta?{' '}
            </Text>

            <Link href="/cadastro" style={styles.link}>
              Cadastre-se
            </Link>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
  },

  conteudo: {
    padding: 24,
    paddingTop: 32,
  },

  logo: {
    width: 160,
    height: 160,
    alignSelf: 'center',
  },

  titulo: {
    fontFamily: fontes.bold,
    fontSize: tamanhos.secao,
    color: cores.texto,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 32,
  },

  acao: {
    marginTop: 8,
  },

  erroGeral: {
    fontFamily: fontes.semiBold,
    fontSize: tamanhos.corpo,
    color: cores.alerta,
    marginBottom: 12,
  },

  rodape: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },

  rodapeTexto: {
    fontFamily: fontes.regular,
    fontSize: tamanhos.corpo,
    color: cores.textoSuave,
  },

  link: {
    fontFamily: fontes.semiBold,
    fontSize: tamanhos.corpo,
    color: cores.primaria,
  },
});
