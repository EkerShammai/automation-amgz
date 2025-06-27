import 'cypress-plugin-tab';
import { gerarQuatroNumerosAleatorios } from '../utils';
export class MargemPage {
  constructor(indiceProduto = 0) {
    this.indiceProduto = indiceProduto;
    this.inputs = {
      tipoProduto: `#margins_${this.indiceProduto}_productType`,
      tipoMargem: `#margins_${this.indiceProduto}_marginType`,
      numeroMatricula: `#margins_${this.indiceProduto}_registrationNumber`,
      margemAtual: `#margins_${this.indiceProduto}_currentMargin`,
      senhaServidor: `#margins_${this.indiceProduto}_employeePassword`,
      tipoBeneficio: '[aria-describedby="margins_0_payrollNumber_help"]',
    };
  }

  selecionarOpcao(seletor, opcoesMap, opcao) {
    cy.get(seletor).click().type(opcoesMap[opcao]);
  }

  selecionarTipoCartao(cartao) {
    const cartaoMap = {
      'Cartão Consignado': '{enter}',
      'Cartão Benefício': '{downarrow}{enter}',
    };
    this.selecionarOpcao(this.inputs.tipoProduto, cartaoMap, cartao);
  }

  selecionarTipoMargem(margem) {
    const margemMap = {
      'Margem Compra': '{enter}',
      'Margem Saque': '{downarrow}{enter}',
      'Margem Única': '{downarrow}{downarrow}{enter}',
    };
    this.selecionarOpcao(this.inputs.tipoMargem, margemMap, margem);
  }

  selecionarBeneficio() {
    const numeroAleatorio = Math.floor(Math.random() * 10) + 1;
    const comandosDownarrow = '{downarrow}'.repeat(numeroAleatorio);
    const comando = `${comandosDownarrow}{enter}`;

    cy.get(this.inputs.numeroMatricula).tab();
    cy.focused().click({ force: true }).type(comando, { force: true });
  }

  preencherValoresAleatorio(seletor, min, max) {
    const valorAleatorio = gerarQuatroNumerosAleatorios(min, max);
    cy.get(seletor).type(valorAleatorio, { force: true });
  }

  preencherNumeroMatricula() {
    this.preencherValoresAleatorio(this.inputs.numeroMatricula, 0, 50);
  }

  preencherMargemDisponivel(margem) {
    cy.get(this.inputs.margemAtual).type(margem);
  }

  preencherSenhaServidor() {
    this.preencherValoresAleatorio(this.inputs.senhaServidor, 0, 70);
  }

  preencherSimulacao(cartao, tipoMargem, valorMargem) {
    this.selecionarTipoCartao(cartao);
    this.selecionarTipoMargem(tipoMargem);
    this.preencherNumeroMatricula();
    this.preencherMargemDisponivel(valorMargem);
    this.preencherSenhaServidor();
  }
}
