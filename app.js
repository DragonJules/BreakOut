const gameZone = document.querySelector('section')

const bricks = [...document.querySelectorAll('.brick')]


const pScore = document.getElementById("score") 
let score = parseInt(pScore.innerHTML.replace('Score: ', '').replace(' pts', ''))

const pBestScore = document.getElementById("bestscore") 
let bestScore = parseInt(pBestScore.innerHTML.replace('Best score: ', '').replace(' pts', ''))
bestScore = checkCookie('best-normal-score', 0, 365)
pBestScore.innerHTML = 'Best score: '+bestScore.toString()+' pts'

function increaseScore(){
    score ++;
    pScore.innerHTML = 'Score: '+score.toString()+' pts'
}


function resetScore(){
    score = 0;
    pScore.innerHTML = 'Score: '+score.toString()+' pts'
}

let width = gameZone.offsetWidth
let height = gameZone.offsetHeight - 18


let startScreenChildren = [...document.querySelector('#startscreen').children]

//difficulty
const elDifficulties = [...document.querySelectorAll('.difficulty')]
const pDifficulty = document.getElementById('difficulty')


let difficulties = [
    {
        name: 'Normal',
        randomXvelocity: 0,
        velocity: 12,
        harderBricks: [10, 15],
        firstHardestBricks: 2
    },
    {
        name: 'Difficult',
        randomXvelocity: 1,
        velocity: 14,
        harderBricks: [15, 20],
        firstHardestBricks: 4
    },
    {
        name: 'Hard',
        randomXvelocity: 4,
        velocity: 20,
        harderBricks: [20, 30],
        firstHardestBricks: 8
    },
    {
        name: 'Rainbow',
        randomXvelocity: 4,
        velocity: 20,
        harderBricks: [20, 30],
        firstHardestBricks: 8
    }
]
let difficultyLevel = 0;
let difficulty = difficulties[difficultyLevel];

function changeBestScore(){
    if(score > bestScore) {
        bestScore = score; 
        pBestScore.innerHTML = 'Best score: '+bestScore.toString()+' pts'

        setCookie(`best-${difficulty.name.toLowerCase()}-score`, bestScore.toString(), 365)
    }

}


let hardestBricks = difficulty.firstHardestBricks;

let addHardestBricks = 0;

let scrollValue = 1;

let rainbowed = false;

function changeDifficulty(e) {
    let direction = e.deltaY * 0.01
    direction = direction > 0? 1: -1
    console.log('direction:', direction)


    if((scrollValue < 4000 && direction > 0) || (scrollValue > 0 && direction < 0 && scrollValue!=1)){
        scrollValue += direction
        
    }
    console.log(scrollValue, difficultyLevel)


    if((difficultyLevel > 0 && direction < 0) || (difficultyLevel < 2 && direction > 0)){        
        difficultyLevel += direction

        difficulty = difficulties[difficultyLevel];
        pDifficulty.innerHTML = pDifficulty.innerHTML.substring(0, 13) + difficulty.name


        bestScore = checkCookie(`best-${difficulty.name.toLowerCase()}-score`, 0, 365)
        pBestScore.innerHTML = 'Best score: '+bestScore.toString()+' pts'

        hardestBricks = difficulty.firstHardestBricks;
    }   

    if(scrollValue == 4000){
        difficultyLevel = 3

        difficulty = difficulties[difficultyLevel];
        pDifficulty.innerHTML = pDifficulty.innerHTML.substring(0, 13) + difficulty.name

        document.body.classList.add('rainbow')
        rainbowed = true

        bestScore = checkCookie(`best-${difficulty.name.toLowerCase()}-score`, 0, 365)
        pBestScore.innerHTML = 'Best score: '+bestScore.toString()+' pts'

        hardestBricks = difficulty.firstHardestBricks;
    }else if(rainbowed){
        document.body.classList.remove('rainbow')

        rainbowed = false
    }

}


document.addEventListener('wheel', changeDifficulty)


// racket element statements
const elRacket = document.getElementById('racket')
elRacket.style.left = '50%'
elRacket.style.top = '94%'    

let racketAbsoluteLeft = parseInt(elRacket.style.left.replace('%', ''))
let racketAbsoluteTop = parseInt(elRacket.style.top.replace('%', ''))

let racketX = Math.floor((racketAbsoluteLeft/100)*width);
let racketY = Math.floor((racketAbsoluteTop/100)*height);

let racketSize = 150;


// ball element statements
const elBall = document.getElementById('ball')
elBall.style.left = '50%'
elBall.style.top = '80%'


let ballAbsoluteLeft = parseInt(elBall.style.left.replace('%', ''))
let ballAbsoluteTop = parseInt(elBall.style.top.replace('%', ''))

let ballX = Math.floor((ballAbsoluteLeft/100)*width);
let ballY = Math.floor((ballAbsoluteTop/100)*height);


let gravity = 0.02;
let friction = 0.90;

let radius = 19

// bricks

let brickWidth = Math.floor((window.innerWidth - 30 - 30) * (10/108))
let brickHeight = Math.floor((window.innerHeight * 43/100) * (1/11))

let brickXSpacement = 14
let brickYSpacement = 10

let bricksState = [
    [1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1]
]

let ball;
let racket;

// Functions

let played = false;

function generateHarderBricks(){

    for (let i = 0; i < getRandomInt(difficulty.harderBricks[0], difficulty.harderBricks[1]); i++) {
        bricksState[getRandomInt(0, 9)][getRandomInt(0, 7)] = getRandomInt(2, hardestBricks + addHardestBricks) 
    }


    bricksState.forEach((columnBrickState, y) => {
        columnBrickState.forEach((brickState, x) => {
            let column = document.querySelector(`#column-${y}`)
            let brick = column.querySelector(`.row-${x}`)

            brick.classList.remove(brick.classList[brick.classList.length - 1])
            brick.classList.add('s'+brickState.toString())
        })
    })
}


function launchGame(){

    startScreenChildren.forEach((child, i) => {
        child.style.display = 'none'
    })
    elDifficulties.forEach(elDifficulty => {
        elDifficulty.style.display = 'none'
    })
    

    init()
    if(!played) animate()
    played = true
    started = true

    bricks.forEach(brick => {
        brick.style.display = ''
    })

    generateHarderBricks(3)

    resetScore()
    
    document.removeEventListener('click', startGame)
    document.removeEventListener('keydown', startGame)
    document.removeEventListener('wheel', changeDifficulty)
}

let started = false;
function startGame(e){
    if(started) return
    if(e.code && e.code == 'Space'){
        launchGame()
        return
    }
    else if(e.code && e.code != 'Space') return
    launchGame()
}

function startScreen () {

    changeBestScore()

    startScreenChildren.forEach((child, i) => {
        child.style.display = ''
    })
    elDifficulties.forEach(elDifficulty => {
        elDifficulty.style.display = ''
    })


    bricks.forEach(brick => {
        brick.style.display = 'none'
    })

    setTimeout(()=>{
        elBall.style.left = '50%'
        elBall.style.top = '80%'

        elRacket.style.left = '50%'
        elRacket.style.top = '94%'  
    }, 1)

    bricksState = [
        [1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1]
    ]

    document.addEventListener('click', startGame)
    document.addEventListener('keydown', startGame)
    document.addEventListener('wheel', changeDifficulty)

    started = false
}

addEventListener('load', () => {
    startScreen()

})

function findColumn(x) {
    let column = 0;
    if(x > brickXSpacement + brickWidth + brickXSpacement){
        column = 1
    }
    if(x > brickXSpacement + (brickWidth + brickXSpacement)*2){
        column = 2
    }
    if(x > brickXSpacement + (brickWidth + brickXSpacement)*3){
        column = 3
    }
    if(x > brickXSpacement + (brickWidth + brickXSpacement)*4){
        column = 4
    }
    if(x > brickXSpacement + (brickWidth + brickXSpacement)*5){
        column = 5
    }
    if(x > brickXSpacement + (brickWidth + brickXSpacement)*6){
        column = 6
    }
    if(x > brickXSpacement + (brickWidth + brickXSpacement)*7){
        column = 7
    }
    if(x > brickXSpacement + (brickWidth + brickXSpacement)*8){
        column = 8
    }
    if(x > brickXSpacement + (brickWidth + brickXSpacement)*9){
        column = 9
    }
    return column
}

function findRow(y) {
    let row;
    
    if(y < brickYSpacement + (brickHeight + brickYSpacement)*8 + 1){
        row = undefined
    }

    if(y < brickYSpacement + (brickHeight + brickYSpacement)*8){
        row = 7
    }
    if(y < brickYSpacement + (brickHeight + brickYSpacement)*8 - brickHeight){
        row = 7
        
    }

    if(y < brickYSpacement + (brickHeight + brickYSpacement)*7){
        row = 6
    }
    if(y < brickYSpacement + (brickHeight + brickYSpacement)*7 - brickHeight){
        row = 6
        
    }

    if(y < brickYSpacement + (brickHeight + brickYSpacement)*6){
        row = 5
    }
    if(y < brickYSpacement + (brickHeight + brickYSpacement)*6 - brickHeight){
        row = 5
        
    }

    if(y < brickYSpacement + (brickHeight + brickYSpacement)*5){
        row = 4
    }
    if(y < brickYSpacement + (brickHeight + brickYSpacement)*5 - brickHeight){
        row = 4
        
    }

    if(y < brickYSpacement + (brickHeight + brickYSpacement)*4){
        row = 3
    }
    if(y < brickYSpacement + (brickHeight + brickYSpacement)*4 - brickHeight){
        row = 3
        
    }

    if(y < brickYSpacement + (brickHeight + brickYSpacement)*3){
        row = 2
    }
    if(y < brickYSpacement + (brickHeight + brickYSpacement)*3 - brickHeight){
        row = 2
        
    }

    if(y < brickYSpacement + (brickHeight + brickYSpacement)*2){
        row = 1
    }
    if(y < brickYSpacement + (brickHeight + brickYSpacement)*2 - brickHeight){
        row = 1
        
    }

    if(y < brickYSpacement + (brickHeight + brickYSpacement)){
        row = 0
    }
    if(y < brickYSpacement + (brickHeight + brickYSpacement) - brickHeight){
        row = 0
        
    }
    

    return row
}

function destroyBrick(x, y){
    let column = document.querySelector(`#column-${x}`)
    let brick = column.querySelector(`.row-${y}`)

    let brickState = bricksState[x][y]

    brick.classList.remove(brick.classList[brick.classList.length - 1])
    brick.classList.add('s'+brickState.toString())


    let allBrickDestroyed = true;

    
    bricksState.forEach((columnBrickState, y) => {
        columnBrickState.forEach((brickState, x) => {
            if(brickState > 0){
                allBrickDestroyed = false;
            }
        })
    })
    

    if(allBrickDestroyed){
        bricksState = [
            [1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1]
        ]

        bricks.forEach(brick => {
            brick.classList.remove(brick.classList[brick.classList.length - 1])
            brick.classList.add('s'+brickState.toString())
        })

        addHardestBricks ++

        generateHarderBricks()
    }

}

function breakActualBrick(actualColumn, actualRow, velocityChanged) {
    
    ball.vy = - ball.vy    

    bricksState[actualColumn][actualRow] --

    if(velocityChanged) destroyBrick(actualColumn, actualRow);
    
    if(bricksState[actualColumn][actualRow] == 0) increaseScore()

}



let actualColumn;
let actualRow;
// Classes
class Ball {
    constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;

        this.actualColumn = actualColumn;
        this.actualRow = actualRow

        this.configuredvx = vx;
        this.configuredvy = vy;

        this.destroyed = false;

        this.update = () => {
            if(this.destroyed) return

            this.lastvy = vy;

            //ceiling detection
            if (this.y - radius + this.vy + 20 <= 0) {
                this.vy = -this.vy;
                this.vy = this.vy * friction;
                this.vx = this.vx * friction;
            } 
        
            //ground detection
            else if (this.y + radius + this.vy - 4 > height) {
                this.destroy();
            }

            //gravity
            else {
                this.vy += gravity;
            }
            
            //walls detection
            if (this.x - radius + this.vx >= width || this.x - radius + this.vx <= 0) {
                this.vx = -this.vx * friction;
            }
            
            //racket detection
            if (this.y + radius + this.vy - 4 > racketY && racketX - racketSize + 70 < this.x && this.x < racketX + racketSize - 60) {
                this.vy = -Math.abs(this.configuredvy);
                this.vx = this.vx;

                if(racket.lastPosition - racket.position < 0){
                    this.vx = 2;
                }
                if(racket.lastPosition - racket.position < -0.3){
                    this.vx = 5;
                }
                if(racket.lastPosition - racket.position < -0.6){
                    this.vx = 10;
                }

                if(racket.lastPosition - racket.position > 0){
                    this.vx = -2;
                }
                if(racket.lastPosition - racket.position > 0.3){
                    this.vx = -5;
                }
                if(racket.lastPosition - racket.position > 0.6){
                    this.vx = -10;
                }

                if(racket.lastPosition - racket.position == 0){
                    this.vx = this.configuredvx;
                }
            } else {
                this.vy += gravity;
            }

            //brick detection
            
            this.column = findColumn(this.x)
            this.row = findRow(this.y)
 
            this.actualBrick = bricksState[this.column][this.row]
            
            if (this.row != undefined && this.actualBrick > 0) {  
                breakActualBrick(this.column, this.row, this.vy != this.lastvy)
            }

            //add movement
            this.x += this.vx;
            this.y += this.vy;

            this.vx += getRandomInt(-difficulty.randomXvelocity, difficulty.randomXvelocity) / 10;

            this.move();

        };

        this.move = () => {
            let absoluteLeft = (this.x / width) * 100;
            let absoluteTop = (this.y / height) * 100;

            elBall.style.left = absoluteLeft.toString() + '%';
            elBall.style.top = absoluteTop.toString() + '%';

        };

        this.destroy = () => {
            this.destroyed = true;
            
            this.vx = 0
            this.vy = 0

            
            racket.destroy()
            startScreen()
        };
    }
}

class Racket {
    constructor(){

        this.position = parseInt(elRacket.style.left.split('%')[0]);
        this.lastPosition;

        this.mousePos;
        this.destroyed = false

        
        let maxLeft = (100 * 32/width) + (100 * (racketSize/2.3)/width)
        let maxRight = (100 * (width-32)/width) - (100 * (racketSize/4)/width)

        this.update = () => {
            if(this.destroyed) return

            if(this.mousePos > maxLeft && this.mousePos < maxRight){
                this.lastPosition = this.position;
                this.position = this.mousePos;
            }else if(this.mousePos < maxLeft){
                console.log
                this.lastPosition = this.position;
                this.position = maxLeft;
            }else if(this.mousePos > maxRight){
                console.log
                this.lastPosition = this.position;
                this.position = maxRight;
            }
            
            this.move()
        }

        this.move = () => {
            elRacket.style.left = this.position.toString()+'%'
    
            racketX = Math.floor((this.position/100)*width)
        }
        
        this.destroy = () => {
            this.destroyed = true;
        };
    }
}



// Game

function init(){

    ball = new Ball(ballX, ballY, 0, difficulty.velocity) 
    racket = new Racket()

    racket.lastPosition = racket.position

    document.addEventListener('keydown', e =>{
        if(e.code == 'Escape'){
            ball.destroy()
        }
    })

    document.addEventListener('mousemove', e => {
        let mousePos = e.screenX / window.innerWidth * 100
        racket.mousePos = mousePos
    })  
}

function animate() {
	requestAnimationFrame(animate);

    ball.update();
    racket.update();
}


//cookies handling (best score)
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

function checkCookie(cname, notThenValue, notThenExDays) {
    let cookie = getCookie(cname);
    if (cookie != "") {
      return cookie
    }else{
        setCookie(cname, notThenValue, notThenExDays)
        return 0
    }
}

//randomInt
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min +1)) + min;
  }

