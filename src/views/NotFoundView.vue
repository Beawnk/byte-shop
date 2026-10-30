<template>
  <section id="not-found" class="container">
    <transition name="down" mode="out-in" appear>
      <div class="wrapper">
        <h1>404</h1>
        <h2>Página não encontrada</h2>
        <p>O endereço pode estar incorreto ou a página não existe mais.</p>
        <div class="actions">
          <router-link :to="{ name: 'home' }" class="btn secondary">Início</router-link>
          <router-link :to="{ name: 'products' }" class="btn primary">Ver produtos</router-link>
        </div>
      </div>
    </transition>
  </section>
</template>

<style lang="scss" scoped>
#not-found {
  .wrapper {
    min-height: calc(100vh - var(--header-height));
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    text-align: center;
    color: var(--text-color);
  }
  h1 {
    font-size: 6rem;
    line-height: 1;
    color: var(--primary-color);
  }
  .actions {
    display: flex;
    gap: 10px;
    margin-top: 10px;
  }
}
</style>
