import {
  SELECT_LANGUAGE, 
  COMPLETE_TUTORIAL,
  PROVIDE_NEW_INPUT,
  GET_NEW_WORDS,
  ENTER_SETTINGS,
  EXIT_SETTINGS,
  SET_MAX_NUM_RAND_WORDS,
 } from './actions';

// the initial state of the tree
const getInitialState = () => {
  var language = localStorage.getItem("language");
  var voice = localStorage.getItem("voice");
  var didTutorial = localStorage.getItem("didTutorial");
  var numWords = localStorage.getItem("numWords");
  var userInput = localStorage.getItem("userInput");
  var randWords = localStorage.getItem("randWords");
  var maxNumRandWords = localStorage.getItem("maxNumRandWords");

  // daily goals
  // var cur_time = Date.now();
  // var dailyGoal = 5;
  // var dailyGoal = localStorage.getItem("dailyGoal");

  //FUTURE ADDITION: more language options & levels
  //var level = localStorage.getItem("level");

  var initState = {
    "language": language,
    "voice": voice,
    "didTutorial": didTutorial,
    "numWords": numWords,
    "userInput": userInput,
    "randWords": randWords,
    "maxNumRandWords": maxNumRandWords,
    "settings": false,
    //FUTURE ADDITION: more language options & levels
    //"level": level
  };

  return initState;
}

// A reducing function that returns the next state tree, given the current state tree and an action to handle
// Uses the object.assign property to merge the state changes to the existing state and finally assign it to a new blank target object 
export const rootReducer = (state = getInitialState(), action) => {
  switch (action.type){
    case SELECT_LANGUAGE:
      return Object.assign({}, state, {
        language: action.language,
        voice: action.voice
      })
    case COMPLETE_TUTORIAL:
      return Object.assign({}, state, {
        didTutorial: "true"
      })
    case GET_NEW_WORDS:
      return Object.assign({}, state, {
        userInput: "",
        randWords: action.words,
        numWords: action.num 
      })
    case PROVIDE_NEW_INPUT:
      return Object.assign({}, state, {
        userInput: action.input
      })
    case ENTER_SETTINGS:
      return Object.assign({}, state, {
        settings: true
      })
    case EXIT_SETTINGS:
      return Object.assign({}, state, {
        settings: false
      })
    case SET_MAX_NUM_RAND_WORDS:
      return Object.assign({}, state, {
        maxNumRandWords: action.maxNumRandWords
      })
    // action type not recognized, do not change the current state
    default:
      return state;
  }
}
