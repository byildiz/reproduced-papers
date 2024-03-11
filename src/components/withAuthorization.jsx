import { useAuthentication } from '../hooks'
import ErrorAlert from './ErrorAlert'

export default function withAuthorization(roles) {
  return function (Component) {
    return function Authorization(props) {
      const { authUser } = useAuthentication()

      return !authUser || !roles.includes(authUser.profile.role) ? (
        <ErrorAlert title="Restricted Page">
          You don&apos;t have permission to view this page.
        </ErrorAlert>
      ) : (
        <Component {...props} authUser={authUser} />
      )
    }
  }
}
