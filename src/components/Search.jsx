import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { useSearch } from '../hooks'
import { getReprodUrl } from '../helpers'
import Spinner from './Spinner'
import MoreText from './MoreText'

function Search() {
  const location = useLocation()
  const navigate = useNavigate()
  const params = new URLSearchParams(location.search)
  const query = params.has('q') ? params.get('q') : ''
  if (query.length == 0) {
    navigate(-1)
  }

  const paperSearcher = useSearch('papers')
  const reprodSearcher = useSearch('reprods')
  useEffect(() => {
    paperSearcher.search(query)
    reprodSearcher.search(query)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  const loading = paperSearcher.loading || reprodSearcher.loading
  const numHits = paperSearcher.hits.length + reprodSearcher.hits.length

  return (
    <>
      <h1>
        Search Results for{' '}
        <span className="text-muted">&quot;{query}&quot;</span>
      </h1>
      <div>
        {loading && (
          <div className="list-group-item search-item">
            <Spinner />
          </div>
        )}
        {paperSearcher.hits.length > 0 && (
          <>
            <h3 className="mt-3">PAPERS</h3>
            {paperSearcher.hits.map((hit) => (
              <ResultItem key={hit.objectID} hit={hit} />
            ))}
          </>
        )}
        {reprodSearcher.hits.length > 0 && (
          <>
            <h3 className="mt-3">REPRODUCTIONS</h3>
            {reprodSearcher.hits.map((hit) => (
              <ResultItem key={hit.objectID} hit={hit} paper={false} />
            ))}
          </>
        )}
        {numHits > 0 && (
          <p className="text-end">
            Search by{' '}
            <a
              className="text-black-50"
              target="_blank"
              rel="noopener noreferrer"
              href="https://algolia.com"
            >
              Algolia
            </a>
          </p>
        )}
      </div>
    </>
  )
}

export default Search

function ResultItem({ hit, paper = true }) {
  const title = hit.title,
    authors = hit.authors.join(', ')
  let description, url
  if (paper) {
    description = hit.abstract
    url = `/papers/${hit.objectID}`
  } else {
    description = hit.description
    url = getReprodUrl(hit.paperId, hit.objectID)
  }
  return (
    <div className="card mb-3">
      <div className="card-body">
        <h3 className="card-title">
          {title}
          <br />
          <small className="text-muted">by {authors}</small>
        </h3>
        <MoreText className="card-text" text={description} />
        <Link className="btn btn-primary stretched-link" to={url}>
          Detail
        </Link>
      </div>
    </div>
  )
}
