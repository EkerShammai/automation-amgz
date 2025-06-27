export const mensagens = {
  sucesso: 'Digitação realizada com sucesso.',
  instrucoesFigital:
    'Realize o download dos termos de contratação e colete a assinatura do cliente. Após assinado, digitalize o termo e anexe nas opções abaixo para obter o link de formalização.',
  instrucoesAnalfabeto:
    'Realize o download dos termos de contratação e colete a assinatura do cliente a rogo e das testemunhas. Após assinado, digitalize o termo e anexe nas opções abaixo para obter o link de formalização.',
  termos: {
    termoDiamante: /^TERMO DIAMANTE DEMAIS CONVENIOS/i,
    termoConsentimento: /^TERMO DE CONSENTIMENTO/i,
    termoAdesao: /^TERMO DE ADESÃO/i,
    termoCCBSaqueParcelado: /^TERMOS CCB SAQUE PARCELADO/i,
  },
};

export const mensagensRepresentante = {
  sucesso: 'Formalização Representante Legal',
  instrucoesFormalizacao:
    'O link de formalização deverá ser enviado para o Representante Legal, sendo ele o responsável pelo envio de sua Selfie, anexos pertinentes a contratação (caso necessário) e realize o aceite digital dos termos dessa contratação.',
};
