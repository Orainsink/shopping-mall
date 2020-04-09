import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as api from "../../api";
import { Input, message } from "antd";
import { setReceiver, updateReceiver } from "../../actions";

function UserAccount() {
  const [state, setState] = useState({
    tab: "password",
    psw1: "",
    psw2: "",
    psw3: "",
    isChanging: false,
    name: "",
    phone: "",
    address: "",
    detail: ""
  });
  const dispatch = useDispatch();
  const receiver = useSelector(state => state.receiver);
  const user = useSelector(state => state.user);

  useEffect(() => {
    const { name, phone, address, detail } = state;
    if (receiver && !name && !phone && !address && !detail) {
      setState(...state, ...receiver);
    }
  }, [receiver]);

  useEffect(() => {
    !receiver &&
      api
        .getReceiver()
        .then(res => {
          dispatch(setReceiver(res.data));
        })
        .catch(err => {});
  }, []);

  function handleClickTab(tab) {
    if (tab !== state.tab) {
      setState({
        ...state,
        tab
      });
    }
  }

  function handlePsw1Change(e) {
    setState({
      ...state,
      psw1: e.target.value
    });
  }

  function handlePsw2Change(e) {
    setState({
      ...state,
      psw2: e.target.value
    });
  }

  function handlePsw3Change(e) {
    setState({
      ...state,
      psw3: e.target.value
    });
  }

  function changePsw() {
    const pattern = /.{6,18}/;
    const { psw1, psw2, psw3 } = state;
    if (!psw1 || !psw2 || !psw3) {
      message.info("密码不能为空", 2);
      return;
    }
    let array = [psw1, psw2, psw3];
    for (let i = 0; i < array.length; i++) {
      if (!pattern.test(array[i])) {
        message.info("密码为6到18个字符", 2);
        return;
      }
    }
    if (psw1 === psw2) {
      message.info("新密码不能与原密码相同", 2);
      return;
    }
    if (psw2 !== psw3) {
      message.info("两次输入的新密码不一致", 2);
      return;
    }
    setState({
      ...state,
      isChanging: true
    });
    api
      .changePassword(user.username, psw1, psw2)
      .then(res => {
        message.success("密码修改成功", 2);
        clearPsw();
      })
      .catch(err => {
        message.error(err.msg, 2);
        clearPsw();
      });
  }

  function clearPsw() {
    setState({ ...state, psw1: "", psw2: "", psw3: "", isChanging: false });
  }

  function handleName(e) {
    setState({
      ...state,
      name: e.target.value
    });
  }

  function handlePhone(e) {
    setState({
      ...state,
      phone: e.target.value
    });
  }

  function handleAddress(e) {
    setState({
      ...state,
      address: e.target.value
    });
  }

  function handleDetail(e) {
    setState({
      ...state,
      detail: e.target.value
    });
  }

  function changeReceiver() {
    const { name, phone, address, detail } = state;
    if (!name || !phone || !address || !detail) {
      message.info("地址信息不能为空", 2);
      return;
    }
    const {
      name: propName,
      phone: propPhone,
      address: propAddress,
      detail: propDetail
    } = receiver;
    if (
      name === propName &&
      phone === propPhone &&
      address === propAddress &&
      detail === propDetail
    ) {
      return;
    }
    setState({
      ...state,
      isChanging: true
    });
    api
      .updateReceiver(name, phone, address, detail)
      .then(res => {
        dispatch(updateReceiver(res.data));
        setState({
          ...state,
          isChanging: false
        });
      })
      .catch(err => {
        message.error(err.msg, 2);
        setState({ ...state, isChanging: false });
      });
  }

  function handleSubmit() {
    if (state.isChanging) {
      return;
    }
    if (state.tab === "password") {
      changePsw();
    } else if (state.tab === "address") {
      changeReceiver();
    }
  }

  const { tab, name, phone, address, detail } = state;
  return (
    <div className="user-account">
      <div className="title-wrapper">
        <h4
          className={`title ${tab === "password" ? "active" : ""}`}
          onClick={() => handleClickTab("password")}
        >
          <span>修改密码</span>
        </h4>
        <h4
          className={`title ${tab === "address" ? "active" : ""}`}
          onClick={() => handleClickTab("address")}
        >
          <span>我的收货地址</span>
        </h4>
      </div>
      {tab === "password" ? (
        <div className="password">
          <p>
            <label>原密码：</label>
            <Input
              type="password"
              value={state.psw1}
              onChange={handlePsw1Change}
            />
          </p>
          <p>
            <label>新密码：</label>
            <Input
              type="password"
              value={state.psw2}
              onChange={handlePsw2Change}
            />
          </p>
          <p>
            <label>确认新密码：</label>
            <Input
              type="password"
              value={state.psw3}
              onChange={handlePsw3Change}
            />
          </p>
        </div>
      ) : (
        <div className="address">
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
              placeholder="省/市/区"
              value={address}
              onChange={handleAddress}
            />
          </p>
          <p>
            <label>详细地址：</label>
            <Input
              placeholder="详细地址，如：门牌、街道、村镇"
              value={detail}
              onChange={handleDetail}
            />
          </p>
          <p>
            现有收货地址：
            <span>
              {receiver &&
                `${receiver.name || ""} ${receiver.phone ||
                  ""} ${receiver.address || ""} ${receiver.detail || ""}`}
            </span>
          </p>
        </div>
      )}
      <div className="btn" role="button" onClick={handleSubmit}>
        保存
      </div>
    </div>
  );
}

export default UserAccount;
