'use strict';
const videoPlayer = document.querySelector('.video-player');
const overlay = videoPlayer.querySelector('.overlay');
const playButton = videoPlayer.querySelector('.play-button');
const video = videoPlayer.querySelector('.main-video');
const playToggler = videoPlayer.querySelector('.play-toggle');
const volumeToggler = videoPlayer.querySelector('.volume-toggle');
const timeLine = videoPlayer.querySelector('.timeline');

const volumeControl = videoPlayer.querySelector('.volume-lvl');

let isPlayed = false;
let isMuted = false;

let dragTimeline;
let grabTimeline;

let dragVolume;
let grabVolume;





const hideOverlay = function () {
	overlay.classList.add('overlay-hidden');
	setTimeout('overlay.classList.add("hidden")', 300);
	timeLine.max = video.duration;
}
const toggleButton = function () {
	if (video.currentTime === video.duration) {
		console.log('ended');
		playButton.classList.toggle('hidden');
		playButton.classList.toggle('hover');
	} else {
		playButton.classList.toggle('hidden');
	}
}
const changeBgPlay = function () {
	playToggler.classList.toggle('paused');
	playToggler.classList.toggle('played');
}
const changeBgMute = function () {
	volumeToggler.classList.toggle('muted');
	volumeToggler.classList.toggle('unmuted');
}
////////////////////////////////////////////////////////////////////
const calcCoordinate = function (e) {
	let width = window.getComputedStyle(e.target).getPropertyValue('width');
	let offset = e.offsetX;
	let clickXPercent = offset * 100 / +(width.split('p')[0]);
	return clickXPercent;
}
const calcCoordinateTouch = function (e) {
	if (e.target.nodeName === 'INPUT') {
		let coordinate = e.changedTouches[0].clientX;
		let coordinatePercent = (coordinate - e.target.getBoundingClientRect().left) * 100 / window.getComputedStyle(e.target).getPropertyValue('width').split('p')[0];
		return coordinatePercent;
	}

}

// Timeline Logic
const changeTimeLineBg = function (e) {
	if (e) {
		if (e.type.indexOf('touch') !== -1) {
			let coordinate = calcCoordinateTouch(e)
			timeLine.style.background = `linear-gradient(
				to right,
				rgb(255, 255, 255) 0%,
				rgb(0, 0, 0) ${coordinate}%,
				rgb(255, 255, 255) ${coordinate}%,
				rgb(255, 255, 255) 100%
			 )`
		} else {
			let coordinate = calcCoordinate(e)
			timeLine.style.background = `linear-gradient(
				to right,
				rgb(255, 255, 255) 0%,
				rgb(0, 0, 0) ${coordinate}%,
				rgb(255, 255, 255) ${coordinate}%,
				rgb(255, 255, 255) 100%
			 )`
		}
	} else {
		timeLine.style.background = `linear-gradient(
			to right,
			rgb(255, 255, 255) 0%,
			rgb(0, 0, 0) ${timeLine.value / 10.2}%,
			rgb(255, 255, 255) ${timeLine.value / 10.2}%,
			rgb(255, 255, 255) 100%
		 )`
	}

}
const changeTimeLine = function () {
	timeLine.value = video.currentTime;
	changeTimeLineBg();
}
let updateTimeline = window.setInterval(changeTimeLine, 200);
//Video toggle
const toggleVideo = function () {
	if (isPlayed) {
		toggleButton();
		changeBgPlay();
		video.pause();
		isPlayed = false;
	} else {
		toggleButton();
		changeBgPlay();
		video.play();
		isPlayed = true;
	}

}
//drag
timeLine.addEventListener('mouseover', function () { dragTimeline = true });
timeLine.addEventListener('mouseout', function () { dragTimeline = false; grabTimeline = false });
timeLine.addEventListener('mousedown', function () { grabTimeline = dragTimeline });
timeLine.addEventListener('mouseup', function () { grabTimeline = false });
timeLine.addEventListener('mousemove', function (e) {
	if (dragTimeline && grabTimeline) {
		if (playButton.classList.contains('hover')) {
			playButton.classList.remove('hover')
		}
		if (!isPlayed) {
			video.currentTime = timeLine.value;
			changeTimeLineBg(e)
		} else {
			video.currentTime = timeLine.value;
			changeTimeLineBg(e)
		}
	}
});

//click
timeLine.addEventListener('mousedown', (e) => {
	changeTimeLineBg(e);
	let timelineOffset = calcCoordinate(e);
	let currentTimeSec = video.duration * timelineOffset / 100;
	video.currentTime = currentTimeSec;
});

//Touch event logic timeline
timeLine.addEventListener('touchstart', function () { dragTimeline = true; grabTimeline = dragTimeline });
timeLine.addEventListener('touchend', function () { grabTimeline = false });
timeLine.addEventListener('touchmove', function (e) {
	if (dragTimeline && grabTimeline) {
		if (playButton.classList.contains('hover')) {
			playButton.classList.remove('hover')
		}
		if (!isPlayed) {
			video.currentTime = timeLine.value;
			changeTimeLineBg(e);
		} else {
			video.currentTime = timeLine.value;
			changeTimeLineBg(e);
		}
	}
});
timeLine.addEventListener('touchstart', (e) => {
	if (playButton.classList.contains('hover')) {
		playButton.classList.remove('hover')
	}
	if (!isPlayed) {
		let timelineOffset = calcCoordinateTouch(e);
		let currentTimeSec = video.duration * timelineOffset / 100;
		video.currentTime = currentTimeSec;
		changeTimeLineBg(e);
	} else {
		let timelineOffset = calcCoordinateTouch(e);
		let currentTimeSec = video.duration * timelineOffset / 100;
		video.currentTime = currentTimeSec;
		changeTimeLineBg(e);
	}
});


// Volume Logic
const changeVolumeBG = function (e) {
	if (e.type.indexOf('touch') !== -1) {
		let bgOffset = calcCoordinateTouch(e);
		volumeControl.style.background = `linear-gradient(
			to right,
			#fff 0%,
			#000 ${bgOffset + 0.1}%,
			#fff ${bgOffset + 0.1}%,
			#fff 100%
		 )`
	} else {
		let bgOffset = calcCoordinate(e);
		volumeControl.style.background = `linear-gradient(
			to right,
			#fff 0%,
			#000 ${bgOffset + 0.1}%,
			#fff  ${bgOffset + 0.1}%,
			#fff  100%
		 )`
	}
}
const changeVolumeLvl = function (e) {
	if (e.type.indexOf('touch') !== -1) {
		let volumeLvl = calcCoordinateTouch(e) / 100;
		if (isMuted) {
			toggleMuteSound();
		}
		if (volumeLvl < 0.03) {
			volumeLvl = 0;
			toggleMuteSound();
			video.volume = volumeLvl;
			volumeControl.value = 0;
		} else if (volumeLvl > 0.99) {
			volumeLvl = 1;
			video.volume = volumeLvl;
		} else {
			video.volume = volumeLvl;
		}
	} else {
		let volumeLvl = calcCoordinate(e) / 100;
		if (isMuted) {
			toggleMuteSound();
		}
		if (volumeLvl < 0.03) {
			volumeLvl = 0;
			toggleMuteSound();
			video.volume = volumeLvl;
			volumeControl.value = 0;
		} else if (volumeLvl > 0.99) {
			volumeLvl = 1;
			video.volume = volumeLvl;
		} else {
			video.volume = volumeLvl;
		}
	}
}
//Volume toggle
const toggleMuteSound = function () {
	if (isMuted) {
		changeBgMute();
		if (!video.volume) {
			video.volume = 0.1;
			volumeControl.value = 1;
		}
		video.muted = false;
		isMuted = false;
	} else {
		changeBgMute();
		video.muted = true;
		isMuted = true;
	}
}

volumeControl.addEventListener('mouseover', function () { dragVolume = true });
volumeControl.addEventListener('mouseout', function () { dragVolume = false; grabVolume = false });
volumeControl.addEventListener('mousedown', function () { grabVolume = dragVolume });
volumeControl.addEventListener('mouseup', function () { grabVolume = false });
volumeControl.addEventListener('mousemove', function (e) {
	if (dragVolume && grabVolume) {
		changeVolumeBG(e);
		changeVolumeLvl(e);
	}
});
volumeControl.addEventListener('mousedown', changeVolumeLvl);
volumeControl.addEventListener('mousedown', changeVolumeBG);

//Touch event logic volume
volumeControl.addEventListener('touchstart', function () { dragTimeline = true; grabTimeline = dragTimeline });
volumeControl.addEventListener('touchend', function () { grabTimeline = false });
volumeControl.addEventListener('touchmove', function (e) {
	if (dragTimeline && grabTimeline) {
		changeVolumeBG(e);
		changeVolumeLvl(e);
	}
});
volumeControl.addEventListener('touchstart', (e) => {
	changeVolumeLvl(e);
	changeVolumeBG(e);
});

//preloader
window.addEventListener('load', () => {
	document.body.classList.add('loaded_hiding');
	window.setTimeout(function () {
		document.body.classList.add('loaded');
		document.body.classList.remove('loaded_hiding');
	}, 500);

})
video.addEventListener('canplay', () => {
	playButton.addEventListener('click', hideOverlay, { once: true });
	playButton.addEventListener('click', toggleVideo);
	overlay.addEventListener('click', toggleVideo, { once: true });
	overlay.addEventListener('click', hideOverlay, { once: true });
})

video.addEventListener('click', toggleVideo);
video.addEventListener('ended', (updateTimeline) => {
	window.clearInterval(updateTimeline);
	toggleButton();
	changeBgPlay();
	isPlayed = false;
})
playToggler.addEventListener('click', toggleVideo);
volumeToggler.addEventListener('click', toggleMuteSound);

console.log(`1.Вёрстка +10:

 -вёрстка видеоплеера: есть само видео, в панели управления есть кнопка Play/Pause, прогресс-бар, кнопка Volume/Mute, регулятор громкости звука +5
 -в футере приложения есть ссылка на гитхаб автора приложения, год создания приложения, логотип курса со ссылкой на курс +5

2.Кнопка Play/Pause на панели управления +10:

 -при клике по кнопке Play/Pause запускается или останавливается проигрывание видео +5
 -внешний вид и функционал кнопки изменяется в зависимости от того, проигрывается ли видео в данный момент +5

3.Прогресс-бар отображает прогресс проигрывания видео. При перемещении ползунка прогресс-бара вручную меняется текущее время проигрывания видео. Разный цвет прогресс-бара до и после ползунка +10

4.При перемещении ползунка регулятора громкости звука можно сделать звук громче или тише. Разный цвет регулятора громкости звука до и после ползунка +10

5.При клике по кнопке Volume/Mute можно включить или отключить звук. Одновременно с включением/выключением звука меняется внешний вид кнопки. Также внешний вид кнопки меняется, если звук включают или выключают перетягиванием регулятора громкости звука от нуля или до нуля +10

6.Кнопка Play/Pause в центре видео +10

 -есть кнопка Play/Pause в центре видео при клике по которой запускается видео и отображается панель управления +5
 -когда видео проигрывается, кнопка Play/Pause в центре видео скрывается, когда видео останавливается, кнопка снова отображается +5

7.Качество оформления приложения +10

 -собственный дизайн
 -приложение адаптированно под разные размеры экрана`)
