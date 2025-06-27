export class EnderecoPage {
  API_URL = Cypress.env('API_URL');

  inputs = {
    cep: '#customer_endereco_cep',
    numeroEndereco: '#customer_endereco_numero',
  };

  obterCepPorCidade(cidade) {
    const ceps = {
      SP: '01311-000',
      RJ: '20040-008',
    };
    return ceps[cidade];
  }

  preencherCep(cidade = 'RJ') {
    const cep = this.obterCepPorCidade(cidade);
    cy.get(this.inputs.cep).type(cep);
    cy.wait('@buscarCep');
  }

  preencherNumeroEndereco(numero = '1830') {
    cy.get(this.inputs.numeroEndereco).type(numero);
  }

  preencherFormulario(cidade = 'RJ') {
    this.preencherCep(cidade);
    this.preencherNumeroEndereco();
  }
}
