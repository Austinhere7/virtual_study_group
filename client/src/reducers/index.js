import { combineReducers } from "redux"
import alert from "./alert"
import auth from "./auth"
import notes from "./notes"
import questions from "./questions"
import feedback from "./feedback"
import studySessions from "./studySessions"

export default combineReducers({
  alert,
  auth,
  notes,
  questions,
  feedback,
  studySessions,
})

