import { Spinner } from 'react-bootstrap'
import { useAuthentication } from '../hooks'
import ErrorAlert from './ErrorAlert'

export default function withAuthentication(Component) {
  return function Authentication(props) {
    const { loading, authUser } = useAuthentication()

    if (loading) {
      return <Spinner />
    }

    return !authUser ? (
      <ErrorAlert title="Restricted Page">
        Please sign in to see this page.
      </ErrorAlert>
    ) : (
      <Component {...props} authUser={authUser} />
    )
  }
}
