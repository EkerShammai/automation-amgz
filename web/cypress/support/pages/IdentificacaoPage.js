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
    opcaoBanco: '.ant-select-item-option-content',
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

  numerobancosc(numero) {
    cy.get('.ant-select-selection-item').type(numero);
    cy.get(this.inputs.opcaoBanco).click();
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

  preencherTelefone(telefone = '24993204547') {
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
