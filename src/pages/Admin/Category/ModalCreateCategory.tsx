import { useState } from "react";
import { useCategory } from "../../CustomHooks/useCategory";
import Modal from "../../../components/Admin/Modal";
import { CustomAlert } from "../../../utils/CustomAlert";
import { Errors } from "../../../types/common.type";
import { AxiosError } from "axios";
import { Category } from "../../../types/category.type";
import { getErrorField } from "../../../utils/getErrorField";

type ModalCreateCategoryProps = {
  onClose: () => void;
};

export default function ModalCreateCategory({ onClose }: ModalCreateCategoryProps) {
  const { createCategory } = useCategory();

  //  FORM State
  const [formCreateCategory, setFormCreateCategory] = useState<Partial<Category>>({});

  // ERROR State
  const [hasError, setHasError] = useState<Errors[]>([]);
  const nameError = getErrorField(hasError, "name");
  const categoryImageError = getErrorField(hasError, "category_image");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;

    setFormCreateCategory((prevState) => ({
      ...prevState,
      [name]: type === "file" ? files?.[0] : value,
    }));
  };

  // CREATE Category
  const handleCreateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createCategory.mutate(formCreateCategory, {
      onSuccess: (data) => {
        setHasError([]);
        CustomAlert("success", "success", data?.message);
        onClose();
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          const errors = error?.response?.data.errors;

          if (errors) {
            setHasError(errors);
          }
        } else {
          CustomAlert("success", "success", "Internal server error, please try again later ...");
          console.log("error create component: ", error);
        }
      },
    });
  };

  return (
    <Modal>
      <Modal.Header title="Create Category" onClose={onClose} />
      <Modal.Body>
        <form onSubmit={handleCreateCategory} className="w-[500px] flex flex-col gap-y-3">
          {/* Category Name */}
          <div className="flex flex-col gap-y-2">
            <label htmlFor="name" className="font-semibold text-slate-500 ml-1">
              Category Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              value={formCreateCategory.name || ""}
              onChange={handleChange}
              placeholder="Input category name here"
              className={`h-[40px]  rounded-lg px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                nameError ? "ring-2 ring-red-500" : "ring-1 ring-slate-300"
              }`}
            />
          </div>

          {nameError && (
            <div className="ml-2 -mt-2 tracking-wider text-red-500 font-semibold">
              <p>{nameError.message}</p>
            </div>
          )}

          {/* Add icon*/}
          <div className="flex flex-col gap-y-2">
            <label htmlFor="category_image" className="font-semibold text-slate-500 ml-1">
              Add Icon
            </label>
            <input type="file" name="category_image" id="category_image" accept="image/*" onChange={handleChange} />

            {categoryImageError && (
              <div className="ml-2 -mt-2 tracking-wider text-red-500 font-semibold">
                <p>{categoryImageError.message}</p>
              </div>
            )}
          </div>

          {/* Button Submit */}
          <button className="py-2 rounded-lg bg-blue-500 text-white font-semibold text-lg tracking-wider mt-5 shadow-xl hover:oulinte-none hover:ring-2 hover:ring-blue-500 hover:text-blue-500 hover:bg-white duration-300">
            Submit
          </button>
        </form>
      </Modal.Body>
    </Modal>
  );
}
