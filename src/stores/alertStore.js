import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';

const DISPLAY_TIME = 5000;

export const useAlertStore = defineStore('notification', () => {
  const globalErrors = ref([]);
  const globalSuccesses = ref([]);
  const fieldErrors = reactive({});
  let nextId = 0;

  const addMessage = (list, text) => {
    const id = ++nextId;
    list.value.push({ id, text });
    setTimeout(() => {
      list.value = list.value.filter((message) => message.id !== id);
    }, DISPLAY_TIME);
  };

  const addGlobalError = (message, detail) => {
    if (detail) console.error(message, detail);
    addMessage(globalErrors, message);
  };

  const addGlobalSuccess = (message) => {
    addMessage(globalSuccesses, message);
  };

  const setFieldError = (field, message) => {
    fieldErrors[field] = message;
  };

  const clearNotifications = () => {
    globalErrors.value = [];
    globalSuccesses.value = [];
    Object.keys(fieldErrors).forEach((key) => {
      fieldErrors[key] = null;
    });
  };

  const clearFieldError = (field) => {
    fieldErrors[field] = null;
  };

  return {
    globalErrors,
    globalSuccesses,
    fieldErrors,
    addGlobalError,
    addGlobalSuccess,
    clearNotifications,
    clearFieldError,
    setFieldError,
  };
});
