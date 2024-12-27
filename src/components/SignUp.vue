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
            <button type="submit" class="btn primary" @click.prevent="LogIn">Entrar</button>
        </form>
        <p>Ou</p>
        <button class="btn secondary">Faça Login</button>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const email = ref('');
const password = ref('');
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
        }
    }
}
</style>