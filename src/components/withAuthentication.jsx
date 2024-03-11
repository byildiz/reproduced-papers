import { useAuthentication } from '../hooks'
import ErrorAlert from './ErrorAlert'

export default function withAuthentication(Component) {
  return function Authentication(props) {
    const { authUser } = useAuthentication()

    return !authUser ? (
      <ErrorAlert title="Restricted Page">
        Please sign in to see this page.
      </ErrorAlert>
    ) : (
      <Component {...props} authUser={authUser} />
    )
  }
}
