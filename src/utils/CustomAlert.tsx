import Swal from "sweetalert2"

type IconType = "success" | "question" | "warning" | "error"

export const CustomAlert = (
  title: string,
  icon: IconType,
  message?: string,
) => {
  Swal.fire({
    icon: icon,
    title: title,
    text: message,
    confirmButtonText: "Yes",
  })
}

export const CustomAlertConfirm = async (title: string): Promise<boolean> => {
  return Swal.fire({
    title: title,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes",
  }).then((result) => result.isConfirmed)
}
