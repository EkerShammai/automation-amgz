import { faker, fakerPT_BR } from '@faker-js/faker';

export const gerarCPF = () => {
  const numeroAleatorio = () =>
    String(Math.floor(Math.random() * 999999999)).padStart(9, '0');

  const calcularDigito = (numeros) => {
    let soma = 0;
    let peso = numeros.length + 1;

    for (let i = 0; i < numeros.length; i++) {
      soma += parseInt(numeros[i]) * peso--;
    }

    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const gerar = () => {
    const numeros = numeroAleatorio();
    const digito1 = calcularDigito(numeros.slice(0, 9));
    const digito2 = calcularDigito(numeros.slice(0, 9) + digito1);
    return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(
      6,
      9
    )}-${digito1}${digito2}`;
  };

  return gerar();
};

export const gerarDataNascimento = () => {
  const dataNascimento = faker.date.birthdate();
  return `${String(dataNascimento.getDate()).padStart(2, '0')}/${String(
    dataNascimento.getMonth() + 1
  ).padStart(2, '0')}/${dataNascimento.getFullYear()}`;
};

export const gerarNomeAleatorio = () => {
  const primeiroNomeValido = () => {
    let nome;
    do {
      nome = fakerPT_BR.person.firstName();
    } while (nome.length < 3 || /^(Sr|Sra|Dra|Dr)$/i.test(nome));
    return nome;
  };

  let nomeAleatorio = fakerPT_BR.person.fullName();
  const partesNome = nomeAleatorio.split(' ');
  partesNome[0] = primeiroNomeValido();
  nomeAleatorio = partesNome.join(' ').replace(/[^\w\s]/gi, '');

  return nomeAleatorio;
};

export const gerarQuatroNumerosAleatorios = (min, max) => {
  const obterNumeroAleatorio = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;
  return Array.from({ length: 4 }, () => obterNumeroAleatorio(min, max)).join(
    ''
  );
};

export const gerarNivelEscolaridade = () => {
  const niveisEscolaridade = [
    'Ensino Fundamental',
    'Ensino Médio',
    'Ensino Superior',
    'Pós Graduado',
  ];

  const indiceAleatorio = Math.floor(Math.random() * niveisEscolaridade.length);
  return niveisEscolaridade[indiceAleatorio];
};

export const gerarDadosBancarios = () => {
  const tiposConta = [
    'Conta Corrente Pessoa Física',
    'Conta Poupança Pessoa Física',
    'Conta Pagamento Pessoa Física',
  ];

  const numeroAgencia = Math.floor(Math.random() * 9000) + 1000;
  const numeroConta = Math.floor(Math.random() * 9000000) + 1000000;
  const digitoConta = Math.floor(Math.random() * 9) + 1;
  const tipoConta = tiposConta[Math.floor(Math.random() * tiposConta.length)];

  return {
    numeroAgencia: numeroAgencia.toString(),
    numeroConta: numeroConta.toString(),
    digitoConta: digitoConta.toString(),
    codigoBanco: '033',
    tipoConta,
  };
};

export const gerarEstadoCivil = () => {
  const estadosCivis = [
    'Solteiro(a)',
    'Casado(a)',
    'Divorciado(a)',
    'Viúvo(a)',
  ];
  return estadosCivis[Math.floor(Math.random() * estadosCivis.length)];
};

export const gerarGenero = () => {
  const generos = ['Masculino', 'Feminino'];
  return generos[Math.floor(Math.random() * generos.length)];
};

export const gerarTelefone = () => {
  const telefoneBase = '249932074';
  const telefoneAleatorio = telefoneBase + Math.floor(Math.random() * 90 + 10);
  return telefoneAleatorio;
};
