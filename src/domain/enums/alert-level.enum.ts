export enum AlertLevelEnum {
  GRAVISSIMO = 'GRAVISSIMO',
  GRAVE = 'GRAVE',
  MODERADO = 'MODERADO',
  LEVE = 'LEVE',
}

export const AlertLevelEnumDescription: { [key in AlertLevelEnum]: string } = {
  [AlertLevelEnum.GRAVISSIMO]: 'Nível gravíssimo',
  [AlertLevelEnum.GRAVE]: 'Nível grave',
  [AlertLevelEnum.MODERADO]: 'Nível moderado',
  [AlertLevelEnum.LEVE]: 'Nível leve',
};
