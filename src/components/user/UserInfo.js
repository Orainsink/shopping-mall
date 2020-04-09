import React, { useState } from "react";
import Header from "../Header";
import UserNav from "./UserNav";
import UserProfile from "./UserProfile";
import UserAccount from "./UserAccount";
import Recommend from "./Recommend";

function UserInfo(props) {
  const [tab, setTab] = useState("profile");

  function changeTab(curTab) {
    if (curTab !== tab) {
      setTab(curTab);
    }
  }

  return (
    <div className="user-info">
      <Header />
      <UserNav {...props} tab={tab} changeTab={changeTab} />
      {tab === "profile" ? (
        <UserProfile {...props} />
      ) : (
        <UserAccount {...props} />
      )}
      <Recommend {...props}> </Recommend>
    </div>
  );
}

export default React.memo(UserInfo);
