<template>
	<div class="change-pass-form">
		<Loader v-if="loading" />
		<h2>Alterar senha</h2>
		<form @submit.prevent="changePass" novalidate>
			<div class="input">
				<label for="new-pass">Nova senha</label>
				<input type="password" id="new-pass" name="new-pass" placeholder="Digite sua nova senha" v-model="newPass" @blur="validateNewPass"/>
				<FieldNotifications field="newPass"/>
			</div>
			<div class="input">
				<label for="confirm-pass">Confirme a nova senha</label>
				<input type="password" id="confirm-pass" name="confirm-pass" placeholder="Confirme sua nova senha" v-model="confirmPass" @blur="validateConfirmPass" />
				<FieldNotifications field="confirmPass"/>
			</div>
			<div class="action">
				<button class="btn primary save" type="submit" :disabled="loading">Salvar</button>
			</div>	
		</form>
		
	</div>
</template>

<script setup>
import { ref } from 'vue';
import { useForm, useField } from 'vee-validate';
import { useUserStore } from '@/stores/UserState';
import * as yup from 'yup';

const emit = defineEmits(['emitLoginPage']);

const userStore = useUserStore();

const loading = ref(false);

const passSchema = yup.object({
  newPass: yup.string()
    .required('Digite sua nova senha')
    .min(6, 'A senha deve ter no mínimo 6 caracteres'),
  confirmPass: yup.string()
    .required('Confirme sua nova senha')
	.min(6, 'A senha deve ter no mínimo 6 caracteres')
	.oneOf([yup.ref('newPass')], 'As senhas não coincidem')
});

const { handleSubmit } = useForm({
  	validationSchema: passSchema,
  	validateOnMount: false
});

const { value: newPass, validate: validateNewPass } = useField('newPass', undefined, {
  validateOnValueUpdate: false
});

const { value: confirmPass, validate: validateConfirmPass } = useField('confirmPass', undefined, {
  validateOnValueUpdate: false
});

const changePass = handleSubmit(async (values) => {
	loading.value = true;
	try {
		await userStore.resetPassword(values.newPass);
		emit('emitLoginPage');
	} catch {
		// The error message is shown by userStore.resetPassword
	} finally {
		loading.value = false;
	}
});
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