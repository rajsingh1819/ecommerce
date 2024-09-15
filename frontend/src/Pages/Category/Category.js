// Category.js
import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { allProductData } from "../../assets/Constants/Constant";
import NavCategory from "./NavCategory";
import CardItems from "../../Container/CardItems";
import Newsletter from "../../Container/Newsletter";
import { useCartContext } from "../../Context/Cart_Context";
import { useNavigate } from "react-router-dom";
function Category() {
  const navigation = useNavigate();
  const { category, filter } = useParams();
  const { productData,getAllApi} = useCartContext();
  const [selectedCategory, setSelectedCategory] = useState(filter || "All");
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const filtered = productData.filter((item) => {
      if (item.category === category) {
        if (selectedCategory === "All") return true; // Return all products when filter is "All"
        return item.type.toLowerCase() === selectedCategory.toLowerCase();
      }
    });
    setFilteredProducts(filtered);
  }, [category, selectedCategory]);

  useEffect(()=>{
    getAllApi();
  },[navigation])

  return (
    <div>
      <section>
        <Container>
          <NavCategory
            items={productData}
            category={category}
            onSelectCategory={setSelectedCategory}
          />
        </Container>
      </section>

      <section style={{ marginTop: "5%" }}>
        <Container>
          <Row>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((item) => (
                <Col lg="3" className="mb-4" key={item._id}>
                  <CardItems item={item} />
                </Col>
              ))
            ) : (
              // Render all products if no products are filtered
              <h3>Loading...</h3>
            )}
          </Row>
        </Container>
      </section>
      <Newsletter />
    </div>
  );
}

export default Category;
