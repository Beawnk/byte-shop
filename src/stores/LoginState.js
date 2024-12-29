import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '@/lib/supabaseClient';
import { useRoute, useRouter } from 'vue-router'

export const useLoginStore = defineStore('login', () => {
  const route = useRoute()
  const router = useRouter()
  const page = ref('login');
  const logged = ref(false);
  const user = {
    id: ref(''),
    name: ref(''),
    email: ref(''),
    avatar: ref(
      'https://tnwvrtitkleeayjechmy.supabase.co/storage/v1/object/public/byte/avatars/profile-default.png'
    ),
    is_vendor: ref(false),
    street: ref(''),
    number: ref(''),
    district: ref(''),
    city: ref(''),
    state: ref(''),
    country: ref(''),
    zip_code: ref(''),
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
        user.id.value = customUser.id;
        user.name.value = customUser.name;
        user.email.value = customUser.email;
        user.avatar.value = customUser.avatar || user.avatar.value;
        user.is_vendor.value = customUser.is_vendor;
        user.street.value = customUser.address_street;
        user.number.value = customUser.address_number;
        user.district.value = customUser.address_district;
        user.city.value = customUser.address_city;
        user.state.value = customUser.address_state;
        user.country.value = customUser.address_country;
        user.zip_code.value = customUser.address_cep;

        logged.value = true;
        page.value = 'user';
        router.replace({ query: { user: data.user.name } })
      }
    } catch (error) {
      console.error('Error logging in:', error.message);
      throw error; // You can also display a notification or return the error
    }
  };

  const logout = async () => {
    try {
      const { error: logoutError } = await supabase.auth.signOut();
      if (logoutError) throw new Error(logoutError.message);

      // Reset user state
      user.id.value = '';
      user.name.value = '';
      user.email.value = '';
      user.avatar.value =
        'https://tnwvrtitkleeayjechmy.supabase.co/storage/v1/object/public/byte/avatars/profile-default.png';
      user.is_vendor.value = false;
      user.street.value = '';
      user.number.value = '';
      user.district.value = '';
      user.city.value = '';
      user.state.value = '';
      user.country.value = '';
      user.zip_code.value = '';

      logged.value = false;
    } catch (error) {
      console.error('Error logging out:', error.message);
      throw error; // You can also display a notification or return the error
    }
  };

  const unwrapUser = () => ({
    name: user.name.value,
    email: user.email.value,
    avatar: user.avatar.value,
    is_vendor: user.is_vendor.value,
    address_street: user.street.value,
    address_number: user.number.value,
    address_district: user.district.value,
    address_city: user.city.value,
    address_state: user.state.value,
    address_country: user.country.value,
    address_cep: user.zip_code.value,
  });

  const createAccount = async (email, password) => {
    try {
      // Check if email and password are provided
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
  
      // Step 1: Create the user in Supabase Auth
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
  
      if (authError) throw new Error(authError.message);
  
      // Check that the auth user object exists
      if (data.user) {
        // Step 2: Insert user into your custom 'users' table
        const userData = {
          ...unwrapUser(),
          id: data.user.id, // Link the user to Supabase Auth
          email
        };
  
        // Insert into custom users table
        const { error: dbError } = await supabase
          .from('users')
          .insert([userData]);
  
        if (dbError) throw new Error(dbError.message);
  
        console.log('Account created successfully!');
        login(email, password);
      }
    } catch (error) {
      console.error('Error creating account:', error.message);
      throw error; // You can also display a notification or return the error
    }
  };
  

  return {
    page,
    logged,
    user,
    login,
    logout,
    createAccount,
  };
});
