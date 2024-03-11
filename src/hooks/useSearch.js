import { useEffect, useReducer, useRef } from 'react'
import toast from 'react-hot-toast'

import { useAlgolia, useAuthentication } from '.'

const INITIAL_STATE = {
  query: '',
  hits: [],
  loading: false,
  error: null,
}

function reducer(state, action) {
  switch (action.type) {
    case 'SEARCH':
      return { ...state, query: action.query, loading: true }
    case 'SUCCESS':
      return { ...state, hits: action.hits, loading: false, error: null }
    case 'ERROR':
      return { ...state, loading: false, error: action.error }
    case 'EMPTY':
      return { ...state, hits: [], loading: false }
    default:
      throw new Error(`Unknown action type: ${action.type}`)
  }
}

export default function useSearch(index) {
  const { authUser } = useAuthentication()
  const algolia = useAlgolia()
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)
  const timeoutId = useRef(null)

  useEffect(() => {
    return () => {
      clearTimeout(timeoutId.current)
    }
  }, [])

  function search(query) {
    clearTimeout(timeoutId.current)
    dispatch({ type: 'SEARCH', query })
    return new Promise((resolve) => {
      if (query.length > 2) {
        timeoutId.current = setTimeout(() => {
          const params = {}
          if (!authUser || authUser.profile.role !== 'admin') {
            params.filters = '(status:pending OR status:published)'
            if (index === 'reprods') {
              params.filters += ' AND visibility:public'
            }
          }
          algolia
            .search(index, query, params)
            .then((result) => {
              dispatch({ type: 'SUCCESS', hits: result.hits })
              resolve(true)
            })
            .catch((error) => {
              dispatch({ type: 'ERROR', error })
              toast.error(error.message)
              resolve(false)
            })
        }, 200)
      } else {
        dispatch({ type: 'EMPTY' })
        resolve(true)
      }
    })
  }

  return { ...state, search }
}
