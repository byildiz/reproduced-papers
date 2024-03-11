import { useRouteError } from 'react-router-dom'

import ErrorAlert from './ErrorAlert'

function ErrorPage() {
  const error = useRouteError()

  return <ErrorAlert>{error.statusText || error.message}</ErrorAlert>
}

export default ErrorPage
