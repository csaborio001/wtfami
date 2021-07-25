wtfAMI = {
	init: function(quizInfo) {
		this.parseJson(quizInfo);
		this.toggleMode();
	},
	parseJson: function(quizPath) {
		fetch(quizPath)
			.then( response => {
				return response.json();
			})
			.catch( message => {
				console.log(message);
			})
			.then( json => {
				this.setupActionBtnEvent(json.data, json.config.id);
			});
	},
	setupActionBtnEvent: function(quizInfoArray,quizID) {
		const actionButton = document.getElementById('action');
		actionButton.addEventListener('click', () => {
			this.loadNext(quizInfoArray,quizID);
		});
		const clearButton = document.getElementById('clear');
		clearButton.addEventListener('click', () => {
			this.clearQuiz();
		});

	},
	clearQuiz: function() {
		const imageElement = document.getElementById('quiz-image');
		/* Remove so transition to revert image happens quickly. */
		imageElement.classList.remove('image-start');
		imageElement.style.opacity = '0.1';
		imageElement.style = 'filter: blur(90px);width: 10% !important;';
		this.toggleMode();
	},
	loadNext: function(quizInfoArray,quizID) {
		this.toggleMode();
		const actionButton = document.getElementById('action');
		let nextQuestion = null;
		const currentID = actionButton.dataset.current;
		if( currentID === undefined ) { // New Game.
			actionButton.dataset.current = 0;
			nextQuestion = 0;
		} else {
			nextQuestion = parseInt(currentID) + 1;
			actionButton.dataset.current = nextQuestion;
		}
		this.loadQuestion(quizInfoArray[nextQuestion],quizID);
		var tick = new Audio('./audio/tick.mp3');
		tick.play();
	},
	loadQuestion: function(questionObject,quizID) {
		const imageElement = document.getElementById('quiz-image');
		/* Causes the transition */
		imageElement.classList.add('image-start');
		const imageToLoad = `img/${quizID}/${questionObject.image}`;
		imageElement.src = imageToLoad;
		this.startRevealing(imageElement, questionObject.keywords);
	},
	startRevealing: function(imageElement, keywords) {
		var audio = new Audio('./audio/alert.mp3');
		let keywordLength = keywords.length;
		let filterBlurStart = 100;
		let keywordStart = 0;
		let widthStart = 10;
		for(let i = 1; i<=10; i++) {
			window.setTimeout( () => {
				filterBlurStart = filterBlurStart - 10;
				widthStart = widthStart + 10;
				imageElement.style = `filter: blur(${filterBlurStart}px);width: ${widthStart}% !important`;
			}, i * 2000);
			window.setTimeout( () => {
				if( keywordStart<keywordLength ) {
					let red = this.getRandomIntInclusive(0, 255);
					let green = this.getRandomIntInclusive(0, 255);
					let blue = this.getRandomIntInclusive(0, 255);
					const cluesContainer = document.getElementById('clues');
					const clue = document.createElement('div');
					clue.style.color = `rgba(${red},${green},${blue})`;
					clue.innerText = keywords[keywordStart++];
					cluesContainer.appendChild(clue);
					audio.play();
					window.setTimeout( () => {
						clue.classList.add('fadeAway');
					}, 1000);
				}
			}, i * 2500);
		}
	},
	toggleMode: function() {
		const actionButton = document.getElementById('action');
		actionButton.disabled = !actionButton.disabled;
	},
	getRandomIntInclusive: function(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
	}	
}


wtfAMI.init('data/001.json');