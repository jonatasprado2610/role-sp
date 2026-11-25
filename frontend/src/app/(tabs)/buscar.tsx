
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Botao } from '../../components/Botao';
import { CardResultado } from '../../components/CardResultado';
import { ChipFiltro } from '../../components/ChipFiltro';

import { cores, fontes, tamanhos } from '../../constants/theme';
import { CATEGORIAS, PRECOS, REGIOES } from '../../constants/filtros';

import { buscarLocais } from '../../services/locais';
import { Role } from '../../data/roles';

import { filtrarRoles } from '../../utils/filtrarRoles';
import { lerParametro } from '../../utils/parametros';

const VALORES_PRECO = PRECOS.map((item) => item.valor);

export default function Buscar() {
  const router = useRouter();

  // Dados recebidos da API
  const [roles, setRoles] = useState<Role[]>([]);

  // Estados da tela
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  // Parâmetros recebidos pela navegação
  const params = useLocalSearchParams<{
    categoria?: string;
    regiao?: string;
    preco?: string;
  }>();

  // Texto digitado na busca
  const [consulta, setConsulta] = useState('');

  // Filtros selecionados
  const categoria = lerParametro(
    params.categoria,
    CATEGORIAS,
    'Todas'
  );

  const regiao = lerParametro(
    params.regiao,
    REGIOES,
    'Todas as regiões'
  );

  const preco = lerParametro(
    params.preco,
    VALORES_PRECO,
    'qualquer'
  );

  // Carrega os locais diretamente da API
  useEffect(() => {
    async function carregarLocais() {
      try {
        setCarregando(true);
        setErro(false);

        const dados = await buscarLocais();

        setRoles(dados);
      } catch (error) {
        console.error('Erro ao carregar locais:', error);
        setErro(true);
      } finally {
        setCarregando(false);
      }
    }

    carregarLocais();
  }, []);

  // Aplica os filtros aos dados recebidos da API
  const resultados = useMemo(() => {
    return filtrarRoles(roles, {
      categoria,
      regiao,
      preco,
      consulta,
    });
  }, [roles, categoria, regiao, preco, consulta]);

  const quantidade = resultados.length;

  const textoQuantidade = `${quantidade} ${
    quantidade === 1 ? 'opção' : 'opções'
  } · São Paulo`;

  const rotuloPreco =
    PRECOS.find((item) => item.valor === preco)?.rotulo ?? 'Preço';

  // Abre a tela de filtros
  function abrirFiltros() {
    router.push({
      pathname: '/filtros',
      params: {
        categoria,
        regiao,
        preco,
      },
    });
  }

  // Define o título da listagem
  function montarTitulo(): string {
    if (preco === 'ate50') return 'Rolês até R$ 50';

    if (preco === 'gratuito') return 'Rolês gratuitos';

    if (categoria !== 'Todas') return categoria;

    return 'Todos os rolês';
  }

  // Estado de carregamento
  function renderCarregando() {
    return (
      <View style={styles.estado}>
        <ActivityIndicator size="large" color={cores.primaria} />

        <Text style={styles.estadoTexto}>
          Buscando rolês...
        </Text>
      </View>
    );
  }

  // Estado de erro
  function renderErro() {
    return (
      <View style={styles.vazio}>
        <View style={styles.vazioIcone}>
          <Ionicons
            name="cloud-offline-outline"
            size={26}
            color={cores.primaria}
          />
        </View>

        <Text style={styles.vazioTitulo}>
          Não foi possível carregar os rolês.
        </Text>

        <Text style={styles.vazioTexto}>
          Verifique sua conexão e tente novamente.
        </Text>

        <Botao
          titulo="Tentar novamente"
          onPress={() => {
            setCarregando(true);
            setErro(false);

            buscarLocais()
              .then(setRoles)
              .catch((error) => {
                console.error('Erro ao carregar locais:', error);
                setErro(true);
              })
              .finally(() => setCarregando(false));
          }}
        />
      </View>
    );
  }

  // Estado sem resultados
  function renderVazio() {
    return (
      <View style={styles.vazio}>
        <View style={styles.vazioIcone}>
          <Ionicons
            name="search-outline"
            size={26}
            color={cores.primaria}
          />
        </View>

        <Text style={styles.vazioTitulo}>
          Ainda não achamos esse rolê.
        </Text>

        <Text style={styles.vazioTexto}>
          Experimente outra região ou ajuste a faixa de preço.
        </Text>

        <Botao
          titulo="Ajustar filtros"
          onPress={abrirFiltros}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.tela} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.conteudo}
        keyboardShouldPersistTaps="handled"
      >
        {/* Cabeçalho */}
        <View style={styles.cabecalho}>
          <Pressable
            onPress={() => router.navigate('/explorar')}
            accessibilityRole="button"
            accessibilityLabel="Voltar para Explorar"
            style={styles.voltar}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color={cores.texto}
            />
          </Pressable>

          <Text style={styles.cabecalhoTitulo}>
            Encontre seu rolê
          </Text>
        </View>

        {/* Campo de busca */}
        <View style={styles.busca}>
          <Ionicons
            name="search-outline"
            size={22}
            color={cores.textoSuave}
          />

          <TextInput
            style={styles.buscaInput}
            placeholder="Lugar, evento ou bairro"
            placeholderTextColor={cores.textoSuave}
            value={consulta}
            onChangeText={setConsulta}
            returnKeyType="search"
            accessibilityLabel="Buscar lugar, evento ou bairro"
          />
        </View>

        {/* Filtros rápidos */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          <ChipFiltro
            rotulo={
              categoria === 'Todas' ? 'Categorias' : categoria
            }
            ativo={categoria !== 'Todas'}
            onPress={abrirFiltros}
          />

          <ChipFiltro
            rotulo={
              regiao === 'Todas as regiões' ? 'Região' : regiao
            }
            ativo={regiao !== 'Todas as regiões'}
            onPress={abrirFiltros}
          />

          <ChipFiltro
            rotulo={
              preco === 'qualquer' ? 'Preço' : rotuloPreco
            }
            ativo={preco !== 'qualquer'}
            onPress={abrirFiltros}
          />
        </ScrollView>

        {/* Título e quantidade */}
        <View style={styles.tituloLinha}>
          <View style={styles.tituloTextos}>
            <Text style={styles.titulo}>
              {montarTitulo()}
            </Text>

            <Text style={styles.quantidade}>
              {carregando ? 'Carregando opções...' : textoQuantidade}
            </Text>
          </View>

          <Pressable
            onPress={abrirFiltros}
            accessibilityRole="button"
            accessibilityLabel="Abrir filtros"
            style={styles.botaoFiltro}
          >
            <Ionicons
              name="options-outline"
              size={22}
              color={cores.texto}
            />
          </Pressable>
        </View>

        {/* Resultados */}
        {carregando ? (
          renderCarregando()
        ) : erro ? (
          renderErro()
        ) : quantidade > 0 ? (
          <>
            {resultados.map((role) => (
              <CardResultado
                key={role.id}
                role={role}
              />
            ))}

            <Text style={styles.decidir}>
              Quer decidir com calma?
            </Text>

            <Botao
              titulo="Comparar opções"
              onPress={() => router.navigate('/comparar')}
            />
          </>
        ) : (
          renderVazio()
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
  },

  conteudo: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },

  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginLeft: -8,
  },

  voltar: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cabecalhoTitulo: {
    fontFamily: fontes.semiBold,
    fontSize: tamanhos.secao,
    color: cores.texto,
    marginLeft: 4,
  },

  busca: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 12,
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 12,
  },

  buscaInput: {
    flex: 1,
    fontFamily: fontes.regular,
    fontSize: tamanhos.corpo,
    color: cores.texto,
  },

  chips: {
    gap: 8,
    paddingVertical: 16,
  },

  tituloLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 16,
  },

  tituloTextos: {
    flex: 1,
  },

  titulo: {
    fontFamily: fontes.bold,
    fontSize: tamanhos.secao,
    color: cores.texto,
  },

  quantidade: {
    fontFamily: fontes.regular,
    fontSize: tamanhos.corpo,
    color: cores.textoSuave,
    marginTop: 2,
  },

  botaoFiltro: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  decidir: {
    fontFamily: fontes.semiBold,
    fontSize: tamanhos.corpo,
    color: cores.texto,
    marginTop: 8,
    marginBottom: 12,
  },

  estado: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },

  estadoTexto: {
    fontFamily: fontes.regular,
    fontSize: tamanhos.corpo,
    color: cores.textoSuave,
    marginTop: 12,
  },

  vazio: {
    marginTop: 24,
  },

  vazioIcone: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: cores.primariaClara,
    alignItems: 'center',
    justifyContent: 'center',
  },

  vazioTitulo: {
    fontFamily: fontes.bold,
    fontSize: tamanhos.titulo,
    lineHeight: 38,
    color: cores.texto,
    marginTop: 24,
  },

  vazioTexto: {
    fontFamily: fontes.regular,
    fontSize: tamanhos.corpo,
    color: cores.textoSuave,
    marginTop: 8,
    marginBottom: 24,
  },
});
