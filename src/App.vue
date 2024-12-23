<template>
  <Header />
  <main><RouterView /></main>
  <Footer />
</template>

<script setup>
import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

const route = useRoute();

const updateBodyClass = () => {
  if (route.path === '/') {
    document.body.classList.add('home-route');
  } else {
    document.body.classList.remove('home-route');
  }
};

onMounted(() => {
  updateBodyClass();
});

watch(route, () => {
  updateBodyClass();
});
</script>

<style lang="scss">
main {
  flex: 1;
  .container {
    padding: calc(var(--section) + var(--header-height)) var(--side) var(--section) var(--side);
    .home-route & {
      padding-top: var(--section);
    }
  }
}

.btn {
  font-family: var(--ff-primary-Medium);
  display: inline-block;
  padding: 10px 20px;
  color: var(--white-color);
  border-radius: 5px;
  text-decoration: none;
  transition: var(--transition);
  border: 2px solid transparent;
  cursor: pointer;
  &.primary {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
    &:hover {
      background-color: var(--secondary-color);
      border-color: var(--secondary-color);
    }
  }
  &.secondary {
    background-color: var(--secondary-color);
    border-color: var(--secondary-color);
    &:hover {
      background-color: transparent;
      color: var(--secondary-color);
    }
  }
  &.primary.hover {
    &:hover {
      background-color: transparent;
      color: var(--primary-color);
      border-color: var(--primary-color);
    }
  }
}

input.btn {
  @extend .btn;
}

input, textarea {
  outline: none;
  background-color: var(--white-color);
  border: 1px solid var(--gray-color);
  padding: 15px;
  border-radius: var(--border-radius);
  font-family: var(--ff-primary);
  font-size: var(--text-medium);
  transition: var(--transition);
  color: var(--text-color);
}

input:focus, textarea:focus {
  border-color: var(--primary-color);
}

// transition-property: overlay, display, opacity, transform;
// transition-duration: 0.3s;
// transition-behavior: allow-discrete;
</style>
