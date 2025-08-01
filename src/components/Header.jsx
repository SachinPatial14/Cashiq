import React from "react";


const Header = () =>{
    return(
      <div className=" fixed-top shadow container-fluid d-flex align-items-center justify-content-between px-4 py-3"
      style={{ height: "55px" , background:"#d6dbd2"}}>
        <img src="/images/CashiqLogo.png" alt="Logo" style={{ height: "105px" }} />
        <p className="mb-0 fw-semibold text-muted">Control Your Cash Like a Pro</p>
      </div>
    )
}

export default Header ;