import { NavLink, Routes, Route } from 'react-router-dom'

import withAuthorization from '../withAuthorization'
import Papers from './Papers'
import PaperEdit from './PaperEdit'
import Reprods from './Reprods'
import ReprodEdit from './ReprodEdit'
import Users from './Users'
import Actions from './Actions'

function Admin() {
  return (
    <>
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <NavLink
            className="nav-link"
            to="/admin/papers"
            isActive={(match, location) =>
              match || location.pathname === '/admin'
            }
          >
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
      <Routes>
        <Route path={['/admin', '/admin/papers']}>
          <Papers />
        </Route>
        <Route path="/admin/papers/:paperId/edit">
          <PaperEdit />
        </Route>
        <Route path="/admin/reproductions">
          <Reprods />
        </Route>
        <Route path="/admin/reproductions/:paperId/:reprodId/edit">
          <ReprodEdit />
        </Route>
        <Route path="/admin/users">
          <Users />
        </Route>
        <Route path="/admin/actions">
          <Actions />
        </Route>
      </Routes>
    </>
  )
}

export default withAuthorization(['admin'])(Admin)
