export function useClickOutside(element, callback) {
  function handleClickOutside(event) {
    if (element.value && !element.value.contains(event.target)) {
      callback();
    }
  }

  document.addEventListener('mousedown', handleClickOutside);

  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}