const { AMIGOZ_URL } = Cypress.env();

export class LoginPage {
  url = AMIGOZ_URL;

  inputs = {
    cpf: '#identifier',
    senha: '#password',
  };

  botoes = {
    continuar: "button[type='submit']",
    mostrarSenha: 'span[class="ant-input-suffix"]',
  };

  seletores = {
    formulario: 'form',
    erro: '.ant-form-item-explain-error',
    linkEsqueciSenha: 'a[href="/esqueci-senha"]',
    modalErro: '.ant-message-notice-wrapper',
  };

  visitarPagina() {
    cy.visit(this.url, { failOnStatusCode: false });
  }

  obterElemento(seletor) {
    return cy.get(seletor);
  }

  mostrarSenha() {
    return this.obterElemento(this.botoes.mostrarSenha).eq(1).click();
  }

  preencherCampo(campo, valor) {
    return this.obterElemento(campo).type(valor);
  }

  logar(cpf, senha) {
    this.visitarPagina();
    cy.wait('@corban', { timeout: 10000 });
    this.preencherCampo(this.inputs.cpf, cpf);
    this.preencherCampo(this.inputs.senha, senha);
    this.clicarBotaoContinuar();
  }

  clicarBotaoContinuar() {
    return this.obterElemento(this.botoes.continuar).click();
  }
}
