import { LoginPage } from './pages/loginPage';

const { CPF_VALIDO, SENHA_VALIDA, API_URL } = Cypress.env();
const loginPage = new LoginPage();

Cypress.Commands.add('Login', () => {
  loginPage.logar(CPF_VALIDO, SENHA_VALIDA);
});

function configurarInterceptacoes() {
  cy.intercept('GET', `${API_URL}/corbans/`).as('obterCorbans');
  cy.intercept('POST', `${API_URL}/auth/select-corban`).as('selecionarCorban');
  cy.intercept('GET', `${API_URL}/auth/permissoes-usuario`).as(
    'obterPermissoes'
  );
}

Cypress.Commands.add('ClicarBotaoCriarContrato', () => {
  configurarInterceptacoes();
  cy.wait(['@obterCorbans', '@selecionarCorban', '@obterPermissoes']);
  cy.ClicarBotao('Selecionar');
});

Cypress.Commands.add('ClicarBotao', (buttonText) => {
  cy.contains('button', buttonText).click();
});

let fileInputIndex = 0;
function enviarDocumentos(tipoDocumento, comprovanteResidencia = false) {
  const seletorUpload = 'input[type="file"]';
  const documentos = {
    RG: [
      'cypress/fixtures/documentos/RG_FRENTE.png',
      'cypress/fixtures/documentos/RG_VERSO.png',
    ],
    CNH: ['cypress/fixtures/documentos/CNH.jpg'],
    Outros: [
      'cypress/fixtures/documentos/RG_FRENTE.png',
      'cypress/fixtures/documentos/RG_VERSO.png',
    ],
    residencia: 'cypress/fixtures/documentos/comprovanteResidencia.png',
  };

  cy.get(seletorUpload)
    .eq(fileInputIndex)
    .selectFile(documentos[tipoDocumento][0], { force: true });
  fileInputIndex++;

  if (tipoDocumento === 'RG' || tipoDocumento === 'Outros') {
    cy.get(seletorUpload)
      .eq(fileInputIndex)
      .selectFile(documentos[tipoDocumento][1], { force: true });
    fileInputIndex++;
  }

  if (comprovanteResidencia) {
    cy.get(seletorUpload).eq(fileInputIndex).selectFile(documentos.residencia, {
      force: true,
    });
    fileInputIndex += 2;
  }
}

Cypress.Commands.add(
  'EnviarDocumento',
  (documento, comprovanteResidencia = false) => {
    enviarDocumentos(documento, comprovanteResidencia);
  }
);
