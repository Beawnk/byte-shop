<template>
    <div class="login-form">
        <h2>Login</h2>
        <form>
            <div class="input">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" placeholder="Seu email" v-model="email" />
            </div>
            <div class="input">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" placeholder="Sua senha" v-model="password" />
                <span class="lost-pass"><router-link to="/">Esqueceu a senha?</router-link></span>
            </div>
            <div class="action">
                <button type="submit" class="btn primary login" @click.prevent="LogIn" @keyup.enter.prevent="LogIn">Entrar</button>
            </div>
        </form>
        <p class="border">Ou</p>
        <div class="action">
            <button class="btn secondary signup" @click="$emit('emitSignUpPage')">Crie uma conta</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useLoginStore } from '@/stores/LoginState';

const emit = defineEmits(['emitSignUpPage']);

const loginStore = useLoginStore();

const email = ref('');
const password = ref('');

const LogIn = () => {
    loginStore.login(email.value, password.value);
}
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
        a {
            color: var(--primary-color);
            &:hover {
                text-decoration: underline;
            }
        }
    }
}
</style>