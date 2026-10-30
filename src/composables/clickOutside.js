import { onMounted, onBeforeUnmount } from 'vue';

// Call from a component's setup: the listener is added on mount and removed on unmount,
// so remounting a modal doesn't pile up document listeners.
export function useClickOutside(element, callback) {
  function handleClickOutside(event) {
    if (element.value && !element.value.contains(event.target)) {
      callback();
    }
  }

  onMounted(() => document.addEventListener('mousedown', handleClickOutside));
  onBeforeUnmount(() => document.removeEventListener('mousedown', handleClickOutside));
}
