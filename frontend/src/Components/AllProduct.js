import React, { useEffect, useState } from "react";
import { allProductData } from "../assets/Constants/Constant";
import FeaturedList from "../Container/FeaturedList";
import CardSwiper from "../Container/CardSwiper";
import { useCartContext } from "../Context/Cart_Context";
import { useNavigate } from "react-router-dom";




function AllProductFashion() {
  const { productData, getAllApi } = useCartContext();
  const navigation = useNavigate();

  
  useEffect(() => {
    // console.log("AllProductFashion() => ", productData);
    getAllApi();
  }, [navigation]);

  return (
    <>
      <FeaturedList
        allProducts={productData?.filter(
          (item) => item.productType === "old" && item.category === "fashion"
        )}
      />
    </>
  );
}

function AllProductMobile() {
  const { productData, getAllApi } = useCartContext();
  const navigation = useNavigate();

  
  useEffect(() => {
   
    getAllApi();
  }, [navigation]);

 
  return (
    <>
      <FeaturedList
        allProducts={productData?.filter(
          (item) => item.productType === "old" && item.category === "mobile"
        )}
      />
    </>
  );
}

function NewMobile() {
  const { productData, getAllApi } = useCartContext();
  const navigation = useNavigate();

  
  useEffect(() => {
   
    getAllApi();
  }, [navigation]);


  return (
    <>
      {
        <CardSwiper
          newData={productData?.filter(
            (item) => item.productType === "new" && item.category === "mobile"
          )}
        />
      }
    </>
  );
}

function NewFashion() {
  const { productData, getAllApi } = useCartContext();
  const navigation = useNavigate();

  
  useEffect(() => {
   
    getAllApi();
  }, [navigation]);


  return (
    <>
      <CardSwiper
        newData={productData?.filter(
          (item) => item.productType === "new" && item.category === "fashion"
        )}
      />
    </>
  );
}

export { AllProductFashion, AllProductMobile, NewMobile, NewFashion };
