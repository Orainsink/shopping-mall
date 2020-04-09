import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "antd";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="link">
          <Link to="/" className="logo">
            DEMO
          </Link>
          <div className="icons">
            <a
              href="https://github.com/Orainsink"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon type="github" />
            </a>
          </div>
        </div>
        <div className="portfolio">
          <div>作品</div>
          <a
            href="http://101.132.145.80/react-webgl-resume/"
            target="_blank"
            rel="noopener noreferrer"
          >
            React-WebGL-Resume
          </a>
          <a
            href="https://foolishrobot.xyz/cave2_homepage/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Cave2-Homepage
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
