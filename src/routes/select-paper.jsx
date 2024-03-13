import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'

import Spinner from '../components/Spinner'
import PaperPicker from '../components/PaperPicker'
import withAuthentication from '../components/withAuthentication'
import { useFirebase, useRequest } from '../hooks'
import MoreText from '../components/MoreText'

function SelectPaper() {
  const [selected, setSelected] = useState()
  const [show, setShow] = useState(false)
  const firebase = useFirebase()

  // fetch paper
  const paperFetcher = useCallback(
    () => firebase.getPaper(selected),
    [selected, firebase]
  )
  const { data: paper, loading } = useRequest(paperFetcher)

  const isPaperReady = selected && paper && paper.exists

  return (
    <>
      <PaperPicker
        title="Search and select a paper"
        action="Select"
        onSelect={(paperId) => {
          setShow(false)
          setSelected(paperId)
        }}
        onClose={() => setShow(false)}
        isOpen={show}
      />
      {selected && loading && <Spinner />}
      <h1>Select Paper</h1>
      <p>Select a paper to add a reproduction</p>
      <div className="card">
        <div className="card-body">
          {isPaperReady && (
            <>
              <h3 className="card-title">{paper.get('title')}</h3>
              <MoreText className="card-text" text={paper.get('abstract')} />
            </>
          )}
          <button className="btn btn-primary" onClick={() => setShow(true)}>
            {isPaperReady ? 'Reselect' : 'Select'}
          </button>{' '}
          {isPaperReady && (
            <Link
              className="btn btn-success"
              disabled={!isPaperReady}
              to={`/submit-reproduction/${selected}`}
            >
              Next
            </Link>
          )}
        </div>
      </div>
    </>
  )
}

export default withAuthentication(SelectPaper)
