import React from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = () =>{
    return(
          <div>
      <Header />
      <div className="d-flex pt-2" style={{ Height: "690px" , width:"1350px"  }}>
        <Sidebar />
        <main className=" px-4 pt-5 pb-0 w-100"  >
          <Outlet />
        </main>
      </div>
    </div>
    )
}

export default Layout ;