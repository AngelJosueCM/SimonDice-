const round = document.getElementById('round');
const simonButtons = document.getElementsByClassName('square');
const startButton = document.getElementById('startButton');

class Simon {
    constructor(simonButtons, startButton, round) {
        this.round = 0;
        this.userPosition = 0;
        this.totalRounds = 10;
        this.sequence = [];
        this.speed = 1000;
        this.blockedButtons = true;
        this.buttons = Array.from(simonButtons);
        this.display = {
            startButton,
            round
        }
        this.errorSound = new Audio('./sonidos/sounds_error.wav');
        this.buttonSounds = [
            new Audio('/sonidos/sounds_1.mp3'),
            new Audio('/sonidos/sounds_2.mp3'),
            new Audio('/sonidos/sounds_3.mp3'),
            new Audio('/sonidos/sounds_4.mp3')
        ]
    }

    inicio() {
        this.display.startButton.onclick = () => this.empezarJuego();
    }

    empezarJuego() {
        this.display.startButton.disabled = true; 
        this.actualizarRonda(0);
        this.userPosition = 0;
        this.sequence = this.crearSecuencia();
        this.buttons.forEach((element, i) => {
            element.classList.remove('Ganador');
            element.onclick = () => this.buttonClick(i);
        });
        this.showSequence();
    }

    actualizarRonda(value) {
        this.round = value;
        this.display.round.textContent = `Round ${this.round}`;
    }

    crearSecuencia() {
        return Array.from({length: this.totalRounds}, () =>  this.getRandomColor());
    }

    getRandomColor() {
        return Math.floor(Math.random() * 4);
    }

    buttonClick(value) {
        !this.blockedButtons && this.validateChosenColor(value);
    }

    validateChosenColor(value) {
        if(this.sequence[this.userPosition] === value) {
            this.buttonSounds[value].play();
            if(this.round === this.userPosition) {
                this.actualizarRonda(this.round + 1);
                this.speed /= 1.02;
                this.isGameOver();
            } else {
                this.userPosition++;
            }
        } else {
            this.Perdiste();
        }
    }

    isGameOver() {
        if (this.round === this.totalRounds) {
            this.Ganaste();
        } else {
            this.userPosition = 0;
            this.showSequence();
        };
    }

    showSequence() {
        this.blockedButtons = true;
        let sequenceIndex = 0;
        let timer = setInterval(() => {
            const button = this.buttons[this.sequence[sequenceIndex]];
            this.buttonSounds[this.sequence[sequenceIndex]].play();
            this.toggleButtonStyle(button)
            setTimeout( () => this.toggleButtonStyle(button), this.speed / 2)
            sequenceIndex++;
            if (sequenceIndex > this.round) {
                this.blockedButtons = false;
                clearInterval(timer);
            }
        }, this.speed);
    }

    toggleButtonStyle(button) {
        button.classList.toggle('active');
    }

    Perdiste() {
        this.errorSound.play();
        this.display.startButton.disabled = false; 
        this.blockedButtons = true;
    }

    Ganaste() {
        this.display.startButton.disabled = false; 
        this.blockedButtons = true;
        this.buttons.forEach(element =>{
            element.classList.add('Ganador');
        });
        this.updateRound('Le sabes 👍 ');
    }
}

const simon = new Simon(simonButtons, startButton, round);
simon.inicio();