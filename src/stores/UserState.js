import { defineStore } from 'pinia';
import { ref, reactive, watch } from 'vue';
import { supabase } from '@/lib/supabaseClient';
import { useRoute, useRouter } from 'vue-router';

export const useUserStore = defineStore('user', () => {
  	const route = useRoute();
  	const router = useRouter();
  	const page = ref('login');
  	const logged = ref(false);

  	// Use reactive for the user object
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

  // Restore login info from localStorage
  	const loadUserFromLocalStorage = () => {
    	const storedUser = localStorage.getItem('user');
    	const isLogged = localStorage.getItem('logged') === 'true';
    	if (storedUser && isLogged) {
    	  	Object.assign(user, JSON.parse(storedUser)); // Restore reactivity
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
    	try {
    	  	if (!email || !password) {
    	    	throw new Error('Email and password are required');
    	  	}

    	  	const { data, error: loginError } = await supabase.auth.signInWithPassword({
    	    	email,
    	    	password,
    	  	});

    	  	if (loginError) throw new Error(loginError.message);

    	  	if (data.user) {
    	    	// Fetch additional user details from the custom 'users' table
    	    	const { data: customUser, error: userError } = await supabase
    	      .from('users')
    	      .select('*')
    	      .eq('id', data.user.id)
    	      .single();

    	    	if (userError) throw new Error(userError.message);

    	   	 	// Populate user state
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
    	  	}
    	} catch (error) {
    	  	console.error('Error logging in:', error.message);
    	  	throw error;
    	}
  	};

  	const logout = async () => {
    	try {
    	  	const { error: logoutError } = await supabase.auth.signOut();
    	  	if (logoutError) throw new Error(logoutError.message);
			
    	  	// Reset user state to default values
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

    	  	clearLocalStorage(); // Clear session data

    	  	router.replace({ query: { page: 'login' } });
    	} catch (error) {
    	  	console.error('Error logging out:', error.message);
    	  	throw error;
    	}
  	};

  	const createAccount = async (email, password) => {
    	try {
    	  	if (!email || !password) {
    	  	  	throw new Error('Email and password are required');
    	  	}

    	  	const { data, error: authError } = await supabase.auth.signUp({
    	  	  	email,
    	  	  	password,
    	  	});

    	  	if (authError) throw new Error(authError.message);

    	  	if (data.user) {
    	  	  	const userData = {
    	  	    	...user,
    	  	    	id: data.user.id,
    	  	    	email,
    	  	  	};

    	  	  	const { error: dbError } = await supabase.from('users').insert([userData]);

    	  	  	if (dbError) throw new Error(dbError.message);

    	  	  	console.log('Account created successfully!');
    	  	  	await login(email, password);
    	  	}
    	} catch (error) {
    	  	console.error('Error creating account:', error.message);
    	  	throw error;
    	}
  	};

	const updateAccount = async () => {
		try {
			const { data: session } = await supabase.auth.getSession();

			if (!session) {
			  throw new Error('Sessão expirada. Faça login novamente.');
			}

		  	// Check if the email has changed
		  	const { email: currentEmail } = await supabase.auth.getUser();
		  	if (user.email !== currentEmail) {
				// Update the email in the auth table
				const { error: authError } = await supabase.auth.updateUser({
			  	email: user.email,
				});
	  
			if (authError) throw new Error(`Error updating auth email: ${authError.message}`);
		  	}
	  
		  	// Update the user details in the custom 'users' table
		  	const { error: dbError } = await supabase
				.from('users')
				.update(user)
				.eq('id', user.id);
	  
		  	if (dbError) throw new Error(`Error updating user in database: ${dbError.message}`);
	  
		  	console.log('User updated successfully:', user.id);
		  	saveUserToLocalStorage(); // Save the updated user data to localStorage
		} catch (error) {
		  	console.error('Error updating user:', error.message);
		  	throw error;
		}
	};

	const sendPasswordResetEmail = async (email) => {
		try {
			const redirectUrl = `${window.location.origin}${router.resolve({ name: 'change-password' }).href}`;
		  	const { error } = await supabase.auth.resetPasswordForEmail(email, {
				redirectTo: redirectUrl,
		  	});
	  
		  	if (error) throw new Error(error.message);
	  
		  	console.log('Password reset email sent successfully.');
		} catch (error) {
		  	console.error('Error sending password reset email:', error.message);
		  	throw error;
		}
	};

	const resetPassword = async (newPassword) => {
		try {
		  	const accessToken = route.query.access_token; // Extract the token from the query string
			console.log('Access token:', accessToken);
	  
		  	if (!accessToken) throw new Error('Missing access token.');
	  
		  	const { error } = await supabase.auth.updateUser({
				password: newPassword,
		  	});
	  
		  	if (error) throw new Error(error.message);
	  
		  	console.log('Password updated successfully.');
		} catch (error) {
		  	console.error('Error resetting password:', error.message);
		  	throw error;
		}
	};

	const loadProducts = async () => {
		try {
		   	const { data, error } = await supabase
			.from('products')
			.select('*')
			.eq('vendor_id', user.id);
	
		   	if (error) throw new Error(error.message);
	
		   	userProducts.splice(0, userProducts.length, ...data);
		   	console.log('User products loaded:', userProducts);
	
		   	return userProducts;
		} catch (error) {
		   	console.error('Error loading user products:', error.message);
		   	throw error;
		}
	};

  	const getProduct = (productId) => {
    	return userProducts.find((product) => product.id === productId);
  	}

  	const deleteProduct = async (productId, isSold) => {
		if (!isSold) {
    		const confirm = window.confirm('Certeza que deseja excluir este produto?');
    		if (confirm) {
      			try {
        			const { error } = await supabase
        	  		.from('products')
        	  		.delete()
        	  		.eq('id', productId);

        			if (error) throw new Error(error.message);

        			console.log('Product deleted successfully:', productId);
        			await loadProducts();
      			} catch (error) {
        			console.error('Error deleting product:', error.message);
        			throw error;
      			}
    		}
		} else {
			alert('Produto já vendido. Não é possível excluir.');
		}
  	};

  // Watch for changes in the user or login state to save automatically
  	watch(
    	() => ({ user, logged: logged.value }),
    	saveUserToLocalStorage,
    	{ deep: true }
  	);

  	// Load session on store initialization
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
