export const getImageUrl = (
  type: "products" | "categories" | "proofTransactions" | "customers",
  imageName: string | File | null | undefined,
) => {
  if (imageName) {
    return `${import.meta.env.VITE_IMAGE_URL}/${type}/${imageName}`
  } else {
    return "/assets/img/no-image.png"
  }
}
