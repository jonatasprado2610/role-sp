
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { buscarLocalPorId } from '@/services/locais';
import { RoleDetalhe } from '@/data/roleDetalhe';

const ROXO = '#9900AA';
const ROSA = '#B51B60';
const TEXTO = '#26312B';
const SUAVE = '#68736C';
const BORDA = '#DFE5DF';
const FUNDO = '#F1F5F0';

export default function InformacoesRole() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [local, setLocal] = useState<RoleDetalhe | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function carregar() {
      try {
        setCarregando(true);
        const dados = await buscarLocalPorId(id);
        setLocal(dados);
      } catch {
        setErro('Não foi possível carregar as informações.');
      } finally {
        setCarregando(false);
      }
    }

    if (id) carregar();
  }, [id]);

  if (carregando) {
    return (
      <SafeAreaView style={styles.centro}>
        <ActivityIndicator size="large" color={ROXO} />
        <Text style={styles.suave}>Carregando informações...</Text>
      </SafeAreaView>
    );
  }

  if (!local) {
    return (
      <SafeAreaView style={styles.centro}>
        <Text style={styles.titulo}>
          {erro || 'Estabelecimento não encontrado.'}
        </Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.link}>Voltar</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const endereco = local.endereco;
  const acessibilidade = local.acessibilidade;

  const enderecoCompleto =
    `${endereco.logradouro}, ${endereco.numero}, ${endereco.bairro}, ${endereco.cidade} - ${endereco.estado}`;

  async function abrirMaps() {
    const { latitude, longitude } = endereco;

    const destino =
      latitude !== null && longitude !== null
        ? `${latitude},${longitude}`
        : enderecoCompleto;

    const url =
      `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destino)}`;

    await Linking.openURL(url);
  }

  const itens = [
    {
      icone: '♙',
      titulo: 'Acesso sem degraus',
      detalhe: 'Acesso por rampa',
      disponivel: acessibilidade?.rampaAcesso,
    },
    {
      icone: '♧',
      titulo: 'Banheiro adaptado',
      detalhe: 'Banheiro com acessibilidade',
      disponivel: acessibilidade?.banheiroAdaptado,
    },
    {
      icone: 'P',
      titulo: 'Estacionamento',
      detalhe: 'Estacionamento disponível',
      disponivel: acessibilidade?.estacionamento,
    },
    {
      icone: '❄',
      titulo: 'Ar-condicionado',
      detalhe: 'Ambiente climatizado',
      disponivel: acessibilidade?.arCondicionado,
    },
    {
      icone: 'Wi',
      titulo: 'Wi-Fi gratuito',
      detalhe: 'Acesso à internet',
      disponivel: acessibilidade?.wifiGratis,
    },
    {
      icone: '✓',
      titulo: 'Segurança',
      detalhe: 'Estrutura de segurança informada',
      disponivel: acessibilidade?.seguranca,
    },
  ];

  return (
    <SafeAreaView style={styles.tela}>
      <ScrollView
        contentContainerStyle={styles.conteudo}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cabecalho}>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.voltar}>‹</Text>
          </Pressable>

          <Text style={styles.tituloCabecalho}>
            Antes de sair
          </Text>
        </View>

        <Text style={styles.nome}>{local.nome}</Text>

        <View style={styles.cardEndereco}>
          <Text style={styles.icone}>⌖</Text>

          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitulo}>Localização</Text>
            <Text style={styles.endereco}>
              {endereco.logradouro}, {endereco.numero}
            </Text>
            <Text style={styles.endereco}>
              {endereco.bairro} · {endereco.cidade}
            </Text>
            <Text style={styles.endereco}>
              {endereco.estado} · CEP {endereco.cep}
            </Text>
          </View>
        </View>

        <Pressable
          style={styles.botaoMaps}
          onPress={abrirMaps}
        >
          <Text style={styles.botaoTexto}>
            Abrir orientações de chegada
          </Text>
        </Pressable>

        <View style={styles.divisor} />

        <Text style={styles.subtitulo}>
          Acessibilidade e estrutura
        </Text>

        {!acessibilidade ? (
          <Text style={styles.suave}>
            Informações de acessibilidade ainda não cadastradas.
          </Text>
        ) : (
          itens.map((item) => (
            <View key={item.titulo} style={styles.item}>
              <Text style={styles.iconeItem}>
                {item.icone}
              </Text>

              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitulo}>
                  {item.titulo}
                </Text>

                <Text style={styles.itemDetalhe}>
                  {item.disponivel
                    ? item.detalhe
                    : 'Não disponível ou não informado'}
                </Text>
              </View>

              <Text style={{
                color: item.disponivel ? '#397447' : SUAVE,
                fontWeight: 'bold',
              }}>
                {item.disponivel ? '✓' : '—'}
              </Text>
            </View>
          ))
        )}

        <View style={styles.divisor} />

        <Text style={styles.subtitulo}>
          Horários de funcionamento
        </Text>

        {local.horarios.length === 0 ? (
          <Text style={styles.suave}>
            Horários não informados.
          </Text>
        ) : (
          local.horarios.map((horario, index) => (
            <View key={index} style={styles.horario}>
              <Text style={styles.itemTitulo}>
                {horario.diaSemana}
              </Text>

              <Text style={styles.itemDetalhe}>
                {horario.abertura.slice(0, 5)} às{' '}
                {horario.fechamento.slice(0, 5)}
              </Text>
            </View>
          ))
        )}

        <View style={styles.divisor} />

        <Text style={styles.subtitulo}>
          Cuidados no passeio
        </Text>

        <Text style={styles.cuidado}>
          Confira as informações do estabelecimento antes
          de sair. Horários, serviços e condições de acesso
          podem sofrer alterações.
        </Text>

        <View style={styles.aviso}>
          <Text style={styles.avisoTexto}>
            As informações de estrutura são baseadas nos
            dados cadastrados. Confirme detalhes com o
            estabelecimento quando necessário.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.rodape}>
        <Pressable
          style={styles.botaoVoltar}
          onPress={() => router.back()}
        >
          <Text style={styles.botaoTexto}>
            Voltar ao rolê
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: '#FFFFFF' },
  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    padding: 24,
  },
  conteudo: { paddingHorizontal: 22, paddingBottom: 24 },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginVertical: 20,
  },
  voltar: { fontSize: 34, color: TEXTO },
  tituloCabecalho: {
    fontSize: 19,
    fontWeight: 'bold',
    color: TEXTO,
  },
  titulo: { fontSize: 18, fontWeight: 'bold', color: TEXTO },
  nome: {
    fontSize: 22,
    fontWeight: 'bold',
    color: TEXTO,
    marginTop: 12,
    marginBottom: 12,
  },
  cardEndereco: {
    flexDirection: 'row',
    gap: 14,
    padding: 17,
    backgroundColor: FUNDO,
    borderRadius: 10,
  },
  icone: { fontSize: 26, color: TEXTO },
  cardTitulo: {
    fontWeight: 'bold',
    color: TEXTO,
    fontSize: 14,
    marginBottom: 9,
  },
  endereco: {
    color: TEXTO,
    fontSize: 13,
    marginBottom: 5,
  },
  botaoMaps: {
    backgroundColor: ROSA,
    borderRadius: 9,
    padding: 15,
    alignItems: 'center',
    marginTop: 16,
  },
  botaoTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  divisor: {
    height: 1,
    backgroundColor: BORDA,
    marginVertical: 23,
  },
  subtitulo: {
    fontSize: 17,
    fontWeight: 'bold',
    color: TEXTO,
    marginBottom: 15,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
  },
  iconeItem: {
    fontSize: 22,
    width: 30,
    color: TEXTO,
    textAlign: 'center',
  },
  itemTitulo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: TEXTO,
  },
  itemDetalhe: {
    fontSize: 12,
    color: SUAVE,
    marginTop: 5,
  },
  horario: {
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: BORDA,
  },
  cuidado: {
    fontSize: 14,
    color: TEXTO,
    lineHeight: 22,
  },
  aviso: {
    backgroundColor: '#F2DDFB',
    borderRadius: 9,
    padding: 15,
    marginTop: 20,
  },
  avisoTexto: {
    color: TEXTO,
    fontSize: 12,
    lineHeight: 19,
  },
  rodape: {
    paddingHorizontal: 22,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: BORDA,
  },
  botaoVoltar: {
    backgroundColor: ROXO,
    padding: 15,
    borderRadius: 9,
    alignItems: 'center',
  },
  suave: { color: SUAVE, fontSize: 13 },
  link: { color: ROXO, fontWeight: 'bold' },
});
