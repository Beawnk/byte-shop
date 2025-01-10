// schemas/userSchema.js
import * as yup from 'yup';

export const userSchema = yup.object({
  email: yup.string()
    .required('Digite seu email')
    .email('Digite um email válido'),
  name: yup.string()
    .required('Digite seu nome')
    .min(3, 'Nome deve ter pelo menos 3 caracteres'),
  password: yup.string()
    .when('$mode', {
      is: 'create',
      then: () => yup.string()
        .required('Digite sua senha')
        .min(6, 'Senha deve ter pelo menos 6 caracteres'),
      otherwise: () => yup.string()
    }),
  cep: yup.string()
    .required('Digite seu CEP')
    .matches(/^\d{8}$/, 'CEP deve conter 8 dígitos'),
  street: yup.string()
    .required('Digite sua rua'),
  number: yup.string()
    .required('Digite o número'),
  district: yup.string()
    .required('Digite seu bairro'),
  city: yup.string()
    .required('Digite sua cidade'),
  state: yup.string()
    .required('Digite seu estado'),
  country: yup.string()
    .required('Digite seu país')
});