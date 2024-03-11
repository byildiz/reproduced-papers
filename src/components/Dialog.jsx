import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

export default function Dialog({
  title,
  children,
  buttons = null,
  isOpen,
  onToggle,
  size,
}) {
  if (!buttons) {
    buttons = [
      <Button key="close" variant="secondary" onClick={onToggle}>
        Close
      </Button>,
    ]
  }
  return (
    <Modal show={isOpen} onHide={onToggle} dialogClassName={`modal-${size}`}>
      {title && (
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
      )}
      {children && <Modal.Body>{children}</Modal.Body>}
      {buttons && <Modal.Footer>{buttons}</Modal.Footer>}
    </Modal>
  )
}
