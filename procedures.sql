DROP FUNCTION TO_UTF8;
CREATE FUNCTION TO_UTF8(txt VARCHAR(50)) RETURNS VARCHAR(50)
RETURN convert(cast(convert(txt using latin1) as char charset binary) using utf8);

-- Total de despesas
DROP FUNCTION `obter_vl_despesas`;
DELIMITER $
CREATE FUNCTION `obter_vl_despesas`(`id_conta_p` INT) RETURNS decimal(10,2)
return (
    select ifnull(sum(d.pago),0)
    from paroquias p, contas c, despesas d
    where p.id = c.paroquia_id
    and c.id = d.conta_id
    and d.quitado = 1
    and c.id = id_conta_p
)$
DELIMITER ;

-- Total de receitas
DROP FUNCTION `obter_vl_receitas`;
DELIMITER $
CREATE FUNCTION `obter_vl_receitas`(`id_conta_p` INT) RETURNS decimal(10,2)
return (
	select ifnull(sum(r.pago),0)
	from paroquias p, contas c, receitas r
	where p.id = c.paroquia_id
	and c.id = r.conta_id
	and r.quitado = 1
	and r.importado = 0
	and c.id = id_conta_p
)$
DELIMITER ;

DROP FUNCTION obter_vl_saldo_anterior;
DELIMITER $$
CREATE FUNCTION obter_vl_saldo_anterior ( id_paroquia_p INT, dt_inicio_p DATE) RETURNS decimal(10,2)
return (
	select (
		select ifnull(sum(r.pago),0)
		from receitas r
		where r.paroquia_id = id_paroquia_p
		and r.dt_pagamento < dt_inicio_p
		and quitado = 1
		and r.importado = 0
	) - (
		select ifnull(sum(d.pago),0)
		from despesas d
		where d.paroquia_id = id_paroquia_p
		and quitado = 1
		and d.dt_pagamento < dt_inicio_p
	) saldo_anterior
)$$
DELIMITER ;

DROP FUNCTION obter_vl_despesa_prevista;
DELIMITER $$
CREATE FUNCTION obter_vl_despesa_prevista ( id_paroquia_p INT, dt_inicio_p DATE, dt_fim_p DATE) RETURNS decimal(10,2)
return (
	select ifnull(sum(d.pago),0)
	from despesas d
	where d.paroquia_id = id_paroquia_p
    and d.dt_pagamento BETWEEN dt_inicio_p and dt_fim_p 
)$$
DELIMITER ;

DROP FUNCTION obter_vl_despesa_quitada;
DELIMITER $$
CREATE FUNCTION obter_vl_despesa_quitada (id_paroquia_p INT, dt_inicio_p DATE, dt_fim_p DATE) RETURNS decimal(10,2)
return (
	select ifnull(sum(d.pago),0)
	from despesas d
	where d.paroquia_id = id_paroquia_p
	and d.quitado = 1		
    and d.dt_pagamento BETWEEN dt_inicio_p and dt_fim_p 
)$$
DELIMITER ;

DROP FUNCTION obter_vl_receita_prevista;
DELIMITER $$
CREATE FUNCTION obter_vl_receita_prevista (id_paroquia_p INT, dt_inicio_p DATE, dt_fim_p DATE) RETURNS decimal(10,2)
return (
	select ifnull(sum(r.pago),0)
	from receitas r
	where r.paroquia_id = id_paroquia_p
    and r.dt_pagamento BETWEEN dt_inicio_p and dt_fim_p
	and r.importado = 0
)$$
DELIMITER ;

DROP FUNCTION obter_vl_receita_quitada;
DELIMITER $$
CREATE FUNCTION obter_vl_receita_quitada (id_paroquia_p INT, dt_inicio_p DATE, dt_fim_p DATE) RETURNS decimal(10,2)
return (
	select ifnull(sum(r.pago),0)
	from receitas r
	where r.paroquia_id = id_paroquia_p
    and r.dt_pagamento BETWEEN dt_inicio_p and dt_fim_p
    and r.quitado = 1
	and r.importado = 0
)$$
DELIMITER ;

DELIMITER $$
CREATE or replace PROCEDURE obter_resumo_periodo(IN paroquia_id INT UNSIGNED, IN date_start DATE, IN date_end DATE) NOT DETERMINISTIC NO SQL SQL SECURITY DEFINER
BEGIN
    select obter_vl_despesa_prevista(p.id, date_start, date_end) despesa_prevista,
           obter_vl_receita_prevista(p.id, date_start, date_end) receita_prevista,
           obter_vl_despesa_quitada(p.id, date_start, date_end) despesa_quitada,
           obter_vl_receita_quitada(p.id, date_start, date_end) receita_quitada,
		   obter_vl_saldo_anterior(p.id, date_start) saldo_anterior
    from paroquias p
	where p.id = paroquia_id;
END $$
DELIMITER ;

-- Apaga os dados da paroquia informada
DELIMITER $$
CREATE or replace PROCEDURE remover_paroquia(IN p_id INT UNSIGNED) NOT DETERMINISTIC NO SQL SQL SECURITY DEFINER
BEGIN
START TRANSACTION;
    DELETE FROM agentes WHERE paroquia_id = p_id;
    DELETE FROM batismos WHERE paroquia_id = p_id;
    DELETE FROM comunidades WHERE paroquia_id = p_id;
    DELETE FROM contas WHERE paroquia_id = p_id;
    DELETE FROM crismas WHERE paroquia_id = p_id;
    DELETE FROM despesas WHERE paroquia_id = p_id;
    DELETE FROM dizimistas WHERE paroquia_id = p_id;
    DELETE FROM funcionarios WHERE paroquia_id = p_id;
    DELETE FROM matrimonios WHERE paroquia_id = p_id;
    DELETE FROM membros WHERE paroquia_id = p_id;
    DELETE FROM pessoas WHERE paroquia_id = p_id;
    DELETE FROM prestadores_servico WHERE paroquia_id = p_id;
    DELETE FROM receitas WHERE paroquia_id = p_id;
    DELETE FROM transferencias WHERE paroquia_id = p_id;
    -- DELETE FROM usuarios WHERE paroquia_id = p_id;
COMMIT;
END $$
DELIMITER ;

-- Copia os dados da tabela e paroquia informadas
DELIMITER $$
CREATE or replace PROCEDURE copiar_paroquia_tabela(IN p_id INT UNSIGNED, IN nmtb VARCHAR(30)) NOT DETERMINISTIC NO SQL SQL SECURITY DEFINER
BEGIN
START TRANSACTION;
	set @insert = CONCAT('INSERT INTO `', nmtb, '` (SELECT * FROM `v_', nmtb,'_mig` WHERE paroquia_id = ', p_id, ')');
	PREPARE stmt FROM @insert;
	EXECUTE stmt;
COMMIT;
END $$
DELIMITER ;

-- Copia os dados de uma paróquia
DELIMITER $$
CREATE or replace PROCEDURE copiar_paroquia(IN p_id INT UNSIGNED) NOT DETERMINISTIC NO SQL SQL SECURITY DEFINER
BEGIN
START TRANSACTION;
    CALL copiar_paroquia_tabela(p_id, 'agentes');
    CALL copiar_paroquia_tabela(p_id, 'batismos');
    CALL copiar_paroquia_tabela(p_id, 'comunidades');
    CALL copiar_paroquia_tabela(p_id, 'contas');
    CALL copiar_paroquia_tabela(p_id, 'crismas');
    CALL copiar_paroquia_tabela(p_id, 'despesas');
    CALL copiar_paroquia_tabela(p_id, 'dizimistas');
    CALL copiar_paroquia_tabela(p_id, 'matrimonios');
    CALL copiar_paroquia_tabela(p_id, 'membros');
    CALL copiar_paroquia_tabela(p_id, 'pessoas');
    CALL copiar_paroquia_tabela(p_id, 'receitas');
    CALL copiar_paroquia_tabela(p_id, 'prestadores_servico');
    -- CALL copiar_paroquia_tabela(p_id, 'funcionarios');
    -- CALL copiar_paroquia_tabela(p_id, 'transferencias');
    -- CALL copiar_paroquia_tabela(p_id, 'usuarios');
    UPDATE paroquias SET beta = 1 WHERE id = p_id;
COMMIT;
END $$
DELIMITER ;

-- Copia os dados de todas paroquias da tabela
DELIMITER $$
CREATE or replace PROCEDURE copiar_paroquias_tabela(IN nmtb VARCHAR(30)) NOT DETERMINISTIC NO SQL SQL SECURITY DEFINER
BEGIN
START TRANSACTION;
	set @insert = CONCAT('INSERT INTO `', nmtb, '` (SELECT * FROM `v_', nmtb,'_mig`)');
	PREPARE stmt FROM @insert;
	EXECUTE stmt;
COMMIT;
END $$
DELIMITER ;

-- Copia os dados das paroquias
DELIMITER $$
CREATE or replace PROCEDURE copiar_paroquias() NOT DETERMINISTIC NO SQL SQL SECURITY DEFINER
BEGIN
START TRANSACTION;
    CALL copiar_paroquias_tabela('agentes');
    CALL copiar_paroquias_tabela('batismos');
    CALL copiar_paroquias_tabela('comunidades');
    CALL copiar_paroquias_tabela('contas');
    CALL copiar_paroquias_tabela('crismas');
    CALL copiar_paroquias_tabela('despesas');
    CALL copiar_paroquias_tabela('dizimistas');
    CALL copiar_paroquias_tabela('matrimonios');
    CALL copiar_paroquias_tabela('membros');
    CALL copiar_paroquias_tabela('pessoas');
    CALL copiar_paroquias_tabela('receitas');
    CALL copiar_paroquias_tabela('prestadores_servico');
    -- CALL copiar_paroquias_tabela('funcionarios');
    -- CALL copiar_paroquias_tabela('transferencias');
    -- CALL copiar_paroquias_tabela('usuarios');

    DELETE mem
    FROM membros mem
    LEFT JOIN pessoas pes ON mem.pessoa_id = pes.id
    LEFT JOIN aveecclesia_old.pessoal pl ON pes.codigo = pl.id
    WHERE fornecedor = 'SIM';
COMMIT;
END $$
DELIMITER ;

-- Lista os membros não dizimistas
DELIMITER $$
CREATE or replace PROCEDURE obter_membros_nao_dizimista(IN par_id INT UNSIGNED, IN _search VARCHAR(30)) NOT DETERMINISTIC NO SQL SQL SECURITY DEFINER
BEGIN
    SELECT p.nome, p.id pessoa_id, p.paroquia_id
    FROM  pessoas p, membros m
    WHERE p.id = m.pessoa_id
	AND m.paroquia_id = par_id
    AND m.ie_dizimista = 0
    AND m.ativo = 1
    AND p.nome LIKE CONCAT('%', _search, '%')
    ORDER BY nome
    LIMIT 0,10;
END $$
DELIMITER ;

-- Lista os membros não batizados
DELIMITER $$
CREATE or replace PROCEDURE obter_membros_nao_batizado(IN par_id INT UNSIGNED, IN _search VARCHAR(30)) NOT DETERMINISTIC NO SQL SQL SECURITY DEFINER
BEGIN
    SELECT p.nome, p.id pessoa_id, p.paroquia_id
    FROM  pessoas p, membros m
    WHERE p.id = m.pessoa_id
	AND m.paroquia_id = par_id
    AND m.ie_batismo = 0
    AND m.ativo = 1
    AND p.nome LIKE CONCAT('%', _search, '%')
    ORDER BY nome
    LIMIT 0,10;
END $$
DELIMITER ;

-- Lista os membros não crismados
DELIMITER $$
CREATE or replace PROCEDURE obter_membros_nao_crismado(IN par_id INT UNSIGNED, IN _search VARCHAR(30)) NOT DETERMINISTIC NO SQL SQL SECURITY DEFINER
BEGIN
    SELECT p.nome, p.id pessoa_id, p.paroquia_id
    FROM  pessoas p, membros m
    WHERE p.id = m.pessoa_id
	AND m.paroquia_id = par_id
    AND m.ie_crisma = 0
    AND m.ativo = 1
    AND p.nome LIKE CONCAT('%', _search, '%')
    ORDER BY nome
    LIMIT 0,10;
END $$
DELIMITER ;

-- Lista os membros não casados
DELIMITER $$
CREATE or replace PROCEDURE obter_membros_nao_casados(IN par_id INT UNSIGNED, IN _search VARCHAR(30), IN _sexo CHAR(1)) NOT DETERMINISTIC NO SQL SQL SECURITY DEFINER
BEGIN
    SELECT p.nome, p.dt_nascimento, m.mae, p.id pessoa_id, p.paroquia_id
    FROM  pessoas p, membros m
    WHERE p.id = m.pessoa_id
    AND m.paroquia_id = par_id
    AND m.ie_matrimonio = 0
    AND m.ativo = 1
    AND p.sexo = _sexo
    AND p.nome LIKE CONCAT('%', _search, '%')
    ORDER BY nome
    LIMIT 10;
END $$
DELIMITER ;

-- Procedures do sistema antigo
-- Apaga os dados da paroquia informada
DELIMITER $$
CREATE or replace PROCEDURE remover_paroquia(IN p_id INT UNSIGNED) NOT DETERMINISTIC NO SQL SQL SECURITY DEFINER
BEGIN
START TRANSACTION;
    DELETE FROM agentes WHERE id_paroquia = p_id;
    DELETE FROM batismo WHERE id_paroquia = p_id;
    DELETE FROM comunidade WHERE id_paroquia = p_id;
    DELETE FROM carteira WHERE id_paroquia = p_id;
    DELETE FROM crisma WHERE id_paroquia = p_id;
    DELETE FROM despesa WHERE id_paroquia = p_id;
    DELETE FROM dizimista WHERE id_paroquia = p_id;
    DELETE FROM ofertas WHERE id_paroquia = p_id;
    DELETE FROM proc_mat WHERE id_paroquia = p_id;
    DELETE FROM pessoal WHERE id_paroquia = p_id;
    DELETE FROM receita WHERE id_paroquia = p_id;
COMMIT;
END $$
DELIMITER ;
