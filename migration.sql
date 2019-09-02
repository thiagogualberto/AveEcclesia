-- @escalar = 3021298;

-- View PAROQUIA
CREATE OR REPLACE VIEW v_paroquia_mig AS
SELECT id, id_diocese, TO_UTF8(nome), cnpj, IF(fundacao='0000-00-00', null, fundacao) fundacao, cep, uf, TO_UTF8(cidade), TO_UTF8(bairro), TO_UTF8(endereco), telefone1, telefone2, telefone3, TO_UTF8(responsavel), carteira, cat_dizimo, IF(logo='', null, logo) logo, IF(ativo=0,true,true) ativo
FROM aveecclesia_old.paroquia;

-- View PESSOAS
CREATE OR REPLACE VIEW v_pessoas_mig AS
SELECT (id+@escalar) id, id codigo, id_paroquia paroquia_id, TO_UTF8(nome), dt_nascimento, rg, IF(tipo='PJ','J','F') tipo, IF(cpf <> '', cpf, cnpj) cpf_cnpj, null tel, null cel, null numero, TO_UTF8(endereco), TO_UTF8(bairro), TO_UTF8(cidade), uf, cep, email, IF(sexo <> 'M' and sexo <> 'F',null,sexo) sexo, (
	CASE 
		WHEN estado_civil = 'solteiro' OR estado_civil = 'SOLTERIO' THEN 'S'
    	WHEN estado_civil = 'casado' THEN 'C'
		WHEN estado_civil = 'viuvo' THEN 'V'
		ELSE null
	END
) as estado_civil FROM aveecclesia_old.pessoal;

-- View MEMBROS
CREATE OR REPLACE VIEW v_membros_mig AS
SELECT null id, (id+@escalar) pessoa_id, id_paroquia paroquia_id, null numero, TO_UTF8(endereco), TO_UTF8(bairro), TO_UTF8(cidade), uf, cep, null complemento, email, TO_UTF8(mae), TO_UTF8(pai), IF(falecido='NAO',false,true) falecido, IF(ativo=0,true,false) ativo
FROM aveecclesia_old.pessoal;

-- View AGENTES
CREATE OR REPLACE VIEW v_agentes_mig AS
SELECT null id, id_paroquia paroquia_id, (id_pessoal+@escalar) pessoa_id, id_funcao funcao_id, id_comunidade comunidade_id, inicio, termino, if(ativo=0, true, false) ativo
FROM aveecclesia_old.agentes;

-- View COMUNIDADES
CREATE OR REPLACE VIEW v_comunidades_mig AS
SELECT id, id_paroquia paroquia_id, TO_UTF8(nome), cep, uf, TO_UTF8(cidade), TO_UTF8(bairro), TO_UTF8(endereco), null numero, telefone, email, IF(ativo=0, true, false)
FROM aveecclesia_old.comunidade;

-- View FUNCOES
CREATE OR REPLACE VIEW v_funcoes_mig AS
SELECT id, id_diocese, TO_UTF8(funcao), IF(ativo=0,true,false)
FROM aveecclesia_old.funcoes;

-- View BATISMOS
CREATE OR REPLACE VIEW v_batismos_mig AS
SELECT null id, bat.id_paroquia paroquia_id, (id_pessoal+@escalar), TO_UTF8(nome), outra_paroquia, 1 catolico, null cidade, dt_batismo, TO_UTF8(paroquia), livro, folha, registro, TO_UTF8(celebrante), TO_UTF8(padrinho), TO_UTF8(madrinha), TO_UTF8(obs)
FROM aveecclesia_old.batismo bat
INNER JOIN aveecclesia_old.pessoal pes ON id_pessoal = pes.id;

-- View CRISMAS
CREATE OR REPLACE VIEW v_crismas_mig AS
SELECT null id, id_paroquia paroquia_id, (id_pessoal+@escalar), dt_crisma, TO_UTF8(paroquia), livro, folha, registro, TO_UTF8(celebrante), TO_UTF8(padrinho), TO_UTF8(madrinha)
FROM aveecclesia_old.crisma;

-- View MATRIMONIOS
CREATE OR REPLACE VIEW v_matrimonios_mig AS
SELECT null id, mat.id_paroquia paroquia_id, (id_noivo+@escalar), (id_noiva+@escalar), TO_UTF8(noivo.nome) noivo_nome, TO_UTF8(noiva.nome) noiva_nome, dt_cursonoivos, TO_UTF8(local_curso) local_curso, proclamas1, proclamas2, proclamas3, null cartorio, null dt_registro, null regime_bens, null num_certidao, dt_casamento, hr_casamento, TO_UTF8(local_casamento), casado, livro, folha, registro, TO_UTF8(celebrante), TO_UTF8(testemunha1), TO_UTF8(testemunha2), IF(menor='menorsim',true,false) menor, IF(autoriza='casasim',true,false) autorizacao, q1a, q2a, q3a, q4a, q5a, q6a, q7a, q8a, q9a, q10a, q11a, q12a, q13a, q14a, q1b, q2b, q3b, q4b, q5b, q6b, q7b, q8b, q9b, q10b, q11b, q12b, q13b, q14b
FROM aveecclesia_old.proc_mat mat
INNER JOIN aveecclesia_old.pessoal noivo ON noivo.id = id_noivo
INNER JOIN aveecclesia_old.pessoal noiva ON noiva.id = id_noiva;

-- View DIZIMISTAS
CREATE OR REPLACE VIEW v_dizimistas_mig AS
SELECT null, id, id_paroquia paroquia_id, (id_pessoal+@escalar) pessoa_id, id_comunidade, dt_casamento, TO_UTF8(conjuge), dt_conjuge, inicio, termino, IF (ativo=0,true,false)
FROM aveecclesia_old.dizimista;

-- View CONTAS
CREATE OR REPLACE VIEW v_contas_mig AS
SELECT id, id_paroquia paroquia_id, TO_UTF8(nome) nome, (
	CASE 
		WHEN tipo = 'CONTA POUPANÃ‡A' THEN 'CP'
    	WHEN tipo = 'CONTA CORRENTE' THEN 'CC'
		WHEN tipo = 'CARTEIRA' THEN 'CE'
		ELSE null
	END
) tipo, banco, agencia, conta, 0.0 saldo, saldo saldo_inicial, IF(ativo=0,true,false) ativo FROM aveecclesia_old.carteira;

-- View RECEITAS
CREATE OR REPLACE VIEW v_receitas_mig AS
SELECT null id, id_paroquia paroquia_id, (fornecedor+@escalar) pessoa_id, carteira conta_id, plano_contas, TO_UTF8(descricao) descricao, vencimento dt_vencimento, dt_pagamento, valor, pago, IF (pagamento='avista','A','P') pagamento, parcela, IF (periodo='MENSAL','M',null) periodo, null comments, quitado, false importado
FROM aveecclesia_old.receita
UNION ALL
SELECT null id, id_paroquia paroquia_id, (id_pessoal+@escalar) pessoa_id, carteira conta_id, plano_contas, TO_UTF8(descricao) descricao, dt_referencia dt_vencimento, dt_pagamento, pago valor, pago, IF (pagamento='avista','A','P') pagamento, parcela, IF (periodo='MENSAL','M',null) periodo, null comments, quitado, importado
FROM aveecclesia_old.ofertas;

-- View DESPESAS
CREATE OR REPLACE VIEW v_despesas_mig AS
SELECT null, id_paroquia paroquia_id, (fornecedor+@escalar) pessoa_id, carteira conta_id, plano_contas, TO_UTF8(descricao) descricao, vencimento dt_vencimento, dt_pagamento, valor, pago, IF (pagamento='avista','A','P') pagamento, parcela, IF (periodo='MENSAL','M',null) periodo, null comments, quitado
FROM aveecclesia_old.despesa;

-- View USUARIOS
CREATE OR REPLACE VIEW v_usuarios_mig AS
SELECT null id, id_diocese, id_paroquia paroquia_id, TO_UTF8(nome), email, usuario, senha, 0 nivel, 0 rel_paroquias
FROM aveecclesia_old.usuarios;

-- View PLANO_CONTAS
CREATE OR REPLACE VIEW v_plano_contas_mig AS
SELECT null id, id_diocese, id_pai, codigo, descricao, grupo, IF(ativo=0,true,true) ativo, analitica
FROM aveecclesia_old.plano_contas;

-- PRESTADORES_SERVICO
CREATE OR REPLACE VIEW v_prestadores_servico_mig AS
SELECT null id, mem.pessoa_id, mem.paroquia_id, IF(pl.dt_fundacao='0000-00-00',null,pl.dt_fundacao) dt_fundacao, pl.email, IF(pl.telefone1='',null,pl.telefone1) tel, IF(ie='',null,ie) ie, null im, mem.cep, mem.uf, mem.cidade, mem.bairro, mem.endereco, null numero, null complemento, mem.ativo
FROM membros mem
LEFT JOIN pessoas pes ON mem.pessoa_id = pes.id
LEFT JOIN aveecclesia_old.pessoal pl ON pes.codigo = pl.id
WHERE fornecedor = 'SIM';
