import { handleStatus, sortArray } from "./utils.js"

const API = `https://raw.githubusercontent.com/murichristopher/quiz-gameDATA/main/quizData.js`
const quizContainer = document.querySelector('.quiz-container')
function getData(){
  
  return fetch(API)
  .then(handleStatus)
  .then(configureData)
  .catch(err => {console.log(err)})

}

function configureData(quizData){

  setTimeout(() => {
    loadingElement.classList.add('hidded')
    const quizGame = new Quiz(sortArray(quizData));
    quizGame.initializeQuizElements()

  }, 1000)
}


class Quiz{
  constructor(data){
    this.quizData = data
    this.currentQuizQuestion = 0;
    this.question = ['a','b','c','d']
    this.playerPoints = [];
  }

  static createQuestionElements(){

    const questionContainer = document.createElement('div');
    questionContainer.id = ''
    questionContainer.className = 'question-container container'
    questionContainer.innerHTML = `
      <div class="question-counter">
      </div>

      <h2 id="question-title">Question</h2>

      <ul class="quiz-all-options">
        <li class='question-option'>

        </li>
        <li class='question-option'>
         
        </li>
        <li class='question-option'>
          
        </li>
        <li class='question-option'>
     
        </li>
      </ul>
    </div>

    `
    return questionContainer
  }

  initializeQuizElements(){
    
    const fromClone = document.querySelector('.quiz-container');
    const questionContainer = Quiz.createQuestionElements();
    questionContainer.id = this.currentQuizQuestion
    fromClone.appendChild(questionContainer)

    this.initializeCounter()
    this.startQuizQuestion()

  }

  initializeCounter(){
    

    this.quizData.forEach((value, index) => {
      const questionCounter = document.querySelector('.question-counter')
      const questionCounterNumber = document.createElement('div');
      
      index == this.currentQuizQuestion ?
      questionCounterNumber.classList = 'question-counter-number question-active' :
      questionCounterNumber.classList = 'question-counter-number'

      questionCounterNumber.innerHTML = `
        <h3>${index + 1}</h3>
      `
      questionCounter.appendChild(questionCounterNumber)
    });

    const questionCounter = document.querySelectorAll('.question-counter-number')

    this.playerPoints.forEach((userPoint, index) => {
      questionCounter[index].className += ' answr' + this.playerPoints[index]
    })
  }


  startQuizQuestion(){

    const questionTitle = document.querySelector('#question-title')
    const quizOptions = document.querySelectorAll('.question-option')
    const actualQuestionArray = this.quizData[this.currentQuizQuestion]

    questionTitle.innerText = actualQuestionArray.question

    this.question.forEach((letter , index) => {
      quizOptions[index].id = this.question[index]
      quizOptions[index].innerText = actualQuestionArray[letter];
    })

    this.eventListeners()

  }

  eventListeners(){
    const questionContainer = document.querySelector('.question-container')
    questionContainer.addEventListener('click', e => {
        if(e.target.className == 'question-option') {
          
          e.target.className += ' option-selected';

          const quizOptions = document.querySelectorAll('.question-option')
          quizOptions.forEach(quizOption => {
            if(!quizOption.className.includes('option-selected')){
              quizOption.classList.add('not-selected')
            }
          })
          const questionCounterActive = document.querySelector('.question-active');


          if(e.target.id == this.quizData[this.currentQuizQuestion].correct) {
            questionCounterActive.classList.add('answr1')
            e.target.className = 'question-option answr1 noHover'
            this.playerPoints.push(1)

          }else{
            questionCounterActive.classList.add('answr0')
            e.target.className = 'question-option answr0 noHover'
            this.playerPoints.push(0)
          }          


          

            return setTimeout(() => {
              if(this.currentQuizQuestion + 1 < this.quizData.length){
                //if game is not over
                
                this.currentQuizQuestion++
                quizContainer.firstElementChild.remove()
                this.initializeQuizElements()
              }else{
                quizContainer.firstElementChild.remove()
                this.displayGameOver()
              }
             
            }, 600)
            



 
        }
    })



  }

  displayGameOver(){
    const gameFinalResults = this.calcGameResults();
    const gameOverContainer = document.querySelector('.game-over-container');
    const gameOverPercentCount = gameOverContainer.querySelector('.game-percent');

    gameOverContainer.classList.remove('hidded');

    gameOverPercentCount.style.width = gameFinalResults.percentageOfCorrectAnswers+'%'

    gameOverPercentCount.innerHTML = `
      <h3>${gameFinalResults.percentageOfCorrectAnswers}%</h3>
    `
    gameOverPercentCount.style.animation = 'myMove 3s forwards' ; 

    this.displayGameFinalInfos(gameFinalResults)

    
  }

  displayGameFinalInfos(gameFinalResults){

    const gameOverInfo = document.querySelector('.game-over-info');
    const gamePercentage = gameFinalResults.percentageOfCorrectAnswers;
    const gameTotalQuestions = gameFinalResults.totalQuestions;
    const gameCorrectAnswers = gameFinalResults.correctAnswers

    if(gamePercentage == 100){
      gameOverInfo.children[0].innerText = `Amazing, you answered ${gameCorrectAnswers} of ${gameTotalQuestions} questions correctly!`
      gameOverInfo.children[1].innerText = `How about challenging your friends and see if they do as well as you?`
      return
    }

    gameOverInfo.children[0].innerText = `You answered ${gameCorrectAnswers} of ${gameTotalQuestions} questions correctly!`
    gameOverInfo.children[1].innerText = `How about trying one more time? Maybe you can hit all of the questions!`
    return

  }

  calcGameResults(){
    const totalQuestions = this.playerPoints.length
    const correctAnswers = this.playerPoints.reduce((cur, val) => cur + val, 0);
    const wrongAnswers = totalQuestions - correctAnswers;
    const percentageOfCorrectAnswers = parseInt((correctAnswers / totalQuestions ) * 100)

    return {
      totalQuestions: totalQuestions,
      correctAnswers: correctAnswers,
      wrongAnswers: wrongAnswers,
      percentageOfCorrectAnswers: percentageOfCorrectAnswers
    }
  }

}

const startGameContainer = document.querySelector('.start-game-container');
const buttonStart = document.querySelector('#buttonStart');
const buttonRestart = document.querySelector('#buttonRestart')
const loadingElement = document.querySelector('.loading-container ')

buttonStart.addEventListener('click', e => {
  startGameContainer.classList.add('hidded');
  loadingElement.classList.remove('hidded')
  getData();
})

buttonRestart.addEventListener('click', () => {
  location.reload();
})





  


 
