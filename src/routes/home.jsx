import { useLoaderData } from 'react-router-dom'

import { firebase } from '../firebase'

export async function loader() {
  const paperCount = await firebase.getPaperCount()
  const reprodCount = await firebase.getReprodCount()
  return { paperCount, reprodCount }
}

function Home() {
  const { paperCount, reprodCount } = useLoaderData()
  return (
    <>
      <div className="px-4 py-5 my-5 text-center">
        <h1 className="display-5 fw-bold text-body-emphasis">
          Reproduced Papers
        </h1>
        <div className="col-lg-6 mx-auto">
          <p className="lead mb-4">
            Hub for reproduced deep learning papers and their reproductions
          </p>
          <div className="d-grid gap-2 d-sm-flex justify-content-sm-center"></div>
        </div>
        <div className="container px-4 py-5">
          <h2 className="pb-2 border-bottom text-start">Statistics</h2>
          <div className="row g-4 py-5 row-cols-1 row-cols-lg-3">
            <div className="col text-primary p-3">
              <h3 className="fs-2 text-body-emphasis"># Papers</h3>
              <span className="display-6">{paperCount}</span>
            </div>
            <div className="col text-primary p-3">
              <h3 className="fs-2 text-body-emphasis"># Reproductions</h3>
              <span className="display-6">{reprodCount}</span>
            </div>
            <div className="col text-primary p-3">
              <h3 className="fs-2 text-body-emphasis">
                # Reproductions / Paper
              </h3>
              <span className="display-6">
                {(reprodCount / paperCount).toPrecision(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
