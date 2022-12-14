import DataBus from "../databus";
import { randomString, makepokers, checkCover } from "../libs/utils";
// import { innerHeight } from "../libs/weapp-adapter";
import Poker, { POKER_HEIGHT, POKER_WIDTH } from "./poker";

let instance;

let databus = new DataBus();

// æå¤§åŗåĄ
const maxLevel = 50;

const getImage = (url) => {
  const img = new Image();
  img.src = url;
  return img;
};
// const icons = [`đ¨`, `đ`, `âī¸`, `đģ`, `đ`, `đ¯`, `đ¤`, `đŧ`, `đ`, `đ`];
const icons = [
  getImage("images/yang/p1.png"),
  getImage("images/yang/p2.png"),
  getImage("images/yang/p3.png"),
  getImage("images/yang/p4.png"),
  getImage("images/yang/p5.png"),
  getImage("images/yang/p6.png"),
  getImage("images/yang/p7.png"),
  getImage("images/yang/p8.png"),
  getImage("images/yang/p9.png"),
  getImage("images/yang/p10.png"),
];

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const r = screenWidth / 375;

/**
 * poker įŽĄįå¨
 */
export default class Pokers {
  constructor(ctx, updateLevel, reset, playShoot) {
    this.ctx = ctx;
    this.updateLevel = updateLevel;
    this.onTouchStart = this.touchStartHandler.bind(this);
    this.recover = this.recover.bind(this);
    this.reset = reset;
    this.playShoot = playShoot;
    this.init();
  }

  init() {
    this.pokers = this.makePokers(databus.level);
    databus.pokers = this.pokers;

    canvas.addEventListener("touchstart", this.onTouchStart);
  }

  recover() {
    canvas.removeEventListener("touchstart", this.onTouchStart);
  }

  touchStartHandler(e) {
    e.preventDefault();

    console.log("touchstart");
    let x = e.touches[0].clientX;
    let y = e.touches[0].clientY;

    databus.pokers.forEach((item, index) => {
      if (item.checkIsFingerOnAir(x, y)) {
        this.onClick(item, index);
      }
    });

    console.log(x, y);

    const x1 = 30 * r;
    const y1 = screenHeight - 90 * r;
    const w1 = 80 * r;
    const h1 = (80 / 103) * 87 * r;
    if (x > x1 && x < x1 + w1 && y > y1 && y < y1 + h1) {
      console.log("touchstart1");
      this.handlePop();
    }

    const x2 = (30 + 120) * r;
    const y2 = screenHeight - 90 * r;
    const w2 = 80 * r;
    const h2 = (80 / 103) * 87 * r;
    if (x > x2 && x < x2 + w2 && y > y2 && y < y2 + h2) {
      //   console.log("touchstart2");
      this.handleRecover();
    }

    const x3 = (30 + 120 * 2) * r;
    const y3 = screenHeight - 90 * r;
    const w3 = 80 * r;
    const h3 = (80 / 103) * 87 * r;
    if (x > x3 && x < x3 + w3 && y > y3 && y < y3 + h3) {
      console.log("touchstart3");
      this.washPoker();
    }
  }

  handleRecover() {
    if (databus.barPokers.length === 0 || databus.recoverCount === 0) {
      return;
    }
    databus.recoverCount--;
    const poker = databus.barPokers.pop();
    poker.recover1();
    this.checkCover(databus.pokers);
  }

  handlePop() {
    if (databus.barPokers.length === 0 || databus.popCount === 0) {
      return;
    }
    databus.popCount--;

    const ps = databus.barPokers.splice(0, 3);
    ps.forEach((poker) => {
      poker.recover1();
    });
    this.checkCover(databus.pokers);
    // čŽĄįŽbarPokersäŊįŊŽ
    databus.barPokers.forEach((item, index) => {
      item.moveTo(
        (37.5 * 2 * index + 78) * r,
        (screenHeight - 190 * r + 5 * r) * 2
      );
    });
  }

  // æ´į
  washPoker() {
    if (databus.pCount === 0) {
      return;
    }
    databus.pCount--;
    const level = databus.level;
    const curLevel = Math.min(maxLevel, level);
    // const offsetPool = [0];

    let pokers = databus.pokers;
    pokers = pokers.sort(() => Math.random() - 0.5);
    const offsetPool = [0, POKER_WIDTH, -POKER_WIDTH].slice(0, 1 + curLevel);
    const range = [
      [2, 6],
      [1, 6],
      [1, 7],
      [0, 7],
      [0, 8],
    ][Math.min(4, level - 1)];

    const randomSet = (poker) => {
      const offset = offsetPool[Math.floor(offsetPool.length * Math.random())];
      const row = range[0] + Math.floor((range[1] - range[0]) * Math.random());
      const column =
        range[0] + Math.floor((range[1] - range[0]) * Math.random());
      const data = {
        x: column * POKER_WIDTH * 2 + offset + 70,
        y: row * POKER_HEIGHT * 2 + offset + 400,
      };

      poker.moveTo(data.x, data.y);
      poker.oriX = data.x;
      poker.oriY = data.y;
      //   poker.x = data.x;
      //   poker.y = data.y;
      poker.isCover = false;
    };

    for (const poker of pokers) {
      if (poker.status !== 0) continue;
      randomSet(poker);
    }

    this.checkCover(pokers);
    // return updateScene;
  }

  makePokers(level) {
    const curLevel = Math.min(maxLevel, level);
    const iconPool = icons.slice(0, 2 * curLevel);
    const offsetPool = [0, POKER_WIDTH, -POKER_WIDTH].slice(0, 1 + curLevel);
    // const offsetPool = [0];

    const pokers = [];

    const range = [
      [2, 6],
      [1, 6],
      [1, 7],
      [0, 7],
      [0, 8],
    ][Math.min(4, curLevel - 1)];

    const randomSet = (icon) => {
      const offset = offsetPool[Math.floor(offsetPool.length * Math.random())];
      const row = range[0] + Math.floor((range[1] - range[0]) * Math.random());
      const column =
        range[0] + Math.floor((range[1] - range[0]) * Math.random());
      const data = {
        isCover: false,
        status: 0,
        icon,
        id: randomString(4),
        x: column * POKER_WIDTH * 2 + offset + 70,
        y: row * POKER_HEIGHT * 2 + offset + 400,
      };
      const poker = new Poker(
        data.icon,
        data.id,
        data.isCover,
        data.status,
        data.x,
        data.y
      );
      pokers.push(poker);
    };

    // å¤§äē5įē§åĢåĸå iconæą 
    let compareLevel = curLevel;
    while (compareLevel > 0) {
      iconPool.push(...iconPool.slice(0, Math.min(10, 2 * (compareLevel - 5))));
      compareLevel -= 5;
    }

    for (const icon of iconPool) {
      for (let i = 0; i < 6; i++) {
        randomSet(icon);
      }
    }

    return this.checkCover(pokers);
  }

  checkCover(pokers) {
    for (let i = 0; i < pokers.length; i++) {
      // åŊåitemå¯šč§åæ 
      const cur = pokers[i];
      cur.isCover = false;
      if (cur.status !== 0) continue;
      const { x: x1, y: y1 } = cur;
      const x2 = x1 + POKER_WIDTH * 2,
        y2 = y1 + POKER_HEIGHT * 2;

      for (let j = i + 1; j < pokers.length; j++) {
        const compare = pokers[j];
        if (compare.status !== 0) continue;

        // ä¸¤åēåæäē¤éč§ä¸ēéä¸­
        // ä¸¤åēåä¸éå æåĩåååŗä¸ēäē¤é
        const { x, y } = compare;

        if (
          !(
            y + POKER_HEIGHT * 2 <= y1 ||
            y >= y2 ||
            x + POKER_WIDTH * 2 <= x1 ||
            x >= x2
          )
        ) {
          cur.isCover = true;
          break;
        }
      }
    }
    return pokers;
  }

  onClick(poker, index) {
    if (databus.animating) return;
    // const updatepokers = pokers.slice();
    // const barPokers = databus.barPokers;
    // const symbol = updatepokers[idx];
    if (poker.isCover || poker.status !== 0) {
      console.log(poker);
      return;
    }
    poker.goToBar();
    this.playShoot();
    // databus.barPokers.push(poker);
    // poker.x = 37.5 * 2 * (databus.barPokers.length - 1);
    // poker.y = 1;

    // setQueue(updateQueue);
    // checkCover(updatepokers);

    // setAnimating(true);
    // await waitTimeout(300);

    const filterSame = databus.barPokers.filter((sb) => sb.icon === poker.icon);

    // ä¸čŋäē
    if (filterSame.length === 3) {
      //   const updateQueue = databus.barPokers.filter((sb) => sb.icon !== poker.icon);
      databus.barPokers = databus.barPokers.filter(
        (sb) => sb.icon !== poker.icon
      );
      for (const sb of filterSame) {
        const find = databus.pokers.find((i) => i.id === sb.id);
        if (find) {
          // éæ¯éģčž
          find.remove();
        }
      }
    }

    this.checkCover(databus.pokers);

    const r = screenWidth / 375;
    // čŽĄįŽbarPokersäŊįŊŽ
    databus.barPokers.forEach((item, index) => {
      item.moveTo(
        (37.5 * 2 * index + 78) * r,
        (screenHeight - 190 * r + 5 * r) * 2
      );
    });

    console.log(
      databus.barPokers.length,
      databus.barPokers.length === 1,
      "databus.barPokers"
    );

    // čžäē
    if (databus.barPokers.length === 7) {
      wx.showModal({
        title: "å¤ąč´Ĩ",
        content: "ææå¤ąč´ĨäēīŧåĢį°åŋīŧåč¯ä¸æŦĄ~ åäēĢå¯äģĨįģ§įģ­æ¸¸æåĻ~",
        // showCancel: false,
        cancelText: "åæĨä¸åą",
        confirmText: "åäēĢ",
        success: (res) => {
          if (res.confirm) {
            wx.shareAppMessage({
              title: "ä¸čĻåæįŖ¨æäēīŧåŋĢæĨįŠįŠįŽåįįžäēä¸Ēįžå§",
              imageUrl: "", // åžį URL
            });
            databus.pCount += 1;
            databus.popCount += 1;
            databus.recoverCount += 1;
          } else if (res.cancel) {
            this.reset();
          }
        },
      });
      return;
      //   setTipText("å¤ąč´Ĩäē");
      //   setFinished(true);
    }

    if (!databus.pokers.find((s) => s.status !== 2)) {
      if (databus.level === 50) {
        // setTipText('åŽæææ');
        // setFinished(true);
        wx.showModal({
          title: "æå",
          content: "įéŧå~ äŊ åˇ˛įģéåŗäēīŧåäēĢįģåĨŊåä¸čĩˇįŠå§~",
          // showCancel: false,
          cancelText: "åæĨä¸åą~",
          confirmText: "åäēĢ",
          success: (res) => {
            if (res.confirm) {
              wx.shareAppMessage({
                title: "ä¸čĻåæįŖ¨æäēīŧåŋĢæĨįŠįŠįŽåįįžäēä¸Ēįžå§",
                imageUrl: "", // åžį URL
              });
              databus.pCount += 1;
              databus.popCount += 1;
              databus.recoverCount += 1;
            } else if (res.cancel) {
              this.reset();
            }
          },
        });
        return;
      }
      // åįē§
      //   setLevel(level + 1);
      //   setQueue([]);
      //   checkCover(makepokers(level + 1));
      this.updateLevel();
    } else {
      //   setQueue(updateQueue);
      //   checkCover(updatepokers);
    }
    // setAnimating(false);
  }

  render() {
    databus.pokers.forEach((item) => {
      item.render(this.ctx);
    });
  }
  //   testRender() {
  //     console.log("testRender");
  //     console.log("render");
  //     const pokers = makepokers(10);
  //     console.log(pokers, 111);
  //     pokers.map((item, index) => {
  //       // ctx.drawImage(
  //       ctx.font = "20px Georgia";
  //       const x =
  //         item.status === 0
  //           ? item.x
  //           : item.status === 1
  //           ? sortedQueue[item.id]
  //           : -1000;
  //       const y = item.status === 0 ? item.y : 895;
  //       ctx.drawImage(
  //         img1,
  //         0,
  //         0,
  //         // screenWidth,
  //         // (650 * screenWidth) / screenHeight,
  //         // 650,
  //         // screenHeight,
  //         118,
  //         135,
  //         x / 2 - 10,
  //         y / 2 - 30,
  //         POKER_HEIGHT,
  //         POKER_WIDTH
  //       );
  //       ctx.fillStyle = item.isCover ? "#999" : "#fff";
  //       // ctx.fillRect(x / 2 - 10, y / 2 - 30, POKER_HEIGHT, BLOCK_WIDTH);
  //       // ctx.strokeStyle = "#FF0000";
  //       // ctx.clearRect(45, 45, 60, 60);
  //       // ctx.strokeRect(50, 50, 50, 50);

  //       ctx.fillText(item.icon, x / 2, y / 2);
  //       // ctx.fillStyle = gradient;
  //       ctx.font = "30px Verdana";
  //       // ctx.fillRect(x, y, 100, 100);
  //       // ctx.clearRect(45, 45, 60, 60);
  //       // ctx.strokeRect(x, y, 50, 50);
  //       // console.log(x, y, item.icon)
  //       // ctx.drawImage(
  //       //   'images/hero.png',
  //       //   x,
  //       //   y,
  //       //   50,
  //       //   50
  //       // )
  //     });
  //   }

  testRender() {
    console.log("testRender");
    console.log("render");
    const pokers = makepokers(10);
    console.log(pokers, 111);
    pokers.map((item, index) => {
      // ctx.drawImage(
      ctx.font = "20px Georgia";
      const x =
        item.status === 0
          ? item.x
          : item.status === 1
          ? sortedQueue[item.id]
          : -1000;
      const y = item.status === 0 ? item.y : 895;
      ctx.drawImage(
        img1,
        0,
        0,
        // screenWidth,
        // (650 * screenWidth) / screenHeight,
        // 650,
        // screenHeight,
        118,
        135,
        x / 2 - 10,
        y / 2 - 30,
        POKER_WIDTH,
        POKER_HEIGHT
      );
      ctx.fillStyle = item.isCover ? "#999" : "#fff";
      // ctx.fillRect(x / 2 - 10, y / 2 - 30, BLOCK_WIDTH, BLOCK_WIDTH);
      // ctx.strokeStyle = "#FF0000";
      // ctx.clearRect(45, 45, 60, 60);
      // ctx.strokeRect(50, 50, 50, 50);

      ctx.fillText(item.icon, x / 2, y / 2);
      // ctx.fillStyle = gradient;
      ctx.font = "30px Verdana";
      // ctx.fillRect(x, y, 100, 100);
      // ctx.clearRect(45, 45, 60, 60);
      // ctx.strokeRect(x, y, 50, 50);
      // console.log(x, y, item.icon)
      // ctx.drawImage(
      //   'images/hero.png',
      //   x,
      //   y,
      //   50,
      //   50
      // )
    });
  }
}
