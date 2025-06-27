import { cartoes } from '../../fixtures/cartoes';
import { mensagens } from '../../fixtures/mensagens';
import { DadosPessoaisPage } from '../../support/pages/DadosPessoaisPage';
import { EnderecoPage } from '../../support/pages/EnderecoPage';
import { IdentificacaoPage } from '../../support/pages/IdentificacaoPage';
import { MargemPage } from '../../support/pages/MargemPage';
import { RogadoPage } from '../../support/pages/RogadoPage';
import { SimulacaoPage } from '../../support/pages/SimulacaoPage';
import { TestemunhaPage } from '../../support/pages/TestemunhaPage';

const API_URL = Cypress.env('API_URL');

const registrarIntercepts = () => {
  cy.fixture('interceptacoes.json').then((interceptacoes) => {
    Object.keys(interceptacoes).forEach((key) => {
      const { metodo, url } = interceptacoes[key];
      cy.intercept(metodo, `${API_URL}/${url}`).as(key);
    });
  });
};

const identificacaoPage = new IdentificacaoPage();
const margemPage = new MargemPage();
const simulacaoPage = new SimulacaoPage();
const dadosPessoaisPage = new DadosPessoaisPage();
const testemunhaPage = new TestemunhaPage();
const rogadoPage = new RogadoPage();
const enderecoPage = new EnderecoPage();

describe('Contrato Figital', () => {
  beforeEach(() => {
    registrarIntercepts();
    cy.viewport(1920, 1080);
    cy.Login();
  });

  it('Deve criar um contrato com sucesso com o tipo de produto "Cartão Benefício" e margem "Margem Única"', () => {
    const valorMargem = 1000;
    const cartaoBeneficio = cartoes.beneficio.nome;
    const margemUnica = cartoes.beneficio.margens[2];
    const numeroConvenio = '6';

    cy.ClicarBotaoCriarContrato();
    cy.wait('@consultarConvenios');

    identificacaoPage.selecionarConvenio(numeroConvenio);
    identificacaoPage.preencherFormulario();
    cy.ClicarBotao('Continuar');

    margemPage.preencherSimulacao(cartaoBeneficio, margemUnica, valorMargem);
    cy.ClicarBotao('Simular oferta');

    cy.wait(['@simularLimite', '@simularSaque', '@simularSeguro']);
    cy.ClicarBotao('Adicionar');

    simulacaoPage.preencherDadosBancarios();
    cy.ClicarBotao('Salvar');
    cy.ClicarBotao('Continuar');

    cy.wait(['@listarUF', '@listarDocumentos', '@listarSexos']);
    dadosPessoaisPage.preencherFormulario();
    cy.ClicarBotao('Continuar');

    enderecoPage.preencherFormulario('SP');
    cy.ClicarBotao('Continuar');
    cy.wait(800);
    cy.ClicarBotao('Continuar');

    cy.wait('@formalizacao', { timeout: 10000 });

    cy.contains(mensagens.sucesso).should('be.visible');
    cy.contains(mensagens.instrucoesFigital).should('be.visible');
    cy.contains(mensagens.termos.termoDiamante).should('be.visible');
    cy.contains(mensagens.termos.termoConsentimento).should('be.visible');
    cy.contains(mensagens.termos.termoAdesao).should('be.visible');
    cy.contains(mensagens.termos.termoCCBSaqueParcelado).should('be.visible');

    cy.get('a')
      .filter(':contains("Download")')
      .should('have.length.at.least', 4)
      .each((link) => {
        cy.wrap(link).should('be.visible');
      });

    cy.get('button')
      .filter(':contains("Enviar documento")')
      .should('have.length.at.least', 4)
      .each((button) => {
        cy.wrap(button).should('be.visible').and('be.enabled');
      });

    cy.get('a[href="/servicos"]')
      .eq(1)
      .scrollIntoView()
      .should('be.visible')
      .find('button')
      .should('be.visible')
      .and('be.enabled')
      .and('contain.text', 'Digitar nova proposta');
  });

  it('Deve criar um contrato com sucesso com o tipo de produto "Cartão Benefício" e "Margem Compra"', () => {
    const valorMargem = 1000;
    const numeroConvenio = '6';
    const cartao = cartoes.beneficio.nome;
    const margemCompra = cartoes.beneficio.margens[0];
    const totalButtons = 3;

    cy.ClicarBotaoCriarContrato();
    cy.wait('@consultarConvenios');
    identificacaoPage.selecionarConvenio(numeroConvenio);
    identificacaoPage.preencherFormulario();
    cy.ClicarBotao('Continuar');

    margemPage.preencherSimulacao(cartao, margemCompra, valorMargem);
    cy.ClicarBotao('Simular oferta');

    cy.wait(['@simularLimite', '@simularSeguro']);
    cy.ClicarBotao('Continuar');

    cy.wait(['@listarUF', '@listarDocumentos', '@listarSexos']);
    dadosPessoaisPage.preencherFormulario();
    cy.ClicarBotao('Continuar');

    enderecoPage.preencherFormulario('SP');
    cy.ClicarBotao('Continuar');
    cy.wait(800);
    cy.ClicarBotao('Continuar');

    cy.wait('@formalizacao', { timeout: 10000 });

    cy.contains(mensagens.sucesso).should('be.visible');
    cy.contains(mensagens.instrucoesFigital).should('be.visible');
    cy.contains(mensagens.termos.termoDiamante).should('be.visible');
    cy.contains(mensagens.termos.termoConsentimento).should('be.visible');
    cy.contains(mensagens.termos.termoAdesao).should('be.visible');

    cy.get('a')
      .filter(':contains("Download")')
      .should('have.length.at.least', totalButtons)
      .each((link) => {
        cy.wrap(link).should('be.visible');
      });

    cy.get('button')
      .filter(':contains("Enviar documento")')
      .should('have.length.at.least', totalButtons)
      .each((button) => {
        cy.wrap(button).should('be.visible').and('be.enabled');
      });

    cy.get('a[href="/servicos"]')
      .eq(1)
      .scrollIntoView()
      .should('be.visible')
      .find('button')
      .should('be.visible')
      .and('be.enabled')
      .and('contain.text', 'Digitar nova proposta');
  });

  it('Deve criar um contrato com sucesso com o tipo de produto "Cartão Benefício" e "Margem Saque"', () => {
    const valorMargem = 1000;
    const numeroConvenio = '6';
    const cartao = cartoes.beneficio.nome;
    const margemSaque = cartoes.beneficio.margens[1];

    cy.ClicarBotaoCriarContrato();
    cy.wait('@consultarConvenios');
    identificacaoPage.selecionarConvenio(numeroConvenio);
    identificacaoPage.preencherFormulario();
    cy.ClicarBotao('Continuar');

    margemPage.preencherSimulacao(cartao, margemSaque, valorMargem);
    cy.ClicarBotao('Simular oferta');

    cy.wait(['@simularLimite', '@simularSaque', '@simularSeguro']);
    cy.ClicarBotao('Adicionar');

    simulacaoPage.preencherDadosBancarios();
    cy.ClicarBotao('Salvar');
    cy.ClicarBotao('Continuar');

    cy.wait(['@listarUF', '@listarDocumentos', '@listarSexos']);
    dadosPessoaisPage.preencherFormulario();
    cy.ClicarBotao('Continuar');

    enderecoPage.preencherFormulario('SP');
    cy.ClicarBotao('Continuar');
    cy.wait(800);
    cy.ClicarBotao('Continuar');

    cy.wait('@formalizacao', { timeout: 10000 });

    cy.contains(mensagens.sucesso).should('be.visible');
    cy.contains(mensagens.instrucoesFigital).should('be.visible');
    cy.contains(mensagens.termos.termoDiamante).should('be.visible');
    cy.contains(mensagens.termos.termoConsentimento).should('be.visible');
    cy.contains(mensagens.termos.termoAdesao).should('be.visible');
    cy.contains(mensagens.termos.termoCCBSaqueParcelado).should('be.visible');

    cy.get('a')
      .filter(':contains("Download")')
      .should('have.length.at.least', 4)
      .each((link) => {
        cy.wrap(link).should('be.visible');
      });

    cy.get('button')
      .filter(':contains("Enviar documento")')
      .should('have.length.at.least', 4)
      .each((button) => {
        cy.wrap(button).should('be.visible').and('be.enabled');
      });

    cy.get('a[href="/servicos"]')
      .eq(1)
      .scrollIntoView()
      .should('be.visible')
      .find('button')
      .should('be.visible')
      .and('be.enabled')
      .and('contain.text', 'Digitar nova proposta');
  });

  it('Deve criar um contrato com sucesso com o tipo de produto "Cartão Benefício" e "Margem Única"', () => {
    const valorMargem = 1000;
    const numeroConvenio = '6';
    const cartao = cartoes.beneficio.nome;
    const margemUnica = cartoes.beneficio.margens[2];

    cy.ClicarBotaoCriarContrato();
    cy.wait('@consultarConvenios');
    identificacaoPage.selecionarConvenio(numeroConvenio);
    identificacaoPage.preencherFormulario();
    cy.ClicarBotao('Continuar');

    margemPage.preencherSimulacao(cartao, margemUnica, valorMargem);
    cy.ClicarBotao('Simular oferta');

    cy.wait(['@simularLimite', '@simularSaque', '@simularSeguro']);
    cy.ClicarBotao('Adicionar');

    simulacaoPage.preencherDadosBancarios();
    cy.ClicarBotao('Salvar');
    cy.ClicarBotao('Continuar');

    cy.wait(['@listarUF', '@listarDocumentos', '@listarSexos']);
    dadosPessoaisPage.preencherFormulario();
    cy.ClicarBotao('Continuar');

    enderecoPage.preencherFormulario('SP');
    cy.ClicarBotao('Continuar');
    cy.wait(800);
    cy.ClicarBotao('Continuar');

    cy.wait('@formalizacao', { timeout: 10000 });

    cy.contains(mensagens.sucesso).should('be.visible');
    cy.contains(mensagens.instrucoesFigital).should('be.visible');
    cy.contains(mensagens.termos.termoDiamante).should('be.visible');
    cy.contains(mensagens.termos.termoConsentimento).should('be.visible');
    cy.contains(mensagens.termos.termoAdesao).should('be.visible');
    cy.contains(mensagens.termos.termoCCBSaqueParcelado).should('be.visible');

    cy.get('a')
      .filter(':contains("Download")')
      .should('have.length.at.least', 4)
      .each((link) => {
        cy.wrap(link).should('be.visible');
      });

    cy.get('button')
      .filter(':contains("Enviar documento")')
      .should('have.length.at.least', 4)
      .each((button) => {
        cy.wrap(button).should('be.visible').and('be.enabled');
      });

    cy.get('a[href="/servicos"]')
      .eq(1)
      .scrollIntoView()
      .should('be.visible')
      .find('button')
      .should('be.visible')
      .and('be.enabled')
      .and('contain.text', 'Digitar nova proposta');
  });

  it('Deve criar um contrato com sucesso com o tipo de produto "Cartão Benefício", "Margem Única" e "Margem Compra"', () => {
    const valorMargem = 1000;
    const cartaoBeneficio = cartoes.beneficio.nome;
    const margemSaque = cartoes.beneficio.margens[1];
    const margemUnica = cartoes.beneficio.margens[2];
    const numeroConvenio = '6';
    const margemPage2 = new MargemPage(1);
    const totalBotaoContrato = 5;

    cy.ClicarBotaoCriarContrato();
    cy.wait('@consultarConvenios');
    identificacaoPage.selecionarConvenio(numeroConvenio);
    identificacaoPage.preencherFormulario();
    cy.ClicarBotao('Continuar');

    margemPage.preencherSimulacao(cartaoBeneficio, margemSaque, valorMargem);
    cy.ClicarBotao('Adicionar mais uma margem');

    margemPage2.preencherSimulacao(cartaoBeneficio, margemUnica, valorMargem);

    cy.ClicarBotao('Simular oferta');

    cy.wait(['@simularLimite', '@simularSaque', '@simularSeguro']);
    cy.ClicarBotao('Adicionar');
    simulacaoPage.preencherDadosBancarios();

    cy.ClicarBotao('Salvar');
    cy.ClicarBotao('Continuar');

    cy.wait(['@listarUF', '@listarDocumentos', '@listarSexos']);
    dadosPessoaisPage.preencherFormulario();
    cy.ClicarBotao('Continuar');

    enderecoPage.preencherFormulario('SP');
    cy.ClicarBotao('Continuar');
    cy.wait(800);
    cy.ClicarBotao('Continuar');

    cy.wait('@formalizacao', { timeout: 10000 });

    cy.contains(mensagens.sucesso).should('be.visible');
    cy.contains(mensagens.instrucoesFigital).should('be.visible');
    cy.contains(mensagens.termos.termoDiamante).should('be.visible');
    cy.contains(mensagens.termos.termoAdesao).should('be.visible');
    cy.contains(mensagens.termos.termoConsentimento).should('be.visible');

    cy.get('a[href="/servicos"]')
      .eq(1)
      .scrollIntoView()
      .should('be.visible')
      .find('button')
      .should('be.visible')
      .and('be.enabled')
      .and('contain.text', 'Digitar nova proposta');

    cy.get('a')
      .filter(':contains("Download")')
      .should('have.length.at.least', totalBotaoContrato)
      .each((link) => {
        cy.wrap(link).should('be.visible');
      });

    cy.get('button')
      .filter(':contains("Enviar documento")')
      .should('have.length.at.least', totalBotaoContrato)
      .each((button) => {
        cy.wrap(button).should('be.visible').and('be.enabled');
      });
  });

  it('Deve criar um contrato com sucesso para um cliente analfabeto com o tipo de produto "Cartão Benefício" e "Margem Única""', () => {
    const valorMargem = 1000;
    const cartaoBeneficio = cartoes.beneficio.nome;
    const margemUnica = cartoes.beneficio.margens[2];
    const numeroConvenio = '6';

    cy.ClicarBotaoCriarContrato();
    cy.wait('@consultarConvenios');
    identificacaoPage.selecionarConvenio(numeroConvenio);
    identificacaoPage.preencherCPF();
    identificacaoPage.preencherDataNascimento();
    identificacaoPage.preencherNome();
    identificacaoPage.preencherTelefone();
    identificacaoPage.selecionarNivelEscolaridade('Analfabeto');

    rogadoPage.preencherFormulario();

    cy.ClicarBotao('Continuar');

    margemPage.preencherSimulacao(cartaoBeneficio, margemUnica, valorMargem);
    cy.ClicarBotao('Simular oferta');

    cy.wait(['@simularLimite', '@simularSaque', '@simularSeguro']);
    cy.ClicarBotao('Adicionar');

    simulacaoPage.preencherDadosBancarios();
    cy.ClicarBotao('Salvar');
    cy.ClicarBotao('Continuar');

    cy.wait(['@listarUF', '@listarDocumentos', '@listarSexos']);
    dadosPessoaisPage.preencherFormulario();
    testemunhaPage.preencherFormulario();

    cy.ClicarBotao('Continuar');

    enderecoPage.preencherFormulario('SP');
    cy.ClicarBotao('Continuar');

    cy.wait('@enviarDocumentos');

    const documentoCliente = Cypress.env('documentoCliente');
    const documentoRogado = Cypress.env('documentoRogado');
    const documentoTestemunha1 = Cypress.env('documentoTestemunha1');
    const documentoTestemunha2 = Cypress.env('documentoTestemunha2');

    cy.EnviarDocumento(documentoCliente, true);
    cy.EnviarDocumento(documentoRogado);
    cy.EnviarDocumento(documentoTestemunha1);
    cy.EnviarDocumento(documentoTestemunha2);

    cy.wait(800);

    cy.ClicarBotao('Continuar');

    cy.wait('@formalizacao', { timeout: 10000 });

    cy.contains(mensagens.sucesso).should('be.visible');
    cy.contains(mensagens.instrucoesAnalfabeto).should('be.visible');
    cy.contains(mensagens.termos.termoDiamante).should('be.visible');
    cy.contains(mensagens.termos.termoConsentimento).should('be.visible');
    cy.contains(mensagens.termos.termoAdesao).should('be.visible');
    cy.contains(mensagens.termos.termoCCBSaqueParcelado).should('be.visible');
  });
});
