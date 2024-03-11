import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'

import { FirebaseContext, firebase } from './firebase'
import { AlgoliaContext, algolia } from './algolia'
import App from './components/App'

// bootstrap
import './main.scss'
import 'bootstrap'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FirebaseContext.Provider value={firebase}>
      <AlgoliaContext.Provider value={algolia}>
        <App />
        <Toaster />
      </AlgoliaContext.Provider>
    </FirebaseContext.Provider>
  </React.StrictMode>
)
