import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import { supabase } from '@/lib/supabaseClient';
import { useAlertStore } from '@/stores/alertStore';
import { uploadImage, removeImages } from '@/composables/imageStorage';

export const DEFAULT_AVATAR = 'https://tnwvrtitkleeayjechmy.supabase.co/storage/v1/object/public/byte/avatars/profile-default.png';

const PROFILE_COLUMNS = [
	'name',
	'avatar',
	'address_cep',
	'address_street',
	'address_number',
	'address_district',
	'address_city',
	'address_state',
	'address_country',
];

const emptyUser = () => ({
	id: '',
	name: '',
	email: '',
	avatar: DEFAULT_AVATAR,
	address_street: '',
	address_number: '',
	address_district: '',
	address_city: '',
	address_state: '',
	address_country: '',
	address_cep: '',
});

const pickProfile = (values) =>
	Object.fromEntries(PROFILE_COLUMNS.filter((key) => key in values).map((key) => [key, values[key]]));

export const useUserStore = defineStore('user', () => {
	const alertStore = useAlertStore();
	const logged = ref(false);
	const recovering = ref(false);
	const user = reactive(emptyUser());
	const userProducts = reactive([]);

	const resetState = () => {
		Object.assign(user, emptyUser());
		userProducts.splice(0);
		logged.value = false;
	};

	const fetchProfile = async (userId) => {
		const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();
		if (error) throw error;

		Object.assign(user, data);
		logged.value = true;
		return data;
	};

	const init = async () => {
		localStorage.removeItem('user');
		localStorage.removeItem('logged');

		const { data: { session } } = await supabase.auth.getSession();
		if (!session) return;

		try {
			await fetchProfile(session.user.id);
		} catch {
			await supabase.auth.signOut();
		}
	};

	const ready = init();

	// Não chamar outros métodos do Supabase dentro deste callback: pode travar (deadlock).
	supabase.auth.onAuthStateChange((event) => {
		if (event === 'SIGNED_OUT') {
			resetState();
			recovering.value = false;
		}
		if (event === 'PASSWORD_RECOVERY') recovering.value = true;
	});

	const login = async (email, password) => {
		alertStore.clearNotifications();

		const { data, error } = await supabase.auth.signInWithPassword({ email, password });
		if (error) {
			const messages = {
				invalid_credentials: 'Email ou senha inválidos.',
				email_not_confirmed: 'Confirme seu email pelo link que enviamos antes de entrar.',
				over_request_rate_limit: 'Muitas tentativas seguidas. Espere alguns minutos e tente de novo.',
			};
			alertStore.addGlobalError(messages[error.code] ?? 'Não foi possível entrar agora. Tente de novo em instantes.');
			console.error('Login failed:', error.code ?? error.status, error.message);
			throw error;
		}

		try {
			await fetchProfile(data.user.id);
		} catch (profileError) {
			await supabase.auth.signOut();
			alertStore.addGlobalError('Erro ao carregar informações do usuário.');
			throw profileError;
		}

		alertStore.addGlobalSuccess('Login efetuado com sucesso.');
	};

	const logout = async () => {
		alertStore.clearNotifications();
		try {
			const { error } = await supabase.auth.signOut();
			if (error) throw error;
		} catch {
			alertStore.addGlobalError('Erro ao sair da conta. Seus dados foram removidos deste navegador.');
		} finally {
			resetState();
		}
	};

	const createAccount = async ({ email, password, profile, avatarFile }) => {
		alertStore.clearNotifications();

		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: { data: pickProfile(profile) },
		});

		if (error) {
			alertStore.addGlobalError(
				error.code === 'user_already_exists' ? 'Este email já está cadastrado.' : 'Erro ao criar conta.'
			);
			throw error;
		}

		if (data.user && data.user.identities?.length === 0) {
			alertStore.addGlobalError('Este email já está cadastrado.');
			throw new Error('Email already registered');
		}

		if (!data.session) {
			alertStore.addGlobalSuccess('Conta criada! Confirme pelo link enviado ao seu email e depois faça login.');
			return { needsConfirmation: true };
		}

		await fetchProfile(data.user.id);
		if (avatarFile) {
			try {
				await saveAvatar(avatarFile);
			} catch {
			}
		}

		alertStore.addGlobalSuccess('Conta criada com sucesso.');
		return { needsConfirmation: false };
	};

	const updateAccount = async (changes, { silent = false } = {}) => {
		if (!silent) alertStore.clearNotifications();

		const { data: { session } } = await supabase.auth.getSession();
		if (!session) {
			alertStore.addGlobalError('Sessão expirada. Faça login novamente.');
			throw new Error('Session expired');
		}

		const { data, error } = await supabase
			.from('users')
			.update(pickProfile(changes))
			.eq('id', session.user.id)
			.select()
			.single();

		if (error) {
			alertStore.addGlobalError('Erro ao atualizar suas informações.');
			throw error;
		}

		Object.assign(user, data);

		let emailPending = false;
		if (changes.email && changes.email !== session.user.email) {
			const { error: authError } = await supabase.auth.updateUser({ email: changes.email });
			if (authError) {
				alertStore.addGlobalError('Erro ao alterar o email.');
				throw authError;
			}
			emailPending = true;
		}

		if (!silent) {
			alertStore.addGlobalSuccess(
				emailPending
					? 'Dados salvos. Confirme o novo email pelo link que enviamos para concluir a troca.'
					: 'Informações atualizadas com sucesso.'
			);
		}
	};

	const saveAvatar = async (file) => {
		const previousAvatar = user.avatar;

		let avatar;
		try {
			avatar = await uploadImage(file, user.id);
		} catch (error) {
			alertStore.addGlobalError('Erro ao enviar a foto de perfil.', error);
			throw error;
		}

		try {
			await updateAccount({ avatar }, { silent: true });
		} catch (error) {
			await removeImages([avatar]);
			throw error;
		}

		await removeImages([previousAvatar]);
	};

	const sendPasswordResetEmail = async (email) => {
		const redirectTo = new URL('/usuario/alterar-senha', window.location.origin).href;
		const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

		if (error) {
			alertStore.addGlobalError('Erro ao enviar email de redefinição de senha.');
			throw error;
		}
	};

	const resetPassword = async (newPassword) => {
		alertStore.clearNotifications();

		const { error } = await supabase.auth.updateUser({ password: newPassword });
		if (error) {
			alertStore.addGlobalError('Erro ao redefinir a senha. O link pode ter expirado: peça um novo.');
			throw error;
		}

		recovering.value = false;
		await supabase.auth.signOut();
		resetState();
		alertStore.addGlobalSuccess('Senha redefinida. Faça login com a nova senha.');
	};

	const loadProducts = async () => {
		const { data, error } = await supabase.from('products').select('*').eq('vendor_id', user.id);

		if (error) {
			alertStore.addGlobalError('Erro ao carregar seus produtos.');
			throw error;
		}

		userProducts.splice(0, userProducts.length, ...data);
		return userProducts;
	};

	const getProduct = (productId) => {
		return userProducts.find((product) => product.id === productId);
	};

	const deleteProduct = async (productId, isSold) => {
		alertStore.clearNotifications();

		if (isSold) {
			alertStore.addGlobalError('Produto vendido não pode ser excluído.');
			return;
		}

		if (!window.confirm('Certeza que deseja excluir este produto?')) return;

		const images = getProduct(productId)?.image_url ?? [];

		// Delete bloqueado pelo RLS não dá erro, só volta sem linhas.
		const { data, error } = await supabase.from('products').delete().eq('id', productId).select('id');

		if (error || !data.length) {
			alertStore.addGlobalError('Erro ao excluir produto.');
			throw error ?? new Error('Product not deleted');
		}

		await removeImages(images);
		alertStore.addGlobalSuccess('Produto excluído com sucesso.');
		await loadProducts();
	};

	return {
		logged,
		recovering,
		user,
		userProducts,
		ready,
		login,
		logout,
		createAccount,
		updateAccount,
		saveAvatar,
		sendPasswordResetEmail,
		resetPassword,
		loadProducts,
		getProduct,
		deleteProduct,
	};
});
