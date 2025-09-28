import { useState } from "react";
import Modal from "../../../components/Admin/Modal";
import { useCategory } from "../../CustomHooks/useCategory";
import { useProducts } from "../../CustomHooks/useProduct";
import { CustomAlert } from "../../../utils/CustomAlert";
import { Product } from "../../../types/product.type";
import { Errors } from "../../../types/common.type";
import { AxiosError } from "axios";
import { getErrorField } from "../../../utils/getErrorField";

interface ModalUpdateProductProps {
  product: Product | null;
  onClose: () => void;
}

export default function ModalUpdateProduct({ product, onClose }: ModalUpdateProductProps) {
  const { categories } = useCategory();
  const { updateProduct } = useProducts({});
  const findCategory = categories?.find((item) => item.id === product?.category_id);

  // FORM State
  const [formUpdateProduct, setFormUpdateProduct] = useState<Partial<Product>>({ id: product?.id });

  // ERROR State
  const [hasError, setHasError] = useState<Errors[]>([]);
  const nameError = getErrorField(hasError, "name");
  const categoryError = getErrorField(hasError, "category");
  const priceError = getErrorField(hasError, "price");
  const productImageError = getErrorField(hasError, "product_image");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, files } = e.target as HTMLInputElement;

    setFormUpdateProduct((prevState) => ({
      ...prevState,
      [name]: type === "file" ? files?.[0] : value,
    }));
  };

  const handleUpdateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateProduct.mutate(
      { productId: product!.id, payload: formUpdateProduct },
      {
        onSuccess: (data) => {
          CustomAlert("success", "success", data?.message);
          onClose();
        },
        onError: (error: any) => {
          if (error instanceof AxiosError) {
            const errors = error.response?.data.errors;

            // NO FIELD CHANGES ERROR
            if (!errors && !error.response?.data.success) {
              CustomAlert("error", "error", error.response?.data.message);
            }

            // VALIDATION FIELD ERROR
            if (errors && errors.length !== null && error.response?.data.message === "validation error") {
              setHasError(errors);
            }
          } else {
            console.log("handleUpdateProduct Error: ", error.message);
            CustomAlert("error", "error", "internal server error, please try again later");
          }
        },
      }
    );
  };

  return (
    <Modal>
      <Modal.Header title="Edit Product" onClose={onClose} disabled={updateProduct.isPending} />
      <Modal.Body>
        <form onSubmit={handleUpdateProduct} className="w-[500px]">
          <fieldset disabled={updateProduct.isPending} className="w-full flex flex-col gap-y-3">
            {/* Product Name */}
            <div className="flex flex-col gap-y-2">
              <label htmlFor="name" className="font-semibold text-slate-500 ml-1">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Input product name here"
                className={`h-[40px] rounded-lg px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  nameError ? "ring-2 ring-red-500" : "ring-1 ring-slate-300"
                }`}
                value={formUpdateProduct?.name ?? product?.name ?? ""}
                onChange={handleChange}
              />
              {nameError && <p className="text-red-500 font-semibold tracking-wider ml-2">{nameError?.message}</p>}
            </div>

            {/* Select Category */}
            <div className="flex flex-col gap-y-2">
              <label htmlFor="category_id" className="font-semibold text-slate-500 ml-1">
                Select Category
              </label>
              <select
                name="category_id"
                id="category_id"
                className={`h-[40px] pl-3 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg ${
                  categoryError && "ring-2 ring-red-500"
                }`}
                onChange={handleChange}
              >
                {/* Default Category */}
                <option value={product?.category_id}>{findCategory?.name || "unknown"}</option>
                {/* Render Option */}
                {categories
                  ?.filter((category) => category.id !== product?.category_id)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>

              {categoryError && <p className="text-red-500 font-semibold tracking-wider ml-2">{categoryError?.message}</p>}
            </div>

            {/* Product Price */}
            <div className="flex flex-col gap-y-2">
              <label htmlFor="price" className="font-semibold text-slate-500 ml-1">
                Price
              </label>
              <input
                type="number"
                name="price"
                id="price"
                placeholder="Input product price here"
                className={`h-[40px] rounded-lg px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  priceError ? "ring-2 ring-red-500" : "ring-1 ring-slate-300"
                }`}
                value={formUpdateProduct.price ?? product?.price ?? 0}
                onChange={handleChange}
              />

              {priceError && <p className="text-red-500 font-semibold tracking-wider ml-2">{priceError?.message}</p>}
            </div>

            {/* Product description */}
            <div className="flex flex-col gap-y-2">
              <label htmlFor="description" className="font-semibold text-slate-500 ml-1">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                placeholder="Add description product"
                className="border border-slate-300 rounded-lg px-5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                value={formUpdateProduct?.description ?? product?.description ?? ""}
                onChange={handleChange}
              ></textarea>
            </div>

            {/* Add Product Image*/}
            <div className="flex flex-col gap-y-2">
              <label htmlFor="product_image" className="font-semibold text-slate-500 ml-1">
                Add New Product Image
              </label>
              <input type="file" name="product_image" id="product_image" accept="image/*" onChange={handleChange} />

              {productImageError && <p className="text-red-500 font-semibold tracking-wider ml-2">{productImageError?.message}</p>}
            </div>

            {/* Button Submit */}
            <button className="py-2 rounded-lg bg-green-500 text-white font-semibold text-lg tracking-wider mt-5 shadow-xl duration-300 hover:oulinte-none hover:ring-2 hover:ring-green-500 hover:text-green-500 hover:bg-white disabled:bg-slate-500 disabled:cursor-not-allowed disabled:ring-0 disabled:text-white">
              {updateProduct.isPending ? "Please wait ..." : "Submit"}
            </button>
          </fieldset>
        </form>
      </Modal.Body>
    </Modal>
  );
}
