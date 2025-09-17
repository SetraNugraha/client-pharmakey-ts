import Swal from "sweetalert2";

type type = "success" | "question" | "warning" | "error";

export const CustomAlert = (title: string, icon: type, message?: string) => {
  Swal.fire({
    icon: icon,
    title: title,
    text: message || "Something wrong",
    confirmButtonText: "Yes",
    width: "100%",
    customClass: {
      popup: "!max-w-sm",
    },
  });
};

export const CustomAlertConfirm = async (title: string): Promise<boolean> => {
  return Swal.fire({
    title: title,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes",
    width: "100%",
    customClass: {
      popup: "!max-w-sm",
    },
  }).then((result) => result.isConfirmed);
};
