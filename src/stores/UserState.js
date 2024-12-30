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
    is_vendor: false,
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
        page.value = 'user';

        saveUserToLocalStorage(); // Save session
        router.replace({ query: { user: data.user.name } });
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
        is_vendor: false,
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

  const deleteProduct = async (productId) => {
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
    deleteProduct,
  };
});
