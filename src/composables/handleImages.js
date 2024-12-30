import { ref } from 'vue';

export function useHandleImages(fileImages, e) {
  const files = e.target.files;

  // Check if the number of images exceeds 6
  if (fileImages.length + files.length > 6) {
    alert('Você só pode adicionar até 6 imagens.');
    return fileImages;
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    // Check if the file is an image in PNG, JPG, or JPEG format
    const fileType = file.type;
    if (fileType !== 'image/png' && fileType !== 'image/jpeg' && fileType !== 'image/jpg') {
      alert('Apenas imagens em formato PNG, JPG, e JPEG são permitidas.');
      return fileImages;
    }

    // Create object URL for the valid image file
    const url = URL.createObjectURL(file);
    fileImages.push(url);
  }

  console.log(fileImages);

  return fileImages;
}