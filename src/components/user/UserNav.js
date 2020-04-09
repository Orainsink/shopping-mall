import React from "react";
import { useSelector } from "react-redux";

function UserNav(props) {
  const user = useSelector(state => state.user);
  const { tab, changeTab } = props;

  return (
    <nav className="user-navbar">
      <div className="user-avatar">
        <img src={require("../../style/img/avatar.png")} alt="avatar" />
        <span>{user && (user.nickyname || user.username)}</span>
      </div>
      <div
        className={`index ${tab === "profile" ? "active" : ""}`}
        onClick={() => changeTab("profile")}
      >
        我的首页
      </div>
      <div
        className={`account ${tab === "account" ? "active" : ""}`}
        onClick={() => changeTab("account")}
      >
        账户设置
      </div>
    </nav>
  );
}

export default UserNav;
