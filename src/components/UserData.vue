<template>
  <form class="user-form">
    <Loader v-if="loading"/>
    <div class="user-info" v-show="!route.path.startsWith('/comprar')">
      <div class="profile-pic">
        <img v-if="profilePicUrl" :src="profilePicUrl" alt="Profile Picture" />
        <input type="file" @change="onFileChange" />
      </div>
      <div class="input">
        <label for="email">Email</label>
        <input 
          type="email" 
          id="email" 
          v-model="email" 
          placeholder="Digite seu email" 
          @blur="validateField('email')"
        />
        <FieldNotifications field="email"/>
      </div>
      <div class="input">
        <label for="name">Nome completo</label>
        <input 
          type="text" 
          id="name" 
          v-model="name" 
          placeholder="Digite seu nome completo" 
          @blur="validateField('name')"
        />
        <FieldNotifications field="name"/>
      </div>
      <div class="input" v-if="props.mode === 'create'">
        <label for="password">Senha</label>
        <input 
          type="password" 
          id="password" 
          v-model="password" 
          placeholder="Digite sua senha" 
          @blur="validateField('password')"
        />
        <FieldNotifications field="password"/>
      </div>
      <div class="change-pass" v-else>
        <button class="btn primary" @click.prevent="changePass">
          Alterar senha
        </button>
      </div>
    </div>
    <h4>Endereço</h4>
    <div class="input cep">
      <label for="cep">CEP</label>
      <input 
        type="text" 
        id="cep" 
        v-model="cep" 
        placeholder="Digite seu CEP" 
        @keyup="fillCep"
        @blur="validateField('cep')"
      />
      <FieldNotifications field="cep"/>
    </div>
    <div class="input-group">
      <div class="input street">
        <label for="street">Rua</label>
        <input 
          type="text" 
          id="street" 
          v-model="street" 
          placeholder="Digite sua rua" 
          @blur="validateField('street')"
        />
        <FieldNotifications field="street"/>
      </div>
      <div class="input number">
        <label for="number">Número</label>
        <input 
          type="text" 
          id="number" 
          v-model="number" 
          placeholder="000" 
          @blur="validateField('number')"
        />
        <FieldNotifications field="number"/>
      </div>
    </div>
    <div class="input-group">
      <div class="input">
        <label for="district">Bairro</label>
        <input 
          type="text" 
          id="district" 
          v-model="district" 
          placeholder="Digite seu bairro" 
          @blur="validateField('district')"
        />
        <FieldNotifications field="district"/>
      </div>
      <div class="input">
        <label for="city">Cidade</label>
        <input 
          type="text" 
          id="city" 
          v-model="city" 
          placeholder="Digite sua cidade" 
          @blur="validateField('city')"
        />
        <FieldNotifications field="city"/>
      </div>
    </div>
    <div class="input-group">
      <div class="input">
        <label for="state">Estado</label>
        <input 
          type="text" 
          id="state" 
          v-model="state" 
          placeholder="Digite seu estado" 
          @blur="validateField('state')"
        />
        <FieldNotifications field="state"/>
      </div>
      <div class="input">
        <label for="country">País</label>
        <input 
          type="text" 
          id="country" 
          v-model="country" 
          placeholder="Digite seu país" 
          @blur="validateField('country')"
        />
        <FieldNotifications field="country"/>
      </div>
    </div>
    <div class="action">
      <slot :update="updateUserStore"></slot>
    </div>
  </form>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useForm, useField } from 'vee-validate';
import { getUserSchema } from '@/composables/userSchema';
import { useUserStore } from '@/stores/UserState';
import { useAlertStore } from '@/stores/alertStore';
import { useGetAddress } from '@/composables/getAddress';
import { useRoute } from 'vue-router';

const props = defineProps(['mode']);
const userStore = useUserStore();
const alertStore = useAlertStore();
const route = useRoute();
const loading = ref(false);

// Initialize form with validation schema
const { handleSubmit } = useForm({
  validationSchema: computed(() => getUserSchema(props.mode)),
  validateOnMount: false,
});

// Setup fields with validation
const { value: email, validate: validateEmail } = useField('email', undefined, {
  validateOnValueUpdate: false
});

const { value: name, validate: validateName } = useField('name', undefined, {
  validateOnValueUpdate: false
});

const { value: password, validate: validatePassword } = useField('password', undefined, {
  validateOnValueUpdate: false
});

const { value: cep, validate: validateCep } = useField('cep', undefined, {
  validateOnValueUpdate: false
});

const { value: street, validate: validateStreet } = useField('street', undefined, {
  validateOnValueUpdate: false
});

const { value: number, validate: validateNumber } = useField('number', undefined, {
  validateOnValueUpdate: false
});

const { value: district, validate: validateDistrict } = useField('district', undefined, {
  validateOnValueUpdate: false
});

const { value: city, validate: validateCity } = useField('city', undefined, {
  validateOnValueUpdate: false
});

const { value: state, validate: validateState } = useField('state', undefined, {
  validateOnValueUpdate: false
});

const { value: country, validate: validateCountry } = useField('country', undefined, {
  validateOnValueUpdate: false
});

const profilePicUrl = ref('https://tnwvrtitkleeayjechmy.supabase.co/storage/v1/object/public/byte/avatars/profile-default.png');

// Validate single field
const validateField = (fieldName) => {
  const validateMap = {
    email: validateEmail,
    name: validateName,
    password: validatePassword,
    cep: validateCep,
    street: validateStreet,
    number: validateNumber,
    district: validateDistrict,
    city: validateCity,
    state: validateState,
    country: validateCountry
  };
  
  if (validateMap[fieldName]) {
    validateMap[fieldName]();
  }
};

onMounted(() => {
  email.value = userStore.user.email;
  name.value = userStore.user.name;
  profilePicUrl.value = userStore.user.avatar;
  cep.value = userStore.user.address_cep;
  street.value = userStore.user.address_street;
  number.value = userStore.user.address_number;
  district.value = userStore.user.address_district;
  city.value = userStore.user.address_city;
  state.value = userStore.user.address_state;
  country.value = userStore.user.address_country;
});

const onFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      profilePicUrl.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const fillCep = async () => {
  const cepValue = cep.value.replace(/\D/g, '');
  if (cepValue.length == 8) {
    const address = await useGetAddress(cepValue);
    street.value = address.logradouro;
    district.value = address.bairro;
    city.value = address.localidade;
    state.value = address.uf;
    
    // Validate filled fields
    validateField('street');
    validateField('district');
    validateField('city');
    validateField('state');
  }
};

const changePass = () => {
  userStore.sendPasswordResetEmail(userStore.user.email);
  userStore.logout();
};

const updateUserStore = handleSubmit(async (values) => {
  loading.value = true;
  alertStore.clearNotifications();
  
  try {
    userStore.user.name = values.name;
    userStore.user.email = values.email;
    userStore.user.avatar = profilePicUrl.value;
    userStore.user.address_street = values.street;
    userStore.user.address_number = values.number;
    userStore.user.address_district = values.district;
    userStore.user.address_city = values.city;
    userStore.user.address_state = values.state;
    userStore.user.address_country = values.country;
    userStore.user.address_cep = values.cep;

    if (props.mode === 'edit') {
      await userStore.updateAccount();
      loading.value = false;
    } else if (props.mode === 'create') {
      await userStore.createAccount(values.email, values.password);
      loading.value = false;
    }
  } catch (error) {
    // Erros estão no arquivo userState.js
    loading.value = false;
  }
});
</script>

<style lang="scss">
@use '@/assets/style/main.scss' as m;

.user-form {
  h4 {
    margin-bottom: 20px;
    margin-top: 30px;
    color: var(--text-color);
  }
  .profile-pic {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    margin: 0 auto 20px auto;
    position: relative;
    border: 3px solid var(--primary-color);

    @include m.media(600px) {
      width: 150px;
      height: 150px;
    }
    
    &:hover {
      &::after {
        content: '';
        position: absolute;
        width: 30px;
        height: 30px;
        background-color: var(--white-color);
        border-radius: 50%;
        right: 20px;
        top: 10px;
        background-image: url('../assets/img/icons/edit.png');
        background-size: 20px;
        background-repeat: no-repeat;
        background-position: center;
        z-index: 2;
      }
    }
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
    input[type="file"] {
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      opacity: 0;
      cursor: pointer;
      z-index: 1;
      border-radius: 50%;
    }
  }
  .cep {
    width: calc(50% - 10px);
  }
  .number {
    max-width: 100px;
    flex: auto;
  }
  .action {
    margin-top: 20px;
    justify-content: flex-end !important;
  }
}
.signup .action {
  justify-content: center !important;
}

</style>