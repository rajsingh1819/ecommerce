import React, { useEffect, useState } from "react";
import { Button, Container, Modal } from "react-bootstrap";
import EmptyCart from "../Container/EmptyCart";
import "./style/order.css";
import { Offers } from "../assets/Constants/Constant";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCartContext } from "../Context/Cart_Context";

function Order() {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useCartContext();

  const [status, setStatus] = useState("Placed");
  const [orderId, setOrderId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const { deliveryCharges, taxCharge } = Offers;
  // console.log("Booking ===> ", userInfo?.bookings)
  // console.log("Booking ===> ", userInfo?.bookings.length)


  useEffect(() => {
    let totalPrice = 0;

    if (userInfo?.bookings && userInfo.bookings.length > 0) {
      userInfo.bookings.forEach((item) => {
        let bookingTotal = 0;

        item.products.forEach((product) => {
          const productTotal = Number(product.productId.price) * Number(product.quantity);
          bookingTotal += productTotal;
        });

        // Add delivery and tax charges once per booking
        totalPrice += bookingTotal + deliveryCharges + taxCharge;
      });

      setTotalAmount(totalPrice);
    }
  }, [userInfo?.bookings, deliveryCharges, taxCharge]);





  const getStatusColor = (status) => {
    switch (status) {
      case "Placed":
        return "green";
      case "Shipped":
        return "orange";
      case "Delivered":
        return "blue";
      default:
        return "black";
    }
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
  };

  const notifyDelete = (message, info) => {
    if (info === "success") {
      toast.success(message, {
        duration: 3000,
        className: "hot-toast",
      });

    }
    else {
      toast.error(message, {
        duration: 3000,
        className: "hot-toast",
      });

    }

  };



  const handleOpenModal = (bookingId, productId) => {
    setOpenModal(true);
    setOrderId({ bookingId, productId });
  };

  const handleOrder = async () => {
    const { bookingId, productId } = orderId;

    if (!bookingId || !productId) {
      notifyDelete("Invalid order or product ID", "error");
      return;
    }

    try {
      const api = `https://ecommerce-backend-odsg.onrender.com/booking/api/delete/${bookingId}/product/${productId}`;
      const response = await fetch(api, { method: "DELETE" });

      if (response.ok) {
        const data = await response.json();
        setOpenModal(false);
        notifyDelete(data.message || "Order has been canceled!", "success");

        // Update the bookings by removing the deleted product
        const updatedBookings = userInfo.bookings
          .map((booking) => {
            if (booking._id === bookingId) {
              const updatedProducts = booking.products.filter(
                (product) => product._id !== productId
              );
              const updatedTotal = updatedProducts.reduce(
                (acc, product) =>
                  acc + Number(product.productId.price) * Number(product.quantity),
                0
              );
              return {
                ...booking,
                products: updatedProducts,
                total: updatedTotal + deliveryCharges + taxCharge, // Update total
              };
            }
            return booking;
          })
          .filter((booking) => booking.products.length > 0); // Remove bookings with no products

        // Update the state with the new bookings and recalculate total amount
        const newTotalAmount = updatedBookings.reduce(
          (acc, booking) => acc + booking.total,
          0
        );

        setUserInfo({ ...userInfo, bookings: updatedBookings });
        setTotalAmount(newTotalAmount); // Update total amount in state
      } else {
        setOpenModal(false);
        notifyDelete("Failed to cancel order", "error");
      }
    } catch (error) {
      console.error("Error canceling order:", error);
      notifyDelete("Something went wrong!", "error");
    }
  };











  return (

    <>
      <Container>
        {localStorage.getItem("authToken") && userInfo?.bookings && userInfo.bookings.length > 0 ? (
          <div className="card-body body-style">
            <div className="total-amount">
              <span className="card-title">Order Tracking</span>

              <span className="totalOrder">Total Amount : $ {totalAmount}</span>
            </div>

            <div className="d-flex justify-content-between align-items-center status-bar">
              {["Placed", "Shipped", "Delivered"].map(
                (itemStatus, index, array) => (
                  <React.Fragment key={itemStatus}>
                    <button
                      className={`btn ${status === itemStatus
                        ? itemStatus === "Placed"
                          ? "btn-success"
                          : itemStatus === "Shipped"
                            ? "btn-warning"
                            : "btn-primary"
                        : "btn-light"
                        }`}
                      onClick={() => handleStatusChange(itemStatus)}
                    >
                      {itemStatus}
                    </button>
                    {index < array.length - 1 && <span className="line"></span>}
                  </React.Fragment>
                )
              )}
            </div>

            <div className=" mt-3">
              {userInfo?.bookings
                .map((item) => (
                  <div key={item._id} className="order-details mb-3">
                    <div className="parentDiv">
                      <p>
                        <span>Date:</span>
                        {item?.updatedAt ? new Date(item.updatedAt).toLocaleDateString("en-IN") : 'N/A'}
                      </p>

                      <div className="tex-shipping">
                        <p>
                          <span>Tex: </span> ${taxCharge}
                        </p>

                        <p>
                          <span>Shipping: </span> ${deliveryCharges}
                        </p>
                      </div>
                      <p>
                        <span>Subtotal:</span> $

                        {
                          (item.products.reduce(
                            (acc, product) => acc + Number(product.productId.price) * Number(product.quantity),
                            0
                          )) + deliveryCharges + taxCharge

                        }
                      </p>
                    </div>
                    {/* <h4>I am parent item</h4> */}
                    <hr className="hr" />
                    <ul className="ul">
                      {item?.products.map((innerItem, index) => (
                        <li key={index}>
                          <div>
                            {index > 0 && <div className="line-2 mt-2"></div>}

                            <div className="child">
                              <div className="image-title">
                                <img
                                  src={innerItem?.productId?.Image}
                                  className="img-style"
                                  alt="orderimg"
                                  onClick={() =>
                                    navigate(
                                      `/product/${innerItem?.productId?.category}/${innerItem?.productId?._id}`
                                    )
                                  }
                                />
                                <i
                                  style={{ cursor: 'pointer' }}
                                  onClick={() =>
                                    navigate(
                                      `/product/${innerItem?.productId?.category}/${innerItem?.productId?._id}`
                                    )
                                  }
                                >{innerItem?.productId?.title}</i>
                                <i className="order-price">
                                  {" "}
                                  <span>Price: </span>$
                                  {innerItem?.productId?.price * innerItem?.quantity}
                                </i>
                              </div>

                              <div className="price-qty-status">
                                <i>
                                  <span>Quantity:</span> {innerItem?.quantity}
                                </i>
                                <div className="status">
                                  <span>Status:</span>
                                  <div
                                    style={{
                                      backgroundColor: getStatusColor(status),
                                    }}
                                    className="status-review"
                                  ></div>
                                </div>
                              </div>
                              <div className="cancel-order">
                                <button
                                  onClick={() =>
                                    handleOpenModal(item?._id, innerItem?._id)
                                  }
                                >
                                  Cancel Order
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <hr />
                    <div className="payment-type">
                      <p>
                        <span>Payment Type : </span>
                        {item.selectedPaymentMethod}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
            <div className="note">
              <span>*Note : </span>
              <div>
                <p className="mx-1">  Subtotal = Price +(Tex + Shipping)</p>
                <p className="mx-1">  Price = Price * Quantity</p>

              </div>

            </div>
          </div>

        ) : (
          <EmptyCart />
        )}

        <Modal
          show={openModal}
          // onHide={() => setOpenModal(false)}
          centered
        >
          <Modal.Body>
            <p className="text-center">Do you want to cancel the order?</p>
            <p className="text-center">If yes, press OK!</p>
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-center">
            <Button onClick={() => setOpenModal(false)} variant="secondary">
              Back
            </Button>
            <Button onClick={handleOrder} variant="primary">
              Ok
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>


    </>




  );
}

export default Order;



