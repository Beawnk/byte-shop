<template>
  <Header />
  <main>
    <Notifications v-if="alertStore.globalErrors.length || alertStore.globalSuccesses.length"
      :errors="alertStore.globalErrors" 
      :successes="alertStore.globalSuccesses" 
    />
    <router-view/>
  </main>
  <Footer />
</template>

<script setup>
import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores/UserState';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import Notifications from '@/components/Notifications.vue';
import { useAlertStore } from '@/stores/alertStore';

const route = useRoute();
const userStore = useUserStore();
const alertStore = useAlertStore();

const updateBodyClass = () => {
  if (route.path === '/' || route.path.startsWith('/usuario')) {
    document.body.classList.add('gradient');
  } else {
    document.body.classList.remove('gradient');
  }
};

onMounted(() => {
  updateBodyClass();
  userStore.loadUserFromLocalStorage();
});

watch(route, () => {
  updateBodyClass();
});
</script>

<style lang="scss">
@use '@/assets/style/main.scss' as m;

.down-enter-active,
.down-leave-active {
  transition: opacity, transform 0.5s ease;
}

.down-enter-to, .down-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.down-enter-from,
.down-leave-to {
  opacity: 0;
  transform: translateY(-50px);
}

main {
  flex: 1;
  .container {
    padding: calc(var(--section) + var(--header-height)) var(--side) var(--section) var(--side);
    .gradient & {
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
  @include m.media(540px) {
    padding: 10px 15px;
  }
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
  &:disabled {
    opacity: 0.5;
    cursor: initial;
    &:hover {
      background-color: var(--primary-color);
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
  @include m.media(540px) {
    padding: 10px;
  }
}

input:focus, textarea:focus {
  border-color: var(--primary-color);
}

input::placeholder {
  opacity: 0.3;
}

.input {
  margin-bottom: 20px;
  @include m.media(600px) {
    margin-bottom: 15px;
  }
  label {
    display: block;
    margin-bottom: 10px;
    color: var(--text-color);
    @include m.media(600px) {
      margin-bottom: 5px;
    }
  }
  input, textarea {
    width: 100%;
  }
}

.input-group {
  display: flex;
  gap: 20px;
  @include m.media(758px) { 
    flex-direction: column;
    gap: 0;
  }
  .input {
    flex: 1;
  }
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

      &:hover {
        background-image: url('@/assets/img/icons/clear-hover.png');
      }
    }
  }
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
  button {
    padding: 10px 20px;
    margin: 0 10px;
    border: 1px solid var(--gray-color);
    border-radius: var(--border-radius);
    background-color: var(--white-color);
    color: var(--text-color);
    font-family: var(--ff-primary);
    cursor: pointer;
    transition: var(--transition);
    &:hover {
      background-color: var(--gray-color);
      color: var(--white-color);
    }
    &:disabled {
      opacity: 0.5;
      &:hover {
        background-color: var(--white-color);
        color: var(--text-color);
      }
    }
  }
  span {
    font-family: var(--ff-primary);
    font-size: var(--text-medium);
    color: var(--text-color);
  }
}

// transition-property: overlay, display, opacity, transform;
// transition-duration: 0.3s;
// transition-behavior: allow-discrete;
</style>
