function VideoAnimation(option) {

	//Полифил для requestAnimationFrame
	(function () {
		var lastTime = 0;
		var vendors = ['ms', 'moz', 'webkit', 'o'];
		for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
			window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
			window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||
				window[vendors[x] + 'CancelRequestAnimationFrame'];
		}

		if (!window.requestAnimationFrame)
			window.requestAnimationFrame = function (callback, element) {
				var currTime = new Date().getTime();
				var timeToCall = Math.max(0, 16 - (currTime - lastTime));
				var id = window.setTimeout(function () {
						callback(currTime + timeToCall);
					},
					timeToCall);
				lastTime = currTime + timeToCall;
				return id;
			};

		if (!window.cancelAnimationFrame)
			window.cancelAnimationFrame = function (id) {
				clearTimeout(id);
			};
	}());
	//Полифил для requestAnimationFrame end


	var video = document.getElementById(option.selector);
	var startTime = option.startTime;
	var i = true;
	var loop = option.loop;

	requestAnimationFrame(animateIdel);

	function animateIdel() {
		if (i) {
			i = false;
		} else {
			video.currentTime = startTime;
			setTimeout(function () {
				video.play();
			}, 0);
			i = true;
			requestAnimationFrame(animateIdel);
		}
	}

	function animateActive() {
		video.currentTime = 0.1;
		video.play();
	}

	function notLoop() {
		video.pause();
	}

	video.addEventListener('loadedmetadata', animateIdel, false);
	video.addEventListener('click', animateActive, false);
	if (loop) {
		video.addEventListener('ended', animateIdel, false);
	} else {
		video.addEventListener('ended', notLoop, false);
	}


}