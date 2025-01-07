// stores/errorStore.js
import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';

export const useAlertStore = defineStore('notification', () => {
  const globalErrors = ref([]); // Errors displayed at the top of the screen
  const globalSuccesses = ref([]); // Success messages displayed at the top of the screen
  const fieldErrors = reactive({}); // Field-specific errors

  // Add a global error
  const addGlobalError = (message) => {
    globalErrors.value.push(message);
    setTimeout(() => {
      globalErrors.value.shift(); // Auto-remove after 5 seconds
    }, 5000);
  };

  // Add a global success
  const addGlobalSuccess = (message) => {
    globalSuccesses.value.push(message);
    setTimeout(() => {
      globalSuccesses.value.shift(); // Auto-remove after 5 seconds
    }, 5000);
  };

  // Set a field-specific error
  const setFieldError = (field, message) => {
    fieldErrors[field] = message;
  };

  // Clear all notifications
  const clearNotifications = () => {
    globalErrors.value = [];
    globalSuccesses.value = [];
    Object.keys(fieldErrors).forEach((key) => {
      fieldErrors[key] = null;
    });
  };

  // Clear a specific field error
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
