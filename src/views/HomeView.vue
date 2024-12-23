<template>
  <section id="home" class="container">
    <div class="presentation">
      <h1>Byte Shop</h1>
      <p>Compra e venda de aparelhos tecnológicos</p>
      <div class="buttons"> 
        <router-link to="/produtos" class="btn primary">Produtos</router-link>
        <router-link to="/produtos" class="btn primary">Vender</router-link>
      </div>
    </div>
  </section>
</template>

<script setup>

</script>

<style lang="scss" scoped>
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