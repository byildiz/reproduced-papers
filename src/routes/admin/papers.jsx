import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import {
  useFirebase,
  useRequest,
  useCollection,
  usePaperActions,
} from '../../hooks'
import Button from '../../components/Button'
import DeleteDialog from '../../components/DeleteDialog'
import Dialog from '../../components/Dialog'
import { LIMIT } from '../../constants'
import StatusDropdown from '../../components/StatusDropdown'
import PaperDetail from '../../components/PaperDetail'
import PaperPicker from '../../components/PaperPicker'

const filters = {
  all: 'All',
  pending: 'Pending',
  rejected: 'Rejected',
  published: 'Published',
}
const defaultFilter = 'all'
function getFilteredIds(filter, state) {
  if (filter === 'all') {
    return state.ids
  }
  return state.ids.filter(
    (id) =>
      (filter === 'pending' && state.byId[id].status === 'pending') ||
      (filter === 'rejected' && state.byId[id].status === 'rejected') ||
      (filter === 'published' && state.byId[id].status === 'published')
  )
}

// params should be outside of the component
// otherwise useMemo
const params = { limit: LIMIT }

function AdminPapers() {
  const firebase = useFirebase()
  const { data, loading, hasMore, fetchMore } = useRequest(
    firebase.getPapers,
    params
  )
  const [state, dispatch] = useCollection(data)
  const { byId } = state

  const { doStatusUpdate, doDelete, doMerge } = usePaperActions()
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

  const [forMerge, setForMerge] = useState(null)
  async function handleMerge(paperId1, paperId2) {
    try {
      await doMerge(paperId1, paperId2)
      setForMerge(null)
      dispatch({ type: 'DELETE', paperId2 })
    } catch (error) {
      console.error(error)
    }
  }

  const [forDetail, setForDetail] = useState(null)

  const { hash } = useLocation()
  const [filter, setFilter] = useState(hash ? hash.substr(1) : defaultFilter)
  let filteredIds = getFilteredIds(filter, state)

  return (
    <>
      <ul className="nav nav-pills mb-3">
        {Object.keys(filters).map((key) => (
          <li key={key} className="nav-item">
            <a
              className={`nav-link${key === filter ? ' active' : ''}`}
              onClick={() => setFilter(key)}
              href={`#${filter}`}
            >
              {filters[key]}
            </a>
          </li>
        ))}
      </ul>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Paper ID</th>
              <th>Title</th>
              <th>Author(s)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredIds.map((id) => (
              <tr key={id}>
                <td>
                  <Link to={`/papers/${id}`}>{id}</Link>
                </td>
                <td>{byId[id].title}</td>
                <td>{byId[id].authors.join(', ')}</td>
                <td>
                  <div className="btn-group btn-group-sm" role="group">
                    <Button
                      className="btn btn-primary"
                      onClick={() => setForDetail(id)}
                    >
                      Detail
                    </Button>
                    <Link
                      className="btn btn-success"
                      to={`/admin/papers/${id}/edit`}
                    >
                      Edit
                    </Link>
                    <Button
                      className="btn btn-danger"
                      onClick={() => setForDelete(id)}
                    >
                      Delete
                    </Button>
                    <Button
                      className="btn btn-info"
                      onClick={() => setForMerge(id)}
                    >
                      Merge
                    </Button>
                    <StatusDropdown
                      status={byId[id].status}
                      onStatusChange={(status) =>
                        handleStatusChange(id, status)
                      }
                      size="sm"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
        <Dialog
          isOpen={!!forDetail}
          onToggle={() => setForDetail(null)}
          title={forDetail && byId[forDetail].title}
          size="xl"
        >
          {forDetail && (
            <PaperDetail paperId={forDetail} paper={byId[forDetail]} />
          )}
        </Dialog>
        <PaperPicker
          title="Choose a paper to merge with"
          action="Merge"
          onSelect={(paperId) => handleMerge(paperId, forMerge)}
          onClose={() => setForMerge(null)}
          isOpen={!!forMerge}
        />
      </div>
    </>
  )
}

export default AdminPapers
