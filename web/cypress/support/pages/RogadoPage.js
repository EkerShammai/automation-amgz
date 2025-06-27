import {
  gerarCPF,
  gerarDataNascimento,
  gerarNomeAleatorio,
  gerarTelefone,
} from '../utils';

export class RogadoPage {
  inputs = {
    cpf: '#customer_rogado_cpf',
    dataNascimento: '#customer_rogado_data_nascimento',
    nome: '#customer_rogado_nome',
    telefone: '#customer_rogado_telefone',
    parentesco: '#customer_rogado_grau_parentesco',
    documentoTipo: '#customer_rogado_documento_tipo',
  };

  selecionarOpcao(seletor, opcao) {
    cy.get(seletor).click();
    cy.contains(opcao, { timeout: 5000 }).click();
  }

  preencherCampo(seletor, valor, opcoes = {}) {
    cy.get(seletor).type(valor, opcoes);
  }

  preencherCPF(cpf = gerarCPF()) {
    this.preencherCampo(this.inputs.cpf, cpf);
  }

  preencherDataNascimento(dataNascimento = gerarDataNascimento()) {
    this.preencherCampo(this.inputs.dataNascimento, dataNascimento);
  }

  preencherNome(nome = gerarNomeAleatorio()) {
    this.preencherCampo(this.inputs.nome, nome);
  }

  preencherTelefone(telefone = gerarTelefone()) {
    this.preencherCampo(this.inputs.telefone, telefone, { force: true });
  }

  gerarParentesco() {
    const parentescos = ['Cônjuge', 'Filho(a)', 'Pai', 'Mãe', 'Irmão(ã)'];
    return parentescos[Math.floor(Math.random() * parentescos.length)];
  }

  selecionarParentesco(parentesco = this.gerarParentesco()) {
    this.selecionarOpcao(this.inputs.parentesco, parentesco);
  }

  selecionarTipoDocumento(documento = null) {
    if (!documento) {
      const tiposDocumento = ['RG', 'CNH'];
      documento =
        tiposDocumento[Math.floor(Math.random() * tiposDocumento.length)];
    }

    Cypress.env('documentoRogado', documento);

    this.selecionarOpcao(this.inputs.documentoTipo, documento);
  }

  preencherFormulario() {
    this.preencherNome();
    this.preencherCPF();
    this.preencherDataNascimento();
    this.selecionarParentesco();
    this.preencherTelefone();
    this.selecionarTipoDocumento();
  }
}
