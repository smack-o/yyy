import Sprite from "../base/sprite";
import DataBus from "../databus";

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

// const BG_IMG_SRC = "images/bg.jpg";
const BG_IMG_SRC = "images/yang/bg.png";
const BAR_IMG_SRC = "images/yang/bar.png";
const BAR_LEFT_IMG_SRC = "images/yang/leftBar.png";
const BAR_BOTTOM_IMG_SRC = "images/yang/bottomBar.png";
const M1_SRC = "images/yang/m1.png";
const M2_SRC = "images/yang/m2.png";
const M3_SRC = "images/yang/m3.png";
const M4_SRC = "images/yang/m4.png";
const BG_WIDTH = 512;
const BG_HEIGHT = 512;
const r = screenWidth / 375;

let databus = new DataBus();

const ttt = [10, 32];
/**
 * 游戏背景类
 * 提供update和render函数实现无限滚动的背景功能
 */
export default class BackGround extends Sprite {
  constructor(ctx) {
    super({
      imgSrc: BG_IMG_SRC,
      width: BG_WIDTH,
      height: BG_HEIGHT,
    });

    this.top = 0;
    this.barImg = new Image();
    this.barImg.src = BAR_IMG_SRC;
    this.barLeftImg = new Image();
    this.barLeftImg.src = BAR_LEFT_IMG_SRC;
    this.barBottomImg = new Image();
    this.barBottomImg.src = BAR_BOTTOM_IMG_SRC;

    this.m1 = new Image();
    this.m1.src = M1_SRC;
    this.m2 = new Image();
    this.m2.src = M2_SRC;
    this.m3 = new Image();
    this.m3.src = M3_SRC;
    this.m4 = new Image();
    this.m4.src = M4_SRC;

    this.ctx = ctx;
    this.render(ctx);
    // this.onTouchStart = this.touchStartHandler.bind(this);
    // canvas.addEventListener("touchstart", this.onTouchStart);
  }

  // touchStartHandler(e) {
  //   e.preventDefault();

  //   console.log("touchstart");
  //   let x = e.touches[0].clientX;
  //   let y = e.touches[0].clientY;
  //   console.log(x, y);

  //   const x1 = 30 * r;
  //   const y1 = screenHeight - 90 * r;
  //   const w1 = 80 * r;
  //   const h1 = (80 / 103) * 87 * r;
  //   if (x > x1 && x < x1 + w1 && y > y1 && y < y1 + h1) {
  //     console.log("touchstart1");
  //   }

  //   const x2 = (30 + 120) * r;
  //   const y2 = screenHeight - 90 * r;
  //   const w2 = 80 * r;
  //   const h2 = (80 / 103) * 87 * r;
  //   if (x > x2 && x < x2 + w2 && y > y2 && y < y2 + h2) {
  //     console.log("touchstart2");
  //   }

  //   const x3 = (30 + 120 * 2) * r;
  //   const y3 = screenHeight - 90 * r;
  //   const w3 = 80 * r;
  //   const h3 = (80 / 103) * 87 * r;
  //   if (x > x3 && x < x3 + w3 && y > y3 && y < y3 + h3) {
  //     console.log("touchstart3");
  //   }
  // }

  // recover() {
  //   canvas.removeEventListener("touchstart", this.onTouchStart);
  // }

  update() {
    // this.top += 2;
    // if (this.top >= screenHeight) this.top = 0;
  }
  /**
   * 背景图重绘函数
   * 绘制两张图片，两张图片大小和屏幕一致
   * 第一张漏出高度为top部分，其余的隐藏在屏幕上面
   * 第二张补全除了top高度之外的部分，其余的隐藏在屏幕下面
   */
  render(ctx) {
    if (databus.frame % ttt[1] < ttt[0]) {
      ctx.drawImage(
        this.img,
        20,
        20,
        480,
        screenHeight,
        0,
        0,
        screenWidth,
        screenHeight
      );
      ctx.drawImage(
        this.img,
        20,
        20,
        480,
        screenHeight,
        0,
        screenHeight - 300,
        screenWidth,
        screenHeight
      );
    } else {
      ctx.drawImage(
        this.img,
        20,
        20,
        480,
        screenHeight + 10,
        0,
        0,
        screenWidth,
        screenHeight
      );
      ctx.drawImage(
        this.img,
        20,
        20,
        480,
        screenHeight + 10,
        0,
        screenHeight - 300,
        screenWidth,
        screenHeight
      );
    }

    this.renderBar();
    this.renderOptions();
  }

  renderBar() {
    // this.ctx.drawImage(
    //   this.barImg,
    //   0,
    //   0,
    //   110,
    //   52,
    //   0,
    //   screenHeight - 300,
    //   110,
    //   52
    //   // 350,
    //   // (350 / 110) * 52
    // );

    this.ctx.font = `${15 * r}px Georgia`;
    this.ctx.fillStyle = "#999";
    this.ctx.fillText(`简单版羊了个羊`, 130 * r, 120);

    this.ctx.font = `${25 * r}px Georgia`;
    this.ctx.fillStyle = "#000";
    this.ctx.fillText(`第 ${databus.level} 关 (共 50 关)`, 100 * r, 150);

    const aH = 100 * (screenWidth / 375);
    const bH = 30 * (screenWidth / 375);

    this.ctx.drawImage(
      this.barLeftImg,
      0,
      0,
      21,
      143,
      15,
      screenHeight - 200 * r,
      (aH / 143) * 21,
      aH
      // 350,
      // (350 / 110) * 52
    );
    this.ctx.drawImage(
      this.barLeftImg,
      0,
      0,
      21,
      143,
      (bH / 45) * 499 + 6,
      screenHeight - 200 * r,
      (aH / 143) * 21,
      aH
      // 350,
      // (350 / 110) * 52
    );

    this.ctx.drawImage(
      this.barBottomImg,
      0,
      0,
      499,
      45,
      18,
      screenHeight - 130 * r,
      (bH / 45) * 499,
      bH
      // 350,
      // (350 / 110) * 52
    );

    this.ctx.fillStyle = "#8c5d2b";
    this.ctx.fillRect(35 * r, screenHeight - 190 * r, 300 * r, 60 * r);
    this.ctx.fillStyle = "none";
  }

  renderOptions() {
    this.ctx.drawImage(
      this.m4,
      0,
      0,
      103,
      87,
      30 * r,
      screenHeight - 90 * r,
      80 * r,
      (80 / 103) * 87 * r
      // 350,
      // (350 / 110) * 52
    );

    this.ctx.drawImage(
      this.m1,
      0,
      0,
      79,
      96,
      50 * r,
      screenHeight - (90 - 5) * r,
      (46 / 96) * 79 * r,
      46 * r
      // 350,
      // (350 / 110) * 52
    );

    this.ctx.font = `${25 * r}px Georgia`;
    this.ctx.fillStyle = "#000";
    this.ctx.fillText(
      databus.popCount,
      50 * r + (46 / 96) * 79 * r + 10 * r,
      screenHeight - (90 - 5) * r
    );

    // ===

    this.ctx.drawImage(
      this.m4,
      0,
      0,
      103,
      87,
      (30 + 120) * r,
      screenHeight - 90 * r,
      80 * r,
      (80 / 103) * 87 * r
      // 350,
      // (350 / 110) * 52
    );

    this.ctx.drawImage(
      this.m2,
      0,
      0,
      79,
      96,
      (50 + 120) * r,
      screenHeight - (90 - 5) * r,
      (46 / 96) * 79 * r,
      46 * r
      // 350,
      // (350 / 110) * 52
    );

    this.ctx.font = `${25 * r}px Georgia`;
    this.ctx.fillStyle = "#000";
    this.ctx.fillText(
      databus.recoverCount,
      (50 + 120) * r + (46 / 96) * 79 * r + 10 * r,
      screenHeight - (90 - 5) * r
    );

    // ===

    this.ctx.drawImage(
      this.m4,
      0,
      0,
      103,
      87,
      (30 + 120 * 2) * r,
      screenHeight - 90 * r,
      80 * r,
      (80 / 103) * 87 * r
      // 350,
      // (350 / 110) * 52
    );

    this.ctx.drawImage(
      this.m3,
      0,
      0,
      79,
      96,
      (50 + 120 * 2) * r,
      screenHeight - (90 - 5) * r,
      (46 / 96) * 79 * r,
      46 * r
      // 350,
      // (350 / 110) * 52
    );

    this.ctx.font = `${25 * r}px Georgia`;
    this.ctx.fillStyle = "#000";
    this.ctx.fillText(
      databus.pCount,
      (50 + 120 * 2) * r + (46 / 96) * 79 * r + 10 * r,
      screenHeight - (90 - 5) * r
    );
  }
}
