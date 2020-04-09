import React, { useState } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import * as api from "../../api";
import { setCart } from "../../actions";

function CartItem(props) {
  const [count, setCount] = useState(0);
  const [isChanging, setIsChanging] = useState(false);
  const dispatch = useDispatch();

  const { product } = props;
  if (product && product.count && !count) {
    setCount(product.count);
  }

  function handleCountChange(e) {
    if (e === "plus") {
      changeCount(count + 1);
    } else if (e === "minus") {
      if (count > 1) {
        changeCount(count - 1);
      }
    } else {
      const value = parseInt(e.target.value);
      if (value > 0) {
        changeCount(value);
      }
    }
  }

  function changeCount(count) {
    if (isChanging) {
      return;
    }
    setIsChanging(true);

    api
      .addToCart({ id: product.id, count, type: "changeCount" })
      .then(res => {
        dispatch(setCart(res.data));
        setCount(count);
        setIsChanging(false);
      })
      .catch(() => {
        setIsChanging(false);
      });
  }

  function handleRemove() {
    if (isChanging) {
      return;
    }
    setIsChanging(true);
    api
      .removeFromCart({ id: props.product.id })
      .then(res => {
        setIsChanging(false);
        dispatch(setCart(res.data));
      })
      .catch(() => {
        setIsChanging(false);
      });
  }

  const { selectedIds, history } = props;
  return (
    <li>
      <div className="label">
        <label
          className={
            selectedIds && selectedIds.indexOf(product.id) > -1
              ? "selected"
              : ""
          }
          onClick={() => props.handleClickItem(product.id)}
        />
      </div>
      <div className="info">
        <img
          src={product.main_image}
          alt="main"
          onClick={() => history.push("/product/" + product.id)}
        />
        <span onClick={() => history.push("/product/" + product.id)}>
          {product.title}
        </span>
      </div>
      <div className="price">
        <span>￥{product.discount.toFixed(2)}</span>
        {product.discount < product.price ? (
          <span className="origin">
            <span className="text">原价</span>￥{product.price.toFixed(2)}
          </span>
        ) : (
          ""
        )}
      </div>
      <div className="count">
        <span
          className={`minus ${count <= 1 ? "disabled" : ""}`}
          onClick={() => handleCountChange("minus")}
        >
          -
        </span>
        <input type="text" value={count} onChange={handleCountChange} />
        <span className="plus" onClick={() => handleCountChange("plus")}>
          +
        </span>
      </div>
      <div className="total">
        <span>小计</span>￥{(product.discount * product.count).toFixed(2)}
      </div>
      <div className="action">
        <span onClick={handleRemove}>删除</span>
      </div>
    </li>
  );
}

CartItem.propTypes = {
  product: PropTypes.object.isRequired
};

export default CartItem;
