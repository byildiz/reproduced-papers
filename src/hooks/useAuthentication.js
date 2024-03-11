import { useEffect, useState } from 'react'

import { useFirebase } from '.'

export default function useAuthentication() {
  const [loading, setLoading] = useState(true)
  const [authUser, setAuthUser] = useState(null)
  const firebase = useFirebase()

  useEffect(() => {
    const unsubscribe = firebase.onAuthStateChanged((authUser) => {
      setAuthUser(authUser)
      setLoading(false)
    })
    return () => {
      setLoading(true)
      unsubscribe()
    }
  }, [firebase])
  return { loading, authUser }
}
