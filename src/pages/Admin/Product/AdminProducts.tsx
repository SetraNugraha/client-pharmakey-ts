/* eslint-disable react-hooks/exhaustive-deps */
import { MdEditSquare, MdDelete, MdLibraryAdd } from "react-icons/md";
import { IoListCircleSharp } from "react-icons/io5";
import { useState } from "react";
import { useProducts } from "../../CustomHooks/useProduct";
import ModalCreateProduct from "./ModalCreateProduct";
import ModalUpdateProduct from "./ModalUpdateProduct";
import ModalDetailProduct from "./ModalDetailProduct";
import { CustomAlert, CustomAlertConfirm } from "../../../utils/CustomAlert";
import { Product } from "../../../types/product.type";
import { getImageUrl } from "../../../utils/getImageUrl";

export default function AdminProducts() {
  const { products, isLoading, pagination, goToPrevPage, goToNextPage, deleteProduct } = useProducts({ limit: 5 });
  const [modalCreate, setModalCreate] = useState<boolean>(false);
  const [modalDetail, setModalDetail] = useState<boolean>(false);
  const [modalUpdate, setModalUpdate] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleButtonDetail = (product: Product) => {
    setSelectedProduct(product);
    setModalDetail(true);
  };

  const handleButtonUpdate = (product: Product) => {
    setSelectedProduct(product);
    setModalUpdate(true);
  };

  const handleDeleteProduct = async (product: Product) => {
    const title = `Are you sure want to delete ${product.name} ?`;
    const isConfirm = await CustomAlertConfirm(title);

    if (isConfirm) {
      deleteProduct.mutate(product.id, {
        onSuccess: (data) => {
          CustomAlert("success", "success", data.message);
        },
        onError: (error) => {
          console.log("HandleDeleteProduct Error: ", error.message);
          CustomAlert("error", "error", "Error while deleting product, please try again later");
        },
      });
    } else {
      CustomAlert("cancelled", "error", "deleting cancelled");
    }
  };

  const RenderProducts = () => {
    if (!pagination) return;
    const { page, limit } = pagination;
    // (1 - 1) * 5 + 1 => 0 * 5 + 1 => 1
    // (2 - 1) * 5 + 1 => 1 * 5 + 1 => 6
    const baseNumber = (page - 1) * limit + 1;
    return products?.map((product, index) => {
      // index = 0 , 1 , 2 , ....
      // page 1 = 1 + 0 ... page 2 = 6 + 0 ... page 3 = 11 + 0 ...
      const rowNumber = baseNumber + index;
      const productImage = getImageUrl("products", product.product_image);
      return (
        <tr
          key={product.id}
          className="w-full bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          {/* Number */}
          <td className="text-[20px] text-center font-semibold text-gray-900 whitespace-nowrap dark:text-white">
            {rowNumber}
          </td>

          {/* Product Image */}
          <td className="py-3 flex justify-center items-center">
            <img src={productImage} alt="image-product" className="size-20 object-contain" />
          </td>

          {/* name */}
          <td className="py-3 tracking-widest text-[20px] text-center font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {product.name}
          </td>

          {/* Price */}
          <td className="py-3 text-center font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {product.price.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
            })}
          </td>

          {/* Action Button */}
          <td className="py-3">
            <div className="flex items-center justify-center gap-x-3">
              {/* Detail */}
              <a href="#" onClick={() => handleButtonDetail(product)}>
                <IoListCircleSharp size={30} className="text-yellow-500 hover:text-sky-400 duration-200" />
              </a>
              {/* Update */}
              <button onClick={() => handleButtonUpdate(product)}>
                <MdEditSquare size={30} className="text-green-500 hover:text-blue-500 duration-200" />
              </button>
              {/* Delete */}
              <button onClick={() => handleDeleteProduct(product)}>
                <MdDelete size={30} className="text-red-500 hover:text-slate-400 duration-200" />
              </button>
            </div>
          </td>
        </tr>
      );
    });
  };

  return (
    <>
      <section className="px-10 py-5">
        <div>
          {/* Title */}
          <h1 className="font-bold text-2xl mb-5">Products</h1>
          {/* Button Add New Product */}
          <button
            onClick={() => setModalCreate(true)}
            className="px-3 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-white hover:text-blue-500 hover:outline-none hover:ring-2 hover:ring-blue-500 duration-300 mb-5 flex items-center gap-x-2 shadow-lg shadow-gray-300"
          >
            <span>
              <MdLibraryAdd size={22} />
            </span>
            Create Product
          </button>

          {/* Product Data */}
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    No.
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Image
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr className="font-semibold text-slate-400 tracking-wider">
                    <td colSpan={5} className="py-5 text-center text-xl">
                      Loading ...
                    </td>
                  </tr>
                ) : (
                  <RenderProducts />
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="absolute bottom-24  flex items-center gap-x-3 mt-5 ml-3">
            <button
              disabled={!pagination?.isPrev}
              onClick={goToPrevPage}
              className="px-2 py-1 bg-blue-500 font-semibold text-white rounded-lg cursor-pointer hover:outline-none hover:ring-2 hover:ring-blue-500 hover:text-blue-500 hover:bg-white duration-300 disabled:bg-slate-500 disabled:cursor-not-allowed disabled:text-white disabled:ring-0"
            >
              Prev
            </button>
            <p className="px-3 py-1 ring-2 ring-slate-300 rounded-lg font-semibold text-slate-400">
              {pagination?.page}
            </p>
            <button
              disabled={!pagination?.isNext}
              onClick={goToNextPage}
              className="px-2 py-1 bg-blue-500 font-semibold text-white rounded-lg cursor-pointer hover:outline-none hover:ring-2 hover:ring-blue-500 hover:text-blue-500 hover:bg-white duration-300 disabled:bg-slate-500 disabled:cursor-not-allowed disabled:text-white disabled:ring-0"
            >
              Next
            </button>
          </div>
        </div>

        {/* Create */}
        {modalCreate && <ModalCreateProduct onClose={() => setModalCreate(false)} />}

        {/* Update */}
        {modalUpdate && <ModalUpdateProduct product={selectedProduct} onClose={() => setModalUpdate(false)} />}

        {/* Detail */}
        {modalDetail && <ModalDetailProduct product={selectedProduct} onClose={() => setModalDetail(false)} />}
      </section>
    </>
  );
}
