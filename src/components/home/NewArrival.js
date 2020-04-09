import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as api from "../../api";
import { Spin } from "antd";
import { getNewArrival, setCart } from "../../actions";

function NewArrival(props) {
  const [isAdding, setIsAdding] = useState(false);
  const dispatch = useDispatch();
  const newArrival = useSelector(state => state.newArrival);
  const cart = useSelector(state => state.cart);
  const user = useSelector(state => state.user);

  useEffect(() => {
    !newArrival.data && dispatch(getNewArrival());
  }, []);

  function handleClickProduct(id) {
    props.history.push("/product/" + id);
  }

  function handleClickAdd(e, id) {
    e.stopPropagation();
    const { history } = props;
    if (!user) {
      history.push("/user");
      return;
    }
    if (isAdding) return;

    const products = cart.products || [];
    const item = products.find(item => item.id === id);
    if (item) {
      return;
    }
    setIsAdding(true);

    api
      .addToCart({ id, count: 1 })
      .then(res => {
        dispatch(setCart(res.data));
        setIsAdding(false);
      })
      .catch(() => {
        setIsAdding(false);
      });
  }

  const { isFetching, data } = newArrival;
  return (
    <div className="new-arrival">
      <h1 className="title"> New Arrival </h1>
      <div className="product-wrapper">
        {isFetching ? (
          <div className="spin-wrapper">
            <Spin size="large" />
          </div>
        ) : (
          ""
        )}
        {data && data.length
          ? data.map(product => (
              <div
                className="product"
                key={product.id}
                onClick={() => handleClickProduct(product.id)}
              >
                <h2 className="name"> {product.name} </h2>
                <img src={product.sub_image} alt="product" />
                <span className="price"> ￥{product.discount.toFixed(2)} </span>
                <div
                  className="add"
                  onClick={e => handleClickAdd(e, product.id)}
                >
                  添加到购物车
                </div>
              </div>
            ))
          : ""}
      </div>
    </div>
  );
}

export default NewArrival;
