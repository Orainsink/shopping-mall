import React, { useState,useEffect } from "react";
import PropTypes from "prop-types";

function HomeNavBar(props) {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const { category, changeCategory } = props;
    function filterCategoryIndex() {
        const tabs = ["index", "all", "female", "male", "discount"];
        for (let i = 0; i < tabs.length; i++) {
            if (tabs[i] === category) {
                setCategoryIndex(i);
            }
        }
    }
    useEffect(()=>{
        filterCategoryIndex();
    },[props]);

  return (
    <div className="home-nav-bar-wrapper">
      <div className="home-nav-bar">
        <div className="logo">
          zoro
        </div>
        <nav className="nav-bar">
          <div className="category">
            <div
              className={`item ${category === "index" ? "active" : ""}`}
              onClick={() => changeCategory("index")}
            >
              首页
            </div>
            <div
              className={`item ${category === "all" ? "active" : ""}`}
              onClick={() => changeCategory("all")}
            >
              全部
            </div>
            <div
              className={`item ${category === "female" ? "active" : ""}`}
              onClick={() => changeCategory("female")}
            >
              女士
            </div>
            <div
              className={`item ${category === "male" ? "active" : ""}`}
              onClick={() => changeCategory("male")}
            >
              男士
            </div>
            <div
              className={`item ${category === "discount" ? "active" : ""}`}
              onClick={() => changeCategory("discount")}
            >
              特惠
            </div>
            <div
              className="slider"
              style={{
                transform: `translateX(${categoryIndex * 60}px)`
              }}
            />
            <div
              className="fill"
              style={{
                transform: `translateX(${categoryIndex * 60}px)`
              }}
            />
          </div>
        </nav>
      </div>
    </div>
  );
}

HomeNavBar.propTypes = {
  category: PropTypes.string.isRequired,
  changeCategory: PropTypes.func.isRequired
};

export default React.memo(HomeNavBar);
