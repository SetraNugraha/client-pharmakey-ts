export const objectToFormData = (fields: any) => {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined) {
      if (typeof value === "string" || typeof value === "number") {
        formData.append(key, value.toString().trim());
      } else if (value instanceof File) {
        formData.append(key, value);
      }
    }
  });

  return formData;
};
