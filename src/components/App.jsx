import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { useAuthentication } from '../hooks'

import Spinner from './Spinner'
import Root from '../routes/root'
import Home, { loader as homeLoader } from '../routes/home'
import SubmitPaper from '../routes/submit-paper'
import Papers, { loader as paperLoader } from '../routes/papers'
import SubmitReprod, {
  loader as submitReprodLoader,
} from '../routes/submit-reprod'
import User, { loader as userLoader } from '../routes/users'
import UserProfile from '../routes/users/profile'
import UserPapers from '../routes/users/papers'
import UserReprods from '../routes/users/reprods'
import Admin from '../routes/admin'
import AdminPapers from '../routes/admin/papers'
import AdminReprods from '../routes/admin/reprods'
import SignOut from '../routes/sign-out'
import Help from '../routes/help'
import About from '../routes/about'
import Search from '../routes/search'
import ErrorPage from './ErrorPage'
import PaperItem from '../routes/papers/paper-item'
import PaperForm from '../routes/papers/paper-form'
import ReprodForm from '../routes/reprods/reprod-form'
import Reprods, { loader as reprodLoader } from '../routes/reprods'
import AdminActions from '../routes/admin/actions'
import AdminUsers from '../routes/admin/users'
import SelectPaper from '../routes/select-paper'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <Home />,
            loader: homeLoader,
          },
          {
            path: 'search',
            element: <Search />,
          },
          {
            path: 'reprods',
            element: <Reprods />,
          },
          {
            path: 'submit-reproduction',
            children: [
              {
                index: true,
                element: <SelectPaper />,
              },
              {
                path: ':paperId',
                element: <SubmitReprod />,
                loader: submitReprodLoader,
              },
            ],
          },
          {
            path: 'papers',
            children: [
              { index: true, element: <Papers /> },
              {
                path: ':paperId',
                element: <PaperItem />,
                loader: paperLoader,
              },
              {
                path: ':paperId/edit',
                element: <PaperForm />,
                loader: paperLoader,
              },
              {
                path: ':paperId/reproductions/:reprodId/edit',
                element: <ReprodForm />,
                loader: reprodLoader,
              },
            ],
          },
          {
            path: 'submit-paper',
            element: <SubmitPaper />,
          },
          {
            path: 'users/:userId',
            id: 'user',
            element: <User />,
            loader: userLoader,
            children: [
              {
                index: true,
                element: <UserProfile />,
              },
              {
                path: 'papers/:paperId?',
                element: <UserPapers />,
              },
              {
                path: 'reproductions/:reprodId?',
                element: <UserReprods />,
              },
            ],
          },
          {
            path: 'admin',
            id: 'admin',
            element: <Admin />,
            children: [
              {
                path: 'papers',
                element: <AdminPapers />,
              },
              {
                path: 'papers/:paperId/edit',
                element: <PaperForm />,
                loader: paperLoader,
              },
              {
                path: 'reproductions',
                element: <AdminReprods />,
              },
              {
                path: 'reproductions/:paperId/:reprodId/edit',
                element: <ReprodForm />,
                loader: reprodLoader,
              },
              {
                path: 'actions',
                element: <AdminActions />,
              },
              {
                path: 'users',
                element: <AdminUsers />,
              },
            ],
          },
          {
            path: '/signout',
            element: <SignOut />,
          },
          {
            path: '/help',
            element: <Help />,
          },
          {
            path: '/about',
            element: <About />,
          },
        ],
      },
    ],
  },
])

function App() {
  const { loading } = useAuthentication()

  if (loading) {
    return <Spinner />
  }

  return <RouterProvider router={router} fallbackElement={<Spinner />} />
}

export default App
