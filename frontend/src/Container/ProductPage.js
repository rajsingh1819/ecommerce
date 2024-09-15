import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Form, ListGroup } from "react-bootstrap";
import calculateAvgRating from "../Shared/AvgRating";
import "./styles/productPage.css";
import { FaStar, FaUserAlt } from "react-icons/fa";
import { MdShoppingCart, MdRemoveShoppingCart } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useCartContext } from "../Context/Cart_Context";
import { useNavigate, useParams } from "react-router-dom";
import { Offers } from "../assets/Constants/Constant";
import Newsletter from "./Newsletter";
import toast from "react-hot-toast";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

function ProductPage() {

  const [showReview, setShowReview] = useState(false);
  const { addToCart, cart, removeToCart, userInfo } = useCartContext();
  const navigate = useNavigate();
  const [handleReview, setHandleReview] = useState(null);
  const [goToCart, setGoToCart] = useState(true);
  const [rating, setRating] = useState(null);
  const [reviewText, setReviewText] = useState("");


  const { category, id } = useParams(); // This should correctly capture the URL parameters
  const [product, setProduct] = useState(null);

  const { deliveryCharges, taxCharge } = Offers || {};



  const getProductData = async () => {
    const getApi = `http://localhost:8000/product/${category}/${id}`;
    try {
      let response = await fetch(getApi);
      response = await response.json();
      setProduct(response.data);
    } catch (error) {
      console.error("Failed to fetch product data:", error);
    }
  };

  // useEffect(() => {
  //   console.log("product => ", product);
  // }, [product]);

  useEffect(() => {
    getProductData();
  }, []);

  const { _id, title, Image, price, desc, reviews } = product || {};
  const { totalRating, avgRating } = calculateAvgRating(reviews);




  const userReviews = (message, action) => {
    switch (action) {
      case "info":
        toast(message, {
          icon: <span className="hot-toast-icon">ⓘ</span>,
          duration: 2000,
          className: "hot-toast",
        });
        break;
      case "success":
        toast.success(message, {
          duration: 3000,
          className: "hot-toast",
        });
        break;
      case "error":
        toast.error(message, {
          duration: 3000,
          className: "hot-toast",
        });
        break;
      default:
        toast.error("Somting is wrong!", {
          duration: 3000,
          className: "hot-toast",
        });
    }
  };



  // post user reviews
  const handleReviews = async (e) => {
    e.preventDefault();
    if (!rating) {
      userReviews("Review should not be empty!", "info");
    } else if (!reviewText) {
      userReviews("Message should not be empty!", "info");
    } else {
      if (!localStorage.getItem("authToken")) {
        userReviews("User not logged in!", "error");
      } else {
        const data = { username: userInfo.username, userId: userInfo._id, reviewText, rating };

        const reviewApi = `http://localhost:8000/reviews/post/${id}`;

        try {
          const response = await fetch(reviewApi, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
          if (response.ok) {
            const result = await response.json();
            // console.log("Review Submitted: ", result);
            getProductData();
            userReviews("Review Submitted Successfully!", "success");
          } else {
            const errorResult = await response.json();
            console.error("Failed to submit review: ", errorResult);
            userReviews("Failed to submit review. Please try again.", "error");
          }
        } catch (error) {
          // console.error("Error submitting review: ", error);
          userReviews("An error occurred. Please try again.", "error");
        }

        setRating(null);
        setReviewText("");
      }
    }
  };


  // Function to delete a review
  const deleteReview = async (reviewId) => {
    try {
      const response = await fetch(`http://localhost:8000/reviews/delete/${reviewId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: userInfo._id }), // Send userId in the body
      });

      if (response.ok) {
       
        // console.log("Review deleted successfully");
        getProductData(); // Refresh product data to reflect the deletion
        userReviews("Review deleted successfully!", "success");
      } else {
        // const errorResult = await response.json();
        // console.error("Failed to delete review:", errorResult);
        userReviews("Failed to delete review. Please try again.", "error");
      }
    } catch (error) {
      // console.error("Error deleting review:", error);
      userReviews("An error occurred. Please try again.", "error");
    }
  };



  const handleToggleOptions = (reviewId) => {
    setHandleReview(handleReview === reviewId ? null : reviewId);
  };
  const actionReview = () => {
    setHandleReview(null);
  };

  useEffect(() => {
    const handleScroll = () => {
      setHandleReview(null);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);


 



  const buyTabProduct = () => {
    if (localStorage.getItem("authToken")) {
      const item = {
        productId: id, userId: userInfo._id, username: userInfo.username,
        data: product, deliveryCharges, taxCharge, category
      }

      const queryParams = new URLSearchParams({
        productId: item.productId,
        userId: item.userId,
        username: item.username,
        data: JSON.stringify(item.data), // Stringify the product object
        deliveryCharges: item.deliveryCharges,
        taxCharge: item.taxCharge,
        category: item.category,
      }).toString();
      window.open(`/booking?${queryParams}`, '_blank');

    }
    else {
      userReviews("User not login!", "info");

    }
  }




  return (
    <>
      {
        product ?
          <Container>
            <Row>
              <Col lg="7">
                <div className="card_information">
                  <div className="card_imag_button">
                    <div className="card_img">
                      <img src={Image} alt="img-png" />
                    </div>
                    <div className="button-style">
                      {!cart.find((cartItem) => cartItem.id === _id) ? (
                        <span
                          onClick={() => {
                            setGoToCart(false);

                            setTimeout(() => {
                              addToCart(product);
                              navigate("/cart");
                            }, 2000);
                          }}
                        >
                          <MdShoppingCart size={25} />
                          {goToCart ? (
                            <span> ADD TO CART</span>
                          ) : (
                            <span>
                              {" "}
                              GO TO CART <div className="processing-icon"></div>
                            </span>
                          )}
                        </span>
                      ) : (
                        <span
                          onClick={() => {
                            removeToCart(_id);
                          }}
                        >
                          <MdRemoveShoppingCart size={25} />
                          <span> REMOVE ITEM</span>
                        </span>
                      )}


                      {/* <Button className="buyButton"  onClick={buyProdct}>BUY NOW</Button> */}
                      <Button className="buyButton" onClick={buyTabProduct}>BUY NOW</Button>
                    </div>
                  </div>
                  <div className="Card_data">
                    <div className="card_title_reviews">
                      <div className="title">
                        <h3>{title}</h3>
                      </div>
                      <div className="reviews">
                        <FaStar className="review-icon" />
                        {avgRating === 0 ? null : avgRating}
                        {totalRating === 0 ? (
                          "Not Rated"
                        ) : (
                          <span>({reviews?.length})</span>
                        )}
                      </div>
                    </div>
                    <div className="card_price_desc">
                      <h5>
                        Price : <span>${price}</span>
                      </h5>
                      <div className="area">
                        <h5>Description</h5>
                        <p>{desc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>

              <Col lg="5">
                <div className="user-rating ">
                  <h5>Reviews( {reviews ? reviews.length : 0} reviews)</h5>

                  <Form onSubmit={handleReviews}>
                    <div className="rating-group mt-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={rating === star ? "selected" : ""}
                          onClick={() => setRating(star)}
                          style={{
                            cursor: "pointer",
                            color: rating >= star ? "#e7c251" : "gray",
                          }}
                        >
                          {star}
                          <FaStar />
                        </span>
                      ))}
                    </div>
                    <div className="input_field">
                      <input
                        type="text"
                        placeholder="Write message here..."
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                      />
                      <button className="input_btn" type="submit">
                        Submit
                      </button>
                    </div>
                  </Form>

                  {
                    reviews?.length ? <div className="showHide">
                      <p onClick={() => setShowReview(!showReview)}>
                        {showReview ? (
                          <>
                            <span className="actionHideShow">Click here to </span>  Hide Reviews <IoIosArrowUp color="black" />
                          </>
                        ) : (
                          <>
                            <span className="actionHideShow">Click here to </span>  Show Reviews <IoIosArrowDown color="black" />
                          </>
                        )}
                      </p>
                    </div> :
                      <div >
                        <p className="showHide">No Reviews yet!</p>
                      </div>


                  }



                  {showReview && (
                    <ListGroup
                      className={`user_reviews mt-4 ${reviews?.length > 0 ? "scrollable-column" : ""
                        }`}
                    >
                      <div>
                        {reviews?.length > 0 && (
                          reviews?.map((item, index) => (
                            <div key={index} className="Full_user_action">
                              <div className="reviews-item" onClick={actionReview} >
                                {/* <div className="reviews-item" onClick={actionReview}> */}
                                {item?.image ? (
                                  <img src={item.image} alt="user" />
                                ) : (
                                  <span className="imageView">
                                    <FaUserAlt />
                                  </span>
                                )}
                                <div
                                  className="reviews-info"
                                // onClick={actionReview}
                                >
                                  <div>
                                    <h5>{item?.username}</h5>
                                    <p>

                                      {item?.updatedAt ? new Date(item.updatedAt).toLocaleDateString("en-IN") : 'N/A'}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="userRating">
                                      <FaStar className="icon_style" />
                                      {item.rating}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="userMsg" >
                                <span
                                  className="messageContent"
                                  onClick={actionReview}
                                >
                                  {item?.reviewText}
                                </span>

                                {localStorage.getItem("authToken") && item?.userId === userInfo?._id &&
                                  <div className="messageOptions">
                                    <BsThreeDotsVertical
                                      size={20}
                                      className="toggle-icon"
                                      onClick={() =>
                                        handleToggleOptions(item._id)
                                      }
                                    />
                                    { }


                                    <div className="options-container">
                                      {/* <div className="option">Edit</div> */}
                                      {
                                        handleReview === item._id &&
                                        <div
                                          className="option"
                                          // onClick={() =>
                                          //   deleteReview(
                                          //     item?.id,
                                          //     item?.productId,
                                          //     item?.userId
                                          //   )
                                          // }
                                          onClick={() => deleteReview(item?._id)}
                                        >
                                          Delete
                                        </div>
                                      }

                                      {/* <ul className="setting_options"><li>Edit</li><li>Delete</li></ul> */}

                                    </div>



                                  </div>
                                }

                              </div>
                            </div>
                          ))

                        )}
                      </div>
                    </ListGroup>
                  )}
                </div>
              </Col>
            </Row>
          </Container>
          :
          <Container>
            <h3>Loading...</h3>
          </Container>

      }




      {/* <Booking
            data={data}
            avgRating={avgRating}
            totalRating={totalRating}
            taxCharge={taxCharge}
            deliveryCharges={deliveryCharges}
            setShowBooking={setShowBooking}
          /> */}


      <Newsletter />
    </>
  );
}

export default ProductPage;


// console.table("data =>>> ", location.state.data);

//   console.log("location.state ===> ", location.state);
//   const { productId , userId, username, data, deliveryCharges, taxCharge}= location.state || {};
//   const { _id, title, Image, price, desc, reviews }= data;
