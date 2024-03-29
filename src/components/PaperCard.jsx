import { Link } from 'react-router-dom'
import { get } from 'lodash/fp'

import Button from './Button'
import { useAuthentication } from '../hooks'
import StatusDropdown from './StatusDropdown'
import MoreText from './MoreText'

function PaperCard({ paper, onDeleteClick, onStatusChange }) {
  const { authUser } = useAuthentication()
  const userId = get('uid', authUser)
  const userRole = get('profile.role', authUser)
  const data = paper.data()
  return (
    <div className="card mb-3">
      <div className="card-body">
        <h3 className="card-title">
          {data.title}
          <br />
          <small className="text-muted">by {data.authors.join(', ')}</small>
        </h3>
        <MoreText className="card-text" text={data.abstract} />
        <div
          className="btn-toolbar"
          role="toolbar"
          aria-label="Toolbar with button groups"
        >
          <div
            className="btn-group me-2 mb-2"
            role="group"
            aria-label="View group"
          >
            <Link className="btn btn-primary" to={`/papers/${paper.id}`}>
              Detail
            </Link>
          </div>
          {(userRole === 'admin' || userId === data.createdBy) && (
            <div
              className="btn-group mb-2"
              role="group"
              aria-label="Edit group"
            >
              {(userRole === 'admin' || data.status !== 'published') && (
                <>
                  <Link
                    className="btn btn-success"
                    to={`/papers/${paper.id}/edit`}
                  >
                    Edit
                  </Link>
                  <Button className="btn btn-danger" onClick={onDeleteClick}>
                    Delete
                  </Button>
                </>
              )}
              {userRole === 'admin' && (
                <StatusDropdown
                  status={data.status}
                  onStatusChange={onStatusChange}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PaperCard
