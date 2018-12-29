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


	var dots = document.querySelectorAll('.dots-wrapper .dot');
	var progressDots = document.querySelector('.dots-wrapper .progress');
	var widthContainerOfDots = window.getComputedStyle(document.querySelector('.dots-wrapper')).width;
	var progressWidth = 0;
	var path = parseInt(widthContainerOfDots) / (dots.length - 1);

	var scriptOfAnswer = {
		counter: 0,
		bool: [
			[false, false, true],
			[false, false, true],
		],
		sel: [controlsElementsHeight, interactiveElementsHeight, interactionElementsHeight]
	};



	var addField = document.querySelectorAll('.add-field');
	var btnAdd = document.querySelectorAll('.btn-add');
	var btnAddSmall = document.querySelectorAll('.add-small .btn-add');
	var btnAddBig = document.querySelectorAll('.add-big .btn-add');

	var btnChange = document.querySelectorAll('.btn-change');
	var choiceLeft = document.querySelector('.left-item');
	var choiceRight = document.querySelector('.right-item');
	var videoLeft = document.querySelectorAll('.left-item video');
	var videoRight = document.querySelectorAll('.right-item video');
	var thumbs = document.querySelectorAll('.thumb');


	var addFild1 = document.querySelector('#add-fild1');
	var addFild2 = document.querySelector('#add-fild2');


	var choice = 'left';




	setMaxHeight(controlsElementsHeight, interactiveElementsHeight, interactionElementsHeight);


	for (var o = 0; o < btnAdd.length; o++) { //Добавляем всем перетаскиваемым элементам дата, для прекращения увеличения
		btnAdd[o].classList.add('check-add');
	}

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
				resetAddElement();
				resetColorChange();
			});
		}

		for (var k = 0; k < answer.length; k++) {
			answer[k].addEventListener('click', checkAnswer);
		}


		if (scriptOfAnswer.counter === 0) { //Скрываем предыдущую кнопку
			hidePrev();
		}




		/* 		var animation1 = new VideoAnimation({
					selector: 'videodog',
					startTime: 1.16,
					loop: true,
					autoplay: false
				}); */




		/* 	document.querySelector('.first-video-img-left').hidden = true;
			document.querySelector('.first-video-img-right').hidden = true; */



		for (var d = 0; d < videoLeft.length; d++) { //Запуск собаки по завершению клоунов
			videoLeft[d].addEventListener('ended', function () {
				animation1.startAnimation();
			});
			videoRight[d].addEventListener('ended', function () {
				animation1.startAnimation();
			});
		}




		for (var y = 0; y < btnAddSmall.length; y++) { //Увеличиваем маленький шар
			btnAddSmall[y].addEventListener('touchstart', function () {
				if (this.classList.contains('check-add')) {
					this.style.width = '18vw';
					this.style.height = '18vw';
					this.style.top = '0.5vw';
					this.style.left = '0.5vw';
				}
			});
		}

		for (var u = 0; u < btnAddBig.length; u++) { //Увеличиваем большой шар
			btnAddBig[u].addEventListener('touchstart', function () {
				if (this.classList.contains('check-add')) {
					this.style.width = '27vw';
					this.style.height = '27vw';
					this.style.top = '-2.5vw';
					this.style.left = '-2.5vw';
				}
			});
		}

		for (var m = 0; m < btnAdd.length; m++) { //Показываем следующий шар
			btnAdd[m].addEventListener('touchstart', function () {
				var self = this;
				setTimeout(function () {
					self.previousElementSibling.classList.remove('op-n');
				}, 300);
			});
		}

		for (var h = 0; h < btnAdd.length; h++) { //Находим элемент под переносимым шаром
			btnAdd[h].addEventListener('touchend', function (event) {

				// спрячем переносимый элемент 
				//this.hidden = true;

				// получить самый вложенный элемент под курсором мыши
				//var elemUnder = document.elementFromPoint(event.changedTouches[0].clientX, event.changedTouches[0].clientY);

				this.classList.remove('check-add');
				//startAnimation(elem);
				if (this.parentElement.classList.contains('add-small')) {
					this.classList.add('small-check');
					playVideoUnderElement(addFild2, videoRight, event);
					var sum = document.querySelectorAll('.small-check');
					if (sum.length > 3) {
						corectPlay();
					}

				} else if (this.parentElement.classList.contains('add-big')) {
					this.classList.add('big-check');
					playVideoUnderElement(addFild1, videoLeft, event);
					var sum = document.querySelectorAll('.big-check');
					if (sum.length === 3) {
						corectPlay();
					} else if (sum.length > 3) {
						wrongPlay();
					}
				}

				// показать переносимый элемент обратно
				//this.hidden = false;

			});
		}





		/* 

				for (var thumb of thumbs) { //Анимируем тумбы
					thumb.addEventListener('click', function () {
						this.classList.remove('animate-big');
						void this.offsetWidth; // reflow hack
						this.classList.add('animate-big');
					});
				} */



		addFild1.addEventListener('click', function (event) { //Выбор левого клоуна
			event.preventDefault();
			event.stopPropagation();
			choice = 'left';
			for (var c = 0; c < videoLeft.length; c++) {
				videoLeft[c].classList.remove('animate');
			}
			for (var s = 0; s < videoLeft.length; s++) {
				if (!(videoLeft[s].classList.contains('d-n'))) {
					void videoLeft[s].offsetWidth; // reflow hack
					videoLeft[s].classList.add('animate');
				} else {
					document.querySelector('.first-video-img-left').classList.add('animate');
				}
			}

		});

		addFild2.addEventListener('click', function (event) { //Выбор правого клоуна
			event.preventDefault();
			event.stopPropagation();
			choice = 'right';
			for (var c = 0; c < videoRight.length; c++) {
				videoRight[c].classList.remove('animate');
			}
			for (var s = 0; s < videoRight.length; s++) {
				if (!videoRight[s].classList.contains('d-n')) {
					void videoRight[s].offsetWidth; // reflow hack
					videoRight[s].classList.add('animate');
				} else {
					document.querySelector('.first-video-img-right').classList.add('animate');
				}

			}

		});




		for (var s = 0; s < btnChange.length; s++) { //Меняем цвета у клоунов
			btnChange[s].addEventListener('click', function () {
				for (var h = 0; h < btnChange.length; h++) {
					btnChange[h].classList.remove('big-btn');
				}
				this.classList.add('big-btn');
				var data, video;
				if (choice === 'left') {
					data = this.getAttribute('data-change');
					video = document.querySelector('.left-item video[data-change="' + data + '"]');
					for (var c = 0; c < videoLeft.length; c++) {
						videoLeft[c].classList.add('d-n');
						videoLeft[c].pause();
						videoLeft[c].currentTime = 0;
					}
					document.querySelector('.first-video-img-left').hidden = true; //Скрываем клоуна без цвета
					video.classList.remove('d-n');
					video.play();
					if ( /* this.classList.contains('change-2') ||  */ this.classList.contains('change-3')) {
						corectPlay();
					} else {
						wrongPlay();
					}
				} else {
					data = this.getAttribute('data-change');
					video = document.querySelector('.right-item video[data-change="' + data + '"]');
					for (var x = 0; x < videoRight.length; x++) {
						videoRight[x].classList.add('d-n');
						videoRight[x].pause();
						videoRight[x].currentTime = 0;
					}
					document.querySelector('.first-video-img-right').hidden = true; //Скрываем клоуна без цвета
					video.classList.remove('d-n');
					video.play();
					if ( /* this.classList.contains('change-1') ||  */ this.classList.contains('change-4')) {
						corectPlay();
					} else {
						wrongPlay();
					}
				}
				data = this.getAttribute('');



				if (!(videoLeft[1].classList.contains('d-n')) && !(videoRight[0].classList.contains('d-n'))) {
					setTimeout(function () {
						changeField();
					}, 2000);
				}



			});
		}


	})()







	function playVideoUnderElement(elem, video, event) { //Запуск видео клоуна
		if (event.changedTouches.length == 1) {
			var tarWidth = elem.offsetWidth;
			var tarHeight = elem.offsetHeight;
			var tarX = getCoords(elem);
			var tarY = getCoords(elem);
			if (
				(event.changedTouches[0].pageX > tarX.left) && (event.changedTouches[0].pageX < (tarX.left + tarWidth)) &&
				(event.changedTouches[0].pageY > tarY.top) && (event.changedTouches[0].pageY < (tarY.top + tarHeight))) {
				for (var g = 0; g < video.length; g++) {
					if (!(video[g].classList.contains('d-n'))) {
						video[g].currentTime = 0;
						video[g].play();
					}
				}

			}
		}

	}

	function getCoords(elem) { //Получение координат элемента
		var box = elem.getBoundingClientRect();

		return {
			top: box.top + pageYOffset,
			left: box.left + pageXOffset
		};

	}

	function resetAddElement() { //Возвращаем перемещенные элементы назад
		for (var g = 0; g < btnAddSmall.length; g++) {
			btnAddSmall[g].style.transition = 'all .3s ease';
			btnAddSmall[g].style.width = '10vw';
			btnAddSmall[g].style.height = '10vw';
			btnAddSmall[g].style.left = 4.5 + 'vw';
			btnAddSmall[g].style.top = 4.5 + 'vw';
			btnAddSmall[g].classList.add('op-n');
			btnAddSmall[g].classList.remove('check-add', 'big-check');
		}
		for (var j = 0; j < btnAddBig.length; j++) {
			btnAddBig[j].style.transition = 'all .3s ease';
			btnAddBig[j].style.width = '16vw';
			btnAddBig[j].style.height = '16vw';
			btnAddBig[j].style.left = 1.5 + 'vw';
			btnAddBig[j].style.top = 1.5 + 'vw';
			btnAddBig[j].classList.add('op-n');
			btnAddBig[j].classList.remove('check-add', 'big-check');
		}

		setTimeout(function () {
			for (var i = 0; i < btnAdd.length; i++) {
				btnAdd[i].style.transition = '';
				btnAdd[i].classList.add('check-add');
			}
		}, 300);

		btnAddBig[btnAddBig.length - 1].classList.remove('op-n');
		btnAddSmall[btnAddSmall.length - 1].classList.remove('op-n');


	}



	function startAnimation(elem) { //Запуск клоуна над перетаскиваемым шаром
		elem.currentTime = 0;
		elem.play();
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
	}

	function changeFieldPrev(e) { //Поменять поля на предыдущие
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
		stopAllAudio();
		resetAnswer(); //Очищаем все ответы
		resetAddElement(); //Возвращаем перемещенные элементы назад
		prevDot();
		showNext();
		if (scriptOfAnswer.counter === 0) {
			hidePrev();
		}
	}

	function changeField(e) { //Поменять поля на следующие
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
		if (scriptOfAnswer.bool.length - 1 === scriptOfAnswer.counter) {
			hideNext();
		}
	}





	function nextDot() { //Передвинуть точки прогресса в перед
		var counter = scriptOfAnswer.counter;
		dots[counter].classList.add('active', 'a-color');
		dots[counter - 1].classList.remove('active');
		progressWidth += path;
		progressDots.style.width = (progressWidth * 98) / parseInt(widthContainerOfDots) + '%';
	}



	function prevDot() { //Передвинуть точки прогресса назад
		var counter = scriptOfAnswer.counter;
		dots[counter].classList.add('active', 'a-color');
		dots[counter + 1].classList.remove('active', 'a-color');
		progressWidth -= path;
		progressDots.style.width = (progressWidth * 98) / parseInt(widthContainerOfDots) + '%';
	}






	function checkAnswer() { //Ответ на вопрос
		this.classList.add('op');


		var self = this;
		if ((this.firstElementChild.getAttribute('src') === 'yes.png') && (scriptOfAnswer.counter == scriptOfAnswer.bool.length - 1)) {
			finalPlay();
			setTimeout(function () {
				self.classList.remove('op');
			}, 2000);

		} else if (this.firstElementChild.getAttribute('src') === 'yes.png') {
			corectPlay();
			setTimeout(function () {
				self.classList.remove('op');
				changeField();
			}, 2000);
		} else {
			wrongPlay();
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
		for (var k = 0; k < answer.length; k++) {
			answer[k].classList.remove('op');
		}
	}

	function resetColorChange() { //Очистить поля с изменением цвета
		document.querySelector('.first-video-img-left').hidden = false;
		document.querySelector('.first-video-img-right').hidden = false;
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