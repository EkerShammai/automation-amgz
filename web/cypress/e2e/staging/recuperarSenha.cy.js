import { RecuperarSenhaPage } from '../../support/pages/RecuperarSenhaPage';

const { API_URL, EMAIL_VALIDO: emailValido } = Cypress.env();

const mensagens = {
  emailVazio: 'Informe o e-mail',
  emailEnviado: 'E-mail enviado',
  descricaoEmailEnviado:
    'Confira seu e-mail e abra o link que enviamos para continuar.',
};

describe('Página de Redefinição de Senha', () => {
  const recuperarSenhaPage = new RecuperarSenhaPage();

  beforeEach(() => {
    cy.intercept('POST', `${API_URL}/auth/password-request-reset`).as(
      'RequisicaoResetSenha'
    );
    recuperarSenhaPage.visitarPagina();
  });

  describe('Redefinição de Senha - Casos de Sucesso', () => {
    it('Deve enviar um e-mail de redefinição de senha para um e-mail válido', () => {
      recuperarSenhaPage.preencherEmail(emailValido);
      recuperarSenhaPage.clicarBotaoEnviar();
      recuperarSenhaPage
        .obterCorpoMensagem()
        .should('be.visible')
        .and('contain', mensagens.emailEnviado)
        .and('contain', mensagens.descricaoEmailEnviado);
      recuperarSenhaPage
        .obterBotaoRetornar()
        .should('be.visible')
        .and('contain', 'Retornar');
    });
  });

  describe('Redefinição de Senha - Casos de Erro', () => {
    it('Deve exibir um erro para e-mail vazio', () => {
      recuperarSenhaPage.preencherEmail('').clear().blur();
      recuperarSenhaPage.clicarBotaoEnviar();
      recuperarSenhaPage
        .obterMensagemErro()
        .should('be.visible')
        .and('contain', mensagens.emailVazio);
    });

    it('Deve exibir um erro para e-mail inválido', () => {
      recuperarSenhaPage.preencherEmail('emailinvalido@g.com');
      recuperarSenhaPage.obterBotaoSubmeter().click();
      cy.wait('@RequisicaoResetSenha');
      recuperarSenhaPage.obterModalErroNotificacao().should('be.visible');
    });
  });
});
