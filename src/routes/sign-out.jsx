import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

import { useFirebase } from '../hooks'
import Spinner from '../components/Spinner'

function SignOut() {
  const firebase = useFirebase()
  const navigate = useNavigate()

  useEffect(() => {
    firebase
      .signOut()
      .then(() => {
        toast.success('Signed out successfully')
        navigate('/', { replace: true })
      })
      .catch((error) => {
        toast.error(error.message)
      })
  }, [firebase, navigate])

  return <Spinner />
}

export default SignOut
