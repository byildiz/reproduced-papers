import PaperForm from './papers/paper-form'
import withAuthentication from '../components/withAuthentication'

function SubmitPaper() {
  return <PaperForm />
}

export default withAuthentication(SubmitPaper)
