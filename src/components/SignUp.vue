<template>
    <div class="signup-form">
        <h2>Criar conta</h2>
            <UserData v-slot="{ update }">
                <button class="btn primary" @click.prevent="update">Cadastrar</button>
            </UserData>
        <p class="border">Ou</p>
        <div class="action">
            <button class="btn secondary" @click="$emit('emitLoginPage')">Faça Login</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import UserData from '@/components/UserData.vue';

</script>

<style lang="scss" scoped>
.signup-form {
    h2 {
        margin-bottom: 20px;
        color: var(--text-color);
    }
    form {

    }
}
</style>