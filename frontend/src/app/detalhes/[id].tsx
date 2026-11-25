
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

// Cores
const ROXO = '#B51B60';
const TEXTO = '#26312B';
const SUAVE = '#68736C';
const BORDA = '#DFE5DF';
const FUNDO = '#F1F5F0';

export default function DetalhesRole() {
    const router = useRouter();

    const { id } = useLocalSearchParams<{ id: string }>();

    // Estados
    const [local, setLocal] = useState<RoleDetalhe | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');


    function voltarTela() {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/buscar');
        }
    }

    // Busca os detalhes do estabelecimento
    useEffect(() => {
        let ativo = true;

        async function carregar() {
            if (!id) {
                setErro('Identificador do rolê não informado.');
                setCarregando(false);
                return;
            }

            try {
                setCarregando(true);
                setErro('');
                setLocal(null);

                const dados = await buscarLocalPorId(id);

                if (!dados) {
                    throw new Error('Estabelecimento não encontrado.');
                }

                if (ativo) {
                    setLocal(dados);
                }
            } catch (error) {
                console.error('Erro ao carregar detalhes:', error);

                if (ativo) {
                    setErro(
                        error instanceof Error
                            ? error.message
                            : 'Não foi possível carregar os detalhes do rolê.'
                    );

                    setLocal(null);
                }
            } finally {
                if (ativo) {
                    setCarregando(false);
                }
            }
        }

        carregar();

        return () => {
            ativo = false;
        };
    }, [id]);

    // Carregamento
    if (carregando) {
        return (
            <SafeAreaView style={styles.centro}>
                <ActivityIndicator size="large" color={ROXO} />

                <Text style={styles.suave}>
                    Carregando rolê...
                </Text>
            </SafeAreaView>
        );
    }

    // Erro ou estabelecimento não encontrado
    if (!local) {
        return (
            <SafeAreaView style={styles.centro}>
                <Text style={styles.titulo}>
                    {erro || 'Rolê não encontrado.'}
                </Text>

                <Pressable onPress={() => router.back()}>
                    <Text style={styles.link}>Voltar</Text>
                </Pressable>
            </SafeAreaView>
        );
    }

    // Referência segura dos dados após verificar que local existe
    const dadosLocal = local;

    // Informações do estabelecimento
    const localId = dadosLocal.id;
    const site = dadosLocal.site;

    const endereco = dadosLocal.endereco;
    const preco = dadosLocal.preco;

    const categorias = dadosLocal.categorias ?? [];
    const horarios = dadosLocal.horarios ?? [];
    const avaliacoes = dadosLocal.avaliacoes ?? [];

    const categoria = categorias.join(' · ');

    const bairro = endereco?.bairro ?? '';
    const cidade = endereco?.cidade ?? '';

    const precoDescricao =
        preco?.descricao ?? 'Preço não informado';

    const precoEstimado =
        preco?.valorEstimado ?? '';

    // Formatação dos horários
    const horarioTexto = horarios.length > 0
        ? horarios.map((h) =>
            `${h.diaSemana}: ${h.abertura.slice(0, 5)}–${h.fechamento.slice(0, 5)}`
        ).join('\n')
        : 'Horários não informados';

    // Verifica se o rolê é gratuito
    const precoGratuito =
        precoDescricao.toLowerCase() === 'gratuito';

    // Data de atualização
    const data = dadosLocal.atualizadoEm
        ? new Date(dadosLocal.atualizadoEm)
        : null;

    const dataAtualizacao =
        data && !isNaN(data.getTime())
            ? data.toLocaleDateString('pt-BR')
            : null;

    // Navegação para informações
    function abrirInformacoes() {
        router.push({
            pathname: '/informacoes/[id]',
            params: {
                id: String(localId),
            },
        });
    }

    // Abre o site oficial
    async function abrirSite() {
        if (!site) return;

        try {
            await Linking.openURL(site);
        } catch (error) {
            console.error('Erro ao abrir site:', error);
        }
    }

    return (
        <SafeAreaView style={styles.tela}>
            <ScrollView showsVerticalScrollIndicator={false}>

                {/* Imagem e botão voltar */}
                <View style={styles.imagem}>
                    <Pressable
                        style={styles.voltar}
                        onPress={voltarTela}
                        hitSlop={10}
                    >
                        <Text style={styles.iconeVoltar}>‹</Text>
                    </Pressable>

                    <Text style={styles.placeholder}>◇</Text>

                    <Text style={styles.imagemTexto}>
                        Imagem não disponível
                    </Text>

                    <View style={styles.tag}>
                        <Text style={styles.tagTexto}>
                            {categoria || 'Rolê'}
                        </Text>
                    </View>
                </View>

                {/* Conteúdo */}
                <View style={styles.conteudo}>

                    {/* Nome e localização */}
                    <Text style={styles.nome}>
                        {dadosLocal.nome}
                    </Text>

                    <Text style={styles.suave}>
                        {bairro} · {cidade}
                    </Text>

                    {/* Avaliação */}
                    <View style={styles.avaliacao}>
                        <Text style={styles.estrelas}>☆</Text>

                        <Text style={styles.nota}>
                            {dadosLocal.notaMedia?.toFixed(1) ?? '—'}
                        </Text>

                        <Text style={styles.suave}>
                            {dadosLocal.totalAvaliacoes ?? 0} avaliações
                        </Text>
                    </View>

                    <View style={styles.divisor} />

                    {/* Preço e horários */}
                    <View style={styles.informacoes}>

                        <View style={styles.coluna}>
                            <Text
                                style={[
                                    styles.valor,
                                    precoGratuito && styles.gratuito,
                                ]}
                            >
                                {precoDescricao}
                            </Text>

                            <Text style={styles.suave}>
                                {precoEstimado}
                            </Text>
                        </View>

                        <View style={styles.coluna}>
                            <Text style={styles.valor}>
                                Horários
                            </Text>

                            <Text style={styles.suave}>
                                {horarioTexto}
                            </Text>
                        </View>

                    </View>

                    {/* Descrição */}
                    <Text style={styles.subtitulo}>
                        Sobre o estabelecimento
                    </Text>

                    <Text style={styles.descricao}>
                        {dadosLocal.comoChegar ||
                            `Conheça ${dadosLocal.nome}, localizado em ${bairro}, São Paulo.`}
                    </Text>

                    {/* Atualização */}
                    {dataAtualizacao && (
                        <Text style={styles.atualizacao}>
                            Informações atualizadas em {dataAtualizacao}
                        </Text>
                    )}

                    {/* Como chegar */}
                    <Pressable
                        style={styles.botaoInformacoes}
                        onPress={abrirInformacoes}
                    >
                        <Text style={styles.botaoIcone}>⌖</Text>

                        <View style={{ flex: 1 }}>
                            <Text style={styles.botaoTitulo}>
                                Como chegar e estrutura
                            </Text>

                            <Text style={styles.botaoSubtitulo}>
                                Endereço e informações práticas
                            </Text>
                        </View>

                        <Text style={styles.seta}>→</Text>
                    </Pressable>

                    <View style={styles.divisor} />

                    {/* Avaliações recentes */}
                    <Text style={styles.subtitulo}>
                        Avaliações recentes
                    </Text>

                    {avaliacoes.length === 0 ? (
                        <Text style={styles.suave}>
                            Este estabelecimento ainda não possui avaliações.
                        </Text>
                    ) : (
                        avaliacoes.map((avaliacao) => (
                            <View
                                key={avaliacao.id}
                                style={styles.cardAvaliacao}
                            >
                                <Text style={styles.nomeUsuario}>
                                    {avaliacao.nomeUsuario}
                                </Text>

                                <Text style={styles.notaAvaliacao}>
                                    ★ {avaliacao.nota}/5
                                </Text>

                                <Text style={styles.descricao}>
                                    {avaliacao.comentario || 'Sem comentário.'}
                                </Text>
                            </View>
                        ))
                    )}

                    {/* Site oficial */}
                    {site && (
                        <Pressable onPress={abrirSite}>
                            <Text style={styles.link}>
                                Visitar site oficial
                            </Text>
                        </Pressable>
                    )}

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

// Estilização
const styles = StyleSheet.create({
    tela: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },

    centro: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        backgroundColor: '#FFFFFF',
        padding: 24,
    },

    imagem: {
        height: 240,
        backgroundColor: '#E9E0EF',
        justifyContent: 'center',
        alignItems: 'center',
    },

    voltar: {
        position: 'absolute',
        top: 14,
        left: 16,
        zIndex: 2,
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },

    iconeVoltar: {
        fontSize: 34,
        color: TEXTO,
        lineHeight: 38,
    },

    placeholder: {
        fontSize: 55,
        color: '#8D149E',
    },

    imagemTexto: {
        color: SUAVE,
        fontSize: 13,
    },

    tag: {
        position: 'absolute',
        bottom: 14,
        left: 20,
        backgroundColor: ROXO,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 7,
    },

    tagTexto: {
        color: '#FFFFFF',
        fontWeight: '600',
    },

    conteudo: {
        padding: 22,
        paddingBottom: 40,
    },

    nome: {
        fontSize: 25,
        fontWeight: 'bold',
        color: TEXTO,
    },

    titulo: {
        fontSize: 18,
        fontWeight: 'bold',
        color: TEXTO,
    },

    suave: {
        color: SUAVE,
        fontSize: 13,
        marginTop: 5,
    },

    avaliacao: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 9,
        marginTop: 14,
    },

    estrelas: {
        fontSize: 25,
        color: TEXTO,
    },

    nota: {
        fontSize: 16,
        fontWeight: 'bold',
        color: TEXTO,
    },

    divisor: {
        height: 1,
        backgroundColor: BORDA,
        marginVertical: 22,
    },

    informacoes: {
        flexDirection: 'row',
        gap: 20,
        justifyContent: 'space-between',
    },

    coluna: {
        flex: 1,
    },

    valor: {
        fontSize: 19,
        fontWeight: 'bold',
        color: TEXTO,
    },

    gratuito: {
        color: '#397447',
    },

    subtitulo: {
        fontSize: 17,
        fontWeight: 'bold',
        color: TEXTO,
        marginTop: 22,
        marginBottom: 10,
    },

    descricao: {
        fontSize: 14,
        color: TEXTO,
        lineHeight: 21,
    },

    atualizacao: {
        color: SUAVE,
        fontSize: 11,
        marginTop: 16,
    },

    botaoInformacoes: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: FUNDO,
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
        gap: 12,
    },

    botaoIcone: {
        fontSize: 28,
        color: TEXTO,
    },

    botaoTitulo: {
        fontWeight: 'bold',
        color: TEXTO,
        fontSize: 14,
    },

    botaoSubtitulo: {
        color: SUAVE,
        fontSize: 11,
        marginTop: 4,
    },

    seta: {
        fontSize: 23,
        color: TEXTO,
    },

    cardAvaliacao: {
        borderBottomWidth: 1,
        borderBottomColor: BORDA,
        paddingVertical: 14,
        gap: 5,
    },

    nomeUsuario: {
        fontWeight: 'bold',
        color: TEXTO,
    },

    notaAvaliacao: {
        color: '#B57A19',
        fontWeight: 'bold',
    },

    link: {
        color: ROXO,
        fontWeight: 'bold',
        marginTop: 20,
    },
});
