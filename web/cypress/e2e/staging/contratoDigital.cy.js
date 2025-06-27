import { cartoes } from '../../fixtures/cartoes';
import { mensagens, mensagensRepresentante } from '../../fixtures/mensagens';
import { DadosPessoaisPage } from '../../support/pages/DadosPessoaisPage';
import { EnderecoPage } from '../../support/pages/EnderecoPage';
import { IdentificacaoPage } from '../../support/pages/IdentificacaoPage';
import { MargemPage } from '../../support/pages/MargemPage';
import { RepresentantePage } from '../../support/pages/RepresentantePage';
import { RogadoPage } from '../../support/pages/RogadoPage';
import { SimulacaoPage } from '../../support/pages/SimulacaoPage';
import { TestemunhaPage } from '../../support/pages/TestemunhaPage';

const API_URL = Cypress.env('API_URL');

const identificacaoPage = new IdentificacaoPage();
const rogadoPage = new RogadoPage();
const testemunhaPage = new TestemunhaPage();
const simulacaoPage = new SimulacaoPage();
const dadosPessoaisPage = new DadosPessoaisPage();
const enderecoPage = new EnderecoPage();
const margemPage = new MargemPage();
const representantePage = new RepresentantePage();

const registrarIntercepts = () => {
  cy.fixture('interceptacoes.json').then((interceptacoes) => {
    Object.keys(interceptacoes).forEach((key) => {
      const { metodo, url } = interceptacoes[key];
      cy.intercept(metodo, `${API_URL}/${url}`).as(key);
    });
  });
};

describe('Contrato Digital', () => {
  beforeEach(() => {
    registrarIntercepts();
    cy.viewport(1920, 1080);
    cy.Login();
  });

  it('Deve criar um contrato com sucesso com o tipo de produto "Cartão Consignado" e "Margem Única"', () => {
    const valorMargem = 1000;
    const numeroConvenio = '6';
    const cartao = cartoes.consignado.nome;
    const margemUnica = cartoes.consignado.margens[0];

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

    enderecoPage.preencherFormulario();
    cy.ClicarBotao('Continuar');
    cy.wait(800);
    cy.ClicarBotao('Continuar');

    cy.wait('@formalizacao', { timeout: 10000 });

    cy.contains(
      'Digitação realizada com sucesso, prossiga com a formalização pelo(a) cliente.'
    ).should('be.visible');

    cy.contains('Automatizado Targaryen').should('be.visible');
    cy.contains('Link para formalização').should('be.visible');

    cy.get('button span').contains('Copiar link').should('be.visible');
    cy.get('button span')
      .contains('Digitar nova proposta')
      .scrollIntoView()
      .should('be.visible');
    cy.get('button span').contains('Enviar SMS').should('be.visible');
    cy.get('button span').contains('Enviar WhatsApp').should('be.visible');
  });

  it('Deve criar um contrato com sucesso com o tipo de produto "Cartão Benefício" e "Margem Compra"', () => {
    const valorMargem = 1000;
    const numeroConvenio = '6';
    const cartao = cartoes.beneficio.nome;
    const margemCompra = cartoes.beneficio.margens[0];

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

    enderecoPage.preencherFormulario();
    cy.ClicarBotao('Continuar');
    cy.wait(800);

    const documentoCliente = Cypress.env('documentoCliente');

    cy.EnviarDocumento(documentoCliente, true);
    cy.ClicarBotao('Continuar');

    cy.wait('@criarContrato', { timeout: 12000 });

    cy.contains(
      'Digitação realizada com sucesso, prossiga com a formalização pelo(a) cliente.'
    ).should('be.visible');

    cy.contains('Automatizado Targaryen').should('be.visible');
    cy.contains('Link para formalização').should('be.visible');

    cy.get('button span').contains('Copiar link').should('be.visible');
    cy.get('button span')
      .contains('Digitar nova proposta')
      .scrollIntoView()
      .should('be.visible');
    cy.get('button span').contains('Enviar SMS').should('be.visible');
    cy.get('button span').contains('Enviar WhatsApp').should('be.visible');
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

    enderecoPage.preencherFormulario();
    cy.ClicarBotao('Continuar');
    cy.wait(800);
    cy.ClicarBotao('Continuar');

    cy.wait('@formalizacao', { timeout: 10000 });

    cy.contains(
      'Digitação realizada com sucesso, prossiga com a formalização pelo(a) cliente.'
    ).should('be.visible');

    cy.contains('Automatizado Targaryen').should('be.visible');
    cy.contains('Link para formalização').should('be.visible');

    cy.get('button span').contains('Copiar link').should('be.visible');
    cy.get('button span')
      .contains('Digitar nova proposta')
      .scrollIntoView()
      .should('be.visible');
    cy.get('button span').contains('Enviar SMS').should('be.visible');
    cy.get('button span').contains('Enviar WhatsApp').should('be.visible');
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

    enderecoPage.preencherFormulario();
    cy.ClicarBotao('Continuar');
    cy.wait(800);
    cy.ClicarBotao('Continuar');

    cy.wait('@formalizacao', { timeout: 10000 });

    cy.contains(
      'Digitação realizada com sucesso, prossiga com a formalização pelo(a) cliente.'
    ).should('be.visible');

    cy.contains('Automatizado Targaryen').should('be.visible');
    cy.contains('Link para formalização').should('be.visible');

    cy.get('button span').contains('Copiar link').should('be.visible');
    cy.get('button span')
      .contains('Digitar nova proposta')
      .scrollIntoView()
      .should('be.visible');
    cy.get('button span').contains('Enviar SMS').should('be.visible');
    cy.get('button span').contains('Enviar WhatsApp').should('be.visible');
  });

  it('Deve criar um contrato com sucesso com o tipo de produto "Cartão Benefício", "Margem Compra" e "Cartão Consignado" "Margem Única" ', () => {
    const valorMargem = 1000;
    const cartaoBeneficio = cartoes.beneficio.nome;
    const cartaoConsignado = cartoes.consignado.nome;
    const margemUnica = cartoes.beneficio.margens[2];
    const margemCompra = cartoes.beneficio.margens[0];
    const numeroConvenio = '6';
    const margemPage2 = new MargemPage(1);

    cy.ClicarBotaoCriarContrato();
    cy.wait('@consultarConvenios');
    identificacaoPage.selecionarConvenio(numeroConvenio);
    identificacaoPage.preencherFormulario();
    cy.ClicarBotao('Continuar');

    margemPage.preencherSimulacao(cartaoBeneficio, margemCompra, valorMargem);
    cy.ClicarBotao('Adicionar mais uma margem');

    margemPage2.preencherSimulacao(cartaoConsignado, margemUnica, valorMargem);

    cy.ClicarBotao('Simular oferta');

    cy.wait([
      '@simularLimite',
      '@simularSaque',
      '@simularSeguro',
      '@simularSeguro',
    ]).then((intercepts) => {
      const sucessoNasRequisicoes = intercepts.every(
        (intercept) => intercept.response.statusCode === 200
      );
      if (sucessoNasRequisicoes) {
        simulacaoPage.preencherDadosBancarios();
        cy.ClicarBotao('Salvar');
      }
    });

    cy.ClicarBotao('Continuar');

    cy.wait(['@listarUF', '@listarDocumentos', '@listarSexos']);
    dadosPessoaisPage.preencherFormulario();
    cy.ClicarBotao('Continuar');

    enderecoPage.preencherFormulario();

    cy.wait('@consultaDocumentos');
    const documentoCliente = Cypress.env('documentoCliente');

    cy.EnviarDocumento(documentoCliente, true);
    cy.ClicarBotao('Continuar');

    cy.wait(800);
    cy.ClicarBotao('Continuar');

    cy.wait('@formalizacao');
    cy.wait('@criarEnvelope').then((intercept) => {
      Cypress.env('tokenEnvelope', intercept.response.body.token_envelope);
    });

    cy.wait('@criarContrato').then((intercept) => {
      console.log(intercept.response.body.token_contrato);
      Cypress.env('tokenContrato', intercept.response.body.token_contrato);
    });

    cy.contains(
      'Digitação realizada com sucesso, prossiga com a formalização pelo(a) cliente.'
    ).should('be.visible');

    cy.contains('Automatizado Targaryen').should('be.visible');
    cy.contains('Link para formalização').should('be.visible');

    cy.get('button span').contains('Copiar link').should('be.visible');
    cy.get('button span')
      .contains('Digitar nova proposta')
      .scrollIntoView()
      .should('be.visible');
    cy.get('button span').contains('Enviar SMS').should('be.visible');
    cy.get('button span').contains('Enviar WhatsApp').should('be.visible');
  });

  it('Deve criar um contrato com sucesso para um cliente analfabeto com o tipo de produto "Cartão Benefício" e "Margem Única"', () => {
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

    enderecoPage.preencherFormulario();
    cy.ClicarBotao('Continuar');
    cy.intercept('POST', `${API_URL}/contratos/consulta-documentos-produto`).as(
      'consultaDocumentos'
    );
    cy.wait('@consultaDocumentos');

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

    cy.wait('@criarContrato', { timeout: 10000 });

    cy.contains(mensagens.sucesso).should('be.visible');
    cy.contains(mensagens.instrucoesAnalfabeto).should('be.visible');
    cy.contains(mensagens.termos.termoDiamante).should('be.visible');
    cy.contains(mensagens.termos.termoConsentimento).should('be.visible');
    cy.contains(mensagens.termos.termoAdesao).should('be.visible');
    cy.contains(mensagens.termos.termoCCBSaqueParcelado).should('be.visible');
  });
  it('Deve criar um contrato com sucesso para um cliente com representante legal e o tipo de produto "Cartão Benefício" e "Margem Única"', () => {
    const valorMargem = 1000;
    const cartaoBeneficio = cartoes.beneficio.nome;
    const margemUnica = cartoes.beneficio.margens[2];
    const numeroConvenio = '1';

    cy.ClicarBotaoCriarContrato();
    cy.wait('@consultarConvenios');
    identificacaoPage.selecionarConvenio(numeroConvenio);
    identificacaoPage.preencherCPF('118.922.260-49');
    cy.wait(['@restricaoCliente', '@verificaCartao']);
    identificacaoPage.selecionarRepresentanteLegal('Sim');
    identificacaoPage.preencherDataNascimento();
    identificacaoPage.preencherNome();
    identificacaoPage.selecionarNivelEscolaridade();
    identificacaoPage.preencherTelefone();

    representantePage.preencherIdentificacao('697.284.250-66');

    cy.ClicarBotao('Continuar');

    margemPage.selecionarBeneficio();
    margemPage.selecionarTipoCartao(cartaoBeneficio);
    margemPage.selecionarTipoMargem(margemUnica);
    margemPage.preencherNumeroMatricula();
    margemPage.preencherMargemDisponivel(valorMargem);
    cy.ClicarBotao('Simular oferta');

    cy.wait(['@simularLimite', '@simularSaque', '@simularSeguro']);
    cy.ClicarBotao('Adicionar');

    simulacaoPage.preencherDadosBancarios();
    cy.ClicarBotao('Salvar');
    cy.ClicarBotao('Continuar');

    cy.wait(['@listarUF', '@listarDocumentos', '@listarSexos']);
    dadosPessoaisPage.preencherFormulario();
    representantePage.preencherDadosPessoais();

    cy.ClicarBotao('Continuar');

    enderecoPage.preencherFormulario();
    cy.ClicarBotao('Continuar');
    cy.intercept('POST', `${API_URL}/contratos/consulta-documentos-produto`).as(
      'consultaDocumentos'
    );
    cy.wait('@consultaDocumentos');

    const documentoCliente = Cypress.env('documentoCliente');
    const documentoRepresentante = Cypress.env('documentoRepresentante');

    cy.EnviarDocumento(documentoCliente, true);
    cy.EnviarDocumento(documentoRepresentante);

    cy.wait(800);

    cy.ClicarBotao('Continuar');

    cy.wait('@criarContrato', { timeout: 10000 });

    cy.contains(mensagensRepresentante.sucesso).should('be.visible');
    cy.contains(mensagensRepresentante.instrucoesFormalizacao).should(
      'be.visible'
    );
    cy.contains('button', 'Copiar link').should('be.visible');
    cy.contains('button', 'Enviar SMS').should('be.visible');
    cy.contains('button', 'Enviar WhatsApp').should('be.visible');
  });
  it.only('Deve criar um contrato com sucesso para um cliente com saque complementar', () => {
    const valorMargem = 1000;
    const cartaoBeneficio = cartoes.beneficio.nome;
    const margemUnica = cartoes.beneficio.margens[2];
    const numeroConvenio = '1';
    const numerobanco = '341';

    cy.ClicarBotaoCriarContrato();
    cy.wait('@consultarConvenios');
    identificacaoPage.selecionarConvenio(numeroConvenio);
    identificacaoPage.preencherCPF('196.410.250-23');
    cy.wait(['@restricaoCliente', '@verificaCartao']);

    cy.wait(800);
    cy.ClicarBotao('Continuar');
    cy.wait(800);

    cy.ClicarBotao('Simular');
    cy.wait(800);

   
    identificacaoPage.numerobancosc(numerobanco);
    simulacaoPage.preencherDadosBancarios();

    cy.ClicarBotao('Continuar');

    cy.wait(['@listarUF', '@listarDocumentos', '@listarSexos']);
    dadosPessoaisPage.preencherFormulario();
    representantePage.preencherDadosPessoais();

    cy.ClicarBotao('Continuar');

    enderecoPage.preencherFormulario();
    cy.ClicarBotao('Continuar');
    cy.intercept('POST', `${API_URL}/contratos/consulta-documentos-produto`).as(
      'consultaDocumentos'
    );
    cy.wait('@consultaDocumentos');

    const documentoCliente = Cypress.env('documentoCliente');

    cy.EnviarDocumento(documentoCliente, true);

    cy.wait(800);

    cy.ClicarBotao('Continuar');

    cy.wait('@criarContrato', { timeout: 10000 });

    cy.contains('button', 'Copiar link').should('be.visible');
    cy.contains('button', 'Enviar SMS').should('be.visible');
    cy.contains('button', 'Enviar WhatsApp').should('be.visible');
  });
});
