import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import OrderItem from "./OrderItem";
import * as api from "../../api";
import { setOrders } from "../../actions";

function Order(props) {
  const [tab, setTab] = useState("all");
  const orders = useSelector(state => state.orders);
  const dispatch = useDispatch();

  useEffect(() => {
    api.getOrders().then(res => {
      dispatch(setOrders(res.data.sort((prev, next) => next.id - prev.id)));
    });
  }, [dispatch]);

  function handleClickTab(curTab) {
    if (curTab !== tab) {
      setTab(curTab);
    }
  }

  const length1 =
    (orders && orders.filter(order => order.status === "toConfirm").length) ||
    "";
  const length2 =
    (orders && orders.filter(order => order.status === "toEvaluate").length) ||
    "";
  return (
    <div className="order">
      <div className="title">已买到的宝贝</div>
      <nav className="navbar">
        <div
          onClick={() => handleClickTab("all")}
          className={tab === "all" ? "active" : ""}
        >
          全部订单
        </div>
        <div
          onClick={() => handleClickTab("toConfirm")}
          className={tab === "toConfirm" ? "active" : ""}
        >
          待收货
          <span className="number">{length1}</span>
        </div>
        <div
          onClick={() => handleClickTab("toEvaluate")}
          className={tab === "toEvaluate" ? "active" : ""}
        >
          待评价
          <span className="number">{length2}</span>
        </div>
        <div
          onClick={() => handleClickTab("done")}
          className={tab === "done" ? "active" : ""}
        >
          已完成订单
        </div>
      </nav>
      <ul className="title-bar">
        <li className="info">商品信息</li>
        <li className="price">单价</li>
        <li className="count">数量</li>
        <li className="pay">实付款</li>
        <li className="action">操作</li>
      </ul>
      <ul className="goods">
        {orders && orders.length
          ? orders
              .filter(order => {
                if (tab === "all") {
                  return order;
                } else if (order.status === tab) {
                  return order;
                }
                return false;
              })
              .map(order => (
                <OrderItem order={order} key={order.id} {...props} />
              ))
          : ""}
      </ul>
    </div>
  );
}

export default Order;
