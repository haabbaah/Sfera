'use strict';



class Engine {
	constructor() {
		/* Кнопки управления */
		this.prev = document.querySelector('.btn-click-prev'); // Селектор кнопки назад
		this.restart = document.querySelector('.btn-click-start'); // Селектор кнопки перезагрузить
		this.next = document.querySelector('.btn-click-next'); // Селектор кнопки вперед
		this.changeField = document.querySelector('.interactive-field'); // Селектор меняющегося поля

		/* Пагинация */
		this.dots;
		this.widthProgressLine;
		this.progressLine;
		this.path;
		this.progressWidth = 0;

		/* Информация о страницах */
		this._allPages = this.changeField.children.length; //Количество страниц
		this._currentPage = 0; //Текущая страница

		/* Аудио */
		this.audioYes = document.querySelectorAll('.corect-audio-with-boom .audio-answer');
		this.audioNo = document.querySelectorAll('.wrong-audio-with-boom .audio-answer');
		this.allAudio = document.querySelectorAll('audio');
		this.questionAudio = document.querySelectorAll('.audio-question');
	}

	showFirstElement() { //Показать первый дочерний элемент
		this.changeField.firstElementChild.classList.add('d-b');
	}

	showPrevPage() { //Показать предыдущую страницу
		let children = this.changeField.children;
		if (this._currentPage > 0) {
			for (let w = 0; w < children.length; w++) {
				if (children[w].classList.contains('d-b')) {
					children[w].previousElementSibling.classList.add('d-b');
					children[w].classList.remove('d-b');
					break;
				}
			}
			if (this.next.classList.contains('d-n')) {
				this.next.classList.remove('d-n'); //Показываем кнопку вперед
			}
			if (this._currentPage === 1) {
				this.prev.classList.add('d-n'); //Скрываем кнопку назад
			}
			this._currentPage--;
			this.playQuestion();
			this.paginationPrev();
		}
	}

	reloadPage() { //Перезагрузить страницу
		this.playQuestion();
	}

	showNextPage() { //Показать следущую страницу
		let allPages = this._allPages;
		let children = this.changeField.children;
		if (this._currentPage < allPages - 1) {
			for (let w = 0; w < children.length; w++) {
				if (children[w].classList.contains('d-b')) {
					children[w].nextElementSibling.classList.add('d-b');
					children[w].classList.remove('d-b');
					break;
				}
			}
			if (this.prev.classList.contains('d-n')) {
				this.prev.classList.remove('d-n'); //Показываем кнопку назад
			}
			this._currentPage++;
			if (this._currentPage === allPages - 1) {
				this.next.classList.add('d-n'); //Скрываем кнопку вперед
			}
			this.playQuestion();
			this.paginationNext();

		}
	}

	creatPagination() { //Создание пагинации
		let wrapper = document.querySelector('.dots-wrapper');
		let dotHTML = '';
		for (let k = 1; k < this._allPages; k++) {
			if (k === 1) {
				dotHTML += '<div class="dot active a-color"></div>';
			}
			dotHTML += '<div class="dot"></div>';
		}
		dotHTML += '<div class="progress-line"></div>';
		wrapper.insertAdjacentHTML("afterBegin", dotHTML);

		this.dots = document.querySelectorAll('.progress .dot');
		this.widthProgressLine = parseFloat(window.getComputedStyle(document.querySelector('.dots-wrapper')).width);
		this.progressLine = document.querySelector('.progress .progress-line');
		this.path = this.widthProgressLine / (this.dots.length - 1);
	}

	paginationPrev() { //Пагинация назад
		this.dots[this._currentPage].classList.add('active', 'a-color');
		this.dots[this._currentPage].nextElementSibling.classList.remove('active', 'a-color');
		this.progressWidth -= this.path;
		if (this.progressWidth < 0) {
			this.progressWidth = 0;
		}
		this.progressLine.style.width = (this.progressWidth * 98) / this.widthProgressLine + '%';
	}

	paginationNext() { //Пагинация вперед
		this.dots[this._currentPage].classList.add('active', 'a-color');
		this.dots[this._currentPage].previousElementSibling.classList.remove('active');
		this.progressWidth += this.path;
		this.progressLine.style.width = (this.progressWidth * 98) / this.widthProgressLine + '%';
	}

	playYes() { // Запустить случайное аудио с правильным ответом 
		let randomAudio = this.randomInteger(0, this.audioYes.length - 1);
		this.stopAllAudio();
		this.audioYes[randomAudio].play();
	}

	playNo() { // Запустить случайное аудио с неправильным ответом 
		let randomAudio = this.randomInteger(0, this.audioNo.length - 1);
		this.stopAllAudio();
		this.audioNo[randomAudio].play();
	}

	playQuestion() { // Запустить аудио с вопросом
		this.stopAllAudio();
		if (!this.questionAudio[this._currentPage]) { //Если аудиофайл отсутствует
			return;
		}
		this.questionAudio[this._currentPage].play();
	}

	stopAllAudio() { //Остановить все аудио на странице
		for (let k = 0; k < this.allAudio.length; k++) {
			this.allAudio[k].currentTime = 0;
			this.allAudio[k].pause();
		}
	}

	randomInteger(min, max) { //Случайное целое
		let rand = min - 0.5 + Math.random() * (max - min + 1);
		rand = Math.round(rand);
		return rand;
	}

	hoverEffect(selector, time) { //Сделать ховер эффект
		this.classList.add(selector);
		setTimeout(() => {
			this.classList.remove(selector);
		}, time);
	}

	opacityEffect(time) { //Сделать появление и исчезновение
		this.style.opacity = '1';
		setTimeout(() => {
			this.style.opacity = '0';
			this._currentPage--;
		}, time);
	}

}



class Answers extends Engine {
	constructor() {
		super();
		this.answer = document.querySelectorAll('.answer-field');
	}

	checkAnswer(click) { //Проверка вопроса
		if (click.target.classList.contains('answer-yes')) {
			this.playYes();
			setTimeout(() => {
				field.showNextPage();
			}, 2000);
		} else {
			this.playNo();
		}
	}
}


class DragAndDrop extends Engine {
	constructor() {
		super();
	}

}



let field = new Engine();

let answersField = new Answers();

let dragAndDrop = new DragAndDrop();






(function () { //Вешаем слушатели
	for (let d = 0; d < answersField.answer.length; d++) {
		answersField.answer[d].addEventListener('touchstart', function (event) { //Клик на кнопку ответ на вопрос
			if (event.targetTouches.length == 1) {}
			answersField.checkAnswer(event.targetTouches[0]);
			answersField.opacityEffect.call(this, 300);
		}, false);
	}


	field.prev.addEventListener('touchstart', function (event) { //Клик на кнопку назад
		if (event.targetTouches.length == 1) {}
		field.hoverEffect.call(this, 'hover-nav-svg', 200);
		field.showPrevPage();
	}, false);

	field.restart.addEventListener('touchstart', function (event) { //Клик на кнопку перезагрузить
		if (event.targetTouches.length == 1) {
			field.hoverEffect.call(this, 'hover-nav-svg', 200);
			field.reloadPage();
		}
	}, false);

	field.next.addEventListener('touchstart', function (event) { //Клик на кнопку вперед
		if (event.targetTouches.length == 1) {
			field.hoverEffect.call(this, 'hover-nav-svg', 200);
			field.showNextPage();
		}
	}, false);











	field.showFirstElement();
	field.creatPagination();
})();













/* window.onload = function () {


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

	var scriptOfAnswer = {
		counter: 0,
		bool: [
			[false, true, false],
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
			});
		}
		for (var m = 0; m < btnStart.length; m++) {
			btnStart[m].addEventListener('click', function () {
				var el = this;
				hoverNav(el);
				playAudio();
				resetAnswer();
			});
		}

		for (var k = 0; k < answer.length; k++) {
			answer[k].addEventListener('click', checkAnswer);
		}

		if (scriptOfAnswer.counter === 0) { //Скрываем предыдущую кнопку
			hidePrev();
		}

	})()




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










	function checkAnswer(e) { //Ответ на вопрос
		this.classList.add('op');

		var data = this.firstElementChild.getAttribute('data-answer');
		var img = document.querySelector('.block-imgs img[data-answer="' + data + '"]');

		img.classList.remove('animate');
		void img.offsetWidth; // reflow hack
		img.classList.add('animate');


		var self = this;
		if ((this.firstElementChild.getAttribute('src') === 'yes.png') && (scriptOfAnswer.counter == scriptOfAnswer.bool.length - 2)) {
			
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



}; */