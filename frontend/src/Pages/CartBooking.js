import React, { useState, useEffect } from "react";
import { ListGroup, Form, FormGroup, Button } from "react-bootstrap";
import toast from "react-hot-toast";
import { paymentData } from "../assets/Constants/Constant";
import BookingStatus from "./BookingStatus";

import { useCartContext } from "../Context/Cart_Context";


function CartBooking(props) {
  const [showModal, setShowModal] = useState(false);
  const { userInfo } = useCartContext();
  const [timeLeft, setTimeLeft] = useState(200); //3min:20sec


  const { deliveryCharges, cart, total, taxCharge, setShowBooking, showBooking } =
    props || {};

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [countryState, setCountryState] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  const notify = (message, action) => {
    const actions = {
      info: () => toast(message, { icon: <span className="hot-toast-icon">ⓘ</span>, duration: 3000, className: "hot-toast", }),
      success: () => toast.success(message, { duration: 3000, className: "hot-toast" }),
      error: () => toast.error(message, { duration: 3000, className: "hot-toast" }),
    };
    (actions[action] || actions.error)();
  };

  const goBack = () => {
    setShowBooking(false);
  };

  useEffect(() => {
    let timerId;

    if (showBooking) {
      timerId = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerId);
            notify("Booking session expired!", "info");

            // Set a timeout to run goBack after 3 seconds
            setTimeout(() => {
              goBack();
            }, 3000);

            return 0; // Ensure timer stops updating at 0
          }
          return prev - 1;
        });
      }, 1000);
    }

    // Cleanup interval on component unmount
    return () => clearInterval(timerId);
  }, [showBooking, goBack, notify]);








  const submitForm = async (e) => {
    e.preventDefault();

    if (!selectedPaymentMethod) {
      notify("Please select a payment method!", "info");
      return;
    }

    const products = cart.map(item => ({
      productId: item.id,  // productId should match with item.id
      quantity: item.quantity  // Extract quantity from the cart item
    }));

    //map will return array of objects here
    const formData = {

      products,

      userId: userInfo._id,
      fullName,
      username: userInfo.username,
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
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        notify("Booking confirmed!", "success");
        const data = await response.json();
        console.log(data);
        // closeForm();
        setShowModal(true);
      }
    } catch (error) {
      notify("Booking failed. Please try again.", "error");
      console.error("Booking error: ", error);
    }



    // Clear form fields after submission
    setFullName("");
    setPhone("");
    setEmail("");
    setAddress("");
    setCity("");
    setZip("");
    setCountryState("");
    setSelectedPaymentMethod("");

    setShowModal(true);
  };



  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <>
      <div className="booking_data">
        <div className="form_data">
          <Form className="booking-info-form" onSubmit={submitForm}>
            <h5>Fill Your Information</h5>
            <p>Form will close in:  {timeLeft <= 0 ? "Booking session expired!" : formatTime(timeLeft)}</p>
            <div className="list_group_data">
              <ListGroup>
                <div className="list_1">
                  <span>Service Charges:</span>
                </div>
                <div className="list_1">
                  <span>Items</span>
                  <span>{cart.length} item</span>
                </div>

                <div className="list_1">
                  <span>Tax</span>
                  <span>${taxCharge}.00</span>
                </div>
                <div className="list_1">
                  <span>Shipping</span>
                  <span>${deliveryCharges}.00</span>
                </div>
                <div className="list_1 total_amount">
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
            <FormGroup className="group_Form_4 mb-3">
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

              <h5 style={{ marginRight: 15 }}>Payment Types : </h5>
            </FormGroup>

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
                      className={`payment-icon ${selectedPaymentMethod === payment.name ? "selected" : ""
                        }`}
                    />
                  </label>
                </div>
              ))}
            </div>

            <div className="btn_style_booking">
              <Button variant="danger" onClick={goBack}>
                Cancel
              </Button>
              <Button type="submit" variant="success">
                Pay
              </Button>
            </div>
          </Form>
        </div>
      </div>
      <BookingStatus
        showModal={showModal}
        setShowModal={setShowModal}
        setShowBooking={setShowBooking}
      />
    </>
  );
}

export default CartBooking;
