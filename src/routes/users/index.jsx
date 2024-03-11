import { NavLink, Outlet, useLoaderData, useNavigation } from 'react-router-dom'
import { get } from 'lodash/fp'

import withAuthentication from '../../components/withAuthentication'
import ErrorAlert from '../../components/ErrorAlert'
import Spinner from '../../components/Spinner'
import { firebase } from '../../firebase'

export async function loader({ params }) {
  const { userId } = params
  const user = await firebase.getUser(userId)
  if (!user || !user.exists) {
    throw Error(`User with id ${userId} could not found.`)
  }
  const authUser = firebase.authUser
  const isOwner = authUser && userId === authUser.uid
  return { userId, user, isOwner }
}

function User({ authUser }) {
  const { userId, user, isOwner } = useLoaderData()
  const navigation = useNavigation()

  if (navigation.state === 'loading') {
    return <Spinner />
  }

  const role = get('profile.role')(authUser)
  if (userId !== authUser.uid && role !== 'admin') {
    return (
      <ErrorAlert title="Restricted Page">
        You don&apos;t have permission to view this page.
      </ErrorAlert>
    )
  }

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
