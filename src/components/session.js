import React from "react";
import '../index.css';
import "regenerator-runtime/runtime.js";
import { connect } from 'react-redux';
import { getNewWords, provideNewInput } from "../actions";
import { checkInput, resetWords } from "../functionalities";
import Footer from "./footer";

class Session extends React.Component {
  constructor(props){
    super(props);
    
    var charCount = this.props.userInput.length;
    var noHover = Array(parseInt(this.props.numWords)).fill(false);

    this.state = { 
      isClicked: noHover,
      charCount: charCount,
      hasSubmitted: false,
      errors: []
    }

    this.reset = this.reset.bind(this);
    this.translationToggle = this.translationToggle.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
    this.validateSubmission = this.validateSubmission.bind(this);
    this.playAudio = this.playAudio.bind(this);
  }

  reset () {
    var newSessionParams = resetWords(parseInt(this.props.maxNumRandWords));

    localStorage.setItem("numWords", newSessionParams.numWords);
    localStorage.setItem("userInput", "");
    localStorage.setItem("randWords", newSessionParams.randWords);

    var noHover = Array(parseInt(newSessionParams.numWords)).fill(false);

    this.setState(() => {
      return { 
        isClicked: noHover,
        charCount: 0,
        hasSubmitted: false,
        errors: []
      }
    });

    this.props.dispatch(getNewWords(newSessionParams.randWords, newSessionParams.numWords));
  }

  translationToggle(indexToSwitch) {
    this.setState((state) => {
      const isClicked = state.isClicked.map((item,i) => {
        if (indexToSwitch === i) {return !item;}
        else {return item;}
      });
      return {isClicked};
    });
  }

  handleUserInput(event){
    var input = event.target.value;
    this.setState({
      charCount: input.length
    });
    localStorage.setItem("userInput",input);
    this.props.dispatch(provideNewInput(input));
  }

  validateSubmission() {
    var checkPromise = checkInput(this.props.userInput, this.props.randWords);
    checkPromise.then((errList) => {
      this.setState({
        hasSubmitted: true,
        errors: errList
      });
    });
  }

  playAudio() {
    responsiveVoice.speak(this.props.userInput,this.props.voice);
  }

  render() {
    var randWordsObj = JSON.parse(this.props.randWords)
    var randWordsObjKeys = Object.keys(randWordsObj);
    var randWordsObjList = [];
    randWordsObjKeys.map((k) => {
      randWordsObjList.push(randWordsObj[k]);
    })

    const randWordList = randWordsObjList.map((randWord, i) =>(
      <li>
        <button onClick={() => this.translationToggle(i)}>
          {this.state.isClicked[i] ? randWord.translation : randWord.word}
        </button>
      </li>
    ));

    let feedbackMessage;
    if (!this.state.hasSubmitted){
      feedbackMessage = 
      <div id="settings-btn-row">
        <button id="submit" onClick={this.validateSubmission}>Check!</button>
        <button id="skip" onClick={this.reset}>skip</button>
      </div>
    }
    else if(this.state.errors.length == 0){
      feedbackMessage = <>
        <p className="feedbackText" id="passed">Well done!</p>
        <br />
        <button id="submit" onClick={this.reset}>More Words!</button>
      </>
    }
    else {
      var errorsDisplay = this.state.errors.map(err => (
        <>
          <p id="mistake" className="feedbackText">{err.message}</p>
          <p className="feedbackText">Mistake: <span id="mistake">{err.mistake}</span></p>
          <p className="feedbackText"><span>Suggestions: </span> 
            { err.suggestions.length == 0 
              ? <span id="mistake">No matches found :/</span>
              : err.suggestions.map((e, i) => [
                i > 0 && ", ",
                <span id="passed">{e}</span>
              ])
            }
          </p>
          <br />
        </>
      ));
      feedbackMessage = <>
        {errorsDisplay}
        <br />
        <div id="settings-btn-row">
          <button id="submit" onClick={this.validateSubmission}>Check!</button>
          <button id="skip" onClick={this.reset}>skip</button>
        </div>
      </>
    }
    return (
    <>
      <div id="header">
        <h1>Mumbo Jumbo!</h1>
      </div>
      <p> Create a sentence in {this.props.language} that contains the following words:</p>
      <ul>{randWordList}</ul>
      <div>
        <textarea value={this.props.userInput} onChange={this.handleUserInput} spellcheck="false" maxlength="128"/>
        <p id="charCount">{this.state.charCount}/128</p>
        <input id="audio-btn" type="image" src="../../assets/speaker24.png" alt="Play!" onClick={this.playAudio} />
      </div>
      <br />
      {feedbackMessage}
      <hr />
      <Footer />
    </>
    );
  }
}

const mapStateToProps = (state) => ({
  language: state.language,
  voice: state.voice,
  numWords: state.numWords,
  userInput: state.userInput,
  randWords: state.randWords,
  maxNumRandWords: state.maxNumRandWords
})

export default connect(mapStateToProps)(Session);
