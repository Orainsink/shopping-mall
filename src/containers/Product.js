import React, { useState, useEffect } from "react";
import * as api from "../api";
import ProductInfo from "../components/product/ProductInfo";
import Evaluation from "../components/product/Evaluation";
import TopBar from "../components/TopBar";

function Product(props) {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const { id } = props.match.params;
    if (id) {
      api
        .getSingleProduct(parseInt(id))
        .then(res => {
          setProduct(res.data);
        })
        .catch(() => {
          props.history.push("/");
        });
    }
  }, []);

  return (
    <>
      <TopBar {...props}> </TopBar>
      <main className="main-product">
        <ProductInfo {...props} product={product} />
        <Evaluation {...props} product={product} />
      </main>
    </>
  );
}
export default React.memo(Product);
