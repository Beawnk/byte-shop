import { object, array, string } from 'yup';

export function useHandleImages(imagesRef, e) {
  const schema = object({
    images: array()
      .of(
        string()
          .url()
          .required('Imagem inválida.')
      )
      .max(5, 'Você só pode adicionar até 5 imagens.')
  });

  const files = e.target.files;
  const validImages = [...imagesRef];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileType = file.type;

    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(fileType)) {
      continue; // Skip invalid file
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      validImages.push(event.target.result); // Add valid image
      schema
        .validate({ images: validImages })
        .then(() => (imagesRef.value = validImages))
        .catch(() => {
          // Ignore invalid schema states for now
        });
    };
    reader.readAsDataURL(file); // Read file as URL
  }
}

