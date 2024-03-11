import { useRouteLoaderData } from 'react-router-dom'

function Profile() {
  const { user } = useRouteLoaderData('user')
  const data = user.data()
  return (
    <dl className="mx-1">
      <dt>Display Name</dt>
      <dd>{data.displayName}</dd>
      <dt>E-mail</dt>
      <dd>{data.email}</dd>
    </dl>
  )
}

export default Profile
