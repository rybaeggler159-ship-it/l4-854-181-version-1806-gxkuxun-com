import { H as Hls } from './hls.js';

function showMessage(player, text) {
    var message = player.querySelector('[data-player-message]');
    if (!message) {
        return;
    }

    message.textContent = text;
    message.classList.add('is-visible');
    window.setTimeout(function () {
        message.classList.remove('is-visible');
    }, 4200);
}

function setupPlayer(player) {
    var video = player.querySelector('video');
    var playButton = player.querySelector('[data-player-play]');
    var source = player.getAttribute('data-src');
    var initialized = false;
    var hls = null;

    if (!video || !source) {
        return;
    }

    function initialize() {
        if (initialized) {
            return Promise.resolve();
        }

        initialized = true;
        player.classList.add('is-loading');
        showMessage(player, '正在加载高清播放源...');

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
            player.classList.remove('is-loading');
            return Promise.resolve();
        }

        if (Hls && Hls.isSupported()) {
            hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });

            hls.loadSource(source);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, function () {
                player.classList.remove('is-loading');
                showMessage(player, '播放源已就绪');
            });

            hls.on(Hls.Events.ERROR, function (event, data) {
                if (data && data.fatal) {
                    player.classList.remove('is-loading');
                    showMessage(player, '播放源加载失败，可刷新页面后重试');
                    if (hls) {
                        hls.destroy();
                    }
                }
            });

            return Promise.resolve();
        }

        player.classList.remove('is-loading');
        showMessage(player, '当前浏览器不支持 HLS 播放');
        return Promise.reject(new Error('HLS is not supported'));
    }

    function play() {
        initialize().then(function () {
            return video.play();
        }).then(function () {
            player.classList.add('is-playing');
        }).catch(function () {
            showMessage(player, '浏览器阻止了自动播放，请再次点击播放按钮');
        });
    }

    if (playButton) {
        playButton.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            play();
        });
    }

    player.addEventListener('click', function (event) {
        if (event.target === video || event.target.closest('video')) {
            return;
        }
        play();
    });

    video.addEventListener('play', function () {
        player.classList.add('is-playing');
    });

    video.addEventListener('pause', function () {
        player.classList.remove('is-playing');
    });

    window.addEventListener('beforeunload', function () {
        if (hls) {
            hls.destroy();
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(setupPlayer);
});
