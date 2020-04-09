import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Sku from "../Sku";
import { useSelector, useDispatch } from "react-redux";
import { getAllProducts } from "../../actions";

function HomeCategory(props) {
  const [products, setProducts] = useState(null);
  const [margin, setMargin] = useState(0);
  const elRef = useRef(null);
  const allProducts = useSelector(state => state.allProducts);
  const dispatch = useDispatch();

  function filterProduct() {
    const category = props.category;
    if (category && allProducts.data && allProducts.data.length) {
      const array = allProducts.data.filter(product => {
        switch (category) {
          case "all":
            return product;
          case "female":
          case "male":
            if (product.category === category) {
              return product;
            }
            break;
          case "discount":
            if (product.discount < product.price) {
              return product;
            }
            break;
          default:
            return product;
        }
        return false;
      });
      return array;
    } else {
      return null;
    }
  }

  useEffect(() => {
    // setProducts(filterProduct()); TODO 取消catogory限制
    setProducts(allProducts.data);
  }, [props.category, allProducts]);

  useEffect(() => {
    !allProducts.data && dispatch(getAllProducts());
    handleSize();
  }, []);

  function handleSize() {
    let { width } = elRef.current.getBoundingClientRect();
    let col = Math.floor(width / 300);
    let space = width % 300;
    let calcMargin = space / (col * 2);
    setMargin(calcMargin);
  }

  return (
    <div className="home-category" ref={elRef}>
      {products && products.length
        ? products.map(product => (
            <Sku
              {...props}
              product={product}
              key={product.id}
              margin={margin}
            />
          ))
        : ""}
    </div>
  );
}

HomeCategory.propTypes = {
  category: PropTypes.string.isRequired
};

export default React.memo(HomeCategory);
