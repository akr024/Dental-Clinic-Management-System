import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import PersonalPage from './page/PersonalPage.jsx'

import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import MainPage from './page/MainPage.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <MainPage /> },
      { path: "/personal-page", element: <PersonalPage /> }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
