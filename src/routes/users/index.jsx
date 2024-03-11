import { NavLink, Outlet, useLoaderData } from 'react-router-dom'
import { get } from 'lodash/fp'

import withAuthentication from '../../components/withAuthentication'
import ErrorAlert from '../../components/ErrorAlert'
import { firebase } from '../../firebase'

export async function loader({ params }) {
  const { userId } = params
  const user = await firebase.getUser(userId)
  if (!user || !user.exists) {
    throw Error(`User with id ${userId} could not found.`)
  }
  return { user }
}

function User({ authUser }) {
  const { user } = useLoaderData()

  const userId = user.id
  const role = get('profile.role')(authUser)
  if (userId !== authUser.uid && role !== 'admin') {
    return (
      <ErrorAlert title="Restricted Page">
        You don&apos;t have permission to view this page.
      </ErrorAlert>
    )
  }

  const isOwner = authUser && userId === authUser.uid
  const myPrefix = isOwner ? 'My' : ''
  return (
    <>
      <h1>{user.get('displayName')}</h1>
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <NavLink className="nav-link" to={`/users/${userId}`} end>
            {`${myPrefix} Profile`}
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to={`/users/${userId}/papers`}>
            {`${myPrefix} Papers`}
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to={`/users/${userId}/reproductions`}>
            {`${myPrefix} Reproductions`}
          </NavLink>
        </li>
      </ul>
      <Outlet />
    </>
  )
}

export default withAuthentication(User)
