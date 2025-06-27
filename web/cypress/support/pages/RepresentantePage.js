import {
  gerarDataNascimento,
  gerarNomeAleatorio,
  gerarTelefone,
} from '../utils';

import { faker } from '@faker-js/faker';

export class RepresentantePage {
  inputs = {
    nome: '#customer_representante_legal_nome',
    cpf: '#customer_representante_legal_cpf',
    dataNascimento: '#customer_representante_legal_data_nascimento',
    parentesco: '#customer_representante_legal_grau_parentesco',
    telefone: '#customer_representante_legal_telefone',
    tipoDocumento: '#customer_representante_legal_documento_tipo',
    numeroDocumento: '#customer_representante_legal_documento_numero',
    uf: '#customer_representante_legal_documento_uf',
    orgaoEmissor: '#customer_representante_legal_documento_orgao_emissor',
    dataEmissao: '#customer_representante_legal_documento_data_emissao',
    email: '#customer_representante_legal_email',
  };

  selecionarOpcao(seletor, opcoesMap, opcao) {
    cy.get(seletor).click({ force: true }).type(opcoesMap[opcao]);
  }

  preencherCampo(seletor, valor, opcoes = {}) {
    cy.get(seletor).type(valor, opcoes).blur();
  }

  preencherCPF(cpf) {
    cy.get(this.inputs.cpf).type(cpf);
  }

  preencherDataNascimento(dataNascimento = gerarDataNascimento()) {
    cy.get(this.inputs.dataNascimento).type(dataNascimento);
  }

  preencherNome(nome = gerarNomeAleatorio()) {
    cy.get(this.inputs.nome).type(nome);
  }

  preencherTelefone(telefone = gerarTelefone()) {
    cy.get(this.inputs.telefone).type(telefone, { force: true });
  }

  gerarParentesco() {
    const parentescos = ['Filho(a)', 'Pai', 'Mãe', 'Irmão(ã)'];
    return parentescos[Math.floor(Math.random() * parentescos.length)];
  }

  selecionarParentesco(parentesco = this.gerarParentesco()) {
    cy.get(this.inputs.parentesco).click();
    cy.contains(parentesco).click();
  }

  preencherIdentificacao(cpf) {
    this.preencherNome();
    this.preencherCPF(cpf);
    this.preencherDataNascimento();
    this.selecionarParentesco();
    this.preencherTelefone();
  }

  preencherTipoDocumentoRepresentante(documento = null) {
    if (!documento) {
      const tiposDocumento = ['RG', 'CNH'];
      documento =
        tiposDocumento[Math.floor(Math.random() * tiposDocumento.length)];
    }

    const documentoMap = {
      RG: '{enter}',
      CNH: '{downarrow}{enter}',
    };

    Cypress.env('documentoRepresentante', documento);

    this.selecionarOpcao(this.inputs.tipoDocumento, documentoMap, documento);
  }
  preencherNumeroDocumentoRepresentante() {
    const numeroDocumento =
      Cypress.env('documentoRepresentante') === 'CNH'
        ? '98765410322'
        : '123456729';
    this.preencherCampo(this.inputs.numeroDocumento, numeroDocumento);
  }

  preencherUFRepresentante() {
    const numeroAleatorio = Math.floor(Math.random() * 10) + 1;
    const comandosDownarrow = '{downarrow}'.repeat(numeroAleatorio);
    const comando = `${comandosDownarrow}{enter}`;

    cy.get(this.inputs.uf).click().type(comando);
  }

  preencherOrgaoEmissorRepresentante(orgaoEmissor = 'SSP') {
    this.preencherCampo(this.inputs.orgaoEmissor, orgaoEmissor);
  }

  preencherDataEmissaoRepresentante(dataEmissao = '26072021') {
    this.preencherCampo(this.inputs.dataEmissao, dataEmissao);
  }
  preencherEmailRepresentante(email = faker.internet.email()) {
    this.preencherCampo(this.inputs.email, email);
  }

  preencherDadosPessoais() {
    this.preencherTipoDocumentoRepresentante();
    this.preencherNumeroDocumentoRepresentante();
    this.preencherUFRepresentante();
    this.preencherOrgaoEmissorRepresentante();
    this.preencherDataEmissaoRepresentante();
    this.preencherEmailRepresentante();
  }
}
