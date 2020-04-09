import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as api from "../api";
import { login, setCart, setOrders, setReceiver } from "../actions";
import { Icon } from "antd";

function TopBar({ history }) {
  const [actionVisible, setActionVisible] = useState(false);
  const cart = useSelector(state => state.cart);
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    api
      .check()
      .then(res => {
        const { username, nickyname, gender, cart } = res.data;
        dispatch(login({ username, nickyname, gender }));
        dispatch(setCart(cart));
      })
      .catch(() => {});

    return document.removeEventListener("click", listenDocument);
  }, [dispatch, listenDocument]);

  function listenDocument() {
    setActionVisible(false);
    document.removeEventListener("click", listenDocument);
  }

  function handleClick(tab) {
    if (tab === "cart") {
      history.push("/cart");
    } else {
      if (!user) {
        history.push("/user");
      } else {
        setActionVisible(true);
        document.addEventListener("click", listenDocument);
      }
    }
  }

  function handleClickAction(tab) {
    if (tab === "user") {
      history.push("/user");
    } else {
      api
        .logout()
        .then(() => {
          localStorage.removeItem("user");
          dispatch(login(null));
          dispatch(setCart(null));
          dispatch(setOrders(null));
          dispatch(setReceiver(null));
          history.push("/");
        })
        .catch(err => {});
    }
  }

  return (
    <div className="top-bar">
      <div className="top-bar-inner">
        <div className="user-info" onClick={() => handleClick("user")}>
          <Icon type="user" />
          <span className="username">
            {(user && (user.nickyname || user.username)) || "未登录"}
          </span>
          {actionVisible ? (
            <div className="actions">
              <div className="action" onClick={() => handleClickAction("user")}>
                账户管理
              </div>
              <div
                className="action"
                onClick={() => handleClickAction("logout")}
              >
                注销登录
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="top-bar-cart" onClick={() => handleClick("cart")}>
          <Icon type="shopping-cart" />
          <span className="badge">{(cart && cart.products.length) || 0}</span>
        </div>
      </div>
    </div>
  );
}

export default TopBar;
