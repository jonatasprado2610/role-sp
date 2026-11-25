import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Botao } from '../components/Botao';
import { CabecalhoVoltar } from '@/components/cabecalhoVoltar';
import { cores, fontes, tamanhos } from '@/constants/theme';

const SECOES = [
  {
    titulo: 'O que é público',
    texto: 'Nome público, nota, relato e data da visita aparecem junto da sua avaliação.',
  },
  {
    titulo: 'O que é privado',
    texto: 'Seu e-mail é usado para acessar a conta. Não será exibido nas avaliações.',
  },
  {
    titulo: 'Localização',
    texto: 'A busca funciona por região selecionada. Não exige acesso à localização do celular.',
  },
  {
    titulo: 'Controle dos dados',
    texto: 'No produto final, você poderá solicitar acesso, correção e exclusão dos dados.',
  },
];

export default function Privacidade() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.tela}>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <CabecalhoVoltar titulo="Privacidade e termos" onVoltar={() => router.back()} />

        <Text style={styles.titulo}>Seus dados, com clareza.</Text>

        {SECOES.map((secao) => (
          <View key={secao.titulo} style={styles.secao}>
            <Text style={styles.secaoTitulo}>{secao.titulo}</Text>
            <Text style={styles.secaoTexto}>{secao.texto}</Text>
          </View>
        ))}

        <Text style={styles.rascunho}>Rascunho para validação jurídica e técnica.</Text>
      </ScrollView>

      <View style={styles.rodape}>
        <Botao titulo="Voltar ao cadastro" variante="roxo" onPress={() => router.back()} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { paddingHorizontal: 24, paddingBottom: 24 },
  titulo: {
    fontFamily: fontes.bold,
    fontSize: tamanhos.titulo,
    lineHeight: 38,
    color: cores.texto,
    marginTop: 24,
    marginBottom: 8,
  },
  secao: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },
  secaoTitulo: {
    fontFamily: fontes.bold,
    fontSize: tamanhos.corpo + 2,
    color: cores.texto,
  },
  secaoTexto: {
    fontFamily: fontes.regular,
    fontSize: tamanhos.corpo,
    color: cores.textoSuave,
    marginTop: 6,
  },
  rascunho: {
    fontFamily: fontes.regular,
    fontSize: tamanhos.apoio,
    color: cores.textoSuave,
    marginTop: 24,
  },
  rodape: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: cores.borda,
  },
});