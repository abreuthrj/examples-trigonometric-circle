var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
var btPause = document.querySelector("#pause");
var btSpeedUp = document.querySelector("#speedup");
var btSpeedDown = document.querySelector("#speeddown");

var width,
  height,
  cx,
  cy,
  cartesianPerc,
  angle,
  theta,
  radius,
  dt,
  framebuffer,
  running,
  speed;

var infos = [];

function resize() {
  var select = Math.min(window.innerWidth, window.innerHeight);

  canvas.width = select;
  canvas.height = select;

  width = canvas.width;
  height = canvas.height;
  cx = width / 2;
  cy = height / 2;
}

window.addEventListener("resize", resize);

function drawShadowX(angle, radius) {
  var cos = Math.cos(angle);

  ctx.strokeStyle = "green";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + radius * cos, cy);
  ctx.stroke();
  ctx.closePath();

  resetDraw();
  ctx.fillText(cos.toFixed(2), cx + radius * cos, cy + 10);
}

function drawShadowY(angle, radius) {
  var sin = -Math.sin(angle);

  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx, cy + radius * sin);
  ctx.stroke();
  ctx.closePath();

  resetDraw();
  ctx.fillText(sin.toFixed(2), cx, cy + radius * sin + 10);
}

function drawRadius(angle, radius) {
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + radius * Math.cos(angle), cy + radius * -Math.sin(angle));
  ctx.stroke();
  ctx.closePath();
}

function drawProjX(angle, radius) {
  ctx.strokeStyle = "green";
  ctx.lineWidth = 2;
  ctx.lineDashOffset = 2;
  ctx.setLineDash([4, 16]);
  ctx.beginPath();
  ctx.moveTo(cx + radius * Math.cos(angle), cy);
  ctx.lineTo(cx + radius * Math.cos(angle), cy + radius * -Math.sin(angle));
  ctx.stroke();
  ctx.closePath();
}

function drawProjY(angle, radius) {
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  ctx.lineDashOffset = 2;
  ctx.setLineDash([4, 16]);
  ctx.beginPath();
  ctx.moveTo(cx, cy + radius * -Math.sin(angle));
  ctx.lineTo(cx + radius * Math.cos(angle), cy + radius * -Math.sin(angle));
  ctx.stroke();
  ctx.closePath();
}

function drawCartesian() {
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + cartesianPerc * cx, cy);
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx - cartesianPerc * cx, cy);
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx, cy + cartesianPerc * cy);
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx, cy - cartesianPerc * cy);
  ctx.stroke();
  ctx.closePath();
}

function drawInfoBox() {
  var x = 20,
    y = 20,
    px = 20,
    py = 20,
    my = 20;

  ctx.fillStyle = "#00000007";
  ctx.fillRect(x, y, 200, 2 * py + my * (infos.length - 1));

  infos.forEach((info, i) => {
    ctx.font = "12px Roboto";
    ctx.fillStyle = "#333333";
    ctx.fillText(info, x + px, y + py + my * i);
  });

  infos.splice(0, infos.length);
}

function resetDraw() {
  ctx.setLineDash([]);
  ctx.lineWidth = 1;
  ctx.strokeStyle = "black";
  ctx.fillStyle = "black";
  ctx.font = "10px sans-serif";
}

function init() {
  resize();

  cartesianPerc = 0.8;
  angle = 0;
  theta = 0;
  radius = 0.8 * (cartesianPerc * cx);
  framebuffer = 0;
  running = true;
  speed = 10;

  requestAnimationFrame(update);
}

function update(time) {
  dt = time - framebuffer;
  framebuffer = time;

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, width, height);

  drawCartesian();

  angle = (theta * Math.PI) / 180;
  drawShadowX(angle, radius);
  drawShadowY(angle, radius);
  drawRadius(angle, radius);
  drawProjX(angle, radius);
  drawProjY(angle, radius);

  if (running) {
    theta += speed * (dt / 1000);
  }

  resetDraw();

  ctx.font = "30px Roboto";
  ctx.fillText(`Angulo: ${theta.toFixed(0) % 360}°`, cx - 55, 0.95 * height);

  infos.push(`fps: ${1 / (dt / 1000)}`);
  infos.push(`speed: ${speed}°/sec`);
  drawInfoBox();

  resetDraw();

  requestAnimationFrame(update);
}

init();

btPause.addEventListener("click", () => {
  running = !running;

  if (running) btPause.value = "Pause";
  else btPause.value = "Run";
});
btSpeedDown.addEventListener("click", () => {
  speed--;
});
btSpeedUp.addEventListener("click", () => {
  speed++;
});
