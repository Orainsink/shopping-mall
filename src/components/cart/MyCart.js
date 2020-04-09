import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import CartItem from "./CartItem";

function MyCart(props) {
  const [selectedIds, setSelectedIds] = useState(null);
  const [all, setAll] = useState(false);
  const [total, setTotal] = useState(0);
  const cart = useSelector(state => state.cart);

  useEffect(() => {
    let tmp;
    if (cart && cart.products && cart.products.length) {
      if (selectedIds && selectedIds.length) {
        const curTotal = cart.products.reduce((prev, current) => {
          //选中的
          if (selectedIds.indexOf(current.id) > -1) {
            tmp = total + current.discount * current.count;
            //未选中的
          } else {
            tmp = total;
          }
        }, 0);
        tmp = curTotal;
      }
    }
    setTotal(tmp);
  }, [cart]);

  function handleClickItem(id) {
    const ids = selectedIds || [];
    const index = ids.indexOf(id);
    if (index === -1) {
      ids.push(id);
    } else {
      ids.splice(index, 1);
    }
    if (equals(ids)) {
      setAll(true);
      setSelectedIds(ids);
    } else {
      setAll(false);
      setSelectedIds(ids);
    }
  }

  function handleClickSelectAll() {
    //购物车为空，直接return
    if (!cart || !cart.products || !cart.products.length) {
      return;
    }
    //ids相等，已全选，则反选
    if (equals(selectedIds)) {
      cancleAll();
    }
    //ids不等，未全选，则全选
    else {
      selectAll();
    }
  }

  //判断传入的ids数组是否和cart中所有product的id数组相同
  function equals(ids) {
    //元素都是number
    if (!ids) {
      return false;
    }
    const cartIds = cart.products.map(product => product.id).sort();
    const selectedIds = JSON.parse(JSON.stringify(ids)).sort();
    if (cartIds.length !== selectedIds.length) {
      return false;
    }
    for (let i = 0; i < cartIds.length; i++) {
      if (cartIds[i] !== selectedIds[i]) {
        return false;
      }
    }
    return true;
  }

  function selectAll() {
    setAll(true);
    setSelectedIds(cart.products.map(product => product.id));
  }

  function cancleAll() {
    setAll(false);
    setSelectedIds(null);
  }

  function handleOnPay() {
    if (!selectedIds || !selectedIds.length) {
      return;
    }
    props.handleChangeTab("payment", selectedIds, total);
  }

  return (
    <div className="my-cart">
      <div className="title">我的购物车</div>
      <ul className="title-bar">
        <li className="label">
          <label
            onClick={handleClickSelectAll}
            className={all ? "selected" : ""}
          />
          <span onClick={handleClickSelectAll}>全选</span>
        </li>
        <li className="info">商品信息</li>
        <li className="price">单价</li>
        <li className="count">数量</li>
        <li>金额</li>
        <li className="action">操作</li>
      </ul>
      <ul className="goods">
        {cart && cart.products && cart.products.length ? (
          cart.products.map(product => (
            <CartItem
              product={product}
              key={product.id}
              {...props}
              selectedIds={selectedIds}
              handleClickItem={handleClickItem}
            />
          ))
        ) : (
          <li className="else">购物车是空的哦~~~</li>
        )}
      </ul>
      <ul className="action-bar">
        <li className="label">
          <label
            onClick={handleClickSelectAll}
            className={all ? "selected" : ""}
          />
          <span onClick={handleClickSelectAll}>全选</span>
        </li>
        <li className="info" />
        <li className="count">
          已选商品
          <span className="number">
            {(selectedIds && selectedIds.length) || 0}
          </span>
          件
        </li>
        <li className="total">
          合计<span className="number">{total && total.toFixed(2)}</span>
        </li>
        <li
          className={`pay ${
            !selectedIds || !selectedIds.length ? "disabled" : ""
          }`}
          onClick={handleOnPay}
        >
          结 算
        </li>
      </ul>
    </div>
  );
}

export default React.memo(MyCart);
