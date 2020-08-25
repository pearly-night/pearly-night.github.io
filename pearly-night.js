(() => {
    let player;

    const commandsQueue = information.playingData.map((datum, index) => {
        const parameters = { videoId: datum.videoId || information.pearlyNightId };

        if ('start' in datum) {
            parameters.startSeconds = datum.start;
        }

        if ('end' in datum) {
            parameters.endSeconds = datum.end;
        }

        return [index === 0 ? -1 : 0, 'LOAD', parameters];
    });

    function onReady() {
        player.playVideo();
    }

    function onStateChange({ data: code }) {
        if (commandsQueue.length === 0) {
            return;
        }

        const [firstCommand] = commandsQueue;
        const [eventCode, eventType, ...parameters] = firstCommand;

        if (eventCode !== code) {
            return;
        }

        commandsQueue.shift();

        switch (eventType) {
            case 'LOAD': {
                commandsQueue.unshift([5, 'PLAY']);
                player.cueVideoById(...parameters);

                break;
            }

            case 'PLAY': {
                player.playVideo();

                break;
            }

            default: break;
        }
    }

    window.onYouTubeIframeAPIReady = function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
            videoId: information.pearlyNightId,
            events: { onReady, onStateChange }
        });
    };
})();
