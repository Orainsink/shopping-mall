import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as api from "../../api";
import { Input, Radio, message } from "antd";
import { changeProfile } from "../../actions";
const RadioGroup = Radio.Group;

function UserProfile() {
  const [state, setState] = useState({
    nickyname: "",
    gender: "",
    isChanging: false
  });
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);

  useEffect(() => {
    if ((user.nickyname || user.gender) && !state.nickyname && !state.gender) {
      setState({ ...state, nickyname: user.nickyname, gender: user.gender });
    }
  }, [user]);

  function handleNicknameChange(e) {
    setState({ ...state, nickyname: e.target.value });
  }

  function handleGenderChange(e) {
    setState({
      ...state,
      gender: e.target.value
    });
  }

  function handleSubmit() {
    if (state.isChanging) {
      return;
    }
    if (!state.nickyname) {
      message.error("昵称不能为空", 2);
      return;
    }
    if (state.nickyname === user.nickyname && state.gender === user.gender) {
      return;
    }
    setState({
      ...state,
      isChanging: true
    });
    api
      .changeProfile(state.nickyname, state.gender)
      .then(res => {
        const { nickyname, gender } = res.data;
        dispatch(changeProfile(nickyname, gender));
        setState({
          ...state,
          isChanging: false
        });
      })
      .catch(err => {
        message.error(err.msg, 2);
        setState({
          ...state,
          isChanging: false
        });
      });
  }

  return (
    <div className="user-profile">
      <h4 className="title">个人资料</h4>
      <div className="user-info">
        <div className="item">
          <label>用户名：</label>
          {user && user.username}
        </div>
        <div className="item">
          <label>昵称：</label>
          <div className="input-wrapper">
            <Input value={state.nickyname} onChange={handleNicknameChange} />
          </div>
        </div>
        <div className="item">
          <label>性别：</label>
          <RadioGroup value={state.gender} onChange={handleGenderChange}>
            <Radio value={"male"}>男</Radio>
            <Radio value={"female"}>女</Radio>
          </RadioGroup>
        </div>
      </div>
      <div className="btn" role="button" onClick={handleSubmit}>
        保存
      </div>
    </div>
  );
}

export default UserProfile;
