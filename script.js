const round = document.getElementById('round');
const simonButtons = document.getElementsByClassName('cuadrado');
const startButton = document.getElementById('startButton');

class Simon {
    constructor(simonButtons,startButton,round){
        this.round = 0;
        this.PJugador = 0;
        this.RondasTotales = 2;
        this.secuencia = [];
        this.speed = 1000;
        this.blockedButtons = true;
        this.buttons = Array.from(simonButtons);
        this.display = {
            startButton,
            round
        }

        this.errorSound = new Audio('./sonidos/you_died.mp3');
        this.buttonSounds = [ 
            new Audio('./sonidos/sounds_1.mp3'),
            new Audio('./sonidos/sounds_2.mp3'),
            new Audio('./sonidos/sounds_3.mp3'),
            new Audio('./sonidos/sounds_4.mp3'),

        ]
    }
    init() {
        this.display.startButton.onclick = () => this.startGame();
    }

    startGame() {
        this.display.startButton.disabled = true; 
        this.updateRound(0);
        this.PJugador = 0;
        this.secuencia = this.createSequence();
        this.buttons.forEach((element, i) => {
            element.classList.remove('winner');
            element.onclick = () => this.buttonClick(i);
        });
        this.showSequence();
    }

    updateRound(value) {
        this.round = value;
        this.display.round.textContent = `Round ${this.round}`;
    }

    createSequence() {
        return Array.from({length: this.RondasTotales}, () =>  this.getRandomColor());
    }

     getRandomColor() {
        return Math.floor(Math.random() * 4);
    }

    buttonClick(value) {
        !this.blockedButtons && this.validateChosenColor(value);
    }

    validateChosenColor(value) {
        if(this.secuencia[this.PJugador] === value) {
            this.buttonSounds[value].play();
            if(this.round === this.PJugador) {
                this.updateRound(this.round + 1);
                this.speed /= 1.02;
                this.isGameOver();
            } else {
                this.PJugador++;
            }
        } else {
            this.gameLost();
        }
    }

    isGameOver() {
        if (this.round === this.RondasTotales) {
            this.gameWon();
        } else {
            this.PJugador = 0;
            this.showSequence();
        };
    }

    showSequence() {
        this.blockedButtons = true;
        let sequenceIndex = 0;
        let timer = setInterval(() => {
            const button = this.buttons[this.secuencia[sequenceIndex]];
            this.buttonSounds[this.secuencia[sequenceIndex]].play();
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

    gameLost() {
        this.errorSound.play();
        this.display.startButton.disabled = false; 
        this.blockedButtons = true;
    }

    gameWon() {
        this.display.startButton.disabled = false; 
        this.blockedButtons = true;
        this.buttons.forEach(element =>{
            element.classList.add('winner');
        });
        this.updateRound('Le sabes 👍 ');
    }
}
const simon = new Simon(simonButtons,startButton,round);
simon.init();

