import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Col, Container, Row } from "react-bootstrap";
import CardItems from "../Container/CardItems";
import Newsletter from ".././Container/Newsletter";
import { useCartContext } from "../Context/Cart_Context";



function SearchPage() {
  const location = useLocation();
  const navigation = useNavigate();
  const { productData, getAllApi}= useCartContext ();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query").toLowerCase();

  const filteredData = productData?.filter((item) => {
    return (
      item.title.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.price.toString().toLowerCase().includes(query) ||
      item.type.toLowerCase().includes(query) || // Ensure 'type' exists
      item.productType.toLowerCase().includes(query)
    ); // Ensure 'productType' exists

    // Add more filters as necessary
  });

  useEffect(()=>{
    getAllApi();

  },[navigation])

  return (
    <>
      <Container>
        <h3 className="h3Style">Search Results for "{query}"</h3>
        <Row>
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <Col lg="3" className="mb-4 card-style" key={item._id}>
                <CardItems item={item} />
              </Col>
            ))
          ) : (
            <p>No results found.</p>
          )}
        </Row>
      </Container>
      <Newsletter />
    </>
  );
}

export default SearchPage;
