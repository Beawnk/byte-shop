<template>
  <form class="user-form">
    <div class="user-info" v-show="!route.path.startsWith('/comprar')">
      <div class="profile-pic">
        <img v-if="profilePicUrl" :src="profilePicUrl" alt="Profile Picture" />
        <input type="file" @change="onFileChange" />
      </div>
      <div class="input">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" placeholder="Digite seu email" />
        <FieldNotifications :field="'email'"/>
      </div>
      <div class="input">
        <label for="name">Nome completo</label>
        <input type="text" id="name" v-model="name" placeholder="Digite seu nome completo" />
        <FieldNotifications :field="'name'"/>
      </div>
      <div class="input" v-if="props.mode === 'create'">
        <label for="password">Senha</label>
        <input type="password" id="password" v-model="password" placeholder="Digite sua senha" />
        <FieldNotifications :field="'password'"/>
      </div>
      <div class="change-pass" v-else>
        <button class="btn primary" @click.prevent="userStore.sendPasswordResetEmail(userStore.user.email)">Alterar senha</button>
      </div>
    </div>
    <h4>Endereço</h4>
    <div class="input cep">
      <label for="cep">CEP</label>
      <input type="text" id="cep" v-model="cep" placeholder="Digite seu CEP" @keyup="fillCep"/>
      <FieldNotifications :field="'address'"/>
    </div>
    <div class="input-group">
      <div class="input street">
        <label for="street">Rua</label>
        <input type="text" id="street" v-model="street" placeholder="Digite sua rua" />
        <FieldNotifications :field="'address'"/>
      </div>
      <div class="input number">
        <label for="number">Número</label>
        <input type="text" id="number" v-model="number" placeholder="000" />
        <FieldNotifications :field="'address'"/>
      </div>
    </div> 
    <div class="input-group">
      <div class="input">
        <label for="district">Bairro</label>
        <input type="text" id="district" v-model="district" placeholder="Digite seu bairro" />
        <FieldNotifications :field="'address'"/>
      </div>
      <div class="input">
        <label for="city">Cidade</label>
        <input type="text" id="city" v-model="city" placeholder="Digite sua cidade" />
        <FieldNotifications :field="'address'"/>
      </div>
    </div>
    <div class="input-group">
      <div class="input">
        <label for="state">Estado</label>
        <input type="text" id="state" v-model="state" placeholder="Digite seu estado" />
        <FieldNotifications :field="'address'"/>
      </div>
      <div class="input">
        <label for="country">País</label>
        <input type="text" id="country" v-model="country" placeholder="Digite seu país" />
        <FieldNotifications :field="'address'"/>
      </div>
    </div>
    <div class="action">
      <slot :update="updateUserStore"></slot>
    </div>
  </form>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useUserStore } from '@/stores/UserState';
import { useAlertStore } from '@/stores/alertStore';
import { useGetAddress } from '@/composables/getAddress';
import { useRoute } from 'vue-router';

const props = defineProps(['mode']);

const userStore = useUserStore();
const alertStore = useAlertStore();
const route = useRoute();

const email = ref('');
const name = ref('');
const password = ref('');
const cep = ref('');
const street = ref('');
const number = ref('');
const district = ref('');
const city = ref('');
const state = ref('');
const country = ref('');
const profilePicUrl = ref('https://tnwvrtitkleeayjechmy.supabase.co/storage/v1/object/public/byte/avatars/profile-default.png');

onMounted(() => {
  email.value = userStore.user.email;
  name.value = userStore.user.name;
  password.value = userStore.user.password;
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
  }
}

const updateUserStore = () => {
  alertStore.clearNotifications();
  
  if (!name.value) alertStore.setFieldError('name', 'Digite seu nome');
  if (!email.value) alertStore.setFieldError('email', 'Digite seu email');
  if (!password.value && props.mode === 'create') alertStore.setFieldError('password', 'Insira uma senha');
  if (!cep.value || !street.value || !number.value || !district.value || !city.value || !state.value || !country.value) alertStore.setFieldError('address', 'Preencha todos os campos do endereço');

  if (Object.keys(alertStore.fieldErrors).length > 0) return;

  userStore.user.name = name.value;
  userStore.user.email = email.value;
  userStore.user.password = password.value;
  userStore.user.avatar = profilePicUrl.value;
  userStore.user.address_street = street.value;
  userStore.user.address_number = number.value;
  userStore.user.address_district = district.value;
  userStore.user.address_city = city.value;
  userStore.user.address_state = state.value;
  userStore.user.address_country = country.value;
  userStore.user.address_cep = cep.value;
  if (props.mode === 'edit') {
    userStore.updateAccount();
  } else if (props.mode === 'create') {
    userStore.createAccount(email.value, password.value);
  }
  
};
</script>

<style lang="scss">
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

</style>