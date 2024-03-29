import { useReducer, useState, useEffect, useRef } from 'react'
import { useNavigate, Link, useLoaderData } from 'react-router-dom'
import toast from 'react-hot-toast'

import Button from '../../components/Button'
import Spinner from '../../components/Spinner'
import { useFirebase, useAlgolia, useSearch } from '../../hooks'

const INITIAL_STATE = {
  title: '',
  abstract: '',
  authors: [],
  urlAbstract: '',
  urlPDF: '',
  urlCode: '',
  status: 'pending',
}

function init(data) {
  return {
    title: data.title,
    abstract: data.abstract,
    authors: Array.isArray(data.authors)
      ? data.authors.join(', ')
      : data.authors,
    urlAbstract: data.urlAbstract,
    urlPDF: data.urlPDF,
    urlCode: data.urlCode || '',
    status: 'pending',
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET':
      return { ...state, [action.name]: action.value }
    default:
      throw new Error(`Unknown action type: ${action.type}`)
  }
}

function PaperForm() {
  const loaderData = useLoaderData()
  let paper = null
  if (loaderData && loaderData.paper) {
    paper = loaderData.paper
  }
  const [state, dispatch] = useReducer(
    reducer,
    paper ? { ...INITIAL_STATE, ...paper.data() } : INITIAL_STATE,
    init
  )
  const { title, abstract, authors, urlAbstract, urlPDF, urlCode } = state

  const firebase = useFirebase()
  const algolia = useAlgolia()
  const navigate = useNavigate()
  const [focused, setFocused] = useState(false)
  const [loading, setLoading] = useState(false)
  const searcher = useSearch('papers')

  function handleChange(event) {
    dispatch({
      type: 'SET',
      name: event.target.name,
      value: event.target.value,
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    try {
      // search for already published papers and if it exists don't save it
      setLoading(true)
      await searcher.search(title)
      if (
        !paper &&
        searcher.hits.length > 0 &&
        searcher.hits.find(
          (hit) => hit.title.trim().toLowerCase() === title.trim().toLowerCase()
        )
      ) {
        throw new Error('The paper has already been submitted')
      }

      const data = {
        ...state,
        authors: authors.split(',').map((s) => s.trim()),
      }
      let doc
      let message
      let snapshot
      if (paper) {
        doc = await firebase.updatePaper(paper.id, data)
        await algolia.updatePaper(doc.id, data)
        message = 'The paper has been updated'
      } else {
        doc = await firebase.addPaper(data)
        snapshot = await doc.get()
        await algolia.savePaper(doc.id, snapshot.data())
        message = 'The paper has been submitted'
      }
      toast.success(message)
      navigate(
        `/users/${
          paper ? paper.get('createdBy') : snapshot.get('createdBy')
        }/papers/${doc.id}`
      )
    } catch (error) {
      toast.error(error.message)
      setLoading(false)
    }
  }

  function showPapers(event) {
    searcher.search(event.target.value)
  }

  // settimeout may fire after unmount so prevent this situation
  let timeoutId = useRef(null)
  useEffect(() => {
    return () => {
      clearTimeout(timeoutId.current)
    }
  })
  function handleBlur() {
    timeoutId.current = setTimeout(() => {
      setFocused(false)
    }, 300)
  }

  return (
    <>
      <h1>{paper ? 'Edit Paper' : 'Submit Paper'}</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3 position-relative">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            onChange={(event) => {
              handleChange(event)
              showPapers(event)
            }}
            value={title}
            required
            onBlur={handleBlur}
            onFocus={() => setFocused(true)}
            autoComplete="off"
          />
          {focused && (
            <div className="list-group position-absolute w-100 mt-1">
              {searcher.loading && (
                <div className="list-group-item search-item">
                  <Spinner />
                </div>
              )}
              {searcher.hits.length > 0 && (
                <>
                  <a
                    href="#papers"
                    className="list-group-item list-group-item-action disabled"
                    tabIndex="-1"
                    aria-disabled="true"
                  >
                    Already Submitted Papers
                  </a>
                  {searcher.hits.map((hit) => (
                    <Link
                      key={hit.objectID}
                      className="list-group-item list-group-item-action"
                      to={`/papers/${hit.objectID}`}
                    >
                      {hit.title}
                    </Link>
                  ))}
                </>
              )}
              {searcher.hits.length > 0 && (
                <div className="list-group-item list-group-item-light text-end">
                  <small>
                    Search by{' '}
                    <a
                      className="text-black-50"
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://algolia.com"
                    >
                      Algolia
                    </a>
                  </small>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="abstract" className="form-label">
            Abstract
          </label>
          <textarea
            className="form-control"
            id="abstract"
            name="abstract"
            onChange={handleChange}
            value={abstract}
            required
            rows="10"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="authors" className="form-label">
            Author(s) of the paper
          </label>
          <input
            type="text"
            className="form-control"
            id="authors"
            name="authors"
            aria-describedby="authorsHelp"
            onChange={handleChange}
            value={authors}
            required
          />
          <small id="authorsHelp" className="form-text text-muted">
            Comma seperated authors of the paper
          </small>
        </div>
        <div className="mb-3">
          <label htmlFor="urlAbstract" className="form-label">
            URL to abstract
          </label>
          <input
            type="url"
            className="form-control"
            id="urlAbstract"
            name="urlAbstract"
            value={urlAbstract}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="urlPDF" className="form-label">
            URL to PDF <span className="text-muted">(optional)</span>
          </label>
          <input
            type="url"
            className="form-control"
            id="urlPDF"
            name="urlPDF"
            onChange={handleChange}
            value={urlPDF}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="urlCode" className="form-label">
            Official code <span className="text-muted">(optional)</span>
          </label>
          <input
            type="url"
            className="form-control"
            id="urlCode"
            name="urlCode"
            value={urlCode}
            onChange={handleChange}
          />
        </div>
        <Button loading={loading}>{paper ? 'Save' : 'Submit'}</Button>
      </form>
    </>
  )
}

export default PaperForm
