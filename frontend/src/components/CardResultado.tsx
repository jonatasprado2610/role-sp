
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { cores, fontes, tamanhos } from '../constants/theme';
import { Role } from '../data/roles';
import { formatarNota } from '../utils/formatacao';
import { ImagemRole } from './ImageRole';

type Props = {
  role: Role;
  onPress?: () => void;
};

export function CardResultado({ role, onPress }: Props) {
  const router = useRouter();

  return (
    <Pressable
      onPress={
        onPress ??
        (() =>
          router.push({
            pathname: '/detalhes/[id]',
            params: {
              id: String(role.id),
            },
          }))
      }
      accessibilityRole="button"
      accessibilityLabel={`${role.nome}, ${role.categoria}, ${role.regiao}, nota ${formatarNota(role.nota)}, ${role.preco}`}
      style={styles.card}
    >
      <ImagemRole imagem={role.imagem} largura={104} altura={150} raio={12} />

      <View style={styles.info}>
        <Text style={styles.categoria}>
          {role.categoria} · {role.regiao}
        </Text>

        <Text style={styles.nome} numberOfLines={2}>
          {role.nome}
        </Text>

        <View style={styles.nota}>
          <Ionicons name="star-outline" size={16} color={cores.texto} />
          <Text style={styles.notaTexto}>
            {formatarNota(role.nota)} · recentes
          </Text>
        </View>

        <Text style={styles.preco}>{role.preco}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 1,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 16,
    backgroundColor: cores.fundo,
  },
  info: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  categoria: {
    fontFamily: fontes.regular,
    fontSize: tamanhos.apoio,
    color: cores.textoSuave,
  },
  nome: {
    fontFamily: fontes.bold,
    fontSize: tamanhos.secao,
    color: cores.texto,
  },
  nota: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  notaTexto: {
    fontFamily: fontes.regular,
    fontSize: tamanhos.apoio,
    color: cores.texto,
  },
  preco: {
    fontFamily: fontes.semiBold,
    fontSize: tamanhos.corpo,
    color: cores.preco,
  },
});
