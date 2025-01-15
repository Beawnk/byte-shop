import { defineStore } from 'pinia';
import { ref, reactive, watch } from 'vue';
import { supabase } from '@/lib/supabaseClient';
import { useRoute, useRouter } from 'vue-router';
import { useAlertStore } from '@/stores/alertStore';

export const useUserStore = defineStore('user', () => {
	const alertStore = useAlertStore();
  	const route = useRoute();
  	const router = useRouter();
  	const page = ref('login');
  	const logged = ref(false);

  	const user = reactive({
    	id: '',
    	name: '',
    	email: '',
    	avatar: 'https://tnwvrtitkleeayjechmy.supabase.co/storage/v1/object/public/byte/avatars/profile-default.png',
    	address_street: '',
    	address_number: '',
    	address_district: '',
    	address_city: '',
    	address_state: '',
    	address_country: '',
    	address_cep: '',
  	});
  	const userProducts = reactive([]);

  	const loadUserFromLocalStorage = () => {
    	const storedUser = localStorage.getItem('user');
    	const isLogged = localStorage.getItem('logged') === 'true';
    	if (storedUser && isLogged) {
    	  	Object.assign(user, JSON.parse(storedUser));
    	  	logged.value = true;
    	  	page.value = 'user';
    	}
  	};

  	const saveUserToLocalStorage = () => {
    	localStorage.setItem('user', JSON.stringify(user));
    	localStorage.setItem('logged', logged.value);
  	};

  	const clearLocalStorage = () => {
    	localStorage.removeItem('user');
    	localStorage.removeItem('logged');
  	};

  	const login = async (email, password) => {
		alertStore.clearNotifications();
    	try {
    	  	if (!email || !password) {
				if (!email) alertStore.setFieldError('email', 'Digite seu email.');
				if (!password) alertStore.setFieldError('password', 'Digite sua senha.');
    	    	throw new Error('Erro de validação. Verifique os campos e tente novamente.');
    	  	}

    	  	const { data, error: loginError } = await supabase.auth.signInWithPassword({
    	    	email,
    	    	password,
    	  	});

    	  	if (loginError) { 
				alertStore.addGlobalError('Email ou senha inválidos.');
				throw new Error(loginError.message);
			}

    	  	if (data.user) {
    	    	const { data: customUser, error: userError } = await supabase
    	      	.from('users')
    	      	.select('*')
    	      	.eq('id', data.user.id)
    	      	.single();

    	    	if (userError) { 
					alertStore.addGlobalError('Erro ao carregar informações do usuário.');
					throw new Error(userError.message); 
				}

    	    	Object.assign(user, customUser);
    	    	logged.value = true;
				saveUserToLocalStorage();

				const redirect = route.query.redirect;

				if (redirect) {
					router.push({ path: `/${redirect}` });
				} else {
					router.replace({ query: { user: customUser.name } });
    	    		page.value = 'user';
				}

				alertStore.addGlobalSuccess('Login efetuado com sucesso.');
    	  	}
    	} catch (error) {
    	  	alertStore.addGlobalError('Erro ao efetuar login', error.message);
    	  	throw error;
    	}
  	};

  	const logout = async () => {
		alertStore.clearNotifications();
    	try {
    	  	const { error: logoutError } = await supabase.auth.signOut();
    	  	if (logoutError) {
				alertStore.addGlobalError('Erro ao efetuar logout.');
				throw new Error(logoutError.message);
			}
			
    	  	Object.assign(user, {
    	  	  	id: '',
    	  	  	name: '',
    	  	  	email: '',
    	  	  	avatar: 'https://tnwvrtitkleeayjechmy.supabase.co/storage/v1/object/public/byte/avatars/profile-default.png',
    	  	  	address_street: '',
    	  	  	address_number: '',
    	  	  	address_district: '',
    	  	  	address_city: '',
    	  	  	address_state: '',
    	  	  	address_country: '',
    	  	  	address_cep: '',
    	  	});

    	  	logged.value = false;
    	  	page.value = 'login';

    	  	clearLocalStorage();

    	  	router.replace({ query: { page: 'login' } });
    	} catch (error) {
    	  	alertStore.addGlobalError('Erro ao efetuar logout:', error.message);
    	  	throw error;
    	}
  	};

  	const createAccount = async (email, password) => {
		alertStore.clearNotifications();
    	try {
    	  	if (!email || !password) {
				if (!email) alertStore.setFieldError('email', 'Digite seu email.');
				if (!password) alertStore.setFieldError('password', 'Digite sua senha.');
    	  	  	throw new Error('Erro de validação. Verifique os campos e tente novamente.');
    	  	}

    	  	const { data, error: authError } = await supabase.auth.signUp({
    	  	  	email,
    	  	  	password,
    	  	});

    	  	if (authError) {
				alertStore.addGlobalError('Erro ao criar conta.', authError);
				throw new Error(authError);
			}

    	  	if (data.user) {
    	  	  	const userData = {
    	  	    	...user,
    	  	    	id: data.user.id,
    	  	    	email,
    	  	  	};

    	  	  	const { error: dbError } = await supabase.from('users').insert([userData]);

    	  	  	if (dbError) {
					alertStore.addGlobalError('Erro ao salvar informações do usuário.', dbError.message);
					throw new Error(dbError.message);
				}

    	  	  	await login(email, password);

				alertStore.addGlobalSuccess('Conta criada com sucesso.');
    	  	}
    	} catch (error) {
    	  	alertStore.addGlobalError('Erro ao criar conta.', error.message);
    	  	throw error;
    	}
  	};

	const updateAccount = async () => {
		alertStore.clearNotifications();
		try {
			const { data: session } = await supabase.auth.getSession();

			if (!session) {
				alertStore.addGlobalError('Sessão expirada. Faça login novamente.');
			  	throw new Error('Sessão expirada. Faça login novamente.');
			}

		  	const { email: currentEmail } = await supabase.auth.getUser();
		  	if (user.email !== currentEmail) {
				const { error: authError } = await supabase.auth.updateUser({
			  	email: user.email,
				});
	  
				if (authError) {
			  		alertStore.addGlobalError('Erro ao atualizar email de autenticação.', authError.message);
					throw new Error(`Error updating auth email: ${authError.message}`);
				}
		  	}
	  
		  	const { error: dbError } = await supabase
				.from('users')
				.update(user)
				.eq('id', user.id);
	  
		  	if (dbError) { 
				alertStore.addGlobalError('Erro ao atualizar informações do usuário.', dbError.message);
				throw new Error(`Error updating user in database: ${dbError.message}`);
			}
		  	
		  	alertStore.addGlobalSuccess('Informações do usuário atualizadas com sucesso.');
		  	saveUserToLocalStorage();
		} catch (error) {
		  	alertStore.addGlobalError('Erro ao atualizar informações do usuário.', error.message);
		  	throw error;
		}
	};

	const sendPasswordResetEmail = async (email) => {
		alertStore.clearNotifications();
		try {
			const redirectUrl = `${window.location.origin}${router.resolve({ name: 'change-password' }).href}`;
		  	const { error } = await supabase.auth.resetPasswordForEmail(email, {
				redirectTo: redirectUrl,
		  	});
	  
		  	if (error) {
				alertStore.addGlobalError('Erro ao enviar email de redefinição de senha.', error.message);
				throw new Error(error.message);
			}
	  
		  	alertStore.addGlobalSuccess('Email de redefinição de senha enviado com sucesso.');
		} catch (error) {
		  	alertStore.addGlobalError('Erro ao enviar email de redefinição de senha.', error.message);
		  	throw error;
		}
	};

	const resetPassword = async (newPassword) => {
		alertStore.clearNotifications();
		try {
		  	const accessToken = route.query.access_token;
	  
		  	if (!accessToken) {
				alertStore.addGlobalError('Token de acesso não encontrado.');
				throw new Error('Missing access token.');
			}
	  
		  	const { error } = await supabase.auth.updateUser({
				password: newPassword,
		  	});
	  
		  	if (error) { 
				alertStore.addGlobalError('Erro ao redefinir senha.', error.message);
				throw new Error(error.message);
			}

		  	alertStore.addGlobalSuccess('Senha redefinida com sucesso.');
		} catch (error) {
		  	alertStore.addGlobalError('Erro ao redefinir senha.', error.message);
		  	throw error;
		}
	};

	const loadProducts = async () => {
		// alertStore.clearNotifications();
		try {
		   	const { data, error } = await supabase
			.from('products')
			.select('*')
			.eq('vendor_id', user.id);
	
		   	if (error) {
				alertStore.addGlobalError('Erro ao carregar produtos do usuário.', error.message);
				throw new Error(error.message);
			}

		   	userProducts.splice(0, userProducts.length, ...data);
	
		   	return userProducts;
		} catch (error) {
			alertStore.addGlobalError('Erro ao carregar produtos do usuário.', error.message);
		   	throw error;
		}
	};

  	const getProduct = (productId) => {
    	return userProducts.find((product) => product.id === productId);
  	}

  	const deleteProduct = async (productId, isSold) => {
		alertStore.clearNotifications();
		if (!isSold) {
    		const confirm = window.confirm('Certeza que deseja excluir este produto?');
    		if (confirm) {
      			try {
        			const { error } = await supabase
        	  		.from('products')
        	  		.delete()
        	  		.eq('id', productId);

        			if (error) {
						alertStore.addGlobalError('Erro ao excluir produto.', error.message);
						throw new Error(error.message);
					}

        			alertStore.addGlobalSuccess('Produto excluído com sucesso.');
        			await loadProducts();
      			} catch (error) {
        			alertStore.addGlobalError('Erro ao excluir produto.', error.message);
        			throw error;
      			}
    		}
		} else {
			alertStore.addGlobalError('Produto vendido não pode ser excluído.');
		}
  	};

  	watch(
    	() => ({ user, logged: logged.value }),
    	saveUserToLocalStorage,
    	{ deep: true }
  	);

  	loadUserFromLocalStorage();

  	return {
  	  	page,
  	  	logged,
  	  	user,
  	  	login,
  	  	logout,
  	  	createAccount,
  	  	loadUserFromLocalStorage,
  	  	loadProducts,
  	  	getProduct,
  	  	deleteProduct,
		updateAccount,
		sendPasswordResetEmail,
		resetPassword,
  	};
});
