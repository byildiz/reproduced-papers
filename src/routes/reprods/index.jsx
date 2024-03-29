import { useState } from 'react'
import { Link } from 'react-router-dom'

import {
  useFirebase,
  useRequest,
  useCollection,
  useReprodActions,
} from '../../hooks'
import DeleteDialog from '../../components/DeleteDialog'
import ReprodCard from '../../components/ReprodCard'
import Button from '../../components/Button'
import { LIMIT } from '../../constants'
import { firebase } from '../../firebase'
import { loader as paperLoader } from '../papers'

export async function loader({ params }) {
  const { paperId, reprodId } = params
  const promises = []
  promises.push(paperLoader({ params }))
  promises.push(firebase.getPaperReprod(paperId, reprodId))
  promises.push(firebase.getPaperTables(paperId))
  const [{ paper }, reprod, tables] = await Promise.all(promises)
  if (!reprod || !reprod.exists) {
    throw Error(`Reproduction with id ${reprodId} could not found.`)
  }
  return { paper, reprod, tables }
}

// params should be outside of the component
// otherwise useMemo
const params = { limit: LIMIT }

function Reprods() {
  const firebase = useFirebase()

  // fetch reproductions
  const { data, loading, hasMore, fetchMore } = useRequest(
    firebase.getReprods,
    params
  )
  const [state, dispatch] = useCollection(data)
  const { byId, ids } = state

  const { doStatusUpdate, doDelete } = useReprodActions()
  async function handleStatusChange(id, status) {
    try {
      const doc = await doStatusUpdate(id, byId[id].paperId, status)
      dispatch({ type: 'SET', id, doc })
    } catch (error) {
      console.error(error)
    }
  }

  const [forDelete, setForDelete] = useState(null)
  async function handleDelete(id) {
    try {
      await doDelete(id, byId[id].paperId)
      setForDelete(null)
      dispatch({ type: 'DELETE', id })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    ids.length > 0 && (
      <>
        <h1>
          <Link
            className="btn btn-primary float-end"
            to="/submit-reproduction"
            role="button"
          >
            Submit Reproduction
          </Link>
          <span>Reproductions</span>
        </h1>
        {ids.map((id) => (
          <ReprodCard
            key={id}
            reprod={byId[id].doc}
            onDeleteClick={() => setForDelete(id)}
            onStatusChange={(status) => handleStatusChange(id, status)}
            forHome={true}
          />
        ))}
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
  )
}

export default Reprods
