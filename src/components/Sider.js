import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import gsap from "gsap";
import ScrollToPlugin from "gsap/ScrollToPlugin";
import { Icon } from "antd";

gsap.registerPlugin(ScrollToPlugin);

function Sider() {
  const cart = useSelector(state => state.cart);
  const [scrolling, setScrolling] = useState(false);

  function handleScrollToTop() {
    setScrolling(true);
    gsap.to(window, {
      duration: 0.3,
      scrollTo: 0,
      ease: "power2.out",
      onComplete: () => {
        setScrolling(false);
      }
    });
  }

  return (
    <div className="sider">
      <div className="link">
        <div className="user">
          <Link to="/user">
            <Icon type="user" />
          </Link>
        </div>
        <Link to="/cart">
          <div className="cart">
            <Icon type="shopping-cart" />
            <span>
              <span>购</span>
              <span>物</span>
              <span>车</span>
            </span>
            <span className="count">
              {cart && cart.products ? cart.products.length : 0}
            </span>
          </div>
        </Link>
      </div>
      <div
        className={`to-top ${scrolling ? "bg-yellow" : ""}`}
        onClick={handleScrollToTop}
      >
        TOP
      </div>
    </div>
  );
}

export default React.memo(Sider);
