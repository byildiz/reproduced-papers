import { useReducer, useEffect } from 'react'

function data(doc) {
  return { ...doc.data(), id: doc.id, doc }
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_DATA': {
      const byId = {}
      const ids = []
      const docs = action.docs || []
      docs.forEach((doc) => {
        byId[doc.id] = data(doc)
        ids.push(doc.id)
      })
      return { ...state, byId, ids }
    }
    case 'SET':
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.id]: data(action.doc),
        },
      }
    case 'DELETE':
      return { ...state, ids: state.ids.filter((id) => id !== action.id) }
    default:
      throw new Error(`Unknown action type: ${action.type}`)
  }
}

export default function useCollection(docs) {
  const [state, dispatch] = useReducer(reducer, { byId: {}, ids: [] })
  useEffect(() => {
    dispatch({ type: 'SET_DATA', docs })
  }, [docs])
  return [state, dispatch]
}
