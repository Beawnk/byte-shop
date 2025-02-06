<template>
	<div class="forgot-pass-form">
		<Loader v-if="loading"/>
		<h2>Enviar email para redefinir a senha</h2>
		<form>
			<div class="input">
				<label for="email">Email</label>
				<input 
				  type="email" 
				  id="email" 
				  name="email" 
				  placeholder="Seu email" 
				  v-model="email"
				  @blur="validateField"
				/>
				<FieldNotifications field="email"/>
			</div>
			<div class="action">
				<button type="submit" class="btn primary send-email" @click.prevent="sendEmail">
				  Enviar email
				</button>
			</div>
		</form>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import { useForm, useField } from 'vee-validate';
import { useUserStore } from '@/stores/UserState';
import { useAlertStore } from '@/stores/alertStore';
import { supabase } from '@/lib/supabaseClient';
import * as yup from 'yup';

const emit = defineEmits(['emitLoginPage']);

const userStore = useUserStore();
const alertStore = useAlertStore();

const loading = ref(false);

const passSchema = yup.object({
  email: yup.string()
	.required('Digite seu email')
	.email('Digite um email válido')
});

const { handleSubmit } = useForm({
  validationSchema: passSchema,
  validateOnMount: false
});

const { value: email, validate: validateField } = useField('email', undefined, {
  validateOnValueUpdate: false
});

const sendEmail = handleSubmit(async (values) => {
	loading.value = true;
	const { data, error } = await supabase
	.from('users')
	.select('email')
	.eq('email', values.email)
	.limit(1);

	if (data.length === 0) {
		loading.value = false;
		alertStore.setFieldError('email', 'Você não possui uma conta com esse email');
		return;
	} else {
		await userStore.sendPasswordResetEmail(values.email);
		loading.value = false;
		emit('emitLoginPage');
	}
});
</script>

<style lang="scss">
.forgot-pass-form {
	h2 {
		color: var(--text-color);
		font-size: var(--title-small);
		margin-bottom: 20px;
	}
}
</style>