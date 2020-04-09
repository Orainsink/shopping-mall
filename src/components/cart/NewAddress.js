import React, { useState } from "react";
import { useDispatch } from "react-redux";
import * as api from "../../api";
import { Input, message } from "antd";
import { updateReceiver } from "../../actions";

function NewAddress(props) {
  const [state, setState] = useState({
    name: "",
    phone: "",
    address: "",
    detail: "",
    isChanging: false
  });
  const dispatch = useDispatch();
  function handleName(e) {
    setState({ ...state, name: e.target.value });
  }

  function handlePhone(e) {
    setState({ ...state, phone: e.target.value });
  }

  function handleAddress(e) {
    setState({ ...state, address: e.target.value });
  }

  function handleDetail(e) {
    setState({ ...state, detail: e.target.value });
  }

  function handleSubmit() {
    const { name, phone, address, detail, isChanging } = state;
    if (isChanging) {
      return;
    }
    if (!name || !phone || !address || !detail) {
      message.info("收货人信息不能为空", 2);
      return;
    }
    setState({ ...state, isChanging: true });
    api
      .updateReceiver(name, phone, address, detail)
      .then(res => {
        this.setState({
          ...state,
          name: "",
          phone: "",
          address: "",
          detail: "",
          isChanging: false
        });
        dispatch(updateReceiver(res.data));
        props.closeNewAddress("address");
      })
      .catch(() => {
        setState({ ...state, isChanging: false });
      });
  }

  const { name, phone, address, detail } = state;
  return (
    <div className="mask">
      <div className="dialog">
        <div className="address">
          <div className="info">使用新地址</div>
          <div className="wrapper">
            <p>
              <label>收货人：</label>
              <Input value={name} onChange={handleName} />
            </p>
            <p>
              <label>手机号码：</label>
              <Input value={phone} onChange={handlePhone} />
            </p>
          </div>
          <p>
            <label>地址信息：</label>
            <Input
              value={address}
              onChange={handleAddress}
              placeholder="省/市/区"
            />
          </p>
          <p>
            <label>详细地址：</label>
            <Input
              value={detail}
              onChange={handleDetail}
              placeholder="详细地址，如：门牌、街道、村镇"
            />
          </p>
        </div>
        <div className="btn-wrapper">
          <div
            className="btn cancle"
            role="button"
            onClick={() => props.closeNewAddress("address")}
          >
            取消
          </div>
          <div className="btn" role="button" onClick={handleSubmit}>
            保存
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewAddress;
