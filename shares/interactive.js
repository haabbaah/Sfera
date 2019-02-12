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

		/* Видео */
		this.allVideo = document.querySelectorAll('video');

		/* Свойства для перезагрузки страницы */
		this.arrReloadPage = []; //Массив для хранение всех полей
		/* Свойства для перезагрузки страницы  end*/

	}

	showFirstElement() { //Показать первый дочерний элемент
		for (let k = 0; k < this.changeField.children.length; k++) {
			this.arrReloadPage.push(this.changeField.children[k].cloneNode(true));
		}

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
			//this.playQuestion();
			this.stopAllAudio();
			this.paginationPrev();
		}
	}

	reloadPage() { //Перезагрузить страницу
		this.stopAllAudio();
		this.playQuestion();


		this.changeField.replaceChild(this.arrReloadPage[this._currentPage], this.changeField.children[this._currentPage]);
		this.addClassOneElement.call(this.changeField.children[this._currentPage], this.changeField.children, 'd-b');

		this.arrReloadPage[this._currentPage] = this.changeField.children[this._currentPage].cloneNode(true); //Обновляем клонируемое значение

		/* 	let dynamicMethod = this.changeField.children[this._currentPage].getAttribute('data-reload-options');
			if (dynamicMethod) {
				this[dynamicMethod](); //Вызов метода, который добавляется в "item"
			} */
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
			this.stopAllAudio();
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

	addClassOneElement(element, cssClass) { //Добавить класс одному элементу, а у других убрать
		let addElement;
		if (typeof element === "string") {
			addElement = document.querySelectorAll(element);
		} else {
			addElement = element;
		}
		for (let k = 0; k < addElement.length; k++) {
			addElement[k].classList.remove(cssClass);
		}
		this.classList.add(cssClass);
	}

	removeClassOneElement(element, cssClass) { //Удалить класс одному элементу, а  другим добавить
		let removeElement;
		if (typeof element === "string") {
			removeElement = document.querySelectorAll(element);
		} else {
			removeElement = element;
		}
		for (let k = 0; k < removeElement.length; k++) {
			removeElement[k].classList.add(cssClass);
		}
		this.classList.remove(cssClass);
	}

	addClassAllElement(element, cssClass) { //Добавить класс всем элементам
		let addElement;
		if (typeof element === "string") {
			addElement = document.querySelectorAll(element);
		} else {
			addElement = element;
		}
		for (let k = 0; k < addElement.length; k++) {
			addElement[k].classList.add(cssClass);
		}
	}

	removeClassAllElement(element, cssClass) { //Удалить класс всем элементам
		let removeElement;
		if (typeof element === "string") {
			removeElement = document.querySelectorAll(element);
		} else {
			removeElement = element;
		}
		for (let k = 0; k < removeElement.length; k++) {
			removeElement[k].classList.remove(cssClass);
		}
	}

	opacityEffect(time) { //Сделать появление и исчезновение
		this.style.opacity = '1';
		setTimeout(() => {
			this.style.opacity = '0';
			this._currentPage--;
		}, time);
	}

	stopAllVideo() { //Остановить все видео на странице
		for (let k = 0; k < this.allVideo.length; k++) {
			this.allVideo[k].currentTime = 0;
			this.allVideo[k].pause();
		}
	}

	playThisVideo() { //Запустить это видео
		//this.pause();
		this.currentTime = 0;
		this.play();
	}

	playVideoInOrder(elements) { //Проиграть видео по порядку
		this.stopAllVideo();
		let element = document.querySelectorAll(elements);
		let videoCounter = 1;
		for (let k = 0; k < element.length; k++) {
			element[k].addEventListener('ended', function (event) {
				element[videoCounter].play();
				videoCounter++;
			}, false);
		}
		element[0].play();
	}

	getCoords(elem) { //Получение координат элемента
		let box = elem.getBoundingClientRect();
		return {
			top: box.top + pageYOffset,
			left: box.left + pageXOffset
		};
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

	showDadElements() { // Появление элементов по очереди
		let parent = this.parentElement;
		let children = parent.children;
		if (!this.classList.contains('check-drag')) {
			for (let d = 0; d < children.length; d++) {
				if (!children[d].classList.contains('op')) {
					if (children[d].previousElementSibling) {
						children[d].previousElementSibling.classList.remove('op');
					} else {
						return;
					}

				}
			}
		}
		this.classList.add('check-drag');
	}
}


class DragAndDropDotted extends DragAndDrop {
	constructor(options) {
		super();
		this.btnDadAll = document.querySelectorAll(options.btnDadAllElements);
		this.btnDadAllSelector = options.btnDadAllElements;
		this.prevDropzone;
		this.animationVideo = document.querySelectorAll(options.animationVideoElements);
		this.animationVideoSelector = options.animationVideoElements;
		this.sumTrueAll = this.btnDadAll.length; // Количество верных ответов всего
	}

	checkUnderElementMove() { //Выделение дропзоны при наведении
		this.classList.add('pointer-e');
		let elemUnder = document.elementFromPoint(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
		let dropzone = elemUnder.closest('.dropzone');
		if (dropzone) {
			dropzone.classList.add('accent-svg');
			this.prevDropzone = dropzone;
		} else if (this.prevDropzone) {
			this.prevDropzone.classList.remove('accent-svg');
		}
		this.classList.remove('pointer-e');
	}

	checkUnderElementEnd(that) { //Проверка совподает ли дропзона с перетаскиваемым элементом
		that.classList.add('pointer-e');
		let elemUnder = document.elementFromPoint(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
		let dropzone = elemUnder.closest('.dropzone');
		if (dropzone) {
			if (dropzone.getAttribute('data-drag') === that.getAttribute('data-drag')) {
				dropzone.classList.add('green-svg');
				that.classList.add('transforn-n');
				that.style.top = that.getAttribute('data-top') + '%';
				that.style.left = that.getAttribute('data-left') + '%';
				that.setAttribute('data-check', '');
				this.showDadElements.call(that);
				this.playYes();
				dropzone.classList.add('op');
				this.checkAllElementsAtPlase();
				this.playVideoInOrder(this.animationVideoSelector);
			} else {
				dropzone.classList.add('red-svg');
				this.playNo();
				setTimeout(() => {
					dropzone.classList.remove('red-svg');
				}, 1000);
			}
		}
		that.classList.remove('pointer-e');
	}

	checkAllElementsAtPlase() { //Проверка, все ли элементы на своих местах и переход на след. страницу
		let btnDad = document.querySelectorAll(this.btnDadAllSelector);
		let arrBtnDadCheck = [];
		for (let k = 0; k < btnDad.length; k++) {
			if (btnDad[k].hasAttribute('data-check')) {
				arrBtnDadCheck.push('1');
			}
		}
		if (this.sumTrueAll === arrBtnDadCheck.length) {
			setTimeout(() => {
				field.showNextPage();
			}, 2500);
		}
	}
}




class DragAndDropInvisible extends DragAndDrop {
	constructor(options) {
		super();
		this.dadElements = document.querySelectorAll(options.dadElements); //Перетаскиваемые элементы
		this.fieldForDadElements = document.querySelectorAll(options.fieldForDadElements); //Поля на которые перетаскиваются элементы
		this.actionAnimation = document.querySelectorAll(options.actionAnimation); //Анимируемые видео
		this.actionAnimationSelector = options.actionAnimation;
		this.dadElementsSelector = options.dadElements;
		this.fieldSelector = options.fieldForDadElements;
		this.arrFieldCords = [];
	}

	checkUnderElement(that) { //Проверка совподает ли дропзона с перетаскиваемым элементом
		that.classList.add('pointer-e');
		let elemUnder = document.elementFromPoint(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
		while (elemUnder.classList.contains('draggable')) {
			elemUnder.classList.add('pointer-e');
			elemUnder = document.elementFromPoint(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
		}
		let dropzone = elemUnder.closest(this.fieldSelector);
		if (dropzone) {
			if (dropzone.getAttribute('data-drag') === that.getAttribute('data-drag')) {
				//this.playYes();
				this.playThisVideo.call(this.findDataDrag(dropzone.getAttribute('data-drag')));
				this.requiredAmount(dropzone);
			} else {
				this.playNo();
			}
		}
		for (const iterator of document.querySelectorAll(this.dadElementsSelector)) {
			iterator.classList.remove('pointer-e');
		}
		/* 	for (let k = 0; k < this.dadElements.length; k++) {
				this.dadElements[k].classList.remove('pointer-e');
			} */
	}

	requiredAmount(dropzone) { //Необходимое количество элементов, которые могут быть перенесены на поле
		let children = dropzone.firstElementChild;
		let num = +children.getAttribute('data-amount');
		num--;
		if (num <= 0) {
			this.playYes();
			children.setAttribute('data-amount', num);
			this.checkDataAmount();
		} else {
			children.setAttribute('data-amount', num);
		}
	}

	checkDataAmount() {
		let videoAmount = document.querySelectorAll(this.actionAnimationSelector);
		let arrAmount = [];
		for (let k = 0; k < videoAmount.length; k++) {
			if (+videoAmount[k].getAttribute('data-amount') <= 0) {
				arrAmount.push('1');
			}
		}
		if (arrAmount.length === this.actionAnimation.length) {
			setTimeout(() => {
				field.showNextPage();
			}, 2500);
		}

	}

	findDataDrag(data) { // Возвращает видео элемент совподающий с перетаскиваемым элементом
		let actionAnimation = document.querySelectorAll(this.actionAnimationSelector);
		for (let k = 0; k < actionAnimation.length; k++) {
			if (actionAnimation[k].getAttribute('data-drag') === data) {
				return actionAnimation[k];
			}
		}
	}


}




class Matches extends Engine {
	constructor() {
		super();
		this.firstMatches = '';
		this.secondMatches = '';
		this.allMatches = false;
	}

	addValueInFirst(val) { //Задаем значение для первого элемента
		this.firstMatches= val;
	}

	addValueInSecond(val) { //Задаем значение для второго элемента
		this.secondMatches = val;
	}

	checkMatches() { // Проверка совпадают ли значения элементов
		if ((this.firstMatches === this.secondMatches) && this.firstMatches != '') {
			this.allMatches = true;
		} else {
			this.allMatches = false;
		}
	}
}


class ChangeColor extends Matches {
	constructor(options) {
		super();
		this.allVideoChange = document.querySelectorAll(options.changeVideo);
		this.allBtnChange = document.querySelectorAll(options.btnChange);
		this.allBtnChangeSelector = options.btnChange;
		this.parentVideo = '';
		this.parentBtn = '';
		this.arrAllMatches = [];
		//this.flagFirstClickChang = true;
		this.sumTrueAllChange = options.sumTrue; // Количество верных ответов всего
		//this.sumTrueClicksChange = 0; // Количество верных ответов при клике
	}

	addParent(that) {
		this.parentVideo = that.parentElement;
		this.removeClassAllElement(this.allBtnChangeSelector, 'big-btn')
	}


	/* 	addValueInSecond(val) { //Задаем значение для второго элемента и находим количество верных ответов всего
			super.addValueInSecond(val);
			if (this.flagFirstClickChang) {
				for (let d = 0; d < this.allBtnChange.length; d++) {
					if (this.allBtnChange[d].getAttribute('data-change') != '') {
						this.sumTrueAllChange++;
					}
				}
				this.flagFirstClickChang = false;
			}
		} */

	checkMatchesAllTrue() { // Проверка, верных ответов для перехода на др. страницу
		let btnChange = document.querySelectorAll(this.allBtnChangeSelector);
		let arrBtnDadCheck = [];
		for (let k = 0; k < btnChange.length; k++) {
			if (btnChange[k].hasAttribute('data-check')) {
				arrBtnDadCheck.push('1');
			}
		}

		if (this.sumTrueAllChange === arrBtnDadCheck.length) {
			setTimeout(() => {
				field.showNextPage();
			}, 2500);
		}
	}

	checkChangeElements(that) { // Проверка, подходят ли элементы друг другу
		let btn;
		//let answer;
		this.parentBtn = that.parentElement.children;
		for (let k = 0; k < this.parentBtn.length; k++) {
			if (this.parentBtn[k] === that) {
				this.removeClassOneElement.call(this.parentVideo.children[k], this.parentVideo.children, 'd-n');
				this.playThisVideo.call(this.parentVideo.children[k]);
				this.firstMatches = this.parentVideo.children[k].getAttribute('data-change');
				btn = this.parentBtn[k];
				//answer = this.firstMatches.val;
			}
		}

		this.checkMatches();
		if (this.allMatches) {
			this.playYes();
			btn.setAttribute('data-check', '');
			//this.sumTrueClicksChange++;
			this.checkMatchesAllTrue();
		} else {
			/* if (that.hasAttribute('data-check')) {
				that.removeAttribute('data-check');
			} */
			this.playNo();
		}
	}
}



class AppearElementsOnClick extends Engine {
	constructor(options) {
		super();
		this.appearItemsSelector = options.appearItems;
		this.sumTrueElements = document.querySelectorAll(options.appearItems).length;
		this.curentElements = 0;
	}

	appearElements() {
		let clickField = document.querySelectorAll(this.appearItemsSelector)
		for (let k = 0; k < clickField.length; k++) {
			if (clickField[k].classList.contains('op')) {
				clickField[k].classList.remove('op');
				this.curentElements++;
				break;
			}
		}
		if (this.sumTrueElements === this.curentElements) {
			this.curentElements++;
			this.playYes();
			setTimeout(() => {
				field.showNextPage();
				field.changeField.addEventListener('touchstart', clickFieldHandler, false);
				this.curentElements = 0;
			}, 3000);
		}
	}
}






let field = new Engine();



(function () { //Вешаем слушатели
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