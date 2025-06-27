import { LoginPage } from '../../support/pages/loginPage';

const { API_URL, CPF_VALIDO, SENHA_VALIDA } = Cypress.env();

const mensagens = {
  cpfVazio: 'Informe o CPF',
  senhaVazia: 'Insira a senha',
};

const loginPage = new LoginPage();

describe('Página de Login', () => {
  beforeEach(() => {
    cy.intercept(
      'POST',
      'https://backoffice-dev.byx.capital/api/auth/token/'
    ).as('postAuthToken');
    cy.intercept('GET', 'https://backoffice-dev.byx.capital/api/corbans/').as(
      'getCorbans'
    );
    cy.intercept(
      'POST',
      'https://backoffice-dev.byx.capital/api/auth/select-corban/'
    ).as('postSelectCorban');
    cy.intercept(
      'GET',
      'https://backoffice-dev.byx.capital/api/auth/permissoes-usuario/'
    ).as('getPermissoesUsuario');

    loginPage.visitarPagina();
  });

  describe('Página de Login - Casos de Sucesso', () => {
    it('Deve exibir o formulário de login', () => {
      loginPage.obterFormulario().should('be.visible');
    });

    it('Deve ter campos de CPF e senha visíveis', () => {
      loginPage.obterCampoCPF().should('be.visible');
      loginPage.obterCampoSenha().should('be.visible');
    });

    it('Deve realizar o login com sucesso', () => {
      loginPage.preencherCPF(CPF_VALIDO);
      loginPage.preencherSenha(SENHA_VALIDA);
      loginPage.clicarBotaoContinuar();

      cy.wait('@postAuthToken');
      cy.wait('@getCorbans');
      cy.wait('@postSelectCorban');
      cy.wait('@getPermissoesUsuario');

      cy.url().should('include', '/servicos');
    });

    it('Deve exibir um botão para mostrar/ocultar a senha', () => {
      loginPage.preencherSenha('password123');
      loginPage.obterCampoSenha().should('have.attr', 'type', 'password');
      loginPage.mostrarSenha();
      loginPage.obterCampoSenha().should('have.attr', 'type', 'text');
      loginPage.obterCampoSenha().should('have.value', 'password123');
    });
  });

  describe('Página de Login - Casos de Erro', () => {
    it('Deve exibir erro ao tentar submeter com CPF vazio', () => {
      loginPage.obterCampoCPF().click().blur();
      loginPage.preencherSenha('password123');
      loginPage.obterBotaoContinuar().should('be.disabled');
      loginPage
        .obterMensagemErro()
        .should('be.visible')
        .and('contain', mensagens.cpfVazio);
    });

    it('Deve exibir erro ao tentar submeter com senha vazia', () => {
      loginPage.preencherSenha(' ').clear().blur();
      loginPage.obterBotaoContinuar().should('be.disabled');
      loginPage
        .obterMensagemErro()
        .should('be.visible')
        .and('contain', mensagens.senhaVazia);
    });

    it('Deve exibir erro ao usar credenciais inválidas', () => {
      cy.intercept('POST', `${API_URL}/auth/token/`).as(
        'RequisicaoAutenticacao'
      );
      loginPage.preencherCPF('76775134843');
      loginPage.preencherSenha('wrongpassword');
      loginPage.clicarBotaoContinuar();
      cy.wait('@RequisicaoAutenticacao');
      loginPage.obterModalMensagemErro().should('be.visible');
    });
  });
});
