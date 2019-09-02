#!/bin/bash
mysqldump --no-create-info -u root -p aveecclesia \
agentes \
batismos \
comunidades \
contas \
crismas \
despesas \
dizimistas \
funcionarios \
matrimonios \
membros \
pessoas \
prestadores_servico \
receitas \
transferencias \
usuarios \
-w"paroquia_id=$1"