import React, { useState } from "react";
import { useCategory } from "../../CustomHooks/useCategory";
import Modal from "../../../components/Admin/Modal";
import { CustomAlert } from "../../../utils/CustomAlert";
import { Errors } from "../../../types/common.type";
import { IUpdateCategory } from "../../../types/category.type";
import { Category } from "../../../types/category.type";
import { AxiosError } from "axios";
import { getErrorField } from "../../../utils/getErrorField";

type ModalUpdateCategoryProps = {
  category: Category | null;
  onClose: () => void;
};

export default function ModalUpdateCategory({ category, onClose }: ModalUpdateCategoryProps) {
  const { updateCategory } = useCategory();

  // FORM State
  const [formUpdateCategory, setFormUpdateCategory] = useState<Partial<IUpdateCategory>>({});

  // ERROR State
  const [hasError, setHasError] = useState<Errors[]>([]);
  const nameError = getErrorField(hasError, "name");
  const categoryImageError = getErrorField(hasError, "category_image");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;
    setFormUpdateCategory((prevState) => ({
      ...prevState,
      [name]: type === "file" ? files?.[0] : value,
    }));
  };

  // EDIT Data
  const handleUpdateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateCategory.mutate(
      { categoryId: category?.id, payload: formUpdateCategory },
      {
        onSuccess: (data) => {
          setHasError([]);
          CustomAlert("success", "success", data?.message);
          onClose();
        },
        onError: (error) => {
          if (error instanceof AxiosError) {
            const errors = error?.response?.data.errors;

            // NO FIELD CHANGES ERROR
            if (!errors && !error.response?.data.success) {
              CustomAlert("error", "error", error.response?.data.message);
            }

            // INPUT VALIDATION ERROR
            if (errors && errors.length !== 0 && error.response?.data.message === "validation error") {
              setHasError(errors);
            }
          } else {
            CustomAlert("error", "error", "Internal server error, please try again later.");
          }
        },
      }
    );
  };

  return (
    <Modal>
      <Modal.Header title="Edit Category" onClose={onClose} disabled={updateCategory.isPending} />
      <Modal.Body>
        {formUpdateCategory && (
          <form onSubmit={handleUpdateCategory} className="w-[500px] flex flex-col gap-y-3">
            {/* Category Name */}
            <div className="flex flex-col gap-y-2">
              <label htmlFor="name" className="font-semibold text-slate-500 ml-1">
                Category Name
              </label>
              <input
                disabled={updateCategory.isPending}
                type="text"
                name="name"
                id="name"
                placeholder="Input category name here"
                className={`h-[40px] rounded-lg px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed ${
                  nameError ? "ring-2 ring-red-500" : "ring-1 ring-slate-300"
                }`}
                value={formUpdateCategory.name ?? category?.name ?? ""}
                onChange={handleChange}
              />
            </div>

            {nameError && <p className="text-red-500 font-semibold tracking-wider ml-2 -mt-2">{nameError?.message}</p>}

            {/* Add icon*/}
            <div className="flex flex-col gap-y-2">
              <label htmlFor="name" className="font-semibold text-slate-500 ml-1">
                Add New Icon
              </label>
              <input
                disabled={updateCategory.isPending}
                type="file"
                name="category_image"
                id="category_image"
                onChange={handleChange}
                accept="image/*"
                className="disabled:cursor-not-allowed"
              />

              {categoryImageError && <p className="text-red-500 font-semibold tracking-wider ml-2 -mt-2">{categoryImageError?.message}</p>}
            </div>

            {/* Button Submit */}
            <button
              className={`py-2 rounded-lg  text-white font-semibold text-lg tracking-wider mt-5 shadow-xl  ${
                updateCategory.isPending
                  ? "bg-slate-500 cursor-not-allowed"
                  : "bg-green-500 duration-300 hover:oulinte-none hover:ring-2 hover:ring-green-500 hover:text-green-500 hover:bg-white"
              }`}
              disabled={updateCategory.isPending}
            >
              {updateCategory.isPending ? "Process Updating .... " : "Submit"}
            </button>
          </form>
        )}
      </Modal.Body>
    </Modal>
  );
}
