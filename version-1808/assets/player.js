import { H as Hls } from './video-vendor-dru42stk.js';

const players = document.querySelectorAll('[data-video-player]');

players.forEach(function (player) {
  const video = player.querySelector('video');
  const button = player.querySelector('[data-play-button]');
  const message = player.querySelector('[data-player-message]');
  const src = player.dataset.src;
  let hls = null;
  let initialized = false;

  const setMessage = function (text) {
    if (message) {
      message.textContent = text || '';
    }
  };

  const initialize = function () {
    if (initialized || !video || !src) {
      return Promise.resolve();
    }

    initialized = true;
    setMessage('正在初始化播放源...');

    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        setMessage('播放源加载完成');
      });

      hls.on(Hls.Events.ERROR, function (_event, data) {
        if (!data || !data.fatal) {
          return;
        }

        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          setMessage('网络错误，正在重新加载播放源');
          hls.startLoad();
          return;
        }

        if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          setMessage('媒体错误，正在尝试恢复');
          hls.recoverMediaError();
          return;
        }

        setMessage('当前浏览器无法继续播放该视频');
        hls.destroy();
      });

      return Promise.resolve();
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      setMessage('使用浏览器原生 HLS 播放');
      return Promise.resolve();
    }

    setMessage('您的浏览器不支持 HLS 播放');
    return Promise.reject(new Error('HLS is not supported'));
  };

  const play = function () {
    initialize()
      .then(function () {
        if (button) {
          button.classList.add('is-hidden');
        }
        return video.play();
      })
      .catch(function () {
        setMessage('播放未能启动，请稍后重试');
      });
  };

  if (button) {
    button.addEventListener('click', play);
  }

  if (video) {
    video.addEventListener('play', function () {
      if (button) {
        button.classList.add('is-hidden');
      }
    });
  }

  window.addEventListener('beforeunload', function () {
    if (hls) {
      hls.destroy();
    }
  });
});
