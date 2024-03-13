import { NavLink, Outlet } from 'react-router-dom'

import withAuthorization from '../../components/withAuthorization'

function Admin() {
  return (
    <>
      <h1>Admin Dashbord</h1>
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <NavLink className="nav-link" to="/admin/papers">
            Papers
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/admin/reproductions">
            Reproductions
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/admin/users">
            Users
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/admin/actions">
            Actions
          </NavLink>
        </li>
      </ul>
      <Outlet />
    </>
  )
}

export default withAuthorization(['admin'])(Admin)
