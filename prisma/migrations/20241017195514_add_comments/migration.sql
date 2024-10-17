-- This is an empty migration.
COMMENT ON TABLE "S_USUARIO" IS 'Armazena informações sobre os usuários.';
COMMENT ON TABLE "S_ORGANIZACAO" IS 'Armazena informações sobre as organizações.';
COMMENT ON TABLE "S_USUARIO_ORGANIZACAO" IS 'Tabela que relaciona usuários e organizações, indicando a participação de um usuário em uma organização.';
COMMENT ON TABLE "S_PILOTO" IS 'Armazena informações sobre os pilotos.';
COMMENT ON TABLE "S_APLICACAO" IS 'Armazena informações sobre as aplicações de uma organização.';
COMMENT ON TABLE "H_EVENTO_APLICACAO" IS 'Armazena eventos de atualização relacionados a aplicações.';
COMMENT ON TABLE "S_STATUS_APLICACAO" IS 'Armazena os diferentes status que uma aplicação pode ter.';
COMMENT ON TABLE "S_DOCUMENTO_APLICACAO" IS 'Armazena documentos associados às aplicações.';
COMMENT ON TABLE "S_DOCUMENTO_DADOS_APLICACAO" IS 'Armazena os diferentes tipos de documentos que podem ser associados às aplicações.';
COMMENT ON TABLE "S_AREA_APLICACAO" IS 'Armazena informações sobre áreas de aplicação.';
COMMENT ON TABLE "S_ANALISE_APLICACAO" IS 'Armazena as análises realizadas sobre uma aplicação a fim de auditoria.';
COMMENT ON TABLE "S_TIPO_ANALISE_APLICACAO" IS 'Armazena os diferentes tipos de análises que podem ser realizadas sobre as aplicações.';
COMMENT ON TABLE "S_NOTIFICACAO_APLICACAO" IS 'Armazena notificações relacionadas a um aplicação caso alguma analise tenha falhado.';
COMMENT ON TABLE "H_EVENTO_NOTIFICACAO" IS 'Armazena eventos relacionados às notificações de uma aplicação';
COMMENT ON TABLE "S_STATUS_NOTIFICACAO" IS 'Armazena os diferentes status que uma notificação pode ter.';
COMMENT ON TABLE "S_AREA_PROTEGIDA" IS 'Armazena informações sobre áreas protegidas.';
COMMENT ON TABLE "S_TIPO_AREA_PROTEGIDA" IS 'Armazena os diferentes tipos de áreas protegidas.';
COMMENT ON TABLE "S_DOCUMENTO_DADOS_APLICACAO" IS 'Tabela que armazena dados relacionados a documentos de aplicação.';
COMMENT ON TABLE "S_CAMINHO_APLICACAO" IS 'Armazena informações sobre áreas de aplicação.';

COMMENT ON COLUMN "S_USUARIO"."ID_USUARIO" IS 'ID do usuário';
COMMENT ON COLUMN "S_USUARIO"."NM_USUARIO" IS 'Nome do usuário';
COMMENT ON COLUMN "S_USUARIO"."DS_EMAIL" IS 'Email do usuário';
COMMENT ON COLUMN "S_USUARIO"."DS_DOCUMENTO" IS 'Documento do usuário (CPF/CNPJ)';
COMMENT ON COLUMN "S_USUARIO"."CS_STATUS" IS 'Status do usuário';
COMMENT ON COLUMN "S_USUARIO"."DH_CRIACAO" IS 'Data de criação do usuário';

COMMENT ON COLUMN "S_ORGANIZACAO"."ID_ORGANIZACAO" IS 'ID da organização';
COMMENT ON COLUMN "S_ORGANIZACAO"."NM_ORGANIZACAO" IS 'Nome da organização';
COMMENT ON COLUMN "S_ORGANIZACAO"."DH_CRIACAO" IS 'Data de criação da organização';

COMMENT ON COLUMN "S_USUARIO_ORGANIZACAO"."ID_USUARIO" IS 'ID do usuário';
COMMENT ON COLUMN "S_USUARIO_ORGANIZACAO"."ID_ORGANIZACAO" IS 'ID da organização';
COMMENT ON COLUMN "S_USUARIO_ORGANIZACAO"."ST_ATIVO" IS 'Indica se a relação está ativa';
COMMENT ON COLUMN "S_USUARIO_ORGANIZACAO"."NM_ATUALIZADO_POR" IS 'Usuário que atualizou a relação';
COMMENT ON COLUMN "S_USUARIO_ORGANIZACAO"."NM_CRIADO_POR" IS 'Usuário que criou a relação';
COMMENT ON COLUMN "S_USUARIO_ORGANIZACAO"."DH_ATUALIZACAO" IS 'Data da última atualização';
COMMENT ON COLUMN "S_USUARIO_ORGANIZACAO"."DH_CRIACAO" IS 'Data de criação da relação';

COMMENT ON COLUMN "S_PILOTO"."ID_PILOTO" IS 'ID do piloto';
COMMENT ON COLUMN "S_PILOTO"."ID_ORGANIZACAO" IS 'ID da organização do piloto';
COMMENT ON COLUMN "S_PILOTO"."NM_PILOTO" IS 'Nome do piloto';
COMMENT ON COLUMN "S_PILOTO"."NR_DOCUMENTO" IS 'Documento do piloto';
COMMENT ON COLUMN "S_PILOTO"."NR_LICENCA" IS 'Número da licença do piloto';
COMMENT ON COLUMN "S_PILOTO"."DH_CRIACAO" IS 'Data de criação do piloto';

COMMENT ON COLUMN "S_APLICACAO"."ID_APLICACAO" IS 'ID da aplicação';
COMMENT ON COLUMN "S_APLICACAO"."ID_USUARIO" IS 'ID do usuário associado à aplicação';
COMMENT ON COLUMN "S_APLICACAO"."ID_ORGANIZACAO" IS 'ID da organização associada à aplicação';
COMMENT ON COLUMN "S_APLICACAO"."NM_VEICULO" IS 'Nome do veículo relacionado à aplicação';
COMMENT ON COLUMN "S_APLICACAO"."DH_INICIO" IS 'Data de início da aplicação';
COMMENT ON COLUMN "S_APLICACAO"."DH_FIM" IS 'Data de fim da aplicação';
COMMENT ON COLUMN "S_APLICACAO"."NM_CRIADO_POR" IS 'Usuário que criou a aplicação';
COMMENT ON COLUMN "S_APLICACAO"."DH_CRIACAO" IS 'Data de criação da aplicação';

COMMENT ON COLUMN "H_EVENTO_APLICACAO"."ID_EVENTO_APLICACAO" IS 'ID do evento da aplicação';
COMMENT ON COLUMN "H_EVENTO_APLICACAO"."ID_APLICACAO" IS 'ID da aplicação associada ao evento';
COMMENT ON COLUMN "H_EVENTO_APLICACAO"."ID_STATUS_APLICACAO" IS 'ID do status da aplicação';
COMMENT ON COLUMN "H_EVENTO_APLICACAO"."ID_PILOTO" IS 'ID do piloto associado ao evento';
COMMENT ON COLUMN "H_EVENTO_APLICACAO"."NM_CRIADO_POR" IS 'Usuário que criou o evento';
COMMENT ON COLUMN "H_EVENTO_APLICACAO"."DH_CRIACAO" IS 'Data de criação do evento';

COMMENT ON COLUMN "S_STATUS_APLICACAO"."ID_STATUS_APLICACAO" IS 'ID do status da aplicação';
COMMENT ON COLUMN "S_STATUS_APLICACAO"."DS_DESCRICAO" IS 'Descrição do status da aplicação';
COMMENT ON COLUMN "S_STATUS_APLICACAO"."ST_ATIVO" IS 'Indica se o status está ativo';
COMMENT ON COLUMN "S_STATUS_APLICACAO"."DH_CRIACAO" IS 'Data de criação do status da aplicação';

COMMENT ON COLUMN "S_DOCUMENTO_APLICACAO"."ID_DOCUMENTO_APLICACAO" IS 'ID do documento da aplicação';
COMMENT ON COLUMN "S_DOCUMENTO_APLICACAO"."ID_APLICACAO" IS 'ID da aplicação associada ao documento';
COMMENT ON COLUMN "S_DOCUMENTO_APLICACAO"."ID_TIPO_DOCUMENTO_APLICACAO" IS 'ID do tipo do documento da aplicação';
COMMENT ON COLUMN "S_DOCUMENTO_APLICACAO"."NM_NOME_ORIGINAL" IS 'Nome original do documento';
COMMENT ON COLUMN "S_DOCUMENTO_APLICACAO"."DS_CAMINHO" IS 'Caminho do documento armazenado';

COMMENT ON COLUMN "S_DOCUMENTO_DADOS_APLICACAO"."ID_DOCUMENTO_DADOS" IS 'ID dos dados do documento da aplicação';
COMMENT ON COLUMN "S_DOCUMENTO_DADOS_APLICACAO"."ID_DOCUMENTO_APLICACAO" IS 'ID do documento da aplicação associado aos dados';
COMMENT ON COLUMN "S_DOCUMENTO_DADOS_APLICACAO"."DS_CHAVE" IS 'Chave dos dados do documento';
COMMENT ON COLUMN "S_DOCUMENTO_DADOS_APLICACAO"."DS_VALOR" IS 'Valor associado à chave dos dados do documento';
COMMENT ON COLUMN "S_DOCUMENTO_DADOS_APLICACAO"."ID_CRIADO_POR" IS 'ID do usuário que criou os dados';
COMMENT ON COLUMN "S_DOCUMENTO_DADOS_APLICACAO"."DH_CRIACAO" IS 'Data de criação dos dados do documento';

COMMENT ON COLUMN "S_TIPO_DOCUMENTO_APLICACAO"."ID_TIPO_DOCUMENTO_APLICACAO" IS 'ID do tipo de documento da aplicação';
COMMENT ON COLUMN "S_TIPO_DOCUMENTO_APLICACAO"."DS_DESCRICAO" IS 'Descrição do tipo de documento da aplicação';
COMMENT ON COLUMN "S_TIPO_DOCUMENTO_APLICACAO"."ST_ATIVO" IS 'Indica se o tipo de documento está ativo';
COMMENT ON COLUMN "S_TIPO_DOCUMENTO_APLICACAO"."DH_CRIACAO" IS 'Data de criação do tipo de documento da aplicação';

COMMENT ON COLUMN "S_AREA_APLICACAO"."ID_AREA_APLICACAO" IS 'ID da área da aplicação';
COMMENT ON COLUMN "S_AREA_APLICACAO"."GEOMETRIA" IS 'Geometria da área da aplicação';
COMMENT ON COLUMN "S_AREA_APLICACAO"."GEOMETRIA_JSON" IS 'Representação em JSON da geometria da área da aplicação';
COMMENT ON COLUMN "S_AREA_APLICACAO"."DS_DESCRICAO" IS 'Descrição da área da aplicação';
COMMENT ON COLUMN "S_AREA_APLICACAO"."ID_APLICACAO" IS 'ID da aplicação associada à área';
COMMENT ON COLUMN "S_AREA_APLICACAO"."DH_CRIACAO" IS 'Data de criação da área da aplicação';

COMMENT ON COLUMN "S_ANALISE_APLICACAO"."ID_ANALISE_APLICACAO" IS 'ID da análise da aplicação';
COMMENT ON COLUMN "S_ANALISE_APLICACAO"."ID_TIPO_ANALISE_APLICACAO" IS 'ID do tipo de análise da aplicação';
COMMENT ON COLUMN "S_ANALISE_APLICACAO"."ID_APLICACAO" IS 'ID da aplicação associada à análise';
COMMENT ON COLUMN "S_ANALISE_APLICACAO"."ID_NOTIFICACAO_APLICACAO" IS 'ID da notificação da aplicação associada à análise';
COMMENT ON COLUMN "S_ANALISE_APLICACAO"."NR_TEMPO_DECORRIDO" IS 'Tempo decorrido da análise em segundos';
COMMENT ON COLUMN "S_ANALISE_APLICACAO"."CS_STATUS" IS 'Status da análise da aplicação';
COMMENT ON COLUMN "S_ANALISE_APLICACAO"."DETALHES" IS 'Detalhes adicionais sobre a análise';
COMMENT ON COLUMN "S_ANALISE_APLICACAO"."DH_CRIACAO" IS 'Data de criação da análise da aplicação';

COMMENT ON COLUMN "S_TIPO_ANALISE_APLICACAO"."ID_TIPO_ANALISE_APLICACAO" IS 'ID do tipo de análise da aplicação';
COMMENT ON COLUMN "S_TIPO_ANALISE_APLICACAO"."DS_NOME" IS 'Nome do tipo de análise da aplicação';
COMMENT ON COLUMN "S_TIPO_ANALISE_APLICACAO"."PERMITIR_REPROCESSAMENTO" IS 'Indica se o tipo de análise permite reprocessamento';
COMMENT ON COLUMN "S_TIPO_ANALISE_APLICACAO"."ST_ATIVO" IS 'Indica se o tipo de análise está ativo';
COMMENT ON COLUMN "S_TIPO_ANALISE_APLICACAO"."DH_CRIACAO" IS 'Data de criação do tipo de análise da aplicação';

COMMENT ON COLUMN "S_NOTIFICACAO_APLICACAO"."ID_NOTIFICACAO_APLICACAO" IS 'ID da notificação da aplicação';
COMMENT ON COLUMN "S_NOTIFICACAO_APLICACAO"."ID_APLICACAO" IS 'ID da aplicação associada à notificação';
COMMENT ON COLUMN "S_NOTIFICACAO_APLICACAO"."DH_CRIACAO" IS 'Data de criação da notificação da aplicação';
COMMENT ON COLUMN "S_NOTIFICACAO_APLICACAO"."ID_FISCAL" IS 'ID do fiscal associado à notificação';
COMMENT ON COLUMN "S_NOTIFICACAO_APLICACAO"."CS_NIVEL_ALERTA" IS 'Nível de alerta da notificação';

COMMENT ON COLUMN "H_EVENTO_NOTIFICACAO"."ID_EVENTO_NOTIFICACAO" IS 'ID do evento de notificação';
COMMENT ON COLUMN "H_EVENTO_NOTIFICACAO"."ID_NOTIFICACAO_APLICACAO" IS 'ID da notificação associada ao evento';
COMMENT ON COLUMN "H_EVENTO_NOTIFICACAO"."ID_STATUS_NOTIFICACAO_APLICACAO" IS 'ID do status da notificação associada ao evento';
COMMENT ON COLUMN "H_EVENTO_NOTIFICACAO"."NM_CRIADO_POR" IS 'Usuário que criou o evento de notificação';
COMMENT ON COLUMN "H_EVENTO_NOTIFICACAO"."DH_CRIACAO" IS 'Data de criação do evento de notificação';

COMMENT ON COLUMN "S_STATUS_NOTIFICACAO"."ID_STATUS_NOTIFICACAO" IS 'ID do status da notificação';
COMMENT ON COLUMN "S_STATUS_NOTIFICACAO"."DS_DESCRICAO" IS 'Descrição do status da notificação';
COMMENT ON COLUMN "S_STATUS_NOTIFICACAO"."ST_ATIVO" IS 'Indica se o status da notificação está ativo';
COMMENT ON COLUMN "S_STATUS_NOTIFICACAO"."DH_CRIACAO" IS 'Data de criação do status da notificação';

COMMENT ON COLUMN "S_AREA_PROTEGIDA"."ID_AREA_PROTEGIDA" IS 'ID da área protegida';
COMMENT ON COLUMN "S_AREA_PROTEGIDA"."GEOMETRIA" IS 'Representação GeoJSON da área protegida';
COMMENT ON COLUMN "S_AREA_PROTEGIDA"."DS_DESCRICAO" IS 'Descrição da área protegida';
COMMENT ON COLUMN "S_AREA_PROTEGIDA"."ID_TIPO_AREA_PROTEGIDA" IS 'ID do tipo da área protegida';
COMMENT ON COLUMN "S_AREA_PROTEGIDA"."ID_ORGANIZACAO" IS 'ID da organização associada à área protegida';
COMMENT ON COLUMN "S_AREA_PROTEGIDA"."NM_CRIADO_POR" IS 'Usuário que criou a área protegida';
COMMENT ON COLUMN "S_AREA_PROTEGIDA"."DH_CRIACAO" IS 'Data de criação da área protegida';

COMMENT ON COLUMN "S_TIPO_AREA_PROTEGIDA"."ID_TIPO_AREA_PROTEGIDA" IS 'ID do tipo da área protegida';
COMMENT ON COLUMN "S_TIPO_AREA_PROTEGIDA"."NM_TIPO_AREA_PROTEGIDA" IS 'Nome do tipo da área protegida';
COMMENT ON COLUMN "S_TIPO_AREA_PROTEGIDA"."DS_DESCRICAO" IS 'Descrição do tipo da área protegida';
COMMENT ON COLUMN "S_TIPO_AREA_PROTEGIDA"."NR_DISTANCIA" IS 'Distância associada ao tipo da área protegida';
COMMENT ON COLUMN "S_TIPO_AREA_PROTEGIDA"."NR_DISTANCIA_DRONE" IS 'Distância associada ao tipo da área protegida para drone';
COMMENT ON COLUMN "S_TIPO_AREA_PROTEGIDA"."ST_ATIVO" IS 'Indica se o tipo da área protegida está ativo';
COMMENT ON COLUMN "S_TIPO_AREA_PROTEGIDA"."DH_CRIACAO" IS 'Data de criação do tipo da área protegida';

COMMENT ON COLUMN "S_CAMINHO_APLICACAO"."ID_CAMINHO_APLICACAO" IS 'ID do caminho da aplicação';
COMMENT ON COLUMN "S_CAMINHO_APLICACAO"."GEOMETRIA" IS 'Representação GeoJSON do caminho da aplicação';
COMMENT ON COLUMN "S_CAMINHO_APLICACAO"."DS_DESCRICAO" IS 'Descrição do caminho da aplicação';
COMMENT ON COLUMN "S_CAMINHO_APLICACAO"."ID_APLICACAO" IS 'ID da aplicação associada ao caminho';
COMMENT ON COLUMN "S_CAMINHO_APLICACAO"."DH_CRIACAO" IS 'Data de criação do caminho da aplicação';
