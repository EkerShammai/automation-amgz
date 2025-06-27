export class RecuperarSenhaPage {
  urlResetSenha = `${Cypress.env('AMIGOZ_URL')}/esqueci-senha`;

  inputs = {
    email: '#email',
    enviarBotao: "button[type='submit']",
    retornarBotao: "button[type='button']",
  };

  seletores = {
    corpoMensagem: '.ant-card-body',
    erro: '.ant-form-item-explain-error',
    modalErroNotificacao: '.ant-notification-notice-wrapper',
  };

  visitarPagina() {
    cy.visit(this.urlResetSenha, { failOnStatusCode: false });
  }

  obterElemento(seletor) {
    return cy.get(seletor);
  }

  preencherEmail(email) {
    this.obterElemento(this.inputs.email).type(email);
  }

  clicarBotaoEnviar() {
    this.obterElemento(this.inputs.enviarBotao).click({ force: true });
  }

  clicarBotaoRetornar() {
    this.obterElemento(this.inputs.retornarBotao).click();
  }
}
