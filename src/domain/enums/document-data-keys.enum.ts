import { ApplicationDocumentType } from './application-document-type.enum';

export const ReceituarioAgronomico = [
  'nome_usuario',
  'endereco_cidade_propriedade',
  'cultura',
  'numero_receita',
  'data_emissao',
  'nome_produto',
  'dosagem',
  'modalidade_aplicacao',
  'formulacao',
  'area_aplicada',
  'classificacao_toxicologica',
  'nome_engenheiro',
  'assinatura',
];

export const RabTripulado = [
  'matricula_prefixo',
  'operadores',
  'cpf_cnpj_operadores',
  'modelo',
  'categoria_registro',
  'validade_cva',
  'situacao_aeronavegabilidade',
];

export const CertificadoSisantDrones = [
  'validade',
  'numero_cadastro_prefixo',
  'operador',
  'cpf_cnpj_operador',
  'modelo',
];

export const RelatorioOperacionalTripulado = [
  'prefixo_aeronave',
  'area_tratada',
  'cultura_tratada',
  'nome_produto_aplicado',
  'coordenada_geografica_area_aplicada',
  'numero_receituario_agronomico',
  'nome_contratante',
  'cpf_cnpj_contratante',
  'data_horario_aplicacao',
];

export const RelatorioDrone = [
  'coordenadas_geograficas_area_aplicada',
  'cultura_tratada',
  'area_tratada_hectares',
  'nome_produto',
  'prefixo_aeronave',
  'data_horario_aplicacao',
  'contratante_cpf_cnpj',
];

export const DocumentKeysEnum = {
  [ApplicationDocumentType.RA]: ReceituarioAgronomico,
  [ApplicationDocumentType.RO]: RelatorioOperacionalTripulado,
};
