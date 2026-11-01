import { onMounted, onBeforeUnmount } from 'vue';

export function useClickOutside(element, callback) {
  function handleClickOutside(event) {
    if (element.value && !element.value.contains(event.target)) {
      callback();
    }
  }

  onMounted(() => document.addEventListener('mousedown', handleClickOutside));
  onBeforeUnmount(() => document.removeEventListener('mousedown', handleClickOutside));
}
