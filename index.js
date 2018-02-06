
//require inquirer
var inquirer = require('inquirer');
var isLetter = require('is-letter');
//require objects/exports
var Word = require('./word.js');

//set the maxListener
require('events').EventEmitter.prototype._maxListeners = 100;


var hangman = {
  wordBank: ["DAENERYS TARGARYEN",
    "JON SNOW",
    "CERSEI LANNISTER",
    "KHAL DROGO",
    "TYRION LANNISTER",
    "SANSA STARK",
    "PETYR BAELISH"],
  guessesRemaining: 10,

  guessedLetters: [],

  display: 0,
  currentWord: null,

  startGame: function() {
    var that = this;
    if(this.guessedLetters.length > 0){
      this.guessedLetters = [];
    }

    inquirer.prompt([{
      name: "play",
      type: "confirm",
      message: "Ready to play?"
    }]).then(function(answer) {
      if(answer.play){
        that.newGame();
      } else{
        console.log("Fine, I didn't want to play anyway..");
      }
    })},
  //Game reset
  newGame: function() {
    if(this.guessesRemaining === 10) {
      console.log("Guess a Game of Thrones Character");
      console.log('*****************');

      var randNum = Math.floor(Math.random()*this.wordBank.length);
      this.currentWord = new Word(this.wordBank[randNum]);
      this.currentWord.getLets();

      console.log(this.currentWord.wordRender());
      this.keepPromptingUser();
    } else{
      this.resetGuessesRemaining();
      this.newGame();
    }
  },
  //Guess reset
  resetGuessesRemaining: function() {
    this.guessesRemaining = 10;
  },
  //Continue to run game
  keepPromptingUser : function(){
    var that = this;
    inquirer.prompt([{
      name: "chosenLtr",
      type: "input",
      message: "Choose a letter:",
      validate: function(value) {
        if(isLetter(value)){
          return true;
        } else{
          return false;
        }
      }
    }]).then(function(ltr) {
      var letterReturned = (ltr.chosenLtr).toUpperCase();
      var guessedAlready = false;
        for(var i = 0; i<that.guessedLetters.length; i++){
          if(letterReturned === that.guessedLetters[i]){
            guessedAlready = true;
          }
        }
        if (guessedAlready === false) {
          that.guessedLetters.push(letterReturned);
          //correct letter choice
          var found = that.currentWord.checkIfLetterFound(letterReturned);
          if (found === 0) {
            console.log('Nope! You guessed wrong.');
            that.guessesRemaining--;
            that.display++;
            console.log('Guesses remaining: ' + that.guessesRemaining);
            //Building the word
            console.log('\n*******************');
            console.log(that.currentWord.wordRender());
            console.log('\n*******************');
            //Display letters guessed
            console.log("Letters guessed: " + that.guessedLetters);
          } else {
              console.log('Yes! You guessed right!');
              if (that.currentWord.didWeFindTheWord() === true) {
                console.log(that.currentWord.wordRender());
                console.log('Congratulations! You won the game!!!');
              } 
              //Render letters guessed
              else 
              {
                console.log('Guesses remaining: ' + that.guessesRemaining);
                console.log(that.currentWord.wordRender());
                console.log('\n*******************');
                console.log("Letters guessed: " + that.guessedLetters);
              }
          }
          if (that.guessesRemaining > 0 && that.currentWord.wordFound === false) {
            that.keepPromptingUser();
          }
          //Game over display
          else if (that.guessesRemaining === 0) {
            console.log('Game over!');
            console.log('The word you were guessing was: ' + that.currentWord.word);
          }
        } 
        //Letter already guessed
        else {
            console.log("You've guessed that letter already. Try again.")
            that.keepPromptingUser();
          }
    });
  }
}

hangman.startGame();