import Sprite from "../base/sprite";
import DataBus from "../databus";
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

// 玩家相关常量设置
// const PLAYER_IMG_SRC = 'images/hero.png'
// const PLAYER_WIDTH   = 80
// const PLAYER_HEIGHT  = 80

let databus = new DataBus();

const pokerImg = new Image();
pokerImg.src = "images/yang/1.png";
const pokerMaskImg = new Image();
pokerMaskImg.src = "images/yang/pokerMask.png";

const r = screenWidth / 375;
export const POKER_WIDTH = 37.5 * r;
export const POKER_HEIGHT = (POKER_WIDTH / 120) * 135 * r;

export default class Poker extends Sprite {
  constructor(icon = "", id = "", isCover = false, status = 0, x = 0, y = 0) {
    super({
      width: POKER_WIDTH,
      height: POKER_HEIGHT,
      x,
      y,
      id,
    });

    this.icon = icon;
    this.id = id;
    this.isCover = isCover;
    this.status = status;
    this.oriX = x;
    this.oriY = y;
    this.moveX = x;
    this.moveY = y;
    this.animating = false;
    this.timer = null;
    // // 用于在手指移动的时候标识手指是否已经在飞机上了 // this.y = screenHeight - this.height - 30; // this.x = screenWidth / 2 - this.width / 2; // // 玩家默认处于屏幕底部居中位置
    // this.touched = false;

    // this.bullets = [];

    // 初始化事件监听
    // .this
    // this.initEvent();
  }

  getCanvas() {
    return this.canvas;
  }

  /**
   * 当手指触摸屏幕的时候
   * 判断手指是否在飞机上
   * @param {Number} x: 手指的X轴坐标
   * @param {Number} y: 手指的Y轴坐标
   * @return {Boolean}: 用于标识手指是否在飞机上的布尔值
   */
  checkIsFingerOnAir(x, y) {
    const deviation = 0;

    return !!(
      x >= this.x / 2 - deviation &&
      y >= this.y / 2 - deviation &&
      x <= this.x / 2 + this.width + deviation &&
      y <= this.y / 2 + this.height + deviation
    );
  }

  /**
   * 根据手指的位置设置飞机的位置
   * 保证手指处于飞机中间
   * 同时限定飞机的活动范围限制在屏幕中
   */
  setAirPosAcrossFingerPosZ(x, y) {
    let disX = x - this.width / 2;
    let disY = y - this.height / 2;

    if (disX < 0) disX = 0;
    else if (disX > screenWidth - this.width) disX = screenWidth - this.width;

    if (disY <= 0) disY = 0;
    else if (disY > screenHeight - this.height)
      disY = screenHeight - this.height;

    console.log("setAirPosAcrossFingerPosZ", x, y);
    this.x = disX;
    this.y = disY;
  }

  /**
   * 玩家响应手指的触摸事件
   * 改变战机的位置
   */
  initEvent() {
    canvas.addEventListener(
      "touchstart",
      ((e) => {
        e.preventDefault();

        console.log("touchstart");
        let x = e.touches[0].clientX;
        let y = e.touches[0].clientY;

        // //
        if (this.checkIsFingerOnAir(x, y)) {
          // this.touched = true;
          console.log(111);

          // this.setAirPosAcrossFingerPosZ(x, y);
        }
      }).bind(this)
    );

    canvas.addEventListener(
      "touchmove",
      ((e) => {
        e.preventDefault();

        let x = e.touches[0].clientX;
        let y = e.touches[0].clientY;

        if (this.touched) this.setAirPosAcrossFingerPosZ(x, y);
      }).bind(this)
    );

    canvas.addEventListener(
      "touchend",
      ((e) => {
        e.preventDefault();

        this.touched = false;
      }).bind(this)
    );
  }

  /**
   * 玩家射击操作
   * 射击时机由外部决定
   */
  shoot() {
    let bullet = databus.pool.getItemByClass("bullet", Bullet);

    bullet.init(this.x + this.width / 2 - bullet.width / 2, this.y - 10, 10);

    databus.bullets.push(bullet);
  }

  remove() {
    this.status = 2;
  }

  /**
   * poker 运动
   */
  moveTo(x, y) {
    if (this.animating) {
      return;
    }

    this.x = x;
    this.y = y;

    this.animating = true;

    const durX = (x - this.moveX) / 10;
    const durY = (y - this.moveY) / 10;

    this.timer = setInterval(() => {
      if (
        (x > this.moveX && this.moveX + durX >= x) ||
        (x < this.moveX && this.moveX + durX <= x) ||
        x === this.moveX
      ) {
        console.log(1, "x");
        this.moveX = x;
      } else {
        this.moveX += durX;
      }

      if (
        (y > this.moveY && this.moveY + durY >= y) ||
        (y < this.moveY && this.moveY + durY <= y) ||
        y === this.moveY
      ) {
        this.moveY = y;
      } else {
        this.moveY += durY;
      }

      if (this.moveX === x && this.moveY === y) {
        clearInterval(this.timer);
        this.animating = false;
      }
    }, 26);
  }

  goToBar() {
    this.status = 1;
    this.width = 42 * r;
    this.height = this.width * (POKER_HEIGHT / POKER_WIDTH);
    databus.barPokers.push(this);
  }

  recover1() {
    this.status = 0;
    this.width = POKER_WIDTH;
    this.height = POKER_HEIGHT;
    this.moveTo(this.oriX, this.oriY);
  }

  render(ctx) {
    if (this.status === 2) {
      return;
    }
    // ctx.font = "20px Georgia";

    // grayscale(100%)
    ctx.drawImage(
      pokerImg,
      0,
      0,
      122,
      135,
      this.moveX / 2,
      this.moveY / 2,
      this.width,
      this.height
    );

    ctx.drawImage(
      this.icon,
      0,
      0,
      104,
      104,
      this.moveX / 2 + 3 * r,
      this.moveY / 2 + 3 * r,
      30 * r,
      30 * r
    );

    if (this.isCover) {
      ctx.drawImage(
        pokerMaskImg,
        0,
        0,
        122,
        135,
        this.moveX / 2,
        this.moveY / 2,
        this.width,
        this.height
      );
    }

    // ctx.fillStyle = this.isCover ? "#999" : "#fff";
    // ctx.fillText(this.icon, this.x / 2 + 10, this.y / 2 + 30);
    // ctx.fillText(this.icon, this.x / 2 + 10, this.y / 2 + 30);
    // // ctx.fillStyle = gradient;
    // ctx.font = "10px Verdana";
    // ctx.filter = "none";
    // ctx.globalAlpha = value;
  }
}
