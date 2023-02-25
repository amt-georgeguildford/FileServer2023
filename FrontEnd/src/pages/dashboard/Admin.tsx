import React from "react";
import Header from "../../components/header/Header";
import { NavLink, useParams } from 'react-router-dom'

const Admin = ({children}: {children: React.ReactNode}) => {
  const {id} = useParams()
  return (
    <>
      <Header homeLink={`/dashboard/admin/${id}/records`} greetNote="Welcome">
        <ul className="nav-menu">
          <li className="nav-item">
            <NavLink to={`/dashboard/admin/${id}/records`}>Records</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to={`/dashboard/admin/${id}/upload`}>Upload</NavLink>
          </li>
        </ul>
      </Header>
      <main className="admin body">
        <div className="container">
            {children}
        </div>
      </main>
    </>
  );
};

export default Admin;
