# Testes Automatizados Targaryen

Bem-vindo ao repositório **Testes Automatizados Targaryen**! Com iniciativa do Q.A, utilizaremos este repositório contém uma coleção de testes automatizados projetados para garantir a qualidade e a robustez de sistemas e aplicações de software, abrangendo tanto testes em Web quanto em APIs.

## Objetivo

O objetivo deste repositório é fornecer uma suite de testes abrangente que cobre diferentes aspectos de um software, desde testes de integração até testes de aceitação e de desempenho.

## Estrutura do Repositório

- **web/**: Testes específicos para a interface web.
- **api/**: Testes específicos para APIs.
- **cypress/**: Contém todos os testes automatizados.
  - **e2e/**: Testes de integração que validam a interação entre diferentes módulos ou sistemas.
  - **acceptance/**: Testes de aceitação que garantem que a aplicação atende aos requisitos especificados.
  - **performance/**: Testes de desempenho que medem a eficiência e a capacidade de resposta do sistema sob diversas condições.
- **.github/workflows**: Configurações e scripts de integração contínua para automação de testes.

## Configuração do Ambiente

Este projeto utiliza a biblioteca `dotenv` para gerenciar variáveis de ambiente. Para configurar corretamente o ambiente de testes, siga os passos abaixo:

1. Crie um arquivo `.env` na raiz do projeto.
2. Insira as seguintes informações no arquivo `.env`:

   ```env
   EMAIL_VALIDO=############@grupobyx.com.br
   CPF_VALIDO=###.###.###-##
   SENHA_VALIDA=#######
   ```

3. Como referência, você pode consultar o arquivo `.env.example` incluído no repositório.

## Tecnologias Utilizadas

- **Linguagem de Programação**: JavaScript
- **Framework de Testes**: Cypress
- **Ferramentas de Integração Contínua**: GitHub Actions
- **Biblioteca para Variáveis de Ambiente**: dotenv

## Contato

eker.junior@grupobyx.com.br
