import { useAlertStore } from "@/stores/alertStore";

export function useHandleImages(fileImages, e, pendingFiles) {
  const alertStore = useAlertStore();
  alertStore.clearNotifications();
  const files = e.target.files;

  if (fileImages.length + files.length > 5) {
    alertStore.setFieldError("images", "Você só pode adicionar até 5 imagens.");
    return fileImages;
  }

  const validImages = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    const fileType = file.type;
    if (!["image/png", "image/jpeg", "image/jpg"].includes(fileType)) {
      alertStore.setFieldError(
        "images",
        "Apenas imagens em formato PNG, JPG, e JPEG são permitidas."
      );
      continue;
    }

    const preview = URL.createObjectURL(file);
    pendingFiles.set(preview, file);
    validImages.push(preview);
  }

  fileImages.push(...validImages);
  return fileImages;
}
