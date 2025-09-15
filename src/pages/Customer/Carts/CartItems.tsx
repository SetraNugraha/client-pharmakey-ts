import { ICart } from "../../../types/cart.type";
import { useCart } from "../../CustomHooks/useCart";
import { CartActionMethod } from "../../../types/cart.type";
import { CustomAlert } from "../../../utils/CustomAlert";
import { getImageUrl } from "../../../utils/getImageUrl";
import { Link } from "react-router-dom";
import { convertToRp } from "../../../utils/convertToRp";

export const CartItems = ({ carts }: { carts?: ICart[] }) => {
  const { cartAction } = useCart();

  const handleRemoveItem = async (productId: string) => {
    cartAction.mutate(
      { action: CartActionMethod.REMOVE, productId: productId },
      {
        onSuccess: (data) => {
          CustomAlert("Success", "success", data?.message);
        },
        onError: (error: any) => {
          CustomAlert("Error", "error", error?.response?.data.message || "Error while removing item");
        },
      }
    );
  };

  if (carts?.length === 0) {
    return <p className="font-semibold tracking-wider p-2 ">Cart is empty</p>;
  }

  return carts?.map((cart, index) => {
    const productImage = getImageUrl("products", cart.product?.product_image);
    return (
      <div key={index} className="relative">
        {/* Products */}
        <Link
          to={`/detail-product/${cart?.product?.slug}/${cart?.product_id}`}
          className="flex items-center justify-between gap-x-2 px-5 py-3 bg-white rounded-[16px] shrink-0 hover:bg-[#FD915A] group"
        >
          <div className="flex items-center gap-x-3">
            <img src={productImage} alt="product-image" className="size-16 object-contain" />
            <div className="flex flex-col gap-y-1 items-start">
              <h1 className="font-bold group-hover:text-white text-start">{cart?.product?.name}</h1>
              <p className="font-semibold text-slate-400 group-hover:text-white">{convertToRp(cart?.product?.price)}</p>
              <p className="font-semibold text-sm text-slate-400 group-hover:text-white">Quantity: {cart?.quantity}</p>
            </div>
          </div>
        </Link>

        {/* Remove Item Button */}
        <button
          onClick={() => handleRemoveItem(cart?.product_id)}
          className="absolute top-1/2 -translate-y-1/2 right-5 p-2 bg-red-500 rounded-full hover:bg-slate-400 transition-all duration-200 ease-in-out"
        >
          <img src="assets/img/trash.png" alt="trash-icon" />
        </button>
      </div>
    );
  });
};
