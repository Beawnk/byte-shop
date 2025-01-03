<template>
	<div class="change-pass-form">
		<h2>Alterar senha de acesso</h2>
		<form>
			<div class="input">
				<label for="new-pass">Nova senha</label>
				<input type="password" id="new-pass" placeholder="Digite sua nova senha" v-model="newPass" />
			</div>
			<div class="input">
				<label for="confirm-pass">Confirme a nova senha</label>
				<input type="password" id="confirm-pass" placeholder="Confirme sua nova senha" v-model="confirmPass" />
			</div>
			<div class="action">
				<button class="btn primary save" @click.prevent="changePass">Salvar</button>
			</div>	
		</form>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/UserState'; 

const userStore = useUserStore();

const newPass = ref('');
const confirmPass = ref('');

const changePass = () => {
	if (newPass.value === confirmPass.value) {
		userStore.resetPassword(newPass.value);
	} else {
		alert('As senhas não coincidem');
	}
}
</script>

<style lang="scss" scoped>
.change-pass-form {
	h2 {
		color: var(--text-color);
		margin-bottom: 40px;
	}
	.action {
		margin-top: 30px;

	}
}
</style>