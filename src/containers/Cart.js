import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import MyCart from "../components/cart/MyCart";
import Payment from "../components/cart/Payment";
import Order from "../components/cart/Order";
import TopBar from "../components/TopBar";

function Cart(props) {
  const [state, setState] = useState({
    tab: "cart",
    selectedIds: null,
    total: 0
  });
  const user = useSelector(state => state.user);

  useEffect(() => {
    const { history } = props;
    if (!user) {
      history.push("/user");
    }
  }, []);
  // TODO
  function handleChangeTab(tab, selectedIds, total) {
    if (state.tab !== tab) {
      setState(() =>
        selectedIds ? { tab, selectedIds, total } : { ...state, tab }
      );
    }
  }

  const { tab, selectedIds, total } = state;
  return (
    <>
      <TopBar {...props}> </TopBar> <Header />
      <div className="cart">
        <aside className="side-nav">
          <h3> 全部功能 </h3>
          <div
            onClick={() => handleChangeTab("cart")}
            className={tab !== "order" ? "active" : ""}
          >
            我的购物车
          </div>
          <div
            onClick={() => handleChangeTab("order")}
            className={tab === "order" ? "active" : ""}
          >
            已买到的宝贝
          </div>
        </aside>
        {tab === "cart" ? (
          <MyCart {...props} handleChangeTab={handleChangeTab} />
        ) : (
          ""
        )}
        {tab === "payment" ? (
          <Payment
            {...props}
            selectedIds={selectedIds}
            total={total}
            handleChangeTab={handleChangeTab}
          />
        ) : (
          ""
        )}
        {tab === "order" ? <Order {...props} /> : ""}
      </div>
    </>
  );
}

export default Cart;
