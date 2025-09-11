/* eslint-disable react-hooks/exhaustive-deps */
import { MdLibraryAdd } from "react-icons/md";
import { useState } from "react";
import { useProducts } from "../../CustomHooks/useProduct";
import ModalCreateProduct from "./ModalCreateProduct";
import ModalUpdateProduct from "./ModalUpdateProduct";
import ModalDetailProduct from "./ModalDetailProduct";
import { CustomAlert, CustomAlertConfirm } from "../../../utils/CustomAlert";
import { Product } from "../../../types/product.type";
import { TableProducts } from "./TableProducts";
import { useDebounce } from "use-debounce";

export default function AdminProducts() {
  const [userSearch, setUserSearch] = useState<string>("");
  const [searchDebounce] = useDebounce(userSearch, 700);

  // CUSTOM HOOKS
  const {
    products,
    isLoading,
    pagination,
    goToPrevPage,
    goToNextPage,
    deleteProduct,
    productsByFilter,
    productsByFilterPagination,
    productsByFilterLoading,
  } = useProducts({ limit: 5, search: searchDebounce });

  const [modalCreate, setModalCreate] = useState<boolean>(false);
  const [modalDetail, setModalDetail] = useState<boolean>(false);
  const [modalUpdate, setModalUpdate] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // const handleUserSearch = () => {}

  const handleDetailProduct = (product: Product) => {
    setSelectedProduct(product);
    setModalDetail(true);
  };

  const handleUpdateProduct = (product: Product) => {
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

  return (
    <>
      <section className="px-10 py-5">
        <div>
          {/* Title */}
          <h1 className="font-bold text-2xl mb-5">Products</h1>
          <div className="flex items-center justify-between mb-5 ">
            {/* Button Add New Product */}
            <button
              onClick={() => setModalCreate(true)}
              className="px-3 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-white hover:text-blue-500 hover:outline-none hover:ring-2 hover:ring-blue-500 duration-300  flex items-center gap-x-2 shadow-lg shadow-gray-300"
            >
              <span>
                <MdLibraryAdd size={22} />
              </span>
              Create Product
            </button>

            {/* Input Search */}
            <input
              type="text"
              placeholder="Search by name or category ..."
              className="ring-1 ring-slate-400 py-1.5 px-3 mr-2 rounded-lg w-[350px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
            />
          </div>

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
                {productsByFilter ? (
                  <TableProducts
                    isLoading={productsByFilterLoading}
                    products={productsByFilter}
                    pagination={productsByFilterPagination}
                    buttonDetail={handleDetailProduct}
                    buttonUpdate={handleUpdateProduct}
                    buttonDelete={handleDeleteProduct}
                  />
                ) : (
                  <TableProducts
                    isLoading={isLoading}
                    products={products}
                    pagination={pagination}
                    buttonDetail={handleDetailProduct}
                    buttonUpdate={handleUpdateProduct}
                    buttonDelete={handleDeleteProduct}
                  />
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
