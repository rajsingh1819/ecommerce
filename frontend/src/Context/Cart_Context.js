import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import CartReducer from "./CartReducer";
import toast from "react-hot-toast";



const CartContext = createContext();

const getLocalStorageData = () => {
  let cartData = localStorage.getItem("cart");
  if (cartData == null) {
    return [];
  } else {
    return JSON.parse(cartData);
  }
};



const initialState = {
  cart: getLocalStorageData()
};

const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(CartReducer, initialState);
  const [productData, setProductData] = useState([]);


  // login user data storing here
  const [ userInfo, setUserInfo] = useState(null);
  // console.log("user information  ==> ", userInfo)


  const addToCart = (data) => {
    if (state.cart.length >= 8) {
      toast("Cannot add more than 8 items to the cart!", {
        icon: <span className="hot-toast-icon">ⓘ</span>,
        duration: 2000,
        className: "hot-toast",
      });

      return;
    }

    dispatch({ type: "ADD_TO_CART", payload: { data } });
    toast.success("Item Add to Cart!", {
      duration: 2000,
      className: "hot-toast",
    });
  };

  const removeToCart = (id) => {
    dispatch({ type: "Remove_TO_Cart", payload: id });
    toast("Item removed from cart!", {
      icon: <span className="hot-toast-icon">ⓘ</span>,
      duration: 2000,
      className: "hot-toast",
    });
  };

  const updateQuantity = (itemId, quantity) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { itemId, quantity } });
  };

  const RemoveAllCartItem = () => {
    dispatch({ type: "Remove_All_Cart_Item" });
    
  };

 

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.cart));

    localStorage.setItem("contactUS", JSON.stringify(state.contact));
  }, [state.cart, state.contact]);

  // get all data from backend
  const getAllApi = async () => {
    try {
      let response = await fetch("http://localhost:8000/product/getAll");
      response = await response.json();
      setProductData(response.data);
    } catch (error) {
      console.error("Failed to fetch product data:", error);
      return null;
    }
  };


  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setUserInfo(null); // Clear userInfo if the token doesn't exist
    }
  }, [localStorage.getItem("authToken")]);
  


  useEffect(() => {
    
    getAllApi();
  }, []);


  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        removeToCart,
        updateQuantity,
        RemoveAllCartItem,
        productData,
        userInfo, setUserInfo,
        getAllApi

      }}
    >
      {children}
    </CartContext.Provider>
  );
};

const useCartContext = () => {
  return useContext(CartContext);
};

export { CartProvider, useCartContext };
