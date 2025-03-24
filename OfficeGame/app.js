const app = new PIXI.Application({
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
});

const filesList = [];

//Bonus and Malus lists
const BonusList1 = [];
const MalusList1 = [];

document.body.appendChild(app.view);

//Remove white border around the canvas and make it fill the screen
document.body.style.margin = '0';
document.body.style.overflow = 'hidden';
document.documentElement.style.margin = '0';
document.documentElement.style.overflow = 'hidden';

app.view.style.position = 'absolute';
app.view.style.width = '100vw';
app.view.style.height = '100vh';

//Restrict browser window size to canvas size
function restrictWindowSize() {
    const canvasWidth = app.view.width;
    const canvasHeight = app.view.height;
    window.resizeTo(canvasWidth, canvasHeight);
}

//Call the function to restrict window size
restrictWindowSize();

//Adjust the initial browser window size to match the canvas
function adjustInitialWindowSize() {
    const canvasWidth = 800; //Base width of the canvas
    const canvasHeight = 600; //Base height of the canvas
    window.resizeTo(canvasWidth, canvasHeight);
    window.moveTo(0, 0); //Optional: Move the window to the top-left corner
}

//Call the function to adjust the initial window size
adjustInitialWindowSize();

const background = PIXI.Sprite.from('assets/office.png');
app.stage.addChild(background);

//Initialize sounds
var sound1 = new Howl({
    src: ['assets/soundGameOver.mp3']
});

var sound2 = new Howl({
    src: ['assets/soundOuch.mp3']
});

var sound3 = new Howl({
    src: ['assets/soundShoot.mp3']
});

var sound4 = new Howl({
    src: ['assets/soundHitPaper.mp3']
});

var sound5 = new Howl({
    src: ['assets/soundPaperFloor.mp3']
});

var sound6 = new Howl({
    src: ['assets/drums.mp3']
});

//Ensure sound6 loops when it ends
sound6.on('end', () => {
    sound6.play();
});

var sound7 = new Howl({
    src: ['assets/funnyBGM.mp3']
});

//Ensure sound7 loops when it ends
sound7.on('end', () => {
    sound7.play();
});

var sound8 = new Howl({
    src: ['assets/lifeUp.mp3']
});

var sound9 = new Howl({
    src: ['assets/lifeDown.mp3']
});

//Variable bullets
var bullets = 0;

//Style bullets
const bulletsstyle = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 38,
    fill: 'lightgreen',
    stroke: '#ffffff',
    strokeThickness: 4,
    dropShadow: true,
    dropShadowDistance: 5,
    dropShadowAngle: Math.PI / 2,
    dropShadowBlur: 4,
    dropShadowColor: '#000000'
});

//Text bullets
const bulletstext = new PIXI.Text('🔫 0', bulletsstyle);
bulletstext.x = 5;
bulletstext.y = 5;
app.stage.addChild(bulletstext);

//Variable life
let life = 3;

//Style life
const lifestyle = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 38,
    fill: 'red',
    stroke: '#ffffff',
    strokeThickness: 4,
    dropShadow: true,
    dropShadowDistance: 5,
    dropShadowAngle: Math.PI / 2,
    dropShadowBlur: 4,
    dropShadowColor: '#000000'
});

//Text life
const lifetext = new PIXI.Text('❤️ 3', lifestyle);
lifetext.x = 715;
lifetext.y = 535;
app.stage.addChild(lifetext);


//Variable score
var score = 0;

//Style score
const scorestyle = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 38,
    fill: 'deepskyblue',
    stroke: '#ffffff',
    strokeThickness: 4,
    dropShadow: true,
    dropShadowDistance: 5,
    dropShadowAngle: Math.PI / 2,
    dropShadowBlur: 4,
    dropShadowColor: '#000000'
});

//Style for efficiency text
const efficiencyStyle = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 36,
    fill: 'darkorange',
    stroke: '#ffffff',
    strokeThickness: 4,
    dropShadow: true,
    dropShadowDistance: 5,
    dropShadowAngle: Math.PI / 2,
    dropShadowBlur: 4,
    dropShadowColor: '#000000'
});

//Text object for efficiency
const efficiencyText = new PIXI.Text('', efficiencyStyle);
efficiencyText.x = 255;
efficiencyText.y = 480;
app.stage.addChild(efficiencyText);

//Text score
const scoretext = new PIXI.Text('🎯 0', scorestyle);
scoretext.x = 5;
scoretext.y = 535;
app.stage.addChild(scoretext);

const gameover = PIXI.Sprite.from('assets/gameover.png');
gameover.x = 210;
gameover.y = 80;
gameover.scale.x = 0.75;
gameover.scale.y = 0.75;

gameover.interactive = true;
gameover.buttonMode = true;
gameover.on('pointerdown', restartGame);

const worker = PIXI.Sprite.from('assets/worker.png');
worker.x = 368;
worker.y = 490;
worker.scale.x = 0.105;
worker.scale.y = 0.10;
app.stage.addChild(worker);

const ground = PIXI.Sprite.from('assets/ground.png');
ground.x = 0;
ground.y = 596;
ground.scale.x = 10;
ground.scale.y = 2;
app.stage.addChild(ground);

const titleScreen = PIXI.Sprite.from('assets/title.png');
titleScreen.x = 0;
titleScreen.y = 0;
titleScreen.width = 800; //title-screen-width in pixels
titleScreen.height = 600; //title-screen-height in pixels
app.stage.addChild(titleScreen);

//Play sound6 while title screen is active
sound6.loop = true; //Corrected looping method
sound6.play();

const easyButton = PIXI.Sprite.from('assets/easyButton.png');
easyButton.x = 450;
easyButton.y = 345;
easyButton.scale.set(0.15); //Scale the button
easyButton.interactive = true;
easyButton.buttonMode = true;
easyButton.on('pointerdown', () => startGame('easy'));

const normalButton = PIXI.Sprite.from('assets/normalButton.png');
normalButton.x = 450;
normalButton.y = 400;
normalButton.scale.set(0.15); //Scale the button
normalButton.interactive = true;
normalButton.buttonMode = true;
normalButton.on('pointerdown', () => startGame('normal'));

const hardButton = PIXI.Sprite.from('assets/hardButton.png');
hardButton.x = 450;
hardButton.y = 455;
hardButton.scale.set(0.15); //Scale the button
hardButton.interactive = true;
hardButton.buttonMode = true;
hardButton.on('pointerdown', () => startGame('hard'));

app.stage.addChild(easyButton);
app.stage.addChild(normalButton);
app.stage.addChild(hardButton);

//Variable for game time
let gameTime = 0.00;

//Style for game time
const timeStyle = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 38,
    fill: 'black',
    stroke: '#ffffff',
    strokeThickness: 4,
    dropShadow: true,
    dropShadowDistance: 5,
    dropShadowAngle: Math.PI / 2,
    dropShadowBlur: 4,
    dropShadowColor: '#000000'
});

//Text object for game time
const timeText = new PIXI.Text('⏱️ 0.00', timeStyle);
timeText.x = 690; //Adjusted to move further left
timeText.y = 5;
app.stage.addChild(timeText);

//Initially hide the timeText
timeText.visible = false;

//Function to update game time
let timeInterval;
function startGameTime() {
    gameTime = 0;
    updateTimeText();
    timeInterval = setInterval(() => {
        gameTime += 10; //Increment by 10 milliseconds
        updateTimeText();
    }, 10);
}

function updateTimeText() {
    const minutes = Math.floor(gameTime / 60000);
    const seconds = Math.floor((gameTime % 60000) / 1000);
    const milliseconds = Math.floor((gameTime % 1000) / 10);
    timeText.text = `⏱️ ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
}

function stopGameTime() {
    clearInterval(timeInterval);
}

function isOverlapping(sprite1, sprite2) {
    const rect1 = sprite1.getBounds();
    const rect2 = sprite2.getBounds();
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

//Utility function to check overlap with all existing sprites
function isOverlappingWithAny(sprite, spriteLists) {
    const rect1 = sprite.getBounds();
    return spriteLists.some(list =>
        list.some(existingSprite => {
            const rect2 = existingSprite.getBounds();
            return (
                rect1.x < rect2.x + rect2.width &&
                rect1.x + rect1.width > rect2.x &&
                rect1.y < rect2.y + rect2.height &&
                rect1.y + rect1.height > rect2.y
            );
        })
    );
}

//Utility function to generate random positions with dynamic ranges
function generateRandomPosition(sprite, spriteLists, maxAttempts = 100) {
    let x, y;
    let attempts = 0;
    const spriteWidth = sprite.width;
    const spriteHeight = sprite.height;

    do {
        x = random(0, 800 - spriteWidth); //Ensure the sprite fits within the canvas width
        y = random(-50, 0); //Generate positions above the visible canvas
        attempts++;
    } while (
        attempts < maxAttempts &&
        isOverlappingWithAny({ getBounds: () => ({ x, y, width: spriteWidth, height: spriteHeight }) }, spriteLists)
    );

    return attempts < maxAttempts ? { x, y } : null; //Return null if no valid position is found
}

function startGame(difficulty) {
    titleScreen.visible = false;
    easyButton.visible = false;
    normalButton.visible = false;
    hardButton.visible = false;

    //Show the timeText when the game starts
    timeText.visible = true;

    //Stop sound6 when game starts and play sound7
    sound6.stop();
    sound7.loop = true; //Corrected looping method
    sound7.play();

    //Start game time
    startGameTime();

    let gameSpeed;
    switch (difficulty) {
        case 'easy':
            gameSpeed = 2000;
            break;
        case 'normal':
            gameSpeed = 1350;
            break;
        case 'hard':
            gameSpeed = 900;
            break;
    }

    gameInterval(() => {
        //Add files to the game
        const files = PIXI.Sprite.from('assets/files.png');
        files.scale.set(0.03);
        const filesPosition = generateRandomPosition(files, [filesList, BonusList1, MalusList1]);
        if (filesPosition) {
            files.x = filesPosition.x;
            files.y = filesPosition.y;
            app.stage.addChild(files);
            filesList.push(files);
            flyDown(files, 2.9);
        }

        //Add Bonus1 with a 10% chance to the game
        if (Math.random() < 0.10) {
            const Bonus1 = PIXI.Sprite.from('assets/PowerUp+1.png');
            Bonus1.scale.set(0.035);
            const bonusPosition = generateRandomPosition(Bonus1, [filesList, BonusList1, MalusList1]);
            if (bonusPosition) {
                Bonus1.x = bonusPosition.x;
                Bonus1.y = bonusPosition.y;
                app.stage.addChild(Bonus1);
                BonusList1.push(Bonus1);
                flyDown(Bonus1, 3.7);
            }
        }

        //Add Malus1 with a 20% chance to the game
        if (Math.random() < 0.20) {
            const Malus1 = PIXI.Sprite.from('assets/PowerUp-1.png');
            Malus1.scale.set(0.035);
            const malusPosition = generateRandomPosition(Malus1, [filesList, BonusList1, MalusList1]);
            if (malusPosition) {
                Malus1.x = malusPosition.x;
                Malus1.y = malusPosition.y;
                app.stage.addChild(Malus1);
                MalusList1.push(Malus1);
                flyDown(Malus1, 3.7);
            }
        }

        waitForCollision(worker, files).then(function() {
            app.stage.removeChild(files);
            life -= 1;
            lifetext.text = `❤️ ${life}`;
            sound2.play();
            if (life <= 0) {
                app.stage.addChild(gameover);
                sound7.stop();
                stopGame();
                stopGameTime(); //Stop game time on game over
                sound1.play();
                let efficiency = bullets > 0 ? (score / bullets).toFixed(2) : 0;
                efficiencyText.text = `🏁 Efficiency: ${efficiency}`;
                app.stage.addChild(efficiencyText);
                background.interactive = true;
                background.buttonMode = true;
                background.on('pointerdown', restartGame);
            }
        });

        waitForCollision(worker, BonusList1).then(function([worker, bonus]) {
            app.stage.removeChild(bonus); //Entferne nur das kollidierte Bonus-Objekt
            BonusList1.splice(BonusList1.indexOf(bonus), 1); //Entferne es aus der Liste
            life += 1;
            lifetext.text = `❤️ ${life}`;
            sound8.play();
        });

        waitForCollision(worker, MalusList1).then(function([worker, malus]) {
            app.stage.removeChild(malus); //Entferne nur das kollidierte Malus-Objekt
            MalusList1.splice(MalusList1.indexOf(malus), 1); //Entferne es aus der Liste
            life -= 1;
            lifetext.text = `❤️ ${life}`;
            sound9.play();
            if (life <= 0) {
                app.stage.addChild(gameover);
                sound7.stop();
                stopGame();
                stopGameTime(); //Stop game time on game over
                sound1.play();
                let efficiency = bullets > 0 ? (score / bullets).toFixed(2) : 0;
                efficiencyText.text = `🏁 Efficiency: ${efficiency}`;
                app.stage.addChild(efficiencyText);
                background.interactive = true;
                background.buttonMode = true;
                background.on('pointerdown', restartGame);
            }
        });

        waitForCollision(ground, files).then(function() {
            app.stage.removeChild(files);
            life -= 1;
            lifetext.text = `❤️ ${life}`;
            sound5.play();
            if (life <= 0) {
                app.stage.addChild(gameover);
                sound7.stop();
                stopGame();
                stopGameTime(); //Stop game time on game over
                sound1.play();
                let efficiency = bullets > 0 ? (score / bullets).toFixed(2) : 0;
                efficiencyText.text = `🏁 Efficiency: ${efficiency}`;
                app.stage.addChild(efficiencyText);
                background.interactive = true;
                background.buttonMode = true;
                background.on('pointerdown', restartGame);
            }
        });
    }, gameSpeed);
}

function restartGame() {
    location.reload();
}

function leftKeyPressed() {
    worker.x = worker.x - 5.75;
}

function rightKeyPressed() {
    worker.x = worker.x + 5.75;
}

function spaceKeyPressed() {
    const bullet = PIXI.Sprite.from('assets/bullet.png');
    bullet.x = worker.x + 30;
    bullet.y = 460;
    bullet.scale.x = 0.02; 
    bullet.scale.y = 0.02;
    flyUp(bullet);
    bullets += 1;
    bulletstext.text = `🔫 ${bullets}`; //Update text correctly
    app.stage.addChild(bullet);
    sound3.play();

    waitForCollision(bullet, filesList).then(function([bullet, files]) {
        app.stage.removeChild(bullet, files);
        score += 1;
        scoretext.text = `🎯 ${score}`; //Update text correctly
        sound4.play();
    });

    waitForCollision(bullet, BonusList1).then(function([bullet, bonus]) {
        app.stage.removeChild(bullet, bonus);
        life += 1;
        lifetext.text = `❤️ ${life}`;
        sound8.play();
    });

    waitForCollision(bullet, MalusList1).then(function([bullet, malus]) {
        app.stage.removeChild(bullet, malus);
        life -= 1;
        lifetext.text = `❤️ ${life}`;
        sound9.play();
        if (life <= 0) {
            app.stage.addChild(gameover);
            sound7.stop();
            stopGame();
            stopGameTime(); //Stop game time on game over
            sound1.play();
            let efficiency = bullets > 0 ? (score / bullets).toFixed(2) : 0;
            efficiencyText.text = `🏁 Efficiency: ${efficiency}`;
            app.stage.addChild(efficiencyText);
            background.interactive = true;
            background.buttonMode = true;
            background.on('pointerdown', restartGame);
        }
    });
}

//Scale the game and its components proportionally to the browser window size
function resizeGame() {
    const scaleX = window.innerWidth / 800; //Base width of the game
    const scaleY = window.innerHeight / 600; //Base height of the game
    const scale = Math.min(scaleX, scaleY);

    app.stage.scale.set(scale);
    app.renderer.resize(window.innerWidth, window.innerHeight);

    //Remove offsets to ensure the canvas fills the screen
    app.view.style.position = 'absolute';
    app.view.style.left = '0';
    app.view.style.top = '0';
    app.view.style.transform = 'translate(0, 0)';

    //Adjust background to match the base size
    background.width = 800;
    background.height = 600;

    //Adjust title screen to match the base size
    titleScreen.width = 800;
    titleScreen.height = 600;

    //Adjust ground to match the base width
    ground.width = 800;

    //Fix timeText position relative to the canvas
    timeText.x = 590; //Fixed position within the canvas
    timeText.y = 5;   //Fixed position within the canvas
}

//Add event listener for window resize
window.addEventListener('resize', resizeGame);

//Call resizeGame initially to ensure proper scaling
resizeGame();