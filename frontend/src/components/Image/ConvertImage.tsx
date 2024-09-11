export const convertToBase64 = (imageData: any) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    const blob = new Blob([imageData], { type: "image/png" }); // 根據需要調整 mime type
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
  });
};
