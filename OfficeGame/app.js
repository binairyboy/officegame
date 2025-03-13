const app = new PIXI.Application({
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
});

const filesList = [];

document.body.appendChild(app.view);

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
titleScreen.width = 800; //Setzen Sie die Breite des Titelbildschirms fest auf X Pixel
titleScreen.height = 600; //Setzen Sie die Höhe des Titelbildschirms fest auf X Pixel
app.stage.addChild(titleScreen);

const easyButton = PIXI.Sprite.from('assets/easyButton.png');
easyButton.x = 450;
easyButton.y = 345;
easyButton.scale.set(0.15); //Skalieren Sie die Schaltfläche
easyButton.interactive = true;
easyButton.buttonMode = true;
easyButton.on('pointerdown', () => startGame('easy'));

const normalButton = PIXI.Sprite.from('assets/normalButton.png');
normalButton.x = 450;
normalButton.y = 400;
normalButton.scale.set(0.15); //Skalieren Sie die Schaltfläche
normalButton.interactive = true;
normalButton.buttonMode = true;
normalButton.on('pointerdown', () => startGame('normal'));

const hardButton = PIXI.Sprite.from('assets/hardButton.png');
hardButton.x = 450;
hardButton.y = 455;
hardButton.scale.set(0.15); //Skalieren Sie die Schaltfläche
hardButton.interactive = true;
hardButton.buttonMode = true;
hardButton.on('pointerdown', () => startGame('hard'));

app.stage.addChild(easyButton);
app.stage.addChild(normalButton);
app.stage.addChild(hardButton);

function startGame(difficulty) {
    titleScreen.visible = false;
    easyButton.visible = false;
    normalButton.visible = false;
    hardButton.visible = false;

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
        const files = PIXI.Sprite.from('assets/files.png');
        files.x = random(0, 700);
        files.y = -25;
        files.scale.x = 0.03;
        files.scale.y = 0.03;
        app.stage.addChild(files);
        filesList.push(files);
        flyDown(files, 2.9);
        
        waitForCollision(worker, files).then(function() {
            app.stage.removeChild(files);
            life -= 1;
            lifetext.text = `❤️ ${life}`;
            sound2.play();
            if (life <= 0) {
                app.stage.addChild(gameover);
                stopGame();
                sound1.play();
                let efficiency = bullets > 0 ? (score / bullets).toFixed(2) : 0;
                efficiencyText.text = `🏁 Efficiency: ${efficiency}`;
                app.stage.addChild(efficiencyText);
            }
        });

        waitForCollision(ground, files).then(function() {
            app.stage.removeChild(files);
            life -= 1;
            lifetext.text = `❤️ ${life}`;
            sound5.play();
            if (life <= 0) {
                app.stage.addChild(gameover);
                stopGame();
                sound1.play();
                let efficiency = bullets > 0 ? (score / bullets).toFixed(2) : 0;
                efficiencyText.text = `🏁 Efficiency: ${efficiency}`;
                app.stage.addChild(efficiencyText);
            }
        });
    }, gameSpeed);
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
    bulletstext.text = `🔫 ${bullets}`; //Aktualisieren Sie den Text korrekt
    app.stage.addChild(bullet);
    sound3.play();
    waitForCollision(bullet, filesList).then(function([bullet, files]) {
        app.stage.removeChild(bullet, files);
        score += 1;
        scoretext.text = `🎯 ${score}`; //Aktualisieren Sie den Text korrekt
        sound4.play();
    });
}