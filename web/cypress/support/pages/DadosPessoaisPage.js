import { faker } from '@faker-js/faker';
import { gerarEstadoCivil, gerarGenero, gerarNomeAleatorio } from '../utils';

export class DadosPessoaisPage {
  inputs = {
    tipoDocumento: '#customer_documento_tipo',
    orgaoEmissor: '#customer_documento_orgao_emissor',
    dataEmissao: '#customer_documento_data_emissao',
    genero: '#customer_sexo',
    estadoCivil: '#customer_estado_civil',
    email: '#customer_email',
    renda: '#customer_renda',
    nomeMae: '#customer_nome_mae',
    numeroDocumento: '#customer_documento_numero',
    uf: '#customer_documento_uf',
  };

  gerarTipoDocumento() {
    const tiposDocumento = ['RG', 'CNH', 'Outros'];
    return tiposDocumento[Math.floor(Math.random() * tiposDocumento.length)];
  }

  selecionarOpcao(seletor, opcoesMap, opcao) {
    cy.get(seletor).click({ force: true }).type(opcoesMap[opcao]);
  }

  preencherCampo(seletor, valor, opcoes = {}) {
    cy.get(seletor).type(valor, opcoes).blur();
  }

  preencherTipoDocumento(documento = this.gerarTipoDocumento()) {
    const documentoMap = {
      RG: '{enter}',
      CNH: '{downarrow}{enter}',
      Outros: '{downarrow}{downarrow}{enter}',
    };

    Cypress.env('documentoCliente', documento);

    this.selecionarOpcao(this.inputs.tipoDocumento, documentoMap, documento);
  }

  preencherNumeroDocumento() {
    const numeroDocumento =
      Cypress.env('documentoCliente') === 'CNH' ? '98765410321' : '123456789';
    this.preencherCampo(this.inputs.numeroDocumento, numeroDocumento);
  }

  preencherUF() {
    const numeroAleatorio = Math.floor(Math.random() * 10) + 1;
    const comandosDownarrow = '{downarrow}'.repeat(numeroAleatorio);
    const comando = `${comandosDownarrow}{enter}`;

    cy.get(this.inputs.uf).click().type(comando);
  }

  preencherOrgaoEmissor(orgaoEmissor = 'SSP') {
    this.preencherCampo(this.inputs.orgaoEmissor, orgaoEmissor);
  }

  preencherDataEmissao(dataEmissao = '26072021') {
    this.preencherCampo(this.inputs.dataEmissao, dataEmissao);
  }

  preencherGenero(genero = gerarGenero()) {
    const generoMap = {
      Feminino: '{enter}',
      Masculino: '{downarrow}{enter}',
    };

    this.selecionarOpcao(this.inputs.genero, generoMap, genero);
  }

  preencherEstadoCivil(estadoCivil = gerarEstadoCivil()) {
    const estadoCivilMap = {
      'Solteiro(a)': '{enter}',
      'Casado(a)': '{downarrow}{enter}',
      'Divorciado(a)': '{downarrow}{downarrow}{enter}',
      'Viúvo(a)': '{downarrow}{downarrow}{downarrow}{enter}',
    };
    this.selecionarOpcao(this.inputs.estadoCivil, estadoCivilMap, estadoCivil);
  }

  preencherEmail(email = faker.internet.email()) {
    this.preencherCampo(this.inputs.email, email);
  }

  preencherRenda(renda = '6500') {
    this.preencherCampo(this.inputs.renda, renda, { force: true });
  }

  preencherNomeMae(nomeMae = gerarNomeAleatorio()) {
    this.preencherCampo(this.inputs.nomeMae, nomeMae);
  }

  preencherFormulario() {
    this.preencherTipoDocumento();
    this.preencherNumeroDocumento();
    this.preencherUF();
    this.preencherOrgaoEmissor();
    this.preencherDataEmissao();
    this.preencherGenero();
    this.preencherEstadoCivil();
    this.preencherEmail();
    this.preencherRenda();
    this.preencherNomeMae();
  }
}
