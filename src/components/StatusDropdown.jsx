import { STATUSES } from '../constants'

function StatusDropdown({ status, onStatusChange, size = null }) {
  return (
    <div
      className={`btn-group${size ? ` btn-group-${size}` : ''}`}
      role="group"
    >
      <button
        type="button"
        className="btn btn-secondary dropdown-toggle"
        data-bs-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        {STATUSES[status].label}
      </button>
      <div className="dropdown-menu">
        {Object.keys(STATUSES)
          .filter((key) => STATUSES[key].action)
          .map((key) => (
            <button
              key={key}
              className="dropdown-item"
              onClick={() => onStatusChange(key)}
              disabled={key === status}
            >
              {STATUSES[key].action}
            </button>
          ))}
      </div>
    </div>
  )
}

export default StatusDropdown
