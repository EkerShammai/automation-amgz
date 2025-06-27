import { gerarDadosBancarios } from '../utils';

export class SimulacaoPage {
  inputs = {
    bank: '#bank',
    agency: '#agency',
    account: '#number',
    accountDigit: '#digit',
    typeAccount: '#type',
  };

  seletors = {
    bankSantander: 'div[title="033 - Banco Santander Brasil S.A"]',
  };

  preencherCampo(seletor, valor, opcoes = {}) {
    cy.get(seletor).type(valor, opcoes);
  }

  preencherNumeroAgencia(numeroAgencia) {
    this.preencherCampo(this.inputs.agency, numeroAgencia, { force: true });
  }

  preencherNumeroConta(numeroConta) {
    this.preencherCampo(this.inputs.account, numeroConta);
  }

  preencherDigitoConta(digitoConta) {
    this.preencherCampo(this.inputs.accountDigit, digitoConta);
  }

  selecionarTipoConta(tipoConta) {
    cy.get(this.inputs.typeAccount).click();
    cy.contains(tipoConta, { timeout: 5000 }).click();
  }

  selecionarBanco(codigoBanco) {
    this.preencherCampo(this.inputs.bank, codigoBanco);
    cy.get(this.seletors.bankSantander).click();
  }

  preencherDadosBancarios() {
    const { numeroAgencia, numeroConta, digitoConta, codigoBanco, tipoConta } =
      gerarDadosBancarios();

    this.preencherNumeroAgencia(numeroAgencia);
    this.preencherNumeroConta(numeroConta);
    this.preencherDigitoConta(digitoConta);
    this.selecionarTipoConta(tipoConta);
    this.selecionarBanco(codigoBanco);
  }
}
