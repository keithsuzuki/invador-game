const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// プレイヤー
const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    width: 50,
    height: 50,
    dx: 0,
    speed: 5,
    color: 'white'
};

// 敵
const invaders = [];
const rows = 4;
const cols = 8;
const invaderWidth = 40;
const invaderHeight = 40;
const invaderPadding = 20;
const offsetTop = 30;
const offsetLeft = 30;

for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
        invaders.push({
            x: c * (invaderWidth + invaderPadding) + offsetLeft,
            y: r * (invaderHeight + invaderPadding) + offsetTop,
            width: invaderWidth,
            height: invaderHeight,
            color: 'red',
            status: 1
        });
    }
}

// 弾
const bullets = [];
const bulletWidth = 5;
const bulletHeight = 10;
const bulletSpeed = 7;

// キーボード操作
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function keyDownHandler(e) {
    console.log(`Key pressed: ${e.key}, Code: ${e.code}`);
    console.log(e.key); // キーの値を確認
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        player.dx = player.speed;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        player.dx = -player.speed;
    } else if (e.key === ' ' || e.code === 'Space') { // スペースキーの判定
        e.preventDefault(); // デフォルトのスクロール動作を抑制
        bullets.push({
            x: player.x + player.width / 2 - bulletWidth / 2,
            y: player.y,
            width: bulletWidth,
            height: bulletHeight,
            dy: -bulletSpeed
        });
    }
}

function keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'Left' || e.key === 'ArrowLeft') {
        player.dx = 0;
    }
}

// 描画
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawInvaders() {
    invaders.forEach((invader) => {
        if (invader.status === 1) {
            ctx.fillStyle = invader.color;
            ctx.fillRect(invader.x, invader.y, invader.width, invader.height);
        }
    });
}

function drawBullets() {
    bullets.forEach((bullet, index) => {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        bullet.y += bullet.dy;

        // 弾が上部に到達したら消す
        if (bullet.y < 0) {
            bullets.splice(index, 1);
        }
    });
}

function collisionDetection() {
    bullets.forEach((bullet, bulletIndex) => {
        invaders.forEach((invader, invaderIndex) => {
            if (invader.status === 1 && bullet.x < invader.x + invader.width && bullet.x + bullet.width > invader.x && bullet.y < invader.y + invader.height && bullet.y + bullet.height > invader.y) {
                invader.status = 0;
                bullets.splice(bulletIndex, 1);
            }
        });
    });
}

// ゲームのロジック
function movePlayer() {
    player.x += player.dx;

    // プレイヤーの移動範囲を制限
    if (player.x < 0) {
        player.x = 0;
    } else if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }
}

function update() {
    movePlayer();
    collisionDetection();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer();
    drawInvaders();
    drawBullets();

    requestAnimationFrame(update);
}

update();
