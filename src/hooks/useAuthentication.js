import { useEffect, useState } from 'react'

import { useFirebase } from '.'

export default function useAuthentication() {
  const [loading, setLoading] = useState(true)
  const [authUser, setAuthUser] = useState(null)
  const firebase = useFirebase()

  useEffect(() => {
    const unsubscribe = firebase.onAuthStateChanged((authUser) => {
      setLoading(true)
      if (authUser) {
        authUser.reload()
        authUser.getIdToken(true)
      }
      setAuthUser(authUser)
      setLoading(false)
    })
    return () => {
      unsubscribe()
    }
  }, [firebase])
  return { loading, authUser }
}
