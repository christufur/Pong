// Game Variables
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('start-button');
const resetButton = document.getElementById('reset-button');
const p1ScoreElement = document.getElementById('player1-score');
const p2ScoreElement = document.getElementById('player2-score');

// game state and scores
let gameRunning = false;
let p1Score = 0;
let p2Score = 0;

//keys hashmap to know when one is pressed up/down
const keys = {
    w: false,
    s: false,
    ArrowUp: false,
    ArrowDown: false
};

//P1 paddle variable
const p1Paddle = {
    x: 10,
    y: (canvas.height) / 2 - 75,
    width: 10,
    height: 150,
    speed: 8,
    color: 'red'
};

//P2 paddle variable 
const p2Paddle = {
    x: (canvas.width) - 20,
    y: (canvas.height / 2) - 75,
    width: 10,
    height: 150,
    speed: 8,
    color: 'blue'
};

//ball for game variable
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speedX: 5,
    speedY: 5,
    color: 'white'
};

//when on of the keys in the hashmap is pressed down
document.addEventListener('keydown', (e) => {
    if (e.key in keys) {
        keys[e.key] = true;
    }
});

//when one of the keys in the hashmap is let go
document.addEventListener('keyup', (e) => {
    if (e.key in keys) {
        keys[e.key] = false;
    }
});

//clicking start button changes the game state
startButton.addEventListener('click', () => {
    gameRunning = true;
});

//reset button click listener
resetButton.addEventListener('click', () => {
    reset();
});

//resets elements and game canvas
function reset(){
    gameRunning = false;
    p1Score = 0;
    p2Score = 0;
    p1ScoreElement.textContent = `Player 1: ${p1Score}`;
    p2ScoreElement.textContent = `Player 2: ${p2Score}`;
    p1Paddle.y = (canvas.height / 2) - 75;
    p2Paddle.y = (canvas.height / 2) - 75;
    resetBall();
    draw();
}

//draw paddles function
function drawPaddle(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

//draws the white ball
function drawBall(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

//uses the draw paddle function to draw a net in the middle of the canvas
function drawNet() {
    for (let i = 0; i < canvas.height; i += 20) {
        drawPaddle(canvas.width / 2 - 1, i, 2, 10, 'white');
    }
}

//main function to render all of the needed pieces to play
function draw() {
    // Clear
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw net
    drawNet();

    // P1 paddle
    drawPaddle(p1Paddle.x, p1Paddle.y, p1Paddle.width, p1Paddle.height, p1Paddle.color);

    // P2 paddle
    drawPaddle(p2Paddle.x, p2Paddle.y, p2Paddle.width, p2Paddle.height, p2Paddle.color);

    drawBall(ball.x, ball.y, ball.radius, ball.color);
}

//places the ball back to the middle when a player scores or game is over
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    
    // Randomize direction on reset
    ball.speedX = ball.speedX > 0 ? -5 : 5;
    ball.speedY = Math.random() * 10 - 5; // Random Y direction
}

//maintains game integrity by checking the score after each score update
function checkWinner() {
    if (p1Score >= 5 || p2Score >= 5) {
        gameRunning = false;
        const winner = p1Score >= 5 ? "Player 1" : "Player 2";
        setTimeout(() => {
            alert(`${winner} wins the game!`);
        }, 100);
        reset();
    }
}

function updateGame() {
    //checks game state
    if (!gameRunning) return;

    // Moving player 1 paddle (W up, S down)
    if (keys.w && p1Paddle.y > 0) {
        p1Paddle.y -= p1Paddle.speed;
    }
    if (keys.s && p1Paddle.y + p1Paddle.height < canvas.height) {
        p1Paddle.y += p1Paddle.speed;
    }

    // Move player 2 paddle (Arrow Up and Down)
    if (keys.ArrowUp && p2Paddle.y > 0) {
        p2Paddle.y -= p2Paddle.speed;
    }
    if (keys.ArrowDown && p2Paddle.y + p2Paddle.height < canvas.height) {
        p2Paddle.y += p2Paddle.speed;
    }

    // Move the ball
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Ball collision with floor or roof of canvas
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.speedY = -ball.speedY;
    }

    // Function to check ball collision with paddles
    function collisionWithPaddle(paddle) {
        return ball.x + ball.radius > paddle.x && 
               ball.x - ball.radius < paddle.x + paddle.width && 
               ball.y + ball.radius > paddle.y && 
               ball.y - ball.radius < paddle.y + paddle.height;
    }

    // Collision with paddle 1
    if (ball.speedX < 0 && collisionWithPaddle(p1Paddle)) {
        ball.speedX = -ball.speedX;

        const impact = ball.y - (p1Paddle.y + p1Paddle.height/2);
        ball.speedY = impact * 0.3;
    }
    
    // Collision with paddle 2
    if (ball.speedX > 0 && collisionWithPaddle(p2Paddle)) {
        ball.speedX = -ball.speedX;

        const impact = ball.y - (p2Paddle.y + p2Paddle.height/2);
        ball.speedY = impact * 0.3;
    }   

    // Player 1 scored
    if (ball.x + ball.radius > canvas.width) {
        p1Score++;
        p1ScoreElement.textContent = `Player 1: ${p1Score}`;
        resetBall();
        checkWinner();
    }

    // Player 2 scored
    if (ball.x - ball.radius < 0) {
        p2Score++;
        p2ScoreElement.textContent = `Player 2: ${p2Score}`;
        resetBall();
        checkWinner();
    }
}

//game loop
function gameLoop() {
    updateGame();
    draw();
    requestAnimationFrame(gameLoop);
}

// Initialize the game
resetBall();
// Set initial game state to paused
gameRunning = false;
// Initial draw to show the starting positions
draw();
// Start the game loop (will only update when gameRunning is true)
gameLoop();