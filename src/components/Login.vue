<template>
    <div class="login-form">
        <Loader v-if="loading"/>
        <h2>Login</h2>
        <form @submit.prevent="onSubmit" novalidate>
            <div class="input">
                <label for="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  placeholder="Seu email" 
                  v-model="email"
                  @blur="validateField('email')"
                />
                <FieldNotifications field="email"/>
            </div>
            <div class="input">
                <label for="password">Senha</label>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  placeholder="Sua senha" 
                  v-model="password"
                  @blur="validateField('password')"
                />
                <FieldNotifications field="password"/>
                <span class="lost-pass"><button type="button" class="link-button" @click="$emit('emitForgotPassPage')">Esqueceu a senha?</button></span>
            </div>
            <div class="action">
                <button class="btn primary login" type="submit" :disabled="loading">
                  Entrar
                </button>
            </div>
        </form>
        <p class="border">Ou</p>
        <div class="action">
            <button class="btn secondary signup" type="button" @click="$emit('emitSignUpPage')">
              Crie uma conta
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useForm, useField } from 'vee-validate';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/UserState';
import { safeRedirect } from '@/utils/safeRedirect';
import * as yup from 'yup';

const emit = defineEmits(['emitSignUpPage', 'emitForgotPassPage']);

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();

const loading = ref(false);

const loginSchema = yup.object({
  email: yup.string()
    .required('Digite seu email')
    .email('Digite um email válido'),
  password: yup.string()
    .required('Digite sua senha')
});

// Initialize form with validation schema
const { handleSubmit } = useForm({
  validationSchema: loginSchema,
  validateOnMount: false
});

// Setup fields with validation
const { value: email, validate: validateEmail } = useField('email', undefined, {
  validateOnValueUpdate: false
});
const { value: password, validate: validatePassword } = useField('password', undefined, {
  validateOnValueUpdate: false
});

// Validate single field on blur
const validateField = (fieldName) => {
  if (fieldName === 'email') {
    validateEmail();
  } else if (fieldName === 'password') {
    validatePassword();
  }
};

// Handle form submission
const onSubmit = handleSubmit(async (values) => {
  try {
    loading.value = true;
    await userStore.login(values.email, values.password);
    const redirect = safeRedirect(route.query.redirect);
    router.replace(redirect ?? { name: 'data' });
  } catch (error) {
    // Error handling is already done in userStore
  } finally {
    loading.value = false;
  }
});
</script>

<style lang="scss" scoped>
.login-form {
    h2 {
        margin-bottom: 20px;
        color: var(--text-color);
    }
    form {
        .input {
            input {
                background-color: var(--);
            }
        }
    }
    .lost-pass {
        display: block;
        margin-top: 10px;
        .link-button {
            background: none;
            border: none;
            padding: 0;
            font: inherit;
            cursor: pointer;
            color: var(--primary-color);
            &:hover {
                text-decoration: underline;
            }
        }
    }
}
</style>