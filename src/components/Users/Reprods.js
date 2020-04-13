import React, { useCallback, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import {
  useFirebase,
  useRequest,
  useCollection,
  useReprodActions,
} from '../../hooks';
import Button from '../Button';
import DeleteDialog from '../DeleteDialog';
import { LIMIT, STATUSES, BADGES } from '../../constants';
import StatusDropdown from '../StatusDropdown';

// params should be outside of the component
// otherwise useMemo
const params = { limit: LIMIT };

function Reprods({ user, isOwner }) {
  const { reprodId } = useParams();
  const firebase = useFirebase();

  // fetch user's reprods
  const userReprodFetcher = useCallback(
    params => firebase.getUserReprods(user.id, params),
    [user.id, firebase]
  );
  const { data, loading, hasMore, fetchMore } = useRequest(
    userReprodFetcher,
    params
  );
  const [state, dispatch] = useCollection(data);
  const { byId, ids } = state;

  const { doStatusUpdate, doDelete } = useReprodActions();
  async function handleStatusChange(id, status) {
    try {
      const doc = await doStatusUpdate(id, byId[id].paperId, status);
      dispatch({ type: 'SET', id, doc });
    } catch (error) {}
  }

  const [selected, setSelected] = useState(null);
  async function handleDelete(id) {
    try {
      await doDelete(id, byId[id].paperId);
      setSelected(null);
      dispatch({ type: 'DELETE', id });
    } catch (error) {}
  }

  const userRole = firebase.authUser.profile.role;
  const isAdmin = userRole === 'admin';
  return (
    <>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Reproduction ID</th>
              <th>Title</th>
              <th>Author(s)</th>
              <th>Badges</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ids.map(id => (
              <tr
                key={id}
                className={`${id === reprodId ? 'table-primary ' : ''}`}
              >
                <td>
                  <Link to={`/papers/${byId[id].paperId}#${id}`}>{id}</Link>
                </td>
                <td>{byId[id].title}</td>
                <td>{byId[id].authors.join(', ')}</td>
                <td>
                  {byId[id].badges &&
                    byId[id].badges.map(key => (
                      <span
                        key={key}
                        className={`badge badge-${BADGES[key].color} mr-2`}
                      >
                        {BADGES[key].label}
                      </span>
                    ))}
                </td>
                <td>
                  <span
                    className={`badge badge-${STATUSES[byId[id].status].color}`}
                  >
                    {STATUSES[byId[id].status].label}
                  </span>
                </td>
                <td>
                  <div className="btn-group btn-group-sm" role="group">
                    {(isAdmin || isOwner) && (
                      <>
                        <Link
                          className="btn btn-primary"
                          to={`/papers/${byId[id].paperId}/reproductions/${byId[id].id}/edit`}
                        >
                          Edit
                        </Link>
                        <Button
                          className="btn btn-danger"
                          onClick={() => setSelected(id)}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                    {isAdmin && (
                      <StatusDropdown
                        status={byId[id].status}
                        onStatusChange={status =>
                          handleStatusChange(id, status)
                        }
                        size="sm"
                      />
                    )}
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
          isOpen={!!selected}
          onDelete={() => handleDelete(selected)}
          onToggle={() => setSelected(null)}
          itemName={selected && byId[selected].title}
        />
      </div>
    </>
  );
}

export default Reprods;
