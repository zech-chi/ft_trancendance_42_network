export function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
}

export default class Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  color: string;
  position: boolean; /*Left or right if true right else Left */

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    speed: number,
    color: string,
    position: boolean
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.color = color;
    this.position = position;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 15;
    ctx.fillStyle = this.color;
    ctx.fillStyle = this.color;
    //ctx.fillRect(this.x, this.y, this.width, this.height);
    drawRoundedRect(ctx, this.x, this.y, this.width, this.height, 8);
  }

  moveUp() {
    this.y -= this.speed;
    if (this.y < 0) this.y = 0;
  }

  moveDown(canvasHeight: number) {
    if (this.y + this.height < canvasHeight) {
      this.y += this.speed;
    }
  }
}
