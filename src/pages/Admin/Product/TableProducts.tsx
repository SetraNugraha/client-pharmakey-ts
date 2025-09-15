import { Pagination } from "../../../types/common.type";
import { Product } from "../../../types/product.type";
import { getImageUrl } from "../../../utils/getImageUrl";
import { MdEditSquare, MdDelete } from "react-icons/md";
import { IoListCircleSharp } from "react-icons/io5";
import { convertToRp } from "../../../utils/convertToRp";

interface Props {
  isLoading: boolean;
  products?: Product[];
  pagination?: Pagination;
  buttonDetail: (product: Product) => void;
  buttonUpdate: (product: Product) => void;
  buttonDelete: (product: Product) => void;
}

export const TableProducts = ({ isLoading, products, pagination, buttonDetail, buttonUpdate, buttonDelete }: Props) => {
  // Loading
  if (isLoading) {
    return (
      <tr>
        <td colSpan={5} className="text-center text-xl font-semibold py-2 text-black">
          Loading data products ....
        </td>
      </tr>
    );
  }

  // Products not found
  if (products?.length === 0 || products === null) {
    return (
      <tr>
        <td colSpan={5} className="text-center text-xl font-semibold py-2 text-black italic">
          Product not found.
        </td>
      </tr>
    );
  }

  if (!pagination) return;
  const { page, limit } = pagination;
  // (1 - 1) * 5 + 1 => 0 * 5 + 1 => 1
  // (2 - 1) * 5 + 1 => 1 * 5 + 1 => 6
  const baseNumber = (page - 1) * limit + 1;

  //   Mapping Products
  return products?.map((product, index) => {
    // index = 0 , 1 , 2 , ....
    // page 1 = 1 + 0 ... page 2 = 6 + 0 ... page 3 = 11 + 0 ...
    const rowNumber = baseNumber + index;
    const productImage = getImageUrl("products", product.product_image);
    return (
      <tr key={product.id} className="w-full bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
        {/* Number */}
        <td className="text-[20px] text-center font-semibold text-gray-900 whitespace-nowrap dark:text-white">{rowNumber}</td>

        {/* Product Image */}
        <td className="py-3 flex justify-center items-center">
          <img src={productImage} alt="image-product" className="size-20 object-contain" />
        </td>

        {/* name */}
        <td className="py-3 tracking-widest text-[20px] text-center font-medium text-gray-900 whitespace-nowrap dark:text-white">{product.name}</td>

        {/* Price */}
        <td className="py-3 text-center font-medium text-gray-900 whitespace-nowrap dark:text-white">{convertToRp(product?.price)}</td>

        {/* Action Button */}
        <td className="py-3">
          <div className="flex items-center justify-center gap-x-3">
            {/* Detail */}
            <a href="#" onClick={() => buttonDetail(product)}>
              <IoListCircleSharp size={30} className="text-yellow-500 hover:text-sky-400 duration-200" />
            </a>
            {/* Update */}
            <button onClick={() => buttonUpdate(product)}>
              <MdEditSquare size={30} className="text-green-500 hover:text-blue-500 duration-200" />
            </button>
            {/* Delete */}
            <button onClick={() => buttonDelete(product)}>
              <MdDelete size={30} className="text-red-500 hover:text-slate-400 duration-200" />
            </button>
          </div>
        </td>
      </tr>
    );
  });
};
