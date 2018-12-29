window.onload = function () {


	'use strict';



	var controlsElementsHeight = document.querySelector('.controls-adj-height');
	var interactiveElementsHeight = document.querySelector('.interactive-adj-height');
	var interactionElementsHeight = document.querySelector('.interaction-adj-height');

	var audioQuestion = document.querySelectorAll('.audio-question');

	var btnNext = document.querySelectorAll('.btn-click-next');
	var btnPrev = document.querySelectorAll('.btn-click-prev');
	var btnStart = document.querySelectorAll('.btn-click-start');
	var answer = document.querySelectorAll('.answer-field');

	var firstFlag = true;

	var corectAudio = document.querySelectorAll('.corect-audio .audio-answer');
	var wrongAudio = document.querySelectorAll('.wrong-audio .audio-answer');
	var finalAudio = document.querySelectorAll('.final-audio .audio-answer');
	var clickAudio = document.querySelectorAll('.click-audio .audio-answer');
	var corectAudioBoom = document.querySelectorAll('.corect-audio-with-boom .audio-answer');
	var wrongAudioBoom = document.querySelectorAll('.wrong-audio-with-boom .audio-answer');


	var dots = document.querySelectorAll('.dots-wrapper .dot');
	var progressDots = document.querySelector('.dots-wrapper .progress');
	var widthContainerOfDots = window.getComputedStyle(document.querySelector('.dots-wrapper')).width;
	var progressWidth = 0;
	var path = parseInt(widthContainerOfDots) / (dots.length - 1);


	var imgAnswer = document.querySelectorAll('.block-imgs img');


	var addField = document.querySelectorAll('.add-field');
	var btnAdd = document.querySelectorAll('.btn-add');


	var leftMouse = document.querySelector('#left-mouse');
	var rightMouse = document.querySelector('#right-mouse');


	var scriptOfAnswer = {
		counter: 0,
		bool: [
			[false, true, false],
			[false, true, false],
			[false, true, false],
			[false, true, false],
			[false, true, false],
		],
		sel: [controlsElementsHeight, interactiveElementsHeight, interactionElementsHeight]
	};




	setMaxHeight(controlsElementsHeight, interactiveElementsHeight, interactionElementsHeight);




	(function () { //Вешаем слушатели
		for (var l = 0; l < btnNext.length; l++) {
			btnNext[l].addEventListener('click', function () {
				var el = this;
				hoverNav(el);
				changeField();
			});
		}

		for (var w = 0; w < btnPrev.length; w++) {
			btnPrev[w].addEventListener('click', function () {
				var el = this;
				hoverNav(el);
				changeFieldPrev();
				resetAddElement();
			});
		}
		for (var m = 0; m < btnStart.length; m++) {
			btnStart[m].addEventListener('click', function () {
				var el = this;
				hoverNav(el);
				playAudio();
				resetAnswer();
				resetAddElement();
			});
		}

		for (var k = 0; k < answer.length; k++) {
			answer[k].addEventListener('click', checkAnswer);
		}

		if (scriptOfAnswer.counter === 0) { //Скрываем предыдущую кнопку
			hidePrev();
		}




		for (var m = 0; m < btnAdd.length; m++) {
			btnAdd[m].addEventListener('touchstart', function (event) {
				event.preventDefault();
				var self = this;
				setTimeout(function () {
					self.previousElementSibling.classList.remove('op-n');
				}, 300);

				this.hidden = true;
				var elemUnder = document.elementFromPoint(event.changedTouches[0].clientX, event.changedTouches[0].clientY);

				if (elemUnder.children.length > 0) {
					if (elemUnder.firstElementChild.classList.contains('green-svg')) {
						elemUnder.firstElementChild.classList.remove('green-svg');
					}
				}


				this.hidden = false;

			});
		}

		/* 	for (var x = 0; x < btnAdd.length; x++) {
				btnAdd[x].addEventListener('touchmove', function (event) {
					event.preventDefault();
					this.hidden = false;
				});
			} */



		for (var h = 0; h < btnAdd.length; h++) { //Находим элемент под переносимым сыром
			btnAdd[h].addEventListener('touchend', function (event) {
				event.preventDefault();
				this.classList.remove('check-add');
				var data = this.getAttribute('data-drag');

				this.hidden = true;
				var elemUnder = document.elementFromPoint(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
				if (elemUnder.getAttribute('id') === 'right-mouse') {
					elemUnder.currentTime = 0;
					elemUnder.play();
				}
				if (elemUnder.parentElement.hasAttribute('data-drag')) {

					if (elemUnder.parentElement.getAttribute('data-drag') === data) {
						elemUnder.firstElementChild.classList.add('green-svg');
						var coordinates = choiceCoords(data);
						//this.style.transform = 'translate(' + coordinates.left + '%, ' + coordinates.top + '%)';
						setTimeout(() => {
							this.style.top = coordinates.top + 'vw';
							this.style.left = coordinates.left + 'vw';
						}, 0);

						startAnimation(leftMouse);
						corectPlay();

						var green = 0;
						for (var v = 0; v < addField.length; v++) {
							if (addField[v].firstElementChild.firstElementChild.classList.contains('green-svg')) {
								green++;
							}
						}
						if (green === 5) {
							setTimeout(() => {
								finalPlay();
								changeField();
							}, 2000);
						}
					} else {
						elemUnder.firstElementChild.classList.add('red-svg');
						wrongPlay();
						setTimeout(() => {
							elemUnder.firstElementChild.classList.remove('red-svg');
						}, 1000);
					}
				}

				this.hidden = false;

			});
		}

	})()




	function choiceCoords(data) {
		var coords = {
			left: 0,
			top: 0
		};
		switch (data) {
			case '1':
				coords.left = '-9.5';
				coords.top = '-15.5';
				break;
			case '2':
				coords.left = '-32';
				coords.top = '-9.5';
				break;
			case '3':
				coords.left = '0';
				coords.top = '-36.5';
				break;
			case '4':
				coords.left = '-33.5';
				coords.top = '-43.5';
				break;
			case '5':
				coords.left = '-3';
				coords.top = '-53.5';
				break;
		}
		return coords;
	}



	function showPrev() { //Показываем предыдущую кнопку
		btnPrev[0].classList.remove('d-n');
	}

	function showNext() { //Показываем следующую кнопку
		btnNext[0].classList.remove('d-n');
	}

	function hidePrev() { //Скрываем предыдущую кнопку
		btnPrev[0].classList.add('d-n');
	}

	function hideNext() { //Скрываем следующую кнопку
		btnNext[0].classList.add('d-n');
	}


	function hoverNav(el) { //Ховер эффект для навигации
		el.classList.add('hover-nav-border');
		el.firstElementChild.classList.add('hover-nav-csg');
		setTimeout(function () {
			el.classList.remove('hover-nav-border');
			el.firstElementChild.classList.remove('hover-nav-csg');
		}, 200);
	}



	function playAudio() { //Запуск аудио с начала
		audioQuestion[scriptOfAnswer.counter].currentTime = 0.0;
		audioQuestion[scriptOfAnswer.counter].play();
	}


	function changeFieldStart() { //Вернуть поля в начальное положение
		for (var i = 0; i < scriptOfAnswer.sel.length; i++) {

			if (scriptOfAnswer.bool[scriptOfAnswer.counter][i]) {
				var childElement = scriptOfAnswer.sel[i].children;
				for (var k = 0; k < childElement.length; k++) {
					if (childElement[k].classList.contains('op')) {
						childElement[0].classList.add('dis', 'op');
						childElement[k].classList.remove('dis', 'op');
						break;
					}
				}
			}
		}
		for (var m = 0; m < audioQuestion.length; m++) {
			audioQuestion[m].pause();
		}
		scriptOfAnswer.counter = 0;
		playAudio();

		resetAnswer(); //Очищаем все ответы
		resetAddElement(); //Возвращаем перемещенные элементы назад
	}

	function changeFieldPrev() { //Поменять поля на предыдущие
		scriptOfAnswer.counter--;
		for (var i = 0; i < scriptOfAnswer.sel.length; i++) {

			if (scriptOfAnswer.bool[scriptOfAnswer.counter][i]) {
				var childElement = scriptOfAnswer.sel[i].children;
				for (var k = 0; k < childElement.length; k++) {
					if (childElement[k].classList.contains('op')) {
						childElement[k].previousElementSibling.classList.add('dis', 'op');
						childElement[k].classList.remove('dis', 'op');
						break;
					}
				}
			}
		}
		audioQuestion[scriptOfAnswer.counter].pause();
		//playAudio();

		resetAnswer(); //Очищаем все ответы
		resetAddElement();
		prevDot();
		showNext();
		if (scriptOfAnswer.counter === 0) {
			hidePrev();
		}
	}

	function changeField() { //Поменять поля на следующие
		for (var i = 0; i < scriptOfAnswer.sel.length; i++) {

			if (scriptOfAnswer.bool[scriptOfAnswer.counter][i]) {
				var childElement = scriptOfAnswer.sel[i].children;
				for (var k = 0; k < childElement.length; k++) {
					if (childElement[k].classList.contains('op')) {
						childElement[k].nextElementSibling.classList.add('dis', 'op');
						childElement[k].classList.remove('dis', 'op');
						break;
					}
				}
			}
		}
		audioQuestion[scriptOfAnswer.counter].pause();
		scriptOfAnswer.counter++;
		playAudio();
		nextDot();
		showPrev();
		if (scriptOfAnswer.bool.length - 2 === scriptOfAnswer.counter) {
			hideNext();
		}
	}





	function nextDot() {
		var counter = scriptOfAnswer.counter;
		dots[counter].classList.add('active', 'a-color');
		dots[counter - 1].classList.remove('active');
		progressWidth += path;
		progressDots.style.width = (progressWidth * 98) / parseInt(widthContainerOfDots) + '%';
	}



	function prevDot() {
		var counter = scriptOfAnswer.counter;
		dots[counter].classList.add('active', 'a-color');
		dots[counter + 1].classList.remove('active', 'a-color');
		progressWidth -= path;
		progressDots.style.width = (progressWidth * 98) / parseInt(widthContainerOfDots) + '%';
	}








	function checkAnswer() { //Ответ на вопрос
		this.classList.add('op');

		if (this.firstElementChild.hasAttribute('data-answer')) {
			var data = this.firstElementChild.getAttribute('data-answer');
			var img = document.querySelector('.block-imgs img[data-answer="' + data + '"]');

			img.classList.remove('animate');
			void img.offsetWidth; // reflow hack
			img.classList.add('animate');
		}


		var self = this;
		if ((this.firstElementChild.getAttribute('src') === 'yes.png') && (scriptOfAnswer.counter == scriptOfAnswer.bool.length - 1)) {

			setTimeout(function () {
				finalPlay();
				changeField();
			}, 1200);

		} else if (this.firstElementChild.getAttribute('src') === 'yes.png') {
			corectPlayBoom();
			setTimeout(function () {
				self.classList.remove('op');
				changeField();
			}, 2000);
		} else {
			wrongPlayBoom();
			setTimeout(function () {
				self.classList.remove('op');
			}, 1000);
		}
	}



	function corectPlay() { // Запустить случайное аудио с правильным ответом
		var randomAudio = randomInteger(0, corectAudio.length - 1);
		stopAllAudio();
		corectAudio[randomAudio].play();
	}

	function wrongPlay() { // Запустить случайное аудио с неправильным ответом
		var randomAudio = randomInteger(0, wrongAudio.length - 1);
		stopAllAudio();
		wrongAudio[randomAudio].play();
	}

	function finalPlay() { // Запустить случайное аудио с конечным ответом
		var randomAudio = randomInteger(0, finalAudio.length - 1);
		stopAllAudio();
		finalAudio[randomAudio].play();
	}

	function clickPlay() { // Запустить случайное аудио с кликом на ответ
		var randomAudio = randomInteger(0, clickAudio.length - 1);
		stopAllAudio();
		clickAudio[randomAudio].play();
	}



	function corectPlayBoom() { // Запустить случайное аудио с равильным ответом boom
		var randomAudio = randomInteger(0, corectAudioBoom.length - 1);
		stopAllAudio();
		corectAudioBoom[randomAudio].play();
	}

	function wrongPlayBoom() { // Запустить случайное аудио с неправильным ответом boom
		var randomAudio = randomInteger(0, wrongAudioBoom.length - 1);
		stopAllAudio();
		wrongAudioBoom[randomAudio].play();
	}






	function randomInteger(min, max) { //Случайное целое
		var rand = min - 0.5 + Math.random() * (max - min + 1);
		rand = Math.round(rand);
		return rand;
	}


	function stopAllAudio() { //Остановить все аудио на странице
		var allAudio = document.querySelectorAll('audio');
		for (var k = 0; k < allAudio.length; k++) {
			allAudio[k].currentTime = 0;
			allAudio[k].pause();
		}
	}

	function resetAnswer() { //Очистить поля с ответами
		for (let i of imgAnswer) {
			i.classList.remove('animate');
		}

		for (var k = 0; k < answer.length; k++) {
			answer[k].classList.remove('op');
		}
	}

















	function resetAddElement() { //Возвращаем перемещенные элементы назад
		for (var h = 0; h < btnAdd.length; h++) {
			btnAdd[h].style.transition = 'all .3s ease';
			btnAdd[h].style.left = 1.5 + 'vw';
			btnAdd[h].style.top = 1.5 + 'vw';
			btnAdd[h].classList.add('op-n');
		}
		setTimeout(function () {
			for (var i = 0; i < btnAdd.length; i++) {
				btnAdd[i].style.transition = '';
			}
		}, 300);
		btnAdd[btnAdd.length - 1].classList.remove('op-n');

		for (var b = 0; b < addField.length; b++) {
			addField[b].firstElementChild.firstElementChild.classList.remove('green-svg');
		}

	}



	function startAnimation(elem) {
		elem.currentTime = 0;
		elem.play();
	}




	function getCoords(elem) { //Получение координат элемента
		var box = elem.getBoundingClientRect();

		return {
			top: box.top + pageYOffset,
			left: box.left + pageXOffset
		};

	}





	function setFirstElement() { //Показываем первые элементы
		for (var k = 0; k < arguments.length; k++) {
			var childElement = arguments[k].children;
			for (var i = 0; i < childElement.length; i++) {
				if (!(i === 0)) {
					childElement[i].style.display = 'none';
				} else {
					childElement[i].classList.add('dis', 'op');
				}
			}
		}
		firstFlag = false;
		//audioQuestion[scriptOfAnswer.counter].play(); //Запускаем первое аудио
	}

	function setDisplay() {
		for (var k = 0; k < arguments.length; k++) {
			var childElement = arguments[k].children;
			for (var i = 0; i < childElement.length; i++) {
				childElement[i].style.display = 'block';
			}
		}
		setMaxHeight(controlsElementsHeight, interactiveElementsHeight, interactionElementsHeight);
	}

	function setNextElements() {
		for (var k = 0; k < arguments.length; k++) {
			var childElement = arguments[k].children;
			for (var i = 0; i < childElement.length; i++) {
				if (!childElement[i].classList.contains('op')) {
					childElement[i].style.display = 'none';
				}
			}
		}
	}


	//Выравнивание элементов по высоте

	function setMaxHeight() {
		for (var i = 0; i < arguments.length; i++) {
			var childElement = arguments[i].childNodes;
			var maxHeight = 0;
			for (var k = 0; k < childElement.length; k++) {
				var heightBlock = childElement[k].clientHeight;
				if (heightBlock > maxHeight) {
					maxHeight = heightBlock;
				}
			}
			arguments[i].style.height = maxHeight + 'px';
		}
		if (firstFlag) {
			setFirstElement(controlsElementsHeight, interactiveElementsHeight, interactionElementsHeight);
		} else {
			setNextElements(controlsElementsHeight, interactiveElementsHeight, interactionElementsHeight);
		}
	}

	window.onresize = function () {
		//window.onload = function () {
		setDisplay(controlsElementsHeight, interactiveElementsHeight, interactionElementsHeight);
		//}
	}
	//Выравнивание элементов по высоте end



};