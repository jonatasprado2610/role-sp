// vai formatando enquanto a pessoa digita: 10052000 vira 10/05/2000
export function mascaraData(texto: string): string {
  const numeros = texto.replace(/\D/g, '').slice(0, 8);
  if (numeros.length <= 2) return numeros;
  if (numeros.length <= 4) return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
  return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4)}`;
}

// "10/05/2000" vira "2000-05-10" (ou null se a data não existir)
export function dataBrParaIso(texto: string): string | null {
  const partes = texto.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!partes) return null;

  const [, dia, mes, ano] = partes;
  const data = new Date(Number(ano), Number(mes) - 1, Number(dia));

  const existe =
    Number(ano) >= 1900 &&
    data.getFullYear() === Number(ano) &&
    data.getMonth() === Number(mes) - 1 &&
    data.getDate() === Number(dia);

  return existe ? `${ano}-${mes}-${dia}` : null;
}

export function maiorDeIdade(dataIso: string, idadeMinima = 18): boolean {
  const [ano, mes, dia] = dataIso.split('-').map(Number);
  const hoje = new Date();

  let idade = hoje.getFullYear() - ano;
  const jaFezAniversario =
    hoje.getMonth() + 1 > mes || (hoje.getMonth() + 1 === mes && hoje.getDate() >= dia);

  if (!jaFezAniversario) idade--;

  return idade >= idadeMinima;
}