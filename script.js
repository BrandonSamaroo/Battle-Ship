const playerBoardContainerEl = document.querySelector('.player-board');
const aiBoardContainerEl = document.querySelector('.ai-board');
const displayWinnerEl = document.querySelector('.display-winner');
const dockEl = document.querySelector('.dock');
const resetGameEl = document.querySelector('.reset-game');
const rotateShipeEl = document.querySelector('.rotate-ship');
const displayMessageEl = document.querySelector('.display-message')
rotateShipeEl.addEventListener('click', rotateBoats);
resetGameEl.addEventListener('click', resetGame);
const toggleMusicEl = document.querySelector('.toggle-music');
let isMusicPlaying = false;
toggleMusicEl.addEventListener('click', toggleMusic);
const volSlider = document.getElementById('volume');
const backgroundMusic = new Audio();
const soundPlayer = new Audio();
backgroundMusic.src= "assets/8bit-persona.mp3";
const sounds= {
        hitBoat: 'assets/hit.wav',
        missBoat: 'assets/miss.mp3',
        placeBoat: 'assets/drop.wav',
        rotateShips: 'assets/rotate.wav',
        boatDestroyed: 'assets/destroyed.ogg'
}
let playerTurn = true;
let selectedBoat;
let indexOfBoat;
let aiPatrolBoat;
let aiSubmarine;
let aiDestroyer;
let aiBattleship;
let aiCarrier;
let isGameDone;
let aiGuessedSpots = [];
let aiNextHitSpots = [];
soundPlayer.volume = volSlider.value;
backgroundMusic.volume = volSlider.value;

function toggleMusic()
{
    if (isMusicPlaying)
    {
        backgroundMusic.pause();
        isMusicPlaying = false;
        toggleMusicEl.src = "assets/audio-icon-muted.png";
    }
    else
    {
        backgroundMusic.play();
        isMusicPlaying = true;
        toggleMusicEl.src = "assets/audio-icon.png";
    }
}

volSlider.addEventListener('change',function()
{
    soundPlayer.volume = volSlider.value;
    backgroundMusic.volume = volSlider.value;
})

function playSound(name) {
    soundPlayer.src = sounds[name];
    soundPlayer.play();
}


class Player
{
    constructor(playerName)
    {
        this.playerName = playerName;
        this.boatSpots = [];
        this.boatsSunk = 0;
        this.isBoardReady = false;
        this.board = [];
    }
    createBoard(board)
    {
        let index = 0;
        for (let x = 0; x < 10; x++)
        {
            for (let i = 0; i < 10; i++)
            {
                let divEL = document.createElement('div');
                divEL.setAttribute('id',`${index}`);
                divEL.classList.add(`grid-item`);
                divEL.classList.add(`${this.playerName}`)
                index++;
                if (this.playerName == "Player")
                {
                    divEL.addEventListener('dragover', dragOver);
                    divEL.addEventListener('dragenter', dragEnter);
                    divEL.addEventListener('dragleave', dragLeave);
                    divEL.addEventListener('drop', dragDrop);
                }
                this.board.push(divEL);
                board.appendChild(divEL);
            }
        }
    }
}

class playerBoats
{
    constructor(name, length)
    {
        this.name = name;
        this.length = length;
        this.hasShipBeenPlaced = false;
        this.isShipsVertical = true;
        this.hitsTaken = 0;
        this.shipEL = this.createBoat();
        this.placeBoat();
    }

    createBoat()
    {
        let shipEL = [];
        let index = 0;
        for (let i = 0; i < this.length; i++)
        {
            let divEL = document.createElement('div');
            divEL.setAttribute('id',`${index}`);
            divEL.classList.add(`boat-piece`);
            divEL.classList.add(`${this.name}`);
            divEL.setAttribute("draggable", "true"); 
            divEL.addEventListener('dragstart',dragStart);
            shipEL.push(divEL);
            index++;
        }
        return shipEL
    }

    placeBoat()
    {
        if (this.hasShipBeenPlaced == false)
        {
            this.shipEL.forEach((divEL,idx) => {
                if(this.isShipsVertical)
                {
                    divEL.style.width = '50%';
                    divEL.style.height = '100%';
                    if(idx == this.shipEL.length-1)
                    {
                        divEL.style.width = '50%';
                        divEL.style.height = '75%';
                        divEL.style.margin = '0%'
                        divEL.style.marginBottom = '25%';
                        divEL.style.borderRadius = "0px 0px 30px 30px";
                    }
                    if(idx == 0)
                    {
                        divEL.style.width = '50%';
                        divEL.style.height = '75%';
                        divEL.style.margin = '0%'
                        divEL.style.marginTop = '25%'
                        divEL.style.borderRadius = "30px 30px 0px 0px";
                    }
                    
                    if(this.name === "Patrol-Boat")
                    {
                        dockBoard[idx*5].appendChild(divEL)
                    }
                    else if(this.name === "Submarine")
                    {
                        dockBoard[(idx*5)+1].appendChild(divEL)
                    }
                    else if(this.name === "Destroyer")
                    {
                        dockBoard[(idx*5)+2].appendChild(divEL)
                    }
                    else if(this.name === "Battleship")
                    {
                        dockBoard[(idx*5)+3].appendChild(divEL)
                    }
                    else if(this.name === "Carrier")
                    {
                        dockBoard[(idx*5)+4].appendChild(divEL)
                    }
                }
                else
                {
                    
                    divEL.style.width = '100%';
                    divEL.style.height = '50%';
                    if(idx == this.shipEL.length-1)
                    {
                        divEL.style.width = '75%';
                        divEL.style.height = '50%';
                        divEL.style.margin = '0%'
                        divEL.style.marginRight = '25%';
                        divEL.style.borderRadius = "0px 30px 30px 0px";
                    }
                    if(idx == 0)
                    {
                        divEL.style.width = '75%';
                        divEL.style.height = '50%';
                        divEL.style.margin = '0%'
                        divEL.style.marginLeft = '25%'
                        divEL.style.borderRadius = "30px 0px 0px 30px";
                    }
                    if(this.name === "Patrol-Boat")
                    {
                        dockBoard[idx].appendChild(divEL)
                    }
                    else if(this.name === "Submarine")
                    {
                        dockBoard[5+idx].appendChild(divEL)
                    }
                    else if(this.name === "Destroyer")
                    {
                        dockBoard[10+idx].appendChild(divEL)
                    }
                    else if(this.name === "Battleship")
                    {
                        dockBoard[15+idx].appendChild(divEL)
                    }
                    else if(this.name === "Carrier")
                    {
                        dockBoard[20+idx].appendChild(divEL)
                    }
                }
            });
        }
    }
}

class aiBoats
{
    constructor(name, length)
    {
        this.name = name;
        this.length = length;
        this.hasShipBeenPlaced = false;
        this.isShipsVertical = true;
        this.hitsTaken = 0;
        this.shipEL = this.createBoat();
        this.placeBoat();
    }
    createBoat()
    {
        let shipEL = [];
        let index = 0;
        for (let i = 0; i < this.length; i++)
        {
            let divEL = document.createElement('div');
            divEL.setAttribute('id',`${index}`);
            divEL.classList.add(`boat-piece`);
            divEL.classList.add(`${this.name}`);
            shipEL.push(divEL);
            index++;
        }
        return shipEL
    }
    placeBoat()
    {
        let counter;
        let startingSpot;
        if (Math.random() < 0.5)
        {
            this.isShipsVertical = false;
        }

        if (this.isShipsVertical == true)
        {
            while(counter != this.length)
            {
                counter = 0;
                startingSpot = Math.floor(Math.random()*(100-((this.length-1)*10)));
                for (let i = 0; i<this.length; i++)
                {
                    if(myAI.board[startingSpot+(i*10)].childNodes.length != 0)
                    {
                        break;
                    }
                    counter++;
                }
            }
        }
        else
        {
            while(counter != this.length)
            {
                counter = 0;
                let startingRow = Math.floor(Math.random()*10).toString();
                let startingColumn = Math.floor(Math.random()*(10-(this.length-1))).toString();
                startingSpot = startingRow + startingColumn;
                startingSpot = parseInt(startingSpot);
                for (let i = 0; i<this.length; i++)
                {
                    if(myAI.board[startingSpot+i].childNodes.length != 0)
                    {
                        break;
                    }
                    counter++;
                }
            }
        }

        this.shipEL.forEach((divEL,idx) => {
            if(this.isShipsVertical)
            {
                divEL.style.width = '50%';
                divEL.style.height = '100%';
                if(idx == this.shipEL.length-1)
                {
                    divEL.style.width = '50%';
                    divEL.style.height = '75%';
                    divEL.style.margin = '0%'
                    divEL.style.marginBottom = '25%';
                    divEL.style.borderRadius = "0px 0px 30px 30px";
                }
                if(idx == 0)
                {
                    divEL.style.width = '50%';
                    divEL.style.height = '75%';
                    divEL.style.margin = '0%'
                    divEL.style.marginTop = '25%'
                    divEL.style.borderRadius = "30px 30px 0px 0px";
                }
                divEL.style.display = "none";
                myAI.board[startingSpot+(idx*10)].appendChild(divEL);
                myAI.boatSpots.push(parseInt(myAI.board[startingSpot+(idx*10)].id));
            }
            else
            {
                divEL.style.width = '100%';
                divEL.style.height = '50%';
                if(idx == this.shipEL.length-1)
                {
                    divEL.style.width = '75%';
                    divEL.style.height = '50%';
                    divEL.style.margin = '0%'
                    divEL.style.marginRight = '25%';
                    divEL.style.borderRadius = "0px 30px 30px 0px";
                }
                if(idx == 0)
                {
                    divEL.style.width = '75%';
                    divEL.style.height = '50%';
                    divEL.style.margin = '0%'
                    divEL.style.marginLeft = '25%'
                    divEL.style.borderRadius = "30px 0px 0px 30px";
                }
                divEL.style.display = "none";
                myAI.board[startingSpot+idx].appendChild(divEL)
                myAI.boatSpots.push(parseInt(myAI.board[startingSpot+idx].id));
            }
        });
    }
}

function rotateBoats()
{
    patrolBoat.isShipsVertical = !patrolBoat.isShipsVertical;
    submarine.isShipsVertical = !submarine.isShipsVertical;
    destroyer.isShipsVertical = !destroyer.isShipsVertical;
    battleship.isShipsVertical = !battleship.isShipsVertical;
    carrier.isShipsVertical = !carrier.isShipsVertical;
    patrolBoat.placeBoat();
    submarine.placeBoat();
    destroyer.placeBoat();
    battleship.placeBoat();
    carrier.placeBoat();
    playSound('rotateShips');
}

function createDock ()
{
    let dockBoard = [];
    let index=0
    for (let x = 0; x < 5; x++)
    {
        for (let i = 0; i < 5; i++)
        {
            let divEL = document.createElement('div');
            divEL.setAttribute('id',`dock-${index}`);
            divEL.classList.add("dock-item");
            dockEl.appendChild(divEL);
            dockBoard.push(divEL);
            index++;
        }
    }
    return dockBoard;
}

function getObject(nameOfBoat)
{
    if(nameOfBoat === "Patrol-Boat")
    {
        return patrolBoat;
    }
    else if(nameOfBoat === "Submarine")
    {
        return submarine;
    }
    else if(nameOfBoat === "Destroyer")
    {
        return destroyer;
    }
    else if(nameOfBoat === "Battleship")
    {
        return battleship;
    }
    else if(nameOfBoat === "Carrier")
    {
        return carrier;
    }
    else if(nameOfBoat === "Ai-Patrol-Boat")
    {
        return aiPatrolBoat;
    }
    else if(nameOfBoat === "Ai-Submarine")
    {
        return aiSubmarine;
    }
    else if(nameOfBoat === "Ai-Destroyer")
    {
        return aiDestroyer;
    }
    else if(nameOfBoat === "Ai-Battleship")
    {
        return aiBattleship;
    }
    else if(nameOfBoat === "Ai-Carrier")
    {
        return aiCarrier;
    }
}

function dragStart(e)
{
    selectedBoat = getObject(e.target.classList[1]);
    indexOfBoat =  e.target.id;
}

function dragOver(e)
{
    e.preventDefault();
    let boardIdx = parseInt(e.target.id);
    if(selectedBoat.isShipsVertical == true)
    {
        if((10*indexOfBoat)>boardIdx)
        {

        }
        else if(((selectedBoat.length-1)*10)-(10*indexOfBoat)>99-boardIdx)
        {

        }
        else{
            let placeableBoatLenght = 0;
            for(let i=0; i<selectedBoat.length; i++)
            {
                if(myPlayer.board[boardIdx-(indexOfBoat*10)+(i*10)].childNodes.length == 0)
                {
                    placeableBoatLenght++;
                }
            }
            if (placeableBoatLenght == selectedBoat.length)
            {
                for(let i=0; i<selectedBoat.length; i++)
                {
                    myPlayer.board[boardIdx-(indexOfBoat*10)+(i*10)].classList.add('isHovered');
                }
            }
        }
    }
    else
    {
        if(10-(boardIdx%10)<(selectedBoat.length)-indexOfBoat)
        {

        }
        else if(boardIdx%10<indexOfBoat)
        {

        }
        else{
            let placeableBoatLenght = 0;
            for(let i=0; i<selectedBoat.length; i++)
            {
                if(myPlayer.board[boardIdx-(indexOfBoat)+(i)].childNodes.length == 0)
                {
                    placeableBoatLenght++;
                }
            }
            if (placeableBoatLenght == selectedBoat.length)
            {
                for(let i=0; i<selectedBoat.length; i++)
                {
                    myPlayer.board[boardIdx-(indexOfBoat)+(i)].classList.add('isHovered');
                }
            }
        }
    }
}

function dragEnter()
{
    //needed for drag to work
}

function dragLeave(e)
{
    let boardIdx = parseInt(e.target.id);
    if(selectedBoat.isShipsVertical == true)
    {
        if((10*indexOfBoat)>boardIdx)
        {

        }
        else if(((selectedBoat.length-1)*10)-(10*indexOfBoat)>99-boardIdx)
        {

        }
        else{
            let placeableBoatLenght = 0;
            for(let i=0; i<selectedBoat.length; i++)
            {
                if(myPlayer.board[boardIdx-(indexOfBoat*10)+(i*10)].childNodes.length == 0)
                {
                    placeableBoatLenght++;
                }
            }
            if (placeableBoatLenght == selectedBoat.length)
            {
                for(let i=0; i<selectedBoat.length; i++)
                {
                    myPlayer.board[boardIdx-(indexOfBoat*10)+(i*10)].classList.remove('isHovered');
                }
            }
        }
    }
    else
    {
        if(10-(boardIdx%10)<(selectedBoat.length)-indexOfBoat)
        {

        }
        else if(boardIdx%10<indexOfBoat)
        {

        }
        else{
            let placeableBoatLenght = 0;
            for(let i=0; i<selectedBoat.length; i++)
            {
                if(myPlayer.board[boardIdx-(indexOfBoat)+(i)].childNodes.length == 0)
                {
                    placeableBoatLenght++;
                }
            }
            if (placeableBoatLenght == selectedBoat.length)
            {
                for(let i=0; i<selectedBoat.length; i++)
                {
                    myPlayer.board[boardIdx-(indexOfBoat)+(i)].classList.remove('isHovered');
                }
            }
        }
    }
}

function dragDrop(e)
{
    let boardIdx = parseInt(e.target.id);
    if(selectedBoat.isShipsVertical == true)
    {
        if((10*indexOfBoat)>boardIdx)
        {

        }
        else if(((selectedBoat.length-1)*10)-(10*indexOfBoat)>99-boardIdx)
        {

        }
        else{
            let placeableBoatLenght = 0;
            for(let i=0; i<selectedBoat.length; i++)
            {
                if(myPlayer.board[boardIdx-(indexOfBoat*10)+(i*10)].childNodes.length == 0)
                {
                    placeableBoatLenght++;
                }
            }
            if (placeableBoatLenght == selectedBoat.length)
            {
                for(let i=0; i<selectedBoat.length; i++)
                {
                    myPlayer.board[boardIdx-(indexOfBoat*10)+(i*10)].classList.remove('isHovered');
                    myPlayer.board[boardIdx-(indexOfBoat*10)+(i*10)].appendChild(selectedBoat.shipEL[i])
                    selectedBoat.shipEL[i].classList.add('placedBoatPlayer');
                    myPlayer.boatSpots.push(parseInt(myPlayer.board[boardIdx-(indexOfBoat*10)+(i*10)].id));
                    selectedBoat.hasShipBeenPlaced = true;
                    playSound('placeBoat');
                }
            }
        }
    }
    else
    {
        if(10-(boardIdx%10)<(selectedBoat.length)-indexOfBoat)
        {

        }
        else if(boardIdx%10<indexOfBoat)
        {

        }
        else{
            let placeableBoatLenght = 0;
            for(let i=0; i<selectedBoat.length; i++)
            {
                if(myPlayer.board[boardIdx-(indexOfBoat)+(i)].childNodes.length == 0)
                {
                    placeableBoatLenght++;
                }
            }
            if (placeableBoatLenght == selectedBoat.length)
            {
                for(let i=0; i<selectedBoat.length; i++)
                {
                    myPlayer.board[boardIdx-(indexOfBoat)+(i)].classList.remove('isHovered');
                    myPlayer.board[boardIdx-(indexOfBoat)+(i)].appendChild(selectedBoat.shipEL[i]);
                    selectedBoat.shipEL[i].classList.add('placedBoatPlayer');
                    myPlayer.boatSpots.push(parseInt(myPlayer.board[boardIdx-(indexOfBoat)+(i)].id));
                    selectedBoat.hasShipBeenPlaced = true;
                    playSound('placeBoat');
                }
            }
        }
    }
    isPlayerReady();
}


function isPlayerReady()
{
    if(myPlayer.boatSpots.length == 17)
    {
        myPlayer.isBoardReady = true;
        aiPatrolBoat = new aiBoats("Ai-Patrol-Boat", 2);
        aiSubmarine = new aiBoats("Ai-Submarine", 3);
        aiDestroyer = new aiBoats("Ai-Destroyer", 3);
        aiBattleship = new aiBoats("Ai-Battleship", 4);
        aiCarrier = new aiBoats("Ai-Carrier", 5);
        myAI.board.forEach((spot)=>
        {
            spot.addEventListener('click', detectHit);
        })
        displayMessageEl.textContent = "Select a Spot To Hit On AI Board"
    }
}

function detectHit(e)
{
    if (playerTurn === true)
    {
        if(e.target.children.length != 0)
        {
            e.target.appendChild(document.createTextNode("X"));
            e.target.classList.add('spotHit');
            checkBoatSunk(e.target.children[0].classList[1],myAI,myPlayer)
            if (!isGameDone)
            {
                e.target.removeEventListener('click', detectHit);
                playerTurn = false;
                window.setTimeout(aiTurn, 2000);
            }
        }
        else
        {
            displayMessageEl.textContent = `You Missed`;
            e.target.appendChild(document.createTextNode("X"));
            e.target.classList.add('spotMiss');
            e.target.removeEventListener('click', detectHit);
            playerTurn = false;
            window.setTimeout(aiTurn, 2000);
            playSound('missBoat');
        }
    }
}

function checkBoatSunk(boatHit,enemy, player)
{
    playSound('hitBoat');
    let currentBoat = getObject(boatHit);
    currentBoat.hitsTaken++;
    if (currentBoat.hitsTaken == currentBoat.length)
    {
        playSound('boatDestroyed');
        currentBoat.shipEL.forEach((element)=>
        {
            element.style.display = "flex";
            element.innerText = "X";
            element.style.color = "red";
            // element.style.backgroundColor = "red";
            if (player == myPlayer)
            {
                element.parentElement.removeChild(element.parentElement.childNodes[1])
            }
        })
        displayMessageEl.textContent = `${currentBoat.name} Has Been Sunk!`
        enemy.boatsSunk++;
        if(enemy.playerName == "AI")
        {
            isGameDone = checkPlayerWin(player,enemy);
        }
        else
        {
            isGameDone = checkPlayerWin(player,enemy);
        }
    }
    else
    {
        displayMessageEl.textContent = `${player.playerName} Hit a Boat!`;
    }
}

function checkPlayerWin(player, enemy)
{
    if(enemy.boatsSunk == 5)
    {
        displayMessageEl.textContent = `${player.playerName} Has Won!`
        myAI.board.forEach((spot)=>
        {
            spot.removeEventListener('click', detectHit);
        })
        return true;
    }
    return false;
}

function aiTurn()
{
    let selectedSpot;
    let randomIndx;
    if(aiNextHitSpots.length == 0)
    {
        randomIndx = aiAllPossibleSpots[Math.floor(Math.random()*aiAllPossibleSpots.length)]
        selectedSpot = myPlayer.board[randomIndx];
    }
    else
    {
        randomIndx = Math.floor(Math.random()*aiNextHitSpots.length)
        selectedSpot = myPlayer.board[aiNextHitSpots[randomIndx]]
    }

    if(selectedSpot.children.length != 0)
    {
        selectedSpot.classList.add('spotHit');
        selectedSpot.children[0].appendChild(document.createTextNode("X"));
        selectedSpot.children[0].style.color = "red";
        checkBoatSunk(selectedSpot.children[0].classList[1], myPlayer, myAI);
        aiNextHitSpots = [];
        let indexUp = parseInt(selectedSpot.id)+10;
        let indexDown =  parseInt(selectedSpot.id)-10
        let indexRight = parseInt(selectedSpot.id)+1
        let indexLeft = parseInt(selectedSpot.id)-1
        if(indexUp < 99 && !myPlayer.board[indexUp].classList.contains('spotHit') && !myPlayer.board[indexUp].classList.contains('spotMiss'))
        {
            aiNextHitSpots.push(indexUp);
        }
        if(indexDown > 0 && !myPlayer.board[indexDown].classList.contains('spotHit') && !myPlayer.board[indexDown].classList.contains('spotMiss'))
        {
            aiNextHitSpots.push(indexDown);
        }
        if(indexRight%10 != 0 && indexRight < 99 && !myPlayer.board[indexRight].classList.contains('spotHit')&& !myPlayer.board[indexRight].classList.contains('spotMiss'))
        {
            aiNextHitSpots.push(indexRight);
        }
        if(indexLeft%10 != 9 && indexLeft > 0 && !myPlayer.board[indexLeft].classList.contains('spotHit') && !myPlayer.board[indexLeft].classList.contains('spotMiss'))
        {
            aiNextHitSpots.push(indexLeft);
        }
        else
        {
            aiNextHitSpots = [];
        }
    }
    else
    {
        playSound('missBoat');
        displayMessageEl.textContent = `AI Missed!`;
        selectedSpot.classList.add('spotMiss');
        selectedSpot.appendChild(document.createTextNode("X"));
        aiNextHitSpots.splice(randomIndx,1);
    }
    aiGuessedSpots.push(selectedSpot.id);
    aiAllPossibleSpots.splice(aiAllPossibleSpots.indexOf(parseInt(selectedSpot.id)),1);
    playerTurn = true;
}

let myPlayer = new Player("Player");
let myAI = new Player("AI");
let dockBoard = createDock();
myPlayer.createBoard(playerBoardContainerEl);
myAI.createBoard(aiBoardContainerEl);
let patrolBoat = new playerBoats("Patrol-Boat", 2);
let submarine = new playerBoats("Submarine", 3);
let destroyer = new playerBoats("Destroyer", 3);
let battleship = new playerBoats("Battleship", 4);
let carrier = new playerBoats("Carrier", 5);
let aiAllPossibleSpots = [];
myPlayer.board.forEach((element)=>
{
    aiAllPossibleSpots.push(parseInt(element.id));
});

function resetGame()
{
    location.reload(); 
}


//hit sound miss
//hit sound hit
//place boat sound
//mechanical rotate sound
//bolder font for logo
