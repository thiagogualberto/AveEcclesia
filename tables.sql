-- Table PESSOAS
CREATE OR REPLACE TABLE pessoas (
	id int NOT NULL AUTO_INCREMENT,
	paroquia_id int DEFAULT NULL,
	nome varchar(60) NOT NULL,
	dt_nascimento date DEFAULT NULL,
	rg varchar(20) DEFAULT NULL,
	tipo enum('F','J') DEFAULT 'F',
	cpf_cnpj varchar(18) DEFAULT NULL,
	tel varchar(15) DEFAULT NULL,
	cel varchar(15) DEFAULT NULL,
	cep char(10) DEFAULT NULL,
	uf char(2) DEFAULT NULL,
	cidade varchar(250) DEFAULT NULL,
	bairro varchar(250) DEFAULT NULL,
	endereco varchar(250) DEFAULT NULL,
	numero int DEFAULT NULL,
	email varchar(250) DEFAULT NULL,
	sexo enum('M','F') DEFAULT NULL COMMENT 'Masculino ou Feminino',
	estado_civil enum('C','S','D','V') DEFAULT NULL COMMENT 'Casado, Solteiro, Divorciado, ou Viúvo',
	PRIMARY KEY (id),
	INDEX (paroquia_id),
	INDEX (sexo)
);

-- Table MEMBROS
CREATE OR REPLACE TABLE membros (
	id int NOT NULL AUTO_INCREMENT,
	pessoa_id int NOT NULL,
	paroquia_id int DEFAULT NULL,
	numero int DEFAULT NULL,
	endereco varchar(250) DEFAULT NULL,
	bairro varchar(250) DEFAULT NULL,
	cidade varchar(250) DEFAULT NULL,
	uf char(2) DEFAULT NULL,
	cep char(10) DEFAULT NULL,
	email varchar(250) DEFAULT NULL,
	mae varchar(250) DEFAULT NULL,
	pai varchar(250) DEFAULT NULL,
	ie_batismo boolean DEFAULT false,
	ie_crisma boolean DEFAULT false,
	ie_matrimonio boolean DEFAULT false,
	ie_dizimista boolean DEFAULT false,
	falecido boolean DEFAULT false,
	ativo boolean DEFAULT true,
	PRIMARY KEY (id),
	INDEX (pessoa_id),
	INDEX (paroquia_id)
);

ALTER TABLE membros
ADD CONSTRAINT membros_fk_pessoa_id
FOREIGN KEY (pessoa_id)
REFERENCES pessoas(id)
ON DELETE CASCADE
ON UPDATE CASCADE;

-- Table AGENTES
CREATE OR REPLACE TABLE agentes (
	id int NOT NULL AUTO_INCREMENT,
    paroquia_id int NOT NULL,
    pessoa_id int NOT NULL,
    funcao_id int NOT NULL,
    comunidade_id int NOT NULL,
    inicio date,
    termino date,
    ativo boolean DEFAULT true,
	PRIMARY KEY (id),
	INDEX (paroquia_id)
);

ALTER TABLE agentes
ADD  CONSTRAINT agentes_fk_pessoa_id
FOREIGN KEY (pessoa_id)
REFERENCES pessoas(id)
ON DELETE RESTRICT
ON UPDATE RESTRICT;

-- Table PRESTADORES_SERVICO
CREATE OR REPLACE TABLE prestadores_servico (
	id int NOT NULL AUTO_INCREMENT,
	pessoa_id int NOT NULL,
	paroquia_id int NOT NULL,
	dt_fundacao date DEFAULT NULL,
	email varchar(100) DEFAULT NULL,
	tel varchar(15) DEFAULT NULL,
	ie varchar(50) DEFAULT NULL COMMENT 'Inscrição estadual',
	im varchar(50) DEFAULT NULL COMMENT 'Inscrição municipal',
	cep char(9) DEFAULT NULL,
	uf char(2) DEFAULT NULL,
	cidade varchar(150) DEFAULT NULL,
	bairro varchar(150) DEFAULT NULL,
	endereco varchar(250) DEFAULT NULL,
	numero int DEFAULT NULL,
	ativo boolean DEFAULT true,
	PRIMARY KEY (id),
	INDEX (paroquia_id)
);

-- Table FUNCIONARIOS
CREATE OR REPLACE TABLE funcionarios (
	id int NOT NULL AUTO_INCREMENT,
	pessoa_id int NOT NULL,
	paroquia_id int NOT NULL,
	dt_admissao date DEFAULT NULL,
	email varchar(100) DEFAULT NULL,
	tel varchar(15) DEFAULT NULL,
	funcao varchar(50) DEFAULT NULL,
	salario decimal(9,2) DEFAULT NULL,
	cep char(9) DEFAULT NULL,
	uf char(2) DEFAULT NULL,
	cidade varchar(150) DEFAULT NULL,
	bairro varchar(150) DEFAULT NULL,
	endereco varchar(250) DEFAULT NULL,
	numero int DEFAULT NULL,
	ativo boolean DEFAULT true,
	PRIMARY KEY (id),
	INDEX (paroquia_id)
);

-- Table COMUNIDADES
CREATE OR REPLACE TABLE comunidades (
	id int NOT NULL AUTO_INCREMENT,
	paroquia_id int NOT NULL,
	nome varchar(150) DEFAULT NULL,
	cep char(9) DEFAULT NULL,
	uf char(2) DEFAULT NULL,
	cidade varchar(150) DEFAULT NULL,
	bairro varchar(150) DEFAULT NULL,
	endereco varchar(250) DEFAULT NULL,
	numero int DEFAULT NULL,
	tel varchar(15) DEFAULT NULL,
	email varchar(100) DEFAULT NULL,
	ativo boolean DEFAULT true,
	PRIMARY KEY (id),
	INDEX (paroquia_id)
);

-- Table FUNCOES
CREATE OR REPLACE TABLE funcoes (
	id int NOT NULL AUTO_INCREMENT,
    diocese_id int NOT NULL,
    nome varchar(100) DEFAULT NULL,
	ativo boolean DEFAULT true,
	PRIMARY KEY (id),
	INDEX (diocese_id)
);

-- Table BATISMOS
CREATE OR REPLACE TABLE batismos (
	id int NOT NULL AUTO_INCREMENT,
	paroquia_id int NOT NULL,
	pessoa_id int NOT NULL,
	nome_batismo varchar(150) DEFAULT NULL,
	outra_paroquia boolean DEFAULT false,
	catolico boolean DEFAULT true,    -- Se o membro é católico ou de outra religião
	cidade varchar(150) DEFAULT NULL, -- Cidade de batismo
	dt_batismo date DEFAULT NULL,
	paroquia varchar(60) NOT NULL,
	livro varchar(5) DEFAULT NULL,
	folha varchar(5) DEFAULT NULL,
	registro varchar(5) DEFAULT NULL,
	celebrante varchar(150) DEFAULT NULL,
	padrinho varchar(150) DEFAULT NULL,
	madrinha varchar(150) DEFAULT NULL,
	obs text DEFAULT NULL,
	PRIMARY KEY (id),
	INDEX (paroquia_id),
	INDEX (catolico)
);

ALTER TABLE batismos
ADD  CONSTRAINT batismos_fk_pessoa_id
FOREIGN KEY (pessoa_id)
REFERENCES pessoas(id)
ON DELETE RESTRICT
ON UPDATE RESTRICT;

-- Table CRISMAS
CREATE OR REPLACE TABLE crismas (
	id int NOT NULL AUTO_INCREMENT,
	paroquia_id int NOT NULL,
	pessoa_id int NOT NULL,
	dt_crisma date DEFAULT NULL,
	paroquia varchar(60) NOT NULL,
	livro varchar(5) DEFAULT NULL,
	folha varchar(5) DEFAULT NULL,
	registro varchar(5) DEFAULT NULL,
	celebrante varchar(150) DEFAULT NULL,
	padrinho varchar(150) DEFAULT NULL,
	madrinha varchar(150) DEFAULT NULL,
	PRIMARY KEY (id),
	INDEX (paroquia_id)
);

ALTER TABLE crismas
ADD  CONSTRAINT crismas_fk_pessoa_id
FOREIGN KEY (pessoa_id)
REFERENCES pessoas(id)
ON DELETE RESTRICT
ON UPDATE RESTRICT;

-- Table MATRIMONIOS
CREATE OR REPLACE TABLE matrimonios (
	id int NOT NULL AUTO_INCREMENT,
	paroquia_id int NOT NULL,
	noivo_id int NOT NULL,
	noiva_id int NOT NULL,
	noivo_nome varchar(150) DEFAULT NULL,
	noiva_nome varchar(150) DEFAULT NULL,
	dt_curso date DEFAULT NULL,
	local_curso varchar(60) NOT NULL,
	proclamas1 date DEFAULT NULL,
	proclamas2 date DEFAULT NULL,
	proclamas3 date DEFAULT NULL,
	cartorio varchar(60) DEFAULT NULL,
	dt_registro date DEFAULT NULL,
	regime_bens enum('U','P','S') DEFAULT NULL COMMENT 'Comunhão Universal de Bens, Comunhão Parcial de Bens, Separação de Bens',
	num_certidao  varchar(60) DEFAULT NULL,
	dt_casamento date DEFAULT NULL,
	hr_casamento time DEFAULT NULL,
	local_casamento varchar(60) NOT NULL,
	casado boolean DEFAULT false,
	livro varchar(5) DEFAULT NULL,
	folha varchar(5) DEFAULT NULL,
	registro varchar(5) DEFAULT NULL,
	celebrante varchar(150) DEFAULT NULL,
	testemunha1 varchar(150) DEFAULT NULL,
	testemunha2 varchar(150) DEFAULT NULL,
	menor boolean DEFAULT false,
	autorizacao boolean DEFAULT true,
	q1a varchar(50) DEFAULT NULL,
	q2a varchar(50) DEFAULT NULL,
	q3a varchar(50) DEFAULT NULL,
	q4a varchar(50) DEFAULT NULL,
	q5a varchar(50) DEFAULT NULL,
	q6a varchar(50) DEFAULT NULL,
	q7a varchar(50) DEFAULT NULL,
	q8a varchar(50) DEFAULT NULL,
	q9a varchar(50) DEFAULT NULL,
	q10a varchar(50) DEFAULT NULL,
	q11a varchar(50) DEFAULT NULL,
	q12a varchar(50) DEFAULT NULL,
	q13a varchar(50) DEFAULT NULL,
	q14a varchar(50) DEFAULT NULL,
	q1b varchar(50) DEFAULT NULL,
	q2b varchar(50) DEFAULT NULL,
	q3b varchar(50) DEFAULT NULL,
	q4b varchar(50) DEFAULT NULL,
	q5b varchar(50) DEFAULT NULL,
	q6b varchar(50) DEFAULT NULL,
	q7b varchar(50) DEFAULT NULL,
	q8b varchar(50) DEFAULT NULL,
	q9b varchar(50) DEFAULT NULL,
	q10b varchar(50) DEFAULT NULL,
	q11b varchar(50) DEFAULT NULL,
	q12b varchar(50) DEFAULT NULL,
	q13b varchar(50) DEFAULT NULL,
	q14b varchar(50) DEFAULT NULL,
	PRIMARY KEY (id),
	INDEX (paroquia_id)
);

ALTER TABLE matrimonios
ADD  CONSTRAINT matrimonios_fk_noivo_id
FOREIGN KEY (noivo_id)
REFERENCES pessoas(id)
ON DELETE RESTRICT
ON UPDATE RESTRICT;

ALTER TABLE matrimonios
ADD  CONSTRAINT matrimonios_fk_noiva_id
FOREIGN KEY (noiva_id)
REFERENCES pessoas(id)
ON DELETE RESTRICT
ON UPDATE RESTRICT;

-- Table DIZIMISTAS
CREATE OR REPLACE TABLE dizimistas (
	id int NOT NULL AUTO_INCREMENT,
	paroquia_id int NOT NULL,
	pessoa_id int NOT NULL,
	comunidade_id int NOT NULL,
	dt_casamento date DEFAULT NULL,
	conjuge varchar(150) DEFAULT NULL,
	dt_conjuge date DEFAULT NULL,
	inicio date DEFAULT NULL,
	termino date DEFAULT NULL,
	ativo boolean DEFAULT true,
	PRIMARY KEY (id),
	INDEX (paroquia_id)
);

ALTER TABLE dizimistas
ADD  CONSTRAINT dizimistas_fk_pessoa_id
FOREIGN KEY (pessoa_id)
REFERENCES pessoas(id)
ON DELETE RESTRICT
ON UPDATE RESTRICT;

-- Table CONTAS
CREATE OR REPLACE TABLE contas (
	id int NOT NULL AUTO_INCREMENT,
	paroquia_id int NOT NULL,
	nome varchar(100) DEFAULT NULL,
	tipo ENUM('CC','CE', 'CP') COMMENT 'Conta corrente, Caixa escritório, Conta poupança',
	banco varchar(50) DEFAULT NULL,
	agencia varchar(11) DEFAULT NULL,
	conta varchar(11) DEFAULT NULL,
	saldo decimal(9,2) DEFAULT 0.0,
	saldo_inicial decimal(9,2) DEFAULT 0.0,
	ativo boolean DEFAULT false,
	PRIMARY KEY (id),
	INDEX (paroquia_id)
);

-- Table RECEITAS
CREATE OR REPLACE TABLE receitas (
	id int NOT NULL AUTO_INCREMENT,
	paroquia_id int NOT NULL,
	pessoa_id int NOT NULL,
	conta_id int NOT NULL,
	plano_contas int NOT NULL,
	descricao varchar(150),
	dt_vencimento date,
	dt_pagamento date,
	valor decimal(9,2) null,
	pago decimal(9,2) null,
	pagamento ENUM('A','P'),
	parcela varchar(7),
	periodo ENUM('M','T','S','A'),
	comments text DEFAULT NULL,
	quitado boolean DEFAULT false,
	importado boolean DEFAULT false,
	PRIMARY KEY (id),
	INDEX (paroquia_id),
	INDEX (pessoa_id),
	INDEX (plano_contas),
	INDEX (importado)
);

-- Table DESPESAS
CREATE OR REPLACE TABLE despesas (
	id int NOT NULL AUTO_INCREMENT,
	paroquia_id int NOT NULL,
	pessoa_id int NOT NULL,
	conta_id int NOT NULL,
	plano_contas int NOT NULL,
	descricao varchar(150),
	dt_vencimento date,
	dt_pagamento date,
	valor decimal(9,2) null,
	pago decimal(9,2) null,
	pagamento ENUM('A','P'),
	parcela varchar(7),
	periodo ENUM('M','T','S','A'),
	comments text DEFAULT NULL,
	quitado boolean DEFAULT false,
	PRIMARY KEY (id),
	INDEX (paroquia_id),
	INDEX (pessoa_id),
	INDEX (plano_contas)
);

-- Table TRANSFERENCIAS
CREATE OR REPLACE TABLE transferencias (
	id int NOT NULL AUTO_INCREMENT,
	paroquia_id int NOT NULL,
	conta_origem int NOT NULL,
	conta_destino int NOT NULL,
	despesa_id int NOT NULL,
	receita_id int NOT NULL,
	descricao varchar(150),
	dt_transferencia date,
	valor decimal(9,2) null,
	quitado boolean DEFAULT false,
	PRIMARY KEY (id),
	INDEX (paroquia_id),
	INDEX (conta_origem),
	INDEX (conta_destino)
);

-- Table USUARIOS
CREATE OR REPLACE TABLE usuarios (
	id int NOT NULL AUTO_INCREMENT,
	diocese_id int NOT NULL,
	paroquia_id int NOT NULL,
	nome varchar(150) DEFAULT NULL,
	email varchar(150) DEFAULT NULL,
	usuario varchar(50) DEFAULT NULL,
	senha varchar(32) DEFAULT NULL,
	nivel tinyint NOT NULL,
	rel_paroquias tinyint NOT NULL,
	cad_usuarios tinyint NOT NULL,
	cad_paroquias tinyint NOT NULL,
	PRIMARY KEY (id),
	INDEX (diocese_id),
	INDEX (paroquia_id)
);

-- Table PAROQUIAS
CREATE OR REPLACE TABLE paroquias (
	id int NOT NULL AUTO_INCREMENT,
	diocese_id int NOT NULL,
	nome varchar(150) DEFAULT NULL,
	cnpj varchar(18) DEFAULT NULL,
	dt_fundacao date DEFAULT NULL,
	cep char(9) DEFAULT NULL,
	uf char(2) DEFAULT NULL,
	cidade varchar(150) DEFAULT NULL,
	bairro varchar(150) DEFAULT NULL,
	endereco varchar(250) DEFAULT NULL,
	tel1 varchar(15) DEFAULT NULL,
	tel2 varchar(15) DEFAULT NULL,
	tel3 varchar(15) DEFAULT NULL,
	responsavel varchar(50) DEFAULT NULL,
	conta_id int NOT NULL COMMENT 'Conta padrão da paróquia',
	dizimo_id int NOT NULL COMMENT 'Plano de contas de dízimo',
	logo varchar(50) DEFAULT NULL,
	ativo boolean DEFAULT false,
	PRIMARY KEY (id),
	INDEX (diocese_id)
);

-- Table PLANO_CONTAS
CREATE OR REPLACE TABLE plano_contas (
	id int NOT NULL AUTO_INCREMENT,
	diocese_id int NOT NULL,
	pai_id int NOT NULL,
	codigo varchar(20) DEFAULT NULL,
	descricao varchar(250) DEFAULT NULL,
	grupo char(1) DEFAULT NULL,
	ativo boolean DEFAULT false,
	analitica boolean DEFAULT false,
	PRIMARY KEY (id),
	INDEX (diocese_id)
);
