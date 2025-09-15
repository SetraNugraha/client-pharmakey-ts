export const convertToRp = (value?: number) => {
  if (typeof value === "number") {
    return value.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });
  } else {
    return "Rp. 0";
  }
};
