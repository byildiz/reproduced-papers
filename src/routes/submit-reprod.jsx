import { firebase } from '../firebase'
import ReprodForm from './reprods/reprod-form'
import withAuthentication from '../components/withAuthentication'
import { loader as paperLoader } from './papers'

export async function loader({ params }) {
  const { paperId } = params
  const promises = []
  promises.push(paperLoader({ params }))
  promises.push(firebase.getPaperTables(paperId))
  const [{ paper }, tables] = await Promise.all(promises)
  return { paper, tables }
}

function SubmitReprod() {
  return <ReprodForm />
}

export default withAuthentication(SubmitReprod)
