import React, { useState } from "react";
import HomeNavBar from "../components/home/HomeNavBar";
import HomeIndex from "../components/home/HomeIndex";
import HomeCategory from "../components/home/HomeCategory";
import TopBar from "../components/TopBar";

function Home(props) {
  const [category, setCategory] = useState("index");

  function handleChangeCategory(cate) {
    setCategory(cate);
  }

  return (
    <>
      <TopBar {...props} />
      <div className="home">
        <HomeNavBar category={category} changeCategory={handleChangeCategory} />
        {category === "index" ? (
          <HomeIndex {...props} />
        ) : (
          <HomeCategory {...props} category={category} />
        )}
      </div>
    </>
  );
}

export default Home;
