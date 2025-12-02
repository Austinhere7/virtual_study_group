"use client"

import React from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { Provider } from "react-redux"
import store from "./store"
import { loadUser } from "./actions/auth"
import setAuthToken from "./utils/setAuthToken"

// Components
import Navbar from "./components/layout/Navbar"
import Landing from "./components/layout/Landing"
import Register from "./components/auth/Register"
import Login from "./components/auth/Login"
import Alert from "./components/layout/Alert"
import Dashboard from "./components/dashboard/Dashboard"
import VideoCall from "./components/video-call/VideoCall"
import Notes from "./components/notes/Notes"
import Feedback from "./components/feedback/Feedback"
import Questions from "./components/questions/Questions"
import QuestionDetail from "./components/questions/QuestionDetail"
import Schedule from "./components/schedule/Schedule"
import PrivateRoute from "./components/routing/PrivateRoute"

// Check for token
if (localStorage.token) {
  setAuthToken(localStorage.token)
}

const App = () => {
  React.useEffect(() => {
    store.dispatch(loadUser())
  }, [])

  return (
    <Provider store={store}>
      <Router>
        <div className="app">
          <Navbar />
          <Alert />
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
            <PrivateRoute exact path="/video-call" component={VideoCall} />
            <PrivateRoute exact path="/notes" component={Notes} />
            <PrivateRoute exact path="/feedback" component={Feedback} />
            <PrivateRoute exact path="/questions" component={Questions} />
            <PrivateRoute exact path="/questions/:id" component={QuestionDetail} />
            <PrivateRoute exact path="/schedule" component={Schedule} />
          </Switch>
        </div>
      </Router>
    </Provider>
  )
}

export default App

