<template>
    <div class="signup-form">
        <h2>Criar conta</h2>
            <UserData v-slot="{ saving }" :mode="'create'">
                <button class="btn primary" type="submit" :disabled="saving">Cadastrar</button>
            </UserData>
        <p class="border">Ou</p>
        <div class="action">
            <button class="btn secondary" @click="$emit('emitLoginPage')">Faça Login</button>
        </div>
    </div>
</template>

<script setup>
import UserData from '@/components/UserData.vue';

defineEmits(['emitLoginPage']);
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