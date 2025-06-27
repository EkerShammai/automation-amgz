import { gerarCPF, gerarNomeAleatorio } from '../utils';

export class TestemunhaPage {
  inputs = {
    nomeTestemunha1: '#customer_testemunha_1_nome',
    nomeTestemunha2: '#customer_testemunha_2_nome',
    cpfTestemunha1: '#customer_testemunha_1_cpf',
    cpfTestemunha2: '#customer_testemunha_2_cpf',
    dataNascimentoTestemunha1: '#customer_testemunha_1_data_nascimento',
    dataNascimentoTestemunha2: '#customer_testemunha_2_data_nascimento',
    tipoDocumentoTestemunha1: '#customer_testemunha_1_documento_tipo',
    tipoDocumentoTestemunha2: '#customer_testemunha_2_documento_tipo',
  };

  preencherCampo(seletor, valor) {
    cy.get(seletor).type(valor);
  }

  preencherNomes(
    testemunha1 = gerarNomeAleatorio(),
    testemunha2 = gerarNomeAleatorio()
  ) {
    this.preencherCampo(this.inputs.nomeTestemunha1, testemunha1);
    this.preencherCampo(this.inputs.nomeTestemunha2, testemunha2);
  }

  preencherCpfs(cpf1 = gerarCPF(), cpf2 = gerarCPF()) {
    this.preencherCampo(this.inputs.cpfTestemunha1, cpf1);
    this.preencherCampo(this.inputs.cpfTestemunha2, cpf2);
  }

  preencherDatasNascimento(
    dataNascimento1 = '01011990',
    dataNascimento2 = '01011990'
  ) {
    this.preencherCampo(this.inputs.dataNascimentoTestemunha1, dataNascimento1);
    this.preencherCampo(this.inputs.dataNascimentoTestemunha2, dataNascimento2);
  }

  gerarTipoDocumento() {
    const tiposDocumento = ['RG', 'CNH'];
    return tiposDocumento[Math.floor(Math.random() * tiposDocumento.length)];
  }

  preencherTipoDocumentos(
    documento1 = this.gerarTipoDocumento(),
    documento2 = this.gerarTipoDocumento()
  ) {
    Cypress.env('documentoTestemunha1', documento1);
    Cypress.env('documentoTestemunha2', documento2);

    const documentoMap = {
      RG: '{enter}',
      CNH: '{downarrow}{enter}',
    };

    cy.get(this.inputs.tipoDocumentoTestemunha1)
      .click()
      .type(documentoMap[documento1]);
    cy.get(this.inputs.tipoDocumentoTestemunha2)
      .click()
      .type(documentoMap[documento2]);
  }

  preencherFormulario = () => {
    this.preencherNomes();
    this.preencherCpfs();
    this.preencherDatasNascimento();
    this.preencherTipoDocumentos();
  };
}
