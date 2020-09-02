let player;

(() => {
    const commandsQueue = information.playingData.map((data, index) => {
        const { videoId = information.pearlyNightId, ...additionalData } = data;
        const parameters = { videoId };

        if ('start' in data) {
            parameters.startSeconds = data.start;
        }

        if ('end' in data) {
            parameters.endSeconds = data.end;
        }

        return [index === 0 ? -1 : 0, 'LOAD', parameters, additionalData];
    });

    function toSecond(time) {
        if(typeof time === 'string') {
            const splitTime = time.split(':');
            return Number(splitTime[0]) * 60 + Number(splitTime[1])
        }
        return time;
    }

    function onReady() {
        player.playVideo();
    }

    function onStateChange({ data: code }) {
        if (commandsQueue.length === 0) {
            return;
        }

        const [firstCommand] = commandsQueue;
        const [eventCode, eventType, parameters, additionalData] = firstCommand;

        if (eventCode !== code) {
            return;
        }

        commandsQueue.shift();

        switch (eventType) {
            case 'RESET': {
                player.pauseVideo();

                break;
            }

            case 'LOAD': {
                commandsQueue.unshift([5, 'PLAY', additionalData]);
                player.cueVideoById(parameters);

                break;
            }

            case 'PLAY': {
                const indicator = document.querySelector('#indicator');
                const { artistName, songName } = parameters;

                if (artistName && songName) {
                    indicator.querySelector('.when-playing .artist-name').textContent = artistName;
                    indicator.querySelector('.when-playing .song-name').textContent = songName;

                    indicator.classList.remove('speaking');
                    indicator.classList.add('playing');
                } else {
                    indicator.querySelector('.when-speaking span').textContent = 'NOIZEMASTA Speaking';

                    indicator.classList.add('speaking');
                    indicator.classList.remove('playing');
                }

                player.playVideo();

                break;
            }

            default: break;
        }
    }

    window.onYouTubeIframeAPIReady = function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
            height: 120,
            playerVars: { autoplay: 1, rel: 0, disablekb: 1, modestbranding: 1 },
            events: { onReady, onStateChange }
        });
    };

    window.addEventListener('keyup', event => {
        if (event.key === ' ') {
            const isPlaying = player.getPlayerState() === 1;
            const isPausing = player.getPlayerState() === 2;

            if (isPlaying) {
                player.pauseVideo();
            }

            if (isPausing) {
                player.playVideo();
            }
        }

        if (event.shiftKey && event.key === 'Enter') {
            const playerElement = document.querySelector('#player');
            const isHidden = getComputedStyle(playerElement).display === 'none';

            playerElement.style.display = isHidden ? 'block' : 'none';
        }
    })
})();
