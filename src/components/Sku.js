import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as api from "../api";
import { Icon } from "antd";
import { setCart } from "../actions";

function Sku(props) {
  const [imgTab, setImgTab] = useState("main");
  // const [imgHeight, setImgHeight] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart);
  const user = useSelector(state => state.user);
  const mainImg = useRef(null);

  function handleMouseEnter(tab) {
    setImgTab(tab);
  }

  function handleAddToCart(id) {
    const { history } = props;
    if (!user) {
      history.push("/user");
      return;
    }
    if (isAdding) {
      return;
    }
    if (cart && cart.products && cart.products.length) {
      if (cart.products.find(product => product.id === id)) {
        return;
      } else {
        setIsAdding(true);
        api
          .addToCart({ id, count: 1 })
          .then(res => {
            dispatch(setCart(res.data));
            setIsAdding(true);
          })
          .catch(err => {
            setIsAdding(false);
          });
      }
    } else {
      setIsAdding(true);
      api
        .addToCart({ id, count: 1 })
        .then(res => {
          dispatch(setCart(res.data));
          setIsAdding(false);
        })
        .catch(err => {
          setIsAdding(false);
        });
    }
  }

  function handleOnDetail(id) {
    props.history.push("/product/" + id);
  }
  const { product } = props;
  return (
    <div className="sku" style={{ margin: `0 ${Math.floor(props.margin)}px` }}>
      <div className="show-img">
        {imgTab === "main" ? (
          <img src={product.main_image} alt="main" ref={mainImg} />
        ) : (
          <img src={product.sub_image} alt="sub" />
        )}
      </div>
      <div className="focus-img">
        <div className={`cover ${imgTab === "main" ? "active" : ""}`}>
          <img
            src={product.main_image}
            alt="main"
            onMouseEnter={() => handleMouseEnter("main")}
          />
        </div>
        <div className={`feature ${imgTab === "sub" ? "active" : ""}`}>
          <img
            src={product.sub_image}
            alt="sub"
            onMouseEnter={() => handleMouseEnter("sub")}
          />
        </div>
      </div>
      <div className="goods-price">
        <div className="price">
          <span>￥</span>
          <span className="number">{product.discount}</span>
          <span>.00</span>
        </div>
        {product.discount < product.price ? (
          <div className="origin-price">
            <span>￥{product.price.toFixed(2)}</span>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="title">{product.title}</div>
      <div className="actions">
        <div
          className="detail"
          role="button"
          onClick={() => handleOnDetail(product.id)}
        >
          <Icon type="file-search" />
          查看详情
        </div>
        <div
          className="add-to-cart"
          role="button"
          onClick={() => handleAddToCart(product.id)}
        >
          <Icon type="shopping-cart" />
          加入购物车
        </div>
      </div>
    </div>
  );
}

export default React.memo(Sku);
