import { useState } from 'react'
import { Link } from 'react-router-dom'

import {
  useFirebase,
  useRequest,
  useCollection,
  usePaperActions,
} from '../../hooks'
import Button from '../../components/Button'
import DeleteDialog from '../../components/DeleteDialog'
import PaperList from '../../components/PaperList'
import { LIMIT } from '../../constants'

// params should be outside of the component
// otherwise useMemo
const params = { limit: LIMIT }

function Papers() {
  const firebase = useFirebase()
  const { data, loading, hasMore, fetchMore } = useRequest(
    firebase.getPapers,
    params
  )
  const [state, dispatch] = useCollection(data)
  const { byId } = state

  const { doStatusUpdate, doDelete } = usePaperActions()
  async function handleStatusChange(id, status) {
    try {
      const doc = await doStatusUpdate(id, status)
      dispatch({ type: 'SET', id, doc })
    } catch (error) {
      console.error(error)
    }
  }

  const [forDelete, setForDelete] = useState(null)
  async function handleDelete(id) {
    try {
      await doDelete(id)
      setForDelete(null)
      dispatch({ type: 'DELETE', id })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <h1>
        <Link className="btn btn-primary float-end" to="/submit-paper">
          Submit Paper
        </Link>
        <span>Papers</span>
      </h1>
      <PaperList
        {...state}
        onDeleteClick={setForDelete}
        onStatusChange={handleStatusChange}
      />
      {hasMore && (
        <div className="text-center mb-3">
          <Button type="button" loading={loading} onClick={fetchMore}>
            More
          </Button>
        </div>
      )}
      <DeleteDialog
        isOpen={!!forDelete}
        onDelete={() => handleDelete(forDelete)}
        onToggle={() => setForDelete(null)}
        itemName={forDelete && byId[forDelete].title}
      />
    </>
  )
}

export default Papers
