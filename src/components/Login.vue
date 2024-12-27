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
                <button type="submit" class="btn primary login" @click.prevent="LogIn">Entrar</button>
            </div>
        </form>
        <p class="border">Ou</p>
        <div class="action">
            <button class="btn secondary signup">Crie uma conta</button>
        </div>
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
    .border {
        width: 100%;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 20px 0;
        color: var(--text-color);
        &::before {
            content: '';
            display: block;
            height: 1px;
            width: 100px;
            background-color: var(--gray-color);
            margin-right: 10px;
        }
        &::after {
            content: '';
            display: block;
            height: 1px;
            width: 100px;
            background-color: var(--gray-color);
            margin-left: 10px;
        }
    }
    .action {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        button {
            min-width: 160px;
        }
    }
}
</style>