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
  font-size: var(--text-medium);
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

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: 0;
  transition-property: overlay, display, opacity;
  transition-duration: 0.3s;
  transition-behavior: allow-discrete;
  &.open {
    opacity: 1;
    @starting-style {
      opacity: 0;
    }
    .modal-content {
      opacity: 1;
      transform: translateY(0);
      @starting-style {
        opacity: 0;
        transform: translateY(-20px);
      }
    }
  }
  .modal-content {
    background-color: var(--background-color);
    padding: 40px;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
    max-width: 1000px;
    width: 100%;
    max-height: 80vh;
    min-height: 80vh;
    position: relative;
    opacity: 0;
    transform: translateY(-20px);
    transition-property: overlay, display, opacity, transform;
    transition-duration: 0.3s;
    transition-behavior: allow-discrete;
    .close {
      position: absolute;
      top: 15px;
      right: 15px;
      width: 15px;
      height: 15px;
      background-image: url('@/assets/img/icons/clear.png');
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }
  }
}

// transition-property: overlay, display, opacity, transform;
// transition-duration: 0.3s;
// transition-behavior: allow-discrete;
</style>
