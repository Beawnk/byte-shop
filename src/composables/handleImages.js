import { useAlertStore } from "@/stores/alertStore";

export function useHandleImages(fileImages, e) {
  const alertStore = useAlertStore();
  const files = e.target.files;

  // Check if the number of images exceeds 5
  if (fileImages.length + files.length > 5) {
    alertStore.setFieldError('image', 'Você só pode adicionar até 5 imagens.');
    return fileImages;
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    // Check if the file is an image in PNG, JPG, or JPEG format
    const fileType = file.type;
    if (fileType !== 'image/png' && fileType !== 'image/jpeg' && fileType !== 'image/jpg') {
      alertStore.setFieldError('image', 'Apenas imagens em formato PNG, JPG, e JPEG são permitidas.');
      continue; // Skip invalid file and process the next one
    }

    // Create object URL for the valid image file using FileReader
    const reader = new FileReader();
    reader.onload = (event) => {
      fileImages.push(event.target.result); // Add the data URL to the array
    };
    reader.readAsDataURL(file); // Read the file as a Data URL
  }
  return fileImages; // Return updated array
}
