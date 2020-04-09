import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PayItem from "./PayItem";
import NewAddress from "./NewAddress";
import * as api from "../../api";
import { Input, message } from "antd";
import { setReceiver } from "../../actions";

function Payment(props) {
  const [state, setState] = useState({
    newAddressVisible: false,
    checkPswVisible: false,
    products: null,
    password: "",
    isPaying: false
  });
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart);
  const receiver = useSelector(state => state.receiver);

  useEffect(() => {
    const { selectedIds } = props;
    const products = cart.products.filter(
      product => selectedIds.indexOf(product.id) > -1
    );
    setState({ ...state, products });
    if (!receiver) {
      api
        .getReceiver()
        .then(res => {
          dispatch(setReceiver(res.data));
        })
        .catch(() => {});
    }
  }, [dispatch]);

  function handleClickBtn(type) {
    if (type === "address") {
      setState({ ...setState, newAddressVisible: !state.newAddressVisible });
    } else if (type === "checkPsw") {
      setState({ ...state, checkPswVisible: !state.checkPswVisible });
    }
  }

  function handlePswChange(e) {
    setState({ ...state, password: e.target.value });
  }

  //验证密码后支付 TODO
  function handleCheckPswSubmit() {
    if (this.isPaying) {
      return;
    }
    const pattern = /.{6,18}/;
    const { password, products } = state;
    if (!pattern.test(password)) {
      message.info("密码为6至18个字符", 2);
      return;
    }
    setState({ ...state, isPaying: true });
    api
      .pay({ products, password })
      .then(() => {
        message.success("订单支付成功，将尽快为您发货", 2);
        setState({
          ...state,
          isPaying: false,
          checkPswVisible: false,
          password: ""
        });
        props.handleChangeTab("order");
      })
      .catch(err => {
        message.error(err.msg, 2);
        setState({ ...state, isPaying: false, password: "" });
      });
  }

  const { newAddressVisible, checkPswVisible, products } = state;
  const { total } = props;
  return (
    <div className="payment">
      <div className="title">确认收货地址</div>
      <div className="address">
        <div className="detail-address">
          <p>默认收货地址：</p>
          <p>{`${receiver && receiver.name + " " + receiver.phone}（收）`}</p>
          <p>{receiver && receiver.address + receiver.detail}</p>
        </div>
        <div
          className="btn"
          role="button"
          onClick={() => handleClickBtn("address")}
        >
          使用新地址
        </div>
        {newAddressVisible ? (
          <NewAddress closeNewAddress={handleClickBtn} {...props} />
        ) : (
          ""
        )}
      </div>
      <div className="title">确认订单信息</div>
      <ul className="title-bar">
        <li className="info">商品信息</li>
        <li className="price">单价</li>
        <li>数量</li>
        <li>小计</li>
      </ul>
      <ul className="goods">
        {products && products.length
          ? products.map(product => (
              <PayItem product={product} key={product.id} />
            ))
          : ""}
        <li className="order-info">
          <div className="ems">
            <span>运送方式 EMS 免邮</span>
            <span className="number">0.00</span>
          </div>
          <div className="all">
            <span>订单合计（含运费）</span>
            <span className="number">￥{total.toFixed(2)}</span>
          </div>
        </li>
      </ul>
      <div className="action-bar">
        <div className="pay-info">
          <div className="pay">
            <span className="label">实付款：</span>
            <span className="number">￥{total.toFixed(2)}</span>
          </div>
          <div className="address">
            <span className="label">寄送至：</span>
            <span className="detail">
              {receiver && receiver.address + receiver.detail}
            </span>
          </div>
          <div className="contract">
            <span className="label">收货人：</span>
            <span>{receiver && receiver.name + " " + receiver.phone}</span>
          </div>
        </div>
        <div className="btns">
          <div className="return">
            <span onClick={() => props.handleChangeTab("cart")}>
              返回购物车
            </span>
          </div>
          <div className="confirm" onClick={() => handleClickBtn("checkPsw")}>
            提交并支付
          </div>
        </div>
      </div>
      {checkPswVisible ? (
        <div className="check-password">
          <div className="inner">
            <h3>支付订单需要验证登录密码</h3>
            <div className="input-wrapper">
              <Input
                type="password"
                value={state.password}
                onChange={handlePswChange}
              />
            </div>
            <div className="btns">
              <div
                className="cancle"
                onClick={() => setState({ ...state, checkPswVisible: false })}
              >
                取消
              </div>
              <div className="confirm" onClick={handleCheckPswSubmit}>
                确定
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default Payment;
