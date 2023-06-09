// made with love by justyy
// https://helloacm.com/microbit-programming-snake-game-with-growing-body-with-greedy-ai/
// dr.zhihua.lai@gmail.com

let direction = 1;
let dxOffset = [[1, 0], [0, 1], [-1, 0], [0, -1]];
let score = 0;
let px = 0;
let py = 0;
let snake = initSnake([px, py, px + 1, py]);
let apple = game.createSprite(2, 2);
// when snake grows to 10 pixels, it stops growing
// to avoid filling the LED
const maxLength = 10;
placeNextApple();

function initSnake(arr: Array<number>) {
    let result = [];
    for (let i = 0; i + 1 < arr.length; i += 2) {
        result.push(game.createSprite(arr[i], arr[i + 1]));
    }
    return result;
};

function validPixelCoordinate(nx: number, ny: number): boolean {
    return (nx >= 0 && nx <= 4 && ny >= 0 && ny <= 4) && (!isOnSnake(nx, ny));
}

function gameOver() {
    game.setScore(score);
    game.pause();
    basic.pause(1000);
    game.gameOver();
}

function resetGame() {
    game.setScore(0);
    score = 0;
    direction = 0;
    px = 0;
    py = 0;
    for (let s of snake) {
        s.delete();
    }
    snake = initSnake([px, py, px + 1, py]);
    placeNextApple();
    game.resume();
}

function moveForward() {
    let dx = dxOffset[direction];
    px += dx[0];
    py += dx[1];
    if (!validPixelCoordinate(px, py)) {
        gameOver();
    }
    snake.unshift(game.createSprite(px, py));
    let last = snake.pop();
    last.delete();
}

function isOnSnake(x: number, y: number): boolean {
    for (let body of snake) {
        if (body.x() == x && body.y() == y) {
            return true;
        }
    }
    return false;
}

function placeNextApple() {
    let x, y;
    do {
        x = Math.randomRange(0, 4);
        y = Math.randomRange(0, 4);
    } while (isOnSnake(x, y));
    apple.goTo(x, y);
    apple.setBrightness(100);
}

function turnLeft() {
    direction = (direction + 3) % 4;
}

function turnRight() {
    direction = (direction + 1) % 4;
}

function letComputerPlay() {
    let x = snake[0].x();
    let y = snake[0].y();

    // next distance to apple if moving forward
    let dx = dxOffset[direction];
    let nx1 = x + dx[0];
    let ny1 = y + dx[1];
    let dist1 = 9999;
    if (validPixelCoordinate(nx1, ny1)) {
        dist1 = Math.abs(nx1 - apple.x()) + Math.abs(ny1 - apple.y());
    }

    // next distance to apple if turning right
    let dx1 = (direction + 1) % 4;
    dx = dxOffset[dx1];
    let nx2 = x + dx[0];
    let ny2 = y + dx[1];
    let dist2 = 9999;
    if (validPixelCoordinate(nx2, ny2)) {
        dist2 = Math.abs(nx2 - apple.x()) + Math.abs(ny2 - apple.y());
    }

    // next distance to apple if turning left
    let dx2 = (direction + 3) % 4;
    dx = dxOffset[dx2];
    let nx3 = x + dx[0];
    let ny3 = y + dx[1];
    let dist3 = 9999;
    if (validPixelCoordinate(nx3, ny3)) {
        dist3 = Math.abs(nx3 - apple.x()) + Math.abs(ny3 - apple.y());
    }

    if (dist1 <= dist2 && dist1 <= dist3) {
        // best strategy is moving forward without turning
        return;
    } else if (dist2 <= dist1 && dist2 <= dist3) {
        turnRight();
    } else if (dist3 <= dist1 && dist3 <= dist2) {
        turnLeft();
    }
}

input.onButtonPressed(Button.A, function () {
    turnLeft();
})

input.onButtonPressed(Button.B, function () {
    turnRight();
})

input.onButtonPressed(Button.AB, function () {
    resetGame();
})

basic.forever(function () {
    if (game.isGameOver()) {
        return;
    }
    let delay = Math.max(100, 1000 - score * 50);
    basic.pause(delay);
    //letComputerPlay();
    moveForward();
    if (snake[0].isTouching(apple)) {
        if (snake.length < maxLength) {
            snake.push(snake[snake.length - 1]);
        }
        score++;
        placeNextApple();
    }
})