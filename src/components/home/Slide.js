import React from 'react'
import { Carousel } from 'antd'

function Slide(){
    return (
      <div className="home-slides">
        <Carousel autoplay dots={false}>
          <div className="slide">
            <img
              src="https://foolishrobot.oss-cn-beijing.aliyuncs.com/banner1.jpg"
              alt="banner"
            />
          </div>
          <div className="slide">
            <img
              src="https://foolishrobot.oss-cn-beijing.aliyuncs.com/banner2.jpg"
              alt="banner"
            />
          </div>
          <div className="slide">
            <img
              src="https://foolishrobot.oss-cn-beijing.aliyuncs.com/banner3.jpg"
              alt="banner"
            />
          </div>
        </Carousel>
      </div>
    )
}

export default Slide
