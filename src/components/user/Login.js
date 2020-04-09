import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import * as api from "../../api";
import { Input, Icon } from "antd";
import { login, setCart } from "../../actions";

function Login() {
  const [state, setState] = useState({
    errMsg: "",
    username: "",
    password: "",
    isLogining: false
  });
  const dispatch = useDispatch();

  function handleUsernameChange(e) {
    setState({
      ...state,
      username: e.target.value
    });
  }

  function handlePasswordChange(e) {
    setState({
      ...state,
      password: e.target.value
    });
  }

  function handleFocus() {
    if (state.errMsg) {
      setState({
        ...state,
        errMsg: ""
      });
    }
  }

  function handleSubmit() {
    if (state.isLogining) {
      return;
    }
    const { username, password } = state;
    if (!username || !password) {
      setState({ ...state, errMsg: "用户名或密码不能为空" });
      return;
    }
    const pattern1 = /^[\u4e00-\u9fa5\w]{5,10}$/;
    const pattern2 = /.{6,18}/;
    if (!pattern1.test(username)) {
      setState({ ...state, errMsg: "账户名为5到10个字符" });
      return;
    }
    if (!pattern2.test(password)) {
      setState({ ...state, errMsg: "密码为6到18个字符" });
      return;
    }
    setState({
      ...state,
      isLogining: true
    });
    api
      .login(username, password)
      .then(res => {
        if (res.token) {
          localStorage.setItem("user", res.token);
        }
        const { username, nickyname, gender, cart } = res.data;
        dispatch(login({ username, nickyname, gender }));
        dispatch(setCart(cart));
      })
      .catch(err => {
        setState({
          ...state,
          errMsg: err.msg,
          isLogining: false
        });
      });
  }

  const { errMsg } = state;
  return (
    <div className="user-login">
      <div className="link">
        <Link to="/" className="logo">
          Zoro
        </Link>
      </div>
      <div className="login-wrapper">
        <div className="login">
          <div className="title">
            <h2> 账户登录 </h2>
          </div>
          {errMsg ? (
            <div className="error">
              <Icon
                type="close-circle"
                style={{ color: "#f10215", marginRight: "5px" }}
              />
              {errMsg}
            </div>
          ) : (
            ""
          )}
          <div className="username">
            <Input
              placeholder="请输入用户名"
              prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
              value={state.username}
              onChange={handleUsernameChange}
              onFocus={handleFocus}
            />
          </div>
          <div className="password">
            <Input
              type="password"
              placeholder="请输入密码"
              prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
              value={state.password}
              onChange={handlePasswordChange}
              onFocus={handleFocus}
            />
          </div>
          <div className="submit">
            <button onClick={handleSubmit}> 登录 </button>
          </div>
          <div className="tips"> 如果账户未注册， 将自动为您注册 </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
