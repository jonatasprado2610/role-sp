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
import { Botao } from '../../components/Botao';
import { CaixaAceite } from '../../components/CaixaAceite';
import { CampoTexto } from '@/components/Campo';
import { cores, fontes, tamanhos } from '../../constants/theme';
import { cadastrarUsuario, mensagemDeErro } from '../../services/auth';
import { dataBrParaIso, maiorDeIdade, mascaraData } from '../../utils/data';
import { emailValido } from '../../utils/validacao';

type Erros = {
  email?: string;
  nome?: string;
  dataNascimento?: string;
  senha?: string;
  termos?: string;
};

export default function Cadastro() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [senha, setSenha] = useState('');
  const [aceitou, setAceitou] = useState(false);
  const [erros, setErros] = useState<Erros>({});
  const [erroGeral, setErroGeral] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function cadastrar() {
    setErroGeral('');

    const emailLimpo = email.trim().toLowerCase();
    const dataIso = dataBrParaIso(dataNascimento);
    const novosErros: Erros = {};

    if (!emailValido(emailLimpo)) novosErros.email = 'Digite um e-mail válido.';
    if (nome.trim().length < 2) novosErros.nome = 'Digite seu nome.';

    if (!dataIso) {
      novosErros.dataNascimento = 'Digite uma data válida (dd/mm/aaaa).';
    } else if (!maiorDeIdade(dataIso)) {
      novosErros.dataNascimento = 'É preciso ter 18 anos ou mais.';
    }

    if (senha.length < 8) novosErros.senha = 'A senha deve ter pelo menos 8 caracteres.';
    if (!aceitou) novosErros.termos = 'É preciso aceitar os termos para criar a conta.';

    setErros(novosErros);
    if (Object.keys(novosErros).length > 0 || !dataIso) return;

    setCarregando(true);
    try {
      await cadastrarUsuario({
        nome: nome.trim(),
        email: emailLimpo,
        senha,
        dataNascimento: dataIso,
        aceiteTermos: true,
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

          <Text style={styles.titulo}>Cadastro</Text>

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
            rotulo="Nome"
            placeholder="Digite seu nome"
            value={nome}
            onChangeText={setNome}
            autoCapitalize="words"
            autoComplete="name"
            maxLength={100}
            erro={erros.nome}
          />

          <CampoTexto
            rotulo="Data de nascimento"
            placeholder="dd/mm/aaaa"
            value={dataNascimento}
            onChangeText={(texto) => setDataNascimento(mascaraData(texto))}
            keyboardType="number-pad"
            maxLength={10}
            erro={erros.dataNascimento}
          />

          <CampoTexto
            rotulo="Senha"
            placeholder="Mínimo de 8 caracteres"
            value={senha}
            onChangeText={setSenha}
            senha
            autoCapitalize="none"
            maxLength={72}
            erro={erros.senha}
          />

          <CaixaAceite
            marcado={aceitou}
            onAlternar={() => setAceitou((valor) => !valor)}
            onAbrirTermos={() => router.push('/privacidade')}
            erro={erros.termos}
          />

          {erroGeral ? (
            <Text style={styles.erroGeral} accessibilityRole="alert">
              {erroGeral}
            </Text>
          ) : null}

          <Botao titulo="Cadastro" onPress={cadastrar} carregando={carregando} />

          <View style={styles.rodape}>
            <Text style={styles.rodapeTexto}>Já tem conta? </Text>
            <Link href="/login" style={styles.link}>
              Entrar
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: 24, paddingTop: 32 },
  logo: { width: 160, height: 160, alignSelf: 'center' },
  titulo: {
    fontFamily: fontes.bold,
    fontSize: tamanhos.secao,
    color: cores.texto,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  erroGeral: {
    fontFamily: fontes.semiBold,
    fontSize: tamanhos.corpo,
    color: cores.alerta,
    marginBottom: 12,
  },
  rodape: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
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