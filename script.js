const focoBtn = document.querySelector('.app__card-button--foco')
const shortBtn = document.querySelector('.app__card-button--short')
const longBtn = document.querySelector('.app__card-button--long')
const html = document.querySelector("html")

const banner = document.querySelector(".app__section-banner-container .app__image")

const title = document.querySelector(".app__title")

const timer = document.querySelector("#timer")
const startPauseBtn = document.querySelector("#start-pause")
const startPauseBtnText = document.querySelector("#start-pause span")
const startPauseBtnIcon = document.querySelector(".app__card-primary-butto-icon")

const buttons = document.querySelectorAll('.app__card-button');
const musicFocusInput = document.querySelector('#toggle-music');

const audioPlay = new Audio('./assets/songs/play.wav');
const audioPause = new Audio('./assets/songs/pause.mp3');
const music = new Audio('./assets/songs/luna-rise-part-one.mp3');
music.loop = true


let rangeId = null;
let elapsedTimeInSeconds = 25; 
showTime()

function changeBanner(context) {
    banner.setAttribute('src', `./assets/images/${context}.png`)

    switch (context) {
        case "foco":
            title.innerHTML = `
                Otimize sua produtividade,<br>
                <strong class="app__title-strong">mergulhe no que importa.</strong>
            `
            break;
        case "short-break":
            title.innerHTML = `
                Que tal dar uma respirada? <br>
                <strong class="app__title-strong">Faça uma pausa curta.</strong>
            `
            break;
        case "long-break":
            title.innerHTML = `
                Hora de voltar à superfície. <br>
                <strong class="app__title-strong">Faça uma pausa longa.</strong>
            `
            break;

        default:
            break;
    }
}

function changeContext(context) {
    html.setAttribute('data-context', context)
    reset()
    showTime()
    changeBanner(context)
    buttons.forEach(function (button) {
        button.classList.remove('active');
    });
}

focoBtn.addEventListener("click", () => {
    elapsedTimeInSeconds = 25;
    changeContext("foco")
    focoBtn.classList.add('active')
})

shortBtn.addEventListener("click", () => {
    elapsedTimeInSeconds = 5;
    changeContext("short-break")
    shortBtn.classList.add('active')
})

longBtn.addEventListener("click", () => {
    elapsedTimeInSeconds = 15;
    changeContext("long-break")
    longBtn.classList.add('active')
})

startPauseBtn.addEventListener("click", startOrPause)

musicFocusInput.addEventListener('change', () => {
    if (music.paused) {
        music.play();
    } else {
        music.pause();
    }
})

const countdown = () => {
    if (elapsedTimeInSeconds <= 0) {
        reset()
        const focusActive = html.getAttribute('data-context') === 'foco'
        if (focusActive) {            
            var event = new CustomEvent("TaskFinished", {
                detail: {
                    message: "A tarefa foi concluída com sucesso!",
                    time: new Date(),
                },
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(event);
            elapsedTimeInSeconds = 25
            showTime()
        }

        return
    }
    elapsedTimeInSeconds -= 1
    showTime()
}

function startOrPause() {
    if (rangeId) {
        audioPause.play();
        reset()
        return
    }
    audioPlay.play();
    startPauseBtnText.textContent = "Pausar"
    startPauseBtnIcon.setAttribute('src', `./assets/images/pause.png`)
    rangeId = setInterval(countdown, 1000)
}

function reset() {
    clearInterval(rangeId)
    startPauseBtnIcon.setAttribute('src', `./assets/images/play_arrow.png`)
    startPauseBtnText.textContent = "Começar"
    rangeId = null
}

function showTime() {
    const data = new Date(elapsedTimeInSeconds * 1000);
    const tempoFormatado = data.toLocaleTimeString('pt-Br', { minute: '2-digit', second: '2-digit' });
    timer.innerHTML = `${tempoFormatado}`
}
