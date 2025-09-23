import {
  gerarCPF,
  gerarDataNascimento,
  gerarNivelEscolaridade,
  gerarNomeAleatorio,
} from '../utils';

export class IdentificacaoPage {
  inputs = {
    convenio: '#benefitCard_convenio',
    opcaoConvenio: '.ant-select-item-option-content',
    cpf: '#customer_nu_cpf',
    dataNascimento: '#customer_dt_nascimento',
    nome: '#customer_nome_cliente',
    telefone: '#customer_telefone_celular',
    nivelEscolaridade: '#customer_escolaridade',
    possuiRepresentante: '#customer_possui_representante_legal',
  };

  selecionarOpcao(seletor, opcoesMap, opcao) {
    cy.get(seletor)
      .click({ force: true })
      .type(opcoesMap[opcao], { force: true });
  }

  selecionarConvenio(numero) {
    cy.get(this.inputs.convenio).click().type(numero);
    cy.get(this.inputs.opcaoConvenio).click();
  }

  selecionarRepresentanteLegal(boolean) {
    const RLMap = {
      Sim: '{enter}',
      Não: '{downarrow}{enter}',
    };
    this.selecionarOpcao(this.inputs.possuiRepresentante, RLMap, boolean);
  }

  preencherCPF(cpf = gerarCPF()) {
    cy.get(this.inputs.cpf).type(cpf);
  }

  preencherDataNascimento(dataNascimento = gerarDataNascimento()) {
    cy.get(this.inputs.dataNascimento).type(dataNascimento);
  }

  preencherNome(nome = gerarNomeAleatorio()) {
    cy.get(this.inputs.nome).type(nome);
  }

preencherTelefone() {
  // Lista de DDDs válidos no Brasil (atualizados pela Anatel)
  const dddsValidos = [
    11,12,13,14,15,16,17,18,19,
    21,22,24,27,28,
    31,32,33,34,35,37,38,
    41,42,43,44,45,46,
    47,48,49,
    51,53,54,55,
    61,62,63,64,65,66,67,68,69,
    71,73,74,75,77,79,
    81,82,83,84,85,86,87,88,89,
    91,92,93,94,95,96,97,98,99
  ];

  // Sorteia um DDD válido
  const ddd = dddsValidos[Math.floor(Math.random() * dddsValidos.length)];

  // Gera número de celular sempre começando com 9 e mais 8 dígitos
  const numero = `9${Math.floor(10000000 + Math.random() * 89999999)}`;

  const telefone = `${ddd}${numero}`;

  cy.get(this.inputs.telefone).type(telefone, { force: true });
}



  selecionarNivelEscolaridade(nivelEscolaridade = gerarNivelEscolaridade()) {
    cy.get(this.inputs.nivelEscolaridade).click();
    cy.contains(nivelEscolaridade, { timeout: 5000 }).click();
  }

  preencherFormulario() {
    this.preencherCPF();
    this.preencherDataNascimento();
    this.preencherNome();
    this.selecionarNivelEscolaridade();
    this.preencherTelefone();
  }
}
