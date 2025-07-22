import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../AuthContext";
import api from "../api";
import { ThemeContext } from "../ThemeContext";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await api.get("/contacts", {
          headers: {
            "Authorization": `Bearer ${user?.token}`
          }
        });
        setContacts(res.data);
      } catch {
        setContacts([]);
      }
    };
    if (user?.token) fetchContacts();
  }, [user]);

  return (
    <div className="container-fluid px-0 px-md-3">
      <nav className="mb-4" aria-label="breadcrumb">
        <ol className="breadcrumb mb-0">
          <li className="breadcrumb-item"><a href="#!">Page 1</a></li>
          <li className="breadcrumb-item"><a href="#!">Page 2</a></li>
          <li className="breadcrumb-item active">Default</li>
        </ol>
      </nav>
      <div className="mb-5">
        <h2 className="mb-4">Contacts</h2>
        <div className="card shadow-sm p-3 p-md-4 mb-4">
          <div className="card-body p-0">
            <div className="table-responsive scrollbar mx-n1 px-1">
              <table className="table fs-9 mb-0 border-top border-translucent">
                <thead>
                  <tr>
                    <th className="white-space-nowrap fs-9 align-middle ps-0" style={{maxWidth: '20px', width: '18px'}}>
                      <div className="form-check mb-0 fs-8">
                        <input className="form-check-input" type="checkbox" />
                      </div>
                    </th>
                    <th className="sort white-space-nowrap align-middle text-uppercase ps-0" scope="col" style={{width: '25%'}}>Name</th>
                    <th className="sort align-middle ps-4 pe-5 text-uppercase border-end border-translucent" scope="col" style={{width: '15%'}}>Email</th>
                    <th className="sort align-middle ps-4 pe-5 text-uppercase border-end border-translucent" scope="col" style={{width: '15%', minWidth: '180px'}}>Phone</th>
                    <th className="sort align-middle ps-4 pe-5 text-uppercase border-end border-translucent" scope="col" style={{width: '15%'}}>Address</th>
                    <th className="sort text-end align-middle pe-0 ps-4" scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.length === 0 ? (
                    <tr><td colSpan={6} className="text-center">No contacts found.</td></tr>
                  ) : (
                    contacts.map(contact => (
                      <tr key={contact.id} className="hover-actions-trigger btn-reveal-trigger position-static">
                        <td className="fs-9 align-middle">
                          <div className="form-check mb-0 fs-8">
                            <input className="form-check-input" type="checkbox" />
                          </div>
                        </td>
                        <td className="name align-middle white-space-nowrap ps-0">
                          <div className="d-flex align-items-center">
                            <a href="#!">
                              <div className="avatar avatar-xl me-3">
                                <img className="rounded-circle" src="/phoenix-assets/assets/img/team/32.webp" alt="" />
                              </div>
                            </a>
                            <div>
                              <a className="fs-8 fw-bold" href="#!">{contact.name}</a>
                            </div>
                          </div>
                        </td>
                        <td className="email align-middle white-space-nowrap fw-semibold ps-4 border-end border-translucent">
                          <a className={`${theme === "light" ? "text-black" : "text-white"}`} href={`mailto:${contact.email}`}>{contact.email}</a>
                        </td>
                        <td className="phone align-middle white-space-nowrap fw-semibold ps-4 border-end border-translucent">
                          <a className={`${theme === "light" ? "text-black" : "text-white"}`} href={`tel:${contact.phone}`}>{contact.phone}</a>
                        </td>
                        <td className={`address align-middle white-space-nowrap text-body-tertiary ps-4 border-end border-translucent fw-semibold ${theme === "light" ? "text-black" : "text-white"}`}>
                          {contact.address}
                        </td>
                        <td className="align-middle white-space-nowrap text-end pe-0 ps-4">
                          <div className="btn-reveal-trigger position-static">
                            <button className="btn btn-sm dropdown-toggle dropdown-caret-none transition-none btn-reveal fs-10" type="button" data-bs-toggle="dropdown">
                              <span className="fas fa-ellipsis-h fs-10"></span>
                            </button>
                            <div className="dropdown-menu dropdown-menu-end py-2">
                              <a className="dropdown-item" href="#!">View</a>
                              <a className="dropdown-item" href="#!">Edit</a>
                              <div className="dropdown-divider"></div>
                              <a className="dropdown-item text-danger" href="#!">Remove</a>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacts; 