<template>
  <section id="home" class="container">
    <transition name="down" mode="out-in" appear>
      <div class="presentation">
        <h1>Byte Shop</h1>
        <p>Compra e venda de aparelhos tecnológicos</p>
        <div class="buttons"> 
          <router-link to="/produtos" class="btn primary">Produtos</router-link>
          <router-link to="/usuario/produtos" class="btn secondary">Vender</router-link>
        </div>
      </div>
    </transition>
  </section>
</template>

<script setup>
import { useUserStore } from '@/stores/UserState';

const userStore = useUserStore();
</script>

<style lang="scss" scoped>
@use '@/assets/style/main.scss' as m;

#home {
    background-image: linear-gradient(180deg, var(--primary-color) 10%, var(--secondary-color) 90%);
    height: 100vh;
    .presentation {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        h1 {
            color: var(--white-color);
            font-size: var(--title-super);
            margin-bottom: 30px;
        }
        p {
            font-size: var(--subtitle-big);
            color: var(--white-color);
            text-align: center;
        }
        .buttons {
            display: flex;
            margin-top: 30px;
            .btn {
                margin-right: 20px;
                &:last-child {
                    margin-right: 0;
                }
            }
        }
    }
}
</style>