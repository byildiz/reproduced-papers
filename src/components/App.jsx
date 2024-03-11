import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { useAuthentication } from '../hooks'

import Spinner from './Spinner'
import Root from '../routes/root'
import Home, { loader as homeLoader } from '../routes/home'
import Reprods from './Reprods'
import SubmitPaper from './SubmitPaper'
import Papers from '../routes/papers'
import Paper, { loader as paperLoader } from '../routes/papers/paper'
import SubmitReprod from './SubmitReprod'
import Admin from './Admin'
import User, { loader as userLoader } from '../routes/users'
import UserProfile from '../routes/users/profile'
import UserPapers from '../routes/users/papers'
import UserReprods from '../routes/users/reprods'
import SignOut from '../routes/sign-out'
import Help from './Help'
import About from './About'
import Search from './Search'
import ErrorPage from './ErrorPage'
import PaperItem from './PaperItem'
import PaperForm from './PaperForm'
import Reprod from './Reprod'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        errorElement: <ErrorPage reprods />,
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
            path: 'papers',
            children: [
              { index: true, element: <Papers /> },
              {
                path: ':paperId',
                id: 'paper',
                element: <Paper />,
                loader: paperLoader,
                children: [
                  {
                    index: true,
                    element: <PaperItem />,
                  },
                  {
                    path: 'edit',
                    element: <PaperForm />,
                  },
                  {
                    path: 'reprod/:reprodId',
                    element: <Reprod />,
                  },
                ],
              },
            ],
          },
          {
            path: '/submit-paper',
            element: <SubmitPaper />,
          },
          {
            path: '/submit-reproduction/:paperId?',
            element: <SubmitReprod />,
          },
          // {
          //   path: '/admin',
          //   element: <Admin />,
          // },
          // {
          //   path: '/users/:userId',
          //   element: <Users />,
          // },
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
                path: '/users/:userId/papers/:paperId?',
                element: <UserPapers />,
              },
              {
                path: '/users/:userId/reproductions/:reprodId?',
                element: <UserReprods />,
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

  return <RouterProvider router={router} />
}

export default App
