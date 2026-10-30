import * as yup from 'yup';

const addressSchema = {
  cep: yup
    .string()
    .required('Digite seu CEP')
    .transform((value) => (value ? value.replace(/\D/g, '') : value))
    .matches(/^\d{8}$/, 'CEP deve conter 8 dígitos'),
  street: yup.string().required('Digite sua rua'),
  number: yup.string().required('Digite o número'),
  district: yup.string().required('Digite seu bairro'),
  city: yup.string().required('Digite sua cidade'),
  state: yup.string().required('Digite seu estado'),
  country: yup.string().required('Digite seu país'),
};

// mode: 'create' (sign up), 'edit' (profile) or 'address' (checkout: only the address is shown and validated)
export const getUserSchema = (mode) => {
  if (mode === 'address') return yup.object(addressSchema);

  const schema = {
    email: yup
      .string()
      .required('Digite seu email')
      .email('Digite um email válido'),
    name: yup
      .string()
      .required('Digite seu nome')
      .min(3, 'Nome deve ter pelo menos 3 caracteres'),
    ...addressSchema,
  };

  // Add password validation only in "create" mode
  if (mode === 'create') {
    schema.password = yup
      .string()
      .required('Digite sua senha')
      .min(6, 'Senha deve ter pelo menos 6 caracteres');
  }

  return yup.object(schema);
};
