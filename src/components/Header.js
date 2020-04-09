import React from 'react'
import {Link} from 'react-router-dom'

function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <Link className="logo" to="/">
          Zoro
        </Link>
      </div>
    </header>
  )
}

export default React.memo(Header)
