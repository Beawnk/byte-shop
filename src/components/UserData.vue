<template>
  <form class="user-form">
    <div class="profile-pic">
      <img v-if="profilePicUrl" :src="profilePicUrl" alt="Profile Picture" />
      <input type="file" @change="onFileChange" />
    </div>
    <div class="input">
      <label for="email">Email</label>
      <input type="email" id="email" v-model="email" placeholder="Digite seu email" />
    </div>
    <div class="input">
      <label for="name">Nome completo</label>
      <input type="text" id="name" v-model="name" placeholder="Digite seu nome completo" />
    </div>
    <div class="input">
      <label for="password">Senha</label>
      <input type="password" id="password" v-model="password" placeholder="Digite sua senha" />
    </div>
    <div class="input cep">
      <label for="cep">CEP</label>
      <input type="text" id="cep" v-model="cep" placeholder="Digite seu CEP" />
    </div>
    <div class="input-group">
      <div class="input street">
        <label for="street">Rua</label>
        <input type="text" id="street" v-model="street" placeholder="Digite sua rua" />
      </div>
      <div class="input number">
        <label for="number">Número</label>
        <input type="text" id="number" v-model="number" placeholder="000" />
      </div>
    </div>
    <div class="input-group">
      <div class="input">
        <label for="district">Bairro</label>
        <input type="text" id="district" v-model="district" placeholder="Digite seu bairro" />
      </div>
      <div class="input">
        <label for="city">Cidade</label>
        <input type="text" id="city" v-model="city" placeholder="Digite sua cidade" />
      </div>
    </div>
    <div class="input-group">
      <div class="input">
        <label for="state">Estado</label>
        <input type="text" id="state" v-model="state" placeholder="Digite seu estado" />
      </div>
      <div class="input">
        <label for="country">País</label>
        <input type="text" id="country" v-model="country" placeholder="Digite seu país" />
      </div>
    </div>
    <div class="action">
      <slot></slot>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue';

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
const profilePicUrl = ref(new URL('@/assets/img/profile/profile-default.png', import.meta.url).href);

const onFileChange = (event) => {
  const file = event.target.files[0];
  console.log(file);
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      profilePicUrl.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};
</script>

<style lang="scss" scoped>
.user-form {
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
  }
}

</style>