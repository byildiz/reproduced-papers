import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'

import { BADGES } from '../constants'

function Badge({ badgeKey }) {
  const badge = BADGES[badgeKey]
  return (
    <OverlayTrigger overlay={<Tooltip>{badge.description}</Tooltip>}>
      <span className={`badge text-bg-${badge.color} me-2`}>{badge.label}</span>
    </OverlayTrigger>
  )
}

export default Badge
