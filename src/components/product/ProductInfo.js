import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as api from "../../api";
import { Icon } from "antd";
import { setCart } from "../../actions";

function ProductInfo(props) {
  const [tab, setTab] = useState("main");
  const [count, setCount] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const dispatch = useDispatch();
  const { product, history } = props;
  const user = useSelector(state => state.user);
  const cart = useSelector(state => state.cart);

  function handleMouseEnter(curTab) {
    curTab !== tab && setTab({ tab: curTab });
  }

  function handleSize(node) {
    if (node) {
      const { width } = node.getBoundingClientRect();
      node.style.height = width + "px";
    }
  }

  function handleCountChange(e) {
    const curCount = parseInt(e.target.value);
    if (curCount && curCount > 0) {
      setCount(curCount);
    }
  }

  function handleBtn(n) {
    if (count + n > 0) {
      setCount(count + n);
    }
  }

  function handleAddToCart(link) {
    if (!user) {
      history.push("/user");
      return;
    }
    if (isAdding) {
      return;
    }
    const { id } = product;
    let products;
    if (cart && cart.product) {
      products = cart.products;
    } else {
      products = [];
    }
    const item = products.find(item => item.id === id);
    if (item) {
      if (count > item.count) {
        setIsAdding(true);
        api
          .addToCart({ id, count, type: "changeCount" })
          .then(res => {
            dispatch(setCart(res.data));
            setIsAdding(false);
            if (link) {
              history.push("/cart");
            }
          })
          .catch(() => {
            setIsAdding(false);
          });
      } else {
        if (link) {
          history.push("/cart");
        }
        return;
      }
    } else {
      setIsAdding(true);
      api
        .addToCart({ id, count })
        .then(res => {
          dispatch(setCart(res.data));
          setIsAdding(false);
          if (link) {
            history.push("/cart");
          }
        })
        .catch(() => {
          setIsAdding(false);
        });
    }
  }

  function handleBuy() {
    handleAddToCart(true);
  }

  return (
    <>
      <div className="tags-bar">
        <div className="tag" onClick={() => history.push("/")}>
          首页
        </div>
        <Icon type="right" />
        <div className="tag" onClick={() => history.push("/")}>
          全部
        </div>
        <Icon type="right" />
        {product ? (
          product.category === "male" ? (
            <div className="tag" onClick={() => history.push("/")}>
              男士
            </div>
          ) : (
            <div className="tag" onClick={() => history.push("/")}>
              女士
            </div>
          )
        ) : (
          ""
        )}
        <Icon type="right" />
        <div className="tag">{product && product.name}</div>
      </div>
      <div className="content">
        <div className="imgs">
          <div className="show-img" ref={node => handleSize(node)}>
            {tab === "main" ? (
              <img src={product && product.main_image} alt="main" />
            ) : (
              <img src={product && product.sub_image} alt="sub" />
            )}
          </div>
          <div className="focus-img">
            <div
              className={`cover ${tab === "main" ? "active" : ""}`}
              onMouseEnter={() => handleMouseEnter("main")}
            >
              <img src={product && product.main_image} alt="main" />
            </div>
            <div
              className={`feature ${tab === "sub" ? "active" : ""}`}
              onMouseEnter={() => handleMouseEnter("sub")}
            >
              <img src={product && product.sub_image} alt="sub" />
            </div>
          </div>
        </div>
        <div className="goods-wrapper">
          <div className="goods-info">
            <div className="title">
              <h2 className="main-title">{product && product.title}</h2>
              <h4 className="sub-title">品牌授权 正品保障 急速物流</h4>
            </div>
            <div className="goods-price">
              {product ? (
                product.discount < product.price ? (
                  <>
                    <div className="origin-price">
                      <span className="label w3">参考价</span>
                      <span>￥{product && product.price.toFixed(2)}</span>
                    </div>
                    <div className="price">
                      <span className="label w3">优惠价</span>
                      <span>￥</span>
                      <span className="number">
                        {product && product.discount}
                      </span>
                      <span>.00</span>
                    </div>
                  </>
                ) : (
                  <div className="price">
                    <span className="label w2">价格</span>
                    <span>￥</span>
                    <span className="number">
                      {product && product.discount}
                    </span>
                    <span>.00</span>
                  </div>
                )
              ) : (
                ""
              )}
              <div className="ems">
                <span className="label w2">快递</span>
                <span>EMS</span>
                <span className="number"> 0.00 </span>
                <span>免运费</span>
              </div>
            </div>
            <div className="count">
              <div className="label w2">数量</div>
              <span
                className={`minus ${count === 1 ? "disabled" : ""}`}
                onClick={() => handleBtn(-1)}
              >
                -
              </span>
              <input type="text" value={count} onChange={handleCountChange} />
              <span className="plus" onClick={() => handleBtn(1)}>
                +
              </span>
              <span className="remain">库存充足</span>
            </div>
            <div className="service">
              <div className="label w2">服务</div>
              <span>七天无理由退货</span>
            </div>
          </div>
          <div className="actions">
            <div className="pay" role="button" onClick={handleBuy}>
              立即购买
            </div>
            <div
              className="add-to-cart"
              role="button"
              onClick={handleAddToCart}
            >
              加入购物车
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default React.memo(ProductInfo);
