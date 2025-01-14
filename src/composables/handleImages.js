import { useAlertStore } from "@/stores/alertStore";

export async function useHandleImages(fileImages, e) {
  const alertStore = useAlertStore();
  alertStore.clearNotifications();
  const files = e.target.files;

  // Check if the number of images exceeds 5
  if (fileImages.length + files.length > 5) {
    alertStore.setFieldError("images", "Você só pode adicionar até 5 imagens.");
    return fileImages;
  }

  const validImages = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    // Check if the file is an image in PNG, JPG, or JPEG format
    const fileType = file.type;
    if (!["image/png", "image/jpeg", "image/jpg"].includes(fileType)) {
      alertStore.setFieldError(
        "images",
        "Apenas imagens em formato PNG, JPG, e JPEG são permitidas."
      );
      continue; // Skip invalid file
    }

    // Read the file as a Data URL using FileReader
    const fileDataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });

    validImages.push(fileDataUrl); // Add valid image
  }

  fileImages.push(...validImages); // Update the array with valid images
  return fileImages; // Return updated array
}
