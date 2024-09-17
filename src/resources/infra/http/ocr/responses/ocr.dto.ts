interface ReceituarioAgronomico {
  nome_usuario: string;
  endereco_cidade_propriedade: string;
  cultura: string;
  numero_receita: string;
  data_emissao: string;
  nome_produto: string;
  dosagem: string;
  modalidade_aplicacao: string;
  formulacao: string;
  area_aplicada: string;
  classificacao_toxicologica: string;
  nome_engenheiro: string;
  assinatura: string;
}

interface RabTripulado {
  matricula_prefixo: string;
  operadores: string;
  cpf_cnpj_operadores: string;
  modelo: string;
  categoria_registro: string;
  validade_cva: string;
  situacao_aeronavegabilidade: string;
}

interface CertificadoSisantDrones {
  validade: string;
  numero_cadastro_prefixo: string;
  operador: string;
  cpf_cnpj_operador: string;
  modelo: string;
}

interface RelatorioOperacionalTripulado {
  prefixo_aeronave: string;
  area_tratada: string;
  cultura_tratada: string;
  nome_produto_aplicado: string;
  coordenada_geografica_area_aplicada: string;
  numero_receituario_agronomico: string;
  nome_contratante: string;
  cpf_cnpj_contratante: string;
  data_horario_aplicacao: string;
}

interface RelatorioDrone {
  coordenadas_geograficas_area_aplicada: string;
  cultura_tratada: string;
  area_tratada_hectares: string;
  nome_produto: string;
  prefixo_aeronave: string;
  data_horario_aplicacao: string;
  contratante_cpf_cnpj: string;
}

export interface OcrResponse {
  receituario_agronomico?: ReceituarioAgronomico;
  rab_tripulado?: RabTripulado;
  certificado_sisant_drones?: CertificadoSisantDrones;
  relatorio_operacional_tripulado?: RelatorioOperacionalTripulado;
  relatorio_drone?: RelatorioDrone;
}
