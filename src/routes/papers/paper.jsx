import { useNavigation, Outlet } from 'react-router-dom'

import { firebase } from '../../firebase'
import Spinner from '../../components/Spinner'

export async function loader({ params }) {
  const { paperId } = params
  const paper = await firebase.getPaper(paperId)
  if (!paper || !paper.exists) {
    throw Error(`Paper with id ${paperId} could not found.`)
  }
  return { paper }
}

function Paper() {
  const navigation = useNavigation()

  if (navigation.state === 'loading') {
    return <Spinner />
  }

  return <Outlet />
}

export default Paper
