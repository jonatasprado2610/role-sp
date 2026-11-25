import { ReactNode, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Botao } from '../components/Botao';
import { CabecalhoVoltar } from '@/components/cabecalhoVoltar';
import { ChipFiltro } from '../components/ChipFiltro';
import { CATEGORIAS, PRECOS, REGIOES } from '../constants/filtros';
import { cores, fontes, tamanhos } from '../constants/theme';
import { lerParametro } from '../utils/parametros';


const VALORES_PRECO = PRECOS.map((item) => item.valor);

type SecaoProps = {
  titulo: string;
  subtitulo?: string;
  children: ReactNode;
};

function Secao({ titulo, subtitulo, children }: SecaoProps) {
  return (
    <View>
      <Text style={styles.secaoTitulo}>{titulo}</Text>
      {subtitulo ? <Text style={styles.secaoSubtitulo}>{subtitulo}</Text> : null}
      <View style={styles.chips}>{children}</View>
    </View>
  );
}

export default function Filtros() {
  const router = useRouter();
  const params = useLocalSearchParams<{ categoria?: string; regiao?: string; preco?: string }>();

  const [categoria, setCategoria] = useState(lerParametro(params.categoria, CATEGORIAS, 'Todas'));
  const [regiao, setRegiao] = useState(lerParametro(params.regiao, REGIOES, 'Todas as regiões'));
  const [preco, setPreco] = useState(lerParametro(params.preco, VALORES_PRECO, 'qualquer'));

  function limpar() {
    setCategoria('Todas');
    setRegiao('Todas as regiões');
    setPreco('qualquer');
  }

  return (
    <SafeAreaView style={styles.tela}>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <CabecalhoVoltar titulo="Refine seu rolê" onVoltar={() => router.back()} />

        <View style={styles.bloco}>
          <Secao titulo="Categoria">
            {CATEGORIAS.map((item) => (
              <ChipFiltro
                key={item}
                rotulo={item}
                ativo={categoria === item}
                onPress={() => setCategoria(item)}
              />
            ))}
          </Secao>
        </View>

        <View style={styles.divisor} />

        <Secao titulo="Região de São Paulo" subtitulo="Escolha onde você quer explorar">
          {REGIOES.map((item) => (
            <ChipFiltro
              key={item}
              rotulo={item}
              ativo={regiao === item}
              onPress={() => setRegiao(item)}
            />
          ))}
        </Secao>

        <View style={styles.divisor} />

        <Secao titulo="Quanto quer gastar?" subtitulo="Valor por pessoa · entrada ou consumo">
          {PRECOS.map((item) => (
            <ChipFiltro
              key={item.valor}
              rotulo={item.rotulo}
              ativo={preco === item.valor}
              onPress={() => setPreco(item.valor)}
            />
          ))}
        </Secao>

        <View style={styles.limpar}>
          <Botao titulo="Limpar filtros" variante="contorno" onPress={limpar} />
        </View>
      </ScrollView>

      <View style={styles.rodape}>

        <Botao
          titulo="Ver opções"
          variante="roxo"
          onPress={() =>
            router.replace({
              pathname: '/buscar',
              params: {
                categoria,
                regiao,
                preco,
              },
            })
          }
        />

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { paddingHorizontal: 24, paddingBottom: 24 },
  bloco: { marginTop: 24 },
  secaoTitulo: {
    fontFamily: fontes.bold,
    fontSize: tamanhos.secao,
    color: cores.texto,
  },
  secaoSubtitulo: {
    fontFamily: fontes.regular,
    fontSize: tamanhos.corpo,
    color: cores.textoSuave,
    marginTop: 2,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 },
  divisor: { height: 1, backgroundColor: cores.borda, marginVertical: 24 },
  limpar: { marginTop: 32 },
  rodape: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: cores.borda,
    backgroundColor: cores.fundo,
  },
});