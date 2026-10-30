import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';

const DISPLAY_TIME = 5000;

export const useAlertStore = defineStore('notification', () => {
  const globalErrors = ref([]); // Errors displayed at the top of the screen: { id, text }
  const globalSuccesses = ref([]); // Success messages displayed at the top of the screen: { id, text }
  const fieldErrors = reactive({}); // Field-specific errors
  let nextId = 0;

  // Each message removes itself by id, so an old timer never removes a newer message
  // (e.g. after clearNotifications() followed by a new alert).
  const addMessage = (list, text) => {
    const id = ++nextId;
    list.value.push({ id, text });
    setTimeout(() => {
      list.value = list.value.filter((message) => message.id !== id);
    }, DISPLAY_TIME);
  };

  // `detail` (usually the Supabase error) goes to the console for debugging, not to the user.
  const addGlobalError = (message, detail) => {
    if (detail) console.error(message, detail);
    addMessage(globalErrors, message);
  };

  const addGlobalSuccess = (message) => {
    addMessage(globalSuccesses, message);
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
