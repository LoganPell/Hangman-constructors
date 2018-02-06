var Letter = require('./letter.js');

function Word(wrd) {
	var that = this;
	this.word = wrd;
	this.letters = [];
  	this.wordFound = false;
  	//Push new letters
	this.getLets = function() {
    	for(var i = 0; i<that.word.length; i++){
    		var newLetter = new Letter(that.word[i]);
    		this.letters.push(newLetter);
    	}
  	};
  	//Word validation
  	this.didWeFindTheWord = function() {
    	if (this.letters.every(function(lttr) {
      		return lttr.appear === true;
    	})){
      		this.wordFound = true;
      		return true;
    		}
  	};
  	//Letter Validation
  	this.checkIfLetterFound = function(guessedLetter) {
    	var whatToReturn = 0;

    	this.letters.forEach(function(lttr){
      		if(lttr.letter === guessedLetter){
        	lttr.appear = true;
        	whatToReturn++;
      		}
    	})
    	return whatToReturn;
  	};
  	//Word Display
  	this.wordRender = function() {
    	var display = '';
    
    	that.letters.forEach(function(lttr){
      	var currentLetter = lttr.letterRender();
      	display+= currentLetter;
    	});

    	return display;
  	};
}

//Export to use in index.js
module.exports = Word;