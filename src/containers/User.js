import React from "react";
import { useSelector } from "react-redux";
import Login from "../components/user/Login";
import UserInfo from "../components/user/UserInfo";
import TopBar from "../components/TopBar";

function User(props) {
  const user = useSelector(state => state.user);
  return (
    <>
      <TopBar {...props}> </TopBar>
      {user ? <UserInfo {...props}> </UserInfo> : <Login {...props} />}
    </>
  );
}

export default React.memo(User);
