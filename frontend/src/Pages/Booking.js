
import React, { useState, useEffect } from "react";
import "./style/booking.css";
import { Button, Form, FormGroup, ListGroup } from "react-bootstrap";
import { FaPlus, FaMinus, FaStar } from "react-icons/fa";
import toast from "react-hot-toast";
import { paymentData } from "../assets/Constants/Constant";
import BookingStatus from "./BookingStatus";
import { useLocation, useNavigate } from "react-router-dom";

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [countryState, setCountryState] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [productData, setProductData] = useState({});
  const [timeLeft, setTimeLeft] = useState(200); //3min:20sec

  // Fetching booking data from URL params
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const productId = searchParams.get("productId");
    const userId = searchParams.get("userId");
    const username = searchParams.get("username");
    const data = JSON.parse(searchParams.get("data"));
    const deliveryCharges = searchParams.get("deliveryCharges");
    const taxCharge = searchParams.get("taxCharge");
    const category = searchParams.get("category");

    setProductData({
      productId,
      userId,
      username,
      data,
      deliveryCharges,
      taxCharge,
      category,
    });

    // // Start the timer for automatic closure
    // const timer = setTimeout(() => {
    //   notify("Booking session expired!", "info");
    //   closeTab();
    // }, 120000); // 5 minutes = 300000 ms

    // return () => clearTimeout(timer); // Cleanup timer on component unmount


    // Countdown timer logic
    const timerId = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerId);
          notify("Booking session expired!", "info");

          // Set a timeout to run cancelBooking after 3 seconds
          const timeoutId = setTimeout(() => {
          
            cancelBooking();
          }, 3000); // 3 seconds delay

          // Cleanup timeout on component unmount
          return () => clearTimeout(timeoutId);
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(timerId);

  }, [location.search]);


 
  const {productId,userId,username,data,deliveryCharges,taxCharge,category}=productData|| {}
  const {price} =data || {}

  

  const notify = (message, action) => {
    const actions = {
      info: () => toast(message, {  icon: <span className="hot-toast-icon">ⓘ</span>, duration: 3000, className: "hot-toast", }),
      success: () => toast.success(message, { duration: 3000 , className: "hot-toast"}),
      error: () => toast.error(message, { duration: 3000 , className: "hot-toast"}),
    };
    (actions[action] || actions.error)();
  };

  const submitForm = async (e) => {
    e.preventDefault();

    if (!selectedPaymentMethod) {
      notify("Please select a payment method!", "info");
      return;
    }

    const bookingData = {
      products: [
        {
          productId: productId,
          quantity,
        },
      ],
      userId,
      fullName,
      username,
      phone,
      email,
      address,
      city,
      zip,
      countryState,
      selectedPaymentMethod,
     
    };

    try {
      const api = "https://ecommerce-backend-odsg.onrender.com/booking/api/create";
      const response = await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });
      if (response.ok) {
        notify("Booking confirmed!", "success");
        const data = await response.json();
        console.log(data);
        closeForm();
        setShowModal(true);
      }
    } catch (error) {
      notify("Booking failed. Please try again.", "error");
      console.error("Booking error: ", error);
    }
  };

  function closeForm() {
    setFullName("");
    setPhone("");
    setEmail("");
    setAddress("");
    setCity("");
    setZip("");
    setCountryState("");
    setQuantity("");
    setSelectedPaymentMethod("");
  }

  const total =
    data && taxCharge && deliveryCharges
      ? quantity === ""
      ? price + ( Number(taxCharge) + Number(deliveryCharges))
      : quantity === 1
      ? price+ ( Number(taxCharge) + Number(deliveryCharges))
      : (price * quantity) +( Number(taxCharge) + Number(deliveryCharges))
      : 0; // Set total to 0 when data is undefined

  


        

  const increaseQuantity = () => {
    setQuantity(quantity < 5 ? quantity + 1 : quantity);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const closeTab = () => {
    window.close();
  };

  function cancelBooking() {
   
    closeForm();
    navigate(`/product/${category}/${productId}`);
    // Close the tab if needed
    window.close();
  }


  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  if (!productData.data) {
    return <div><h3>Loading...</h3></div>; // Display loading message while data is being fetched
  }


  return(
    <>

      <h1 style={{display:"flex", justifyContent:'center',alignItems:'center'}}>Book Your Product Now!</h1>


            <div className="booking_data">
        <div className="form_data">
          <h5>Fill Your Information</h5>
          <p>Form will close in:  {timeLeft <= 0 ? "Booking session expired!" : formatTime(timeLeft)}</p> {/* Display the remaining time */}
          <Form className="booking-info-form" onSubmit={submitForm}>
            <div className="list_group_data">
              <ListGroup>
                <div className="card_price_review">
                  <h6>
                    Price : <span>${price}</span>
                  </h6>
                  <div className="review_items">
                    <FaStar className="icon_style" />
                    {/* {avgRating === 0 ? null : avgRating}({reviews?.length}) */}
                  </div>
                </div>
                <div className="list_1">
                  <span className="listPrice">Quantity</span>
                  <span>{quantity === "" ? 1 : quantity} qty</span>
                </div>
                <div className="list_1">
                  <span className="listPrice">Tax Charge</span>
                  <span>${taxCharge}.00</span>
                </div>

                <div className="list_1">
                  <span>Shipping Charges</span>
                  <span>${deliveryCharges}.00</span>
                </div>
                <div className="list_1  total_amount">
                  <h6>Total</h6>
                  <h4>${total}.00</h4>
                </div>
              </ListGroup>
            </div>
            <FormGroup>
              <input
                type="text"
                placeholder="Full Name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <input
                type="number"
                placeholder="Phone"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <div className="address_child_1">
                <input
                  type="address"
                  placeholder="Address"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="address_child_2">
                <input
                  type="text"
                  placeholder="City"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="State"
                  required
                  value={countryState}
                  onChange={(e) => setCountryState(e.target.value)}
                />
              </div>
            </FormGroup>
            <FormGroup className="group_Form_4">
              <div className="group_inner_form">
                <input
                  type="number"
                  placeholder="Zip"
                  required
                  value={zip}
                  max={999999}
                  min={99999}
                  onChange={(e) => {
                    e.target.value.length <= 8 && setZip(e.target.value);
                  }}
                />
              </div>
              <div className="group_inner_form_4">
                <FaMinus className="minus_icon" onClick={decreaseQuantity} />
                <input
                  type="number"
                  id="quantity"
                  placeholder="Quantity"
                  value={isNaN(quantity) ? "" : quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || "")}
                  min={0}
                  max={5}
                  onKeyDown={(e) => {
                    if (
                      !(
                        (e.key >= "0" && e.key <= "5") ||
                        e.key === "Backspace" ||
                        e.key === "Delete" ||
                        (e.key === "ArrowLeft" &&
                          e.target.selectionStart === e.target.selectionEnd) ||
                        (e.key === "ArrowRight" &&
                          e.target.selectionStart === e.target.selectionEnd)
                      ) ||
                      parseInt(e.target.value + e.key) > 5 ||
                      parseInt(e.target.value + e.key) < 1
                    ) {
                      e.preventDefault();
                    }
                  }}
                />
                <FaPlus className="plus_icon" onClick={increaseQuantity} />
              </div>
            </FormGroup>

            <h5>Payment Methods: </h5>

            <div className="payment-method">
              {paymentData?.map((payment) => (
                <div className="text-center" key={payment.id}>
                  <input
                    type="radio"
                    id={`paymentMethod${payment.id}`}
                    name="paymentMethod"
                    value={payment.name}
                    checked={selectedPaymentMethod === payment.name}
                    onChange={() => setSelectedPaymentMethod(payment.name)}
                  />
                  <label htmlFor={`paymentMethod${payment.id}`}>
                    <img
                      src={payment.image}
                      alt={payment.name}
                      className={`payment-icon ${
                        selectedPaymentMethod === payment.name ? "selected" : ""
                      }`}
                    />
                  </label>
                </div>
              ))}
            </div>

            <div className="btn_style_booking">
              {/* <Button variant="danger" onClick={goBack}>
                Cancel
              </Button> */}
              <Button variant="danger" onClick={cancelBooking} >
                Cancel
              </Button>
              <Button type="submit">Book Now</Button>
            </div>
          </Form>
        </div>
      </div>


      {
        showModal===true &&<BookingStatus
        showModal={showModal}
        setShowModal={setShowModal}
        category={productData.category}
        id={productData.productId}
        closeTab={closeTab}
        // setShowBooking={setShowBooking}
      />
      }
     

    </>

  )
}

export default Booking;






