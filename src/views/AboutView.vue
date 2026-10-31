<template>
  <section id="about" class="container">
    <transition name="down" mode="out-in" appear>
      <div class="about-page">
        <h1>Sobre o projeto</h1>
        <p class="intro">
          O Byte Shop é um marketplace de aparelhos tecnológicos: qualquer pessoa pode anunciar,
          comprar, favoritar produtos e avaliar vendedores. Nasceu do projeto Ranek, do curso de
          Vue.js da Origamid, e foi reescrito e ampliado depois disso.
        </p>

        <h2>Stack</h2>
        <ul class="stack">
          <li v-for="item in stack" :key="item.name">
            <strong>{{ item.name }}</strong>
            <span>{{ item.role }}</span>
          </li>
        </ul>

        <h2>Decisões técnicas</h2>
        <ul class="decisions">
          <li v-for="decision in decisions" :key="decision.title">
            <h3>{{ decision.title }}</h3>
            <p>{{ decision.text }}</p>
          </li>
        </ul>

        <a class="btn primary" href="https://github.com/Beawnk/byte-shop" target="_blank" rel="noopener noreferrer">Ver o código no GitHub</a>
        <p class="credits">
          Parte das fotos de produtos vem do
          <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer">Unsplash</a>.
        </p>
      </div>
    </transition>
  </section>
</template>

<script setup>
const stack = [
  { name: 'Vue 3', role: 'Interface, com Composition API e <script setup>' },
  { name: 'Pinia', role: 'Sessão, favoritos, carrinho e alertas' },
  { name: 'Vue Router', role: 'Rotas com code splitting e proteção de páginas privadas' },
  { name: 'Supabase', role: 'Postgres, autenticação e regras de acesso' },
  { name: 'vee-validate + yup', role: 'Validação de formulários' },
  { name: 'Sass', role: 'Estilos por componente' },
  { name: 'GSAP', role: 'Animações das listas' },
  { name: 'Vitest + ESLint', role: 'Testes e lint, rodando no GitHub Actions' },
];

const decisions = [
  {
    title: 'Compra pelo banco de dados',
    text: 'A compra é feita por uma função no banco, que marca o produto como vendido e cria o pedido na mesma transação. O preço, o comprador e o endereço vêm do próprio banco, o que garante que ninguém altere esses dados pelo navegador, além de impedir que duas pessoas comprem o mesmo produto.',
  },
  {
    title: 'Permissões',
    text: 'Com Row Level Security e permissões por coluna, cada usuário só consegue ver e alterar o que é dele. Na vitrine eu uso uma view que mostra apenas o nome e a foto do vendedor, assim o email e o endereço de ninguém ficam expostos.',
  },
  {
    title: 'Sessão do usuário',
    text: 'Quem define se o usuário está logado é a sessão do Supabase, e a store só reflete esse estado. O router espera a sessão ser restaurada antes de liberar uma página, então recarregar uma página privada não manda ninguém pro login sem necessidade.',
  },
  {
    title: 'Filtros na URL',
    text: 'A busca, os filtros, a ordenação e a página ficam salvos na URL, então dá pra recarregar, voltar ou compartilhar o link e ver exatamente a mesma lista.',
  },
];
</script>

<style lang="scss" scoped>
@use '@/assets/style/main.scss' as m;

#about {
  .about-page {
    max-width: 800px;
    margin: 0 auto;
    color: var(--text-color);
  }
  h1 {
    font-size: var(--title-medium);
  }
  h2 {
    margin: 40px 0 15px;
  }
  .intro {
    margin-top: 15px;
    font-size: var(--text-big);
  }
  .stack {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    @include m.media(xs) {
      grid-template-columns: 1fr;
    }
    li {
      display: flex;
      flex-direction: column;
      gap: 3px;
      padding: 15px;
      background-color: var(--white-color);
      border-radius: var(--border-radius);
      box-shadow: var(--shadow);
    }
  }
  .decisions {
    display: flex;
    flex-direction: column;
    gap: 20px;
    h3 {
      margin-bottom: 5px;
      font-size: var(--subtitle-small);
    }
  }
  .btn {
    margin-top: 40px;
  }
  .credits {
    margin-top: 20px;
    font-size: var(--text-small);
    a {
      color: var(--primary-color);
      text-decoration: underline;
    }
  }
}
</style>
