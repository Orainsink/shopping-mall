import React from "react";
import Slide from "./Slide";
import NewArrival from "./NewArrival";
// TODO
function HomeIndex(props) {
  return (
    <>
      <Slide />
      <NewArrival {...props} />
      <div className="lorem">
        <div className="upper">
          <div className="img-wrapper">
            <img
              src="https://foolishrobot.oss-cn-beijing.aliyuncs.com/banner2.jpg"
              alt="img"
            />
          </div>
          <div className="text">
            <h2>
              The Difference is
              <br />
              in The Lens
            </h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
          <div className="img-wrapper">
            <img
              src="https://foolishrobot.oss-cn-beijing.aliyuncs.com/banner2.jpg"
              alt="img"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default React.memo(HomeIndex);
