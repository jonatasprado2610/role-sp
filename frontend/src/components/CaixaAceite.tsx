import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cores, fontes, tamanhos } from '../constants/theme';

type Props = {
  marcado: boolean;
  onAlternar: () => void;
  onAbrirTermos: () => void;
  erro?: string;
};

export function CaixaAceite({ marcado, onAlternar, onAbrirTermos, erro }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.linha}>
        <Pressable
          onPress={onAlternar}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: marcado }}
          accessibilityLabel="Aceitar os termos de uso e privacidade"
          style={styles.caixa}
        >
          <Ionicons
            name={marcado ? 'checkbox' : 'square-outline'}
            size={28}
            color={marcado ? cores.primaria : cores.textoSuave}
          />
        </Pressable>

        <Text style={styles.texto}>
          Li e aceito os{' '}
          <Text style={styles.link} onPress={onAbrirTermos} accessibilityRole="link">
            termos de uso e privacidade
          </Text>
          .
        </Text>
      </View>

      {erro ? <Text style={styles.erro}>{erro}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  linha: { flexDirection: 'row', alignItems: 'center' },
  caixa: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginLeft: -8 },
  texto: {
    flex: 1,
    fontFamily: fontes.regular,
    fontSize: tamanhos.corpo,
    color: cores.texto,
  },
  link: { fontFamily: fontes.semiBold, color: cores.primaria },
  erro: {
    fontFamily: fontes.regular,
    fontSize: tamanhos.apoio,
    color: cores.alerta,
    marginTop: 4,
  },
});