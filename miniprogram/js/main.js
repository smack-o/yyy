import Player from "./player/index";
import Enemy from "./npc/enemy";
import BackGround from "./runtime/background";
import GameInfo from "./runtime/gameinfo";
import Music from "./runtime/music";
import DataBus from "./databus";
import Pokers from "./poker/pokers";

let ctx = canvas.getContext("2d");
let databus = new DataBus();

const img1 = new Image();
img1.src = "images/yang/1.png";

wx.cloud.init({
  // env 参数说明：
  //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
  //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
  //   如不填则使用默认环境（第一个创建的环境）
  // env: 'my-env-id',
});
const db = wx.cloud.database();
// 最大关卡
const maxLevel = 50;
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

console.log(screenWidth, screenHeight);

const BLOCK_WIDTH = 37.5;
const BLOCK_HEIGHT = (37.5 / 118) * 135;

// const dpr = wx.getSystemInfoSync().pixelRatio;
canvas.width = canvas.width * 2;
canvas.height = canvas.height * 2;
ctx.scale(2, 2);
/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    // 维护当前requestAnimationFrame的id
    this.aniId = 0;
    this.personalHighScore = null;

    this.init();
    // this.login()
  }

  async init() {
    wx.showShareMenu();
    // wx.shareAppMessage
    wx.onShareAppMessage(() => {
      return {
        title: "别折磨我了，来玩玩简单版羊了个羊吧",
        imageUrl: "", // 图片 URL
      };
    });
    this.reset();
    this.start();
  }

  // login() {
  //   // 获取 openid
  //   wx.cloud.callFunction({
  //     name: 'login',
  //     success: res => {
  //       window.openid = res.result.openid
  //       this.prefetchHighScore()
  //     },
  //     fail: err => {
  //       console.error('get openid failed with error', err)
  //     }
  //   })
  // }

  // prefetchHighScore() {
  //   // 预取历史最高分
  //   db.collection('score').doc(`${window.openid}-score`).get()
  //     .then(res => {
  //       if (this.personalHighScore) {
  //         if (res.data.max > this.personalHighScore) {
  //           this.personalHighScore = res.data.max
  //         }
  //       } else {
  //         this.personalHighScore = res.data.max
  //       }
  //     })
  //     .catch(err => {
  //       console.error('db get score catch error', err)
  //       this.prefetchHighScoreFailed = true
  //     })
  // }

  updateLevel() {
    databus.level++;
    // 胜利
    if (databus.level === maxLevel) {
      // setTipText("完成挑战");
      // setFinished(true);
      return;
    }

    this.pokers && this.pokers.recover();
    this.start();
  }

  reset() {
    databus.reset(true);
    this.pokers && this.pokers.recover();
  }

  start() {
    databus.reset();

    canvas.removeEventListener("touchstart", this.touchHandler);

    this.bg = new BackGround(ctx);
    // this.player = new Player(ctx);
    // this.gameinfo = new GameInfo();
    this.music = new Music();
    this.pokers = new Pokers(
      ctx,
      this.updateLevel.bind(this),
      () => {
        this.reset();
        this.start();
      },
      this.music.playShoot
    );
    console.log(databus, "databus");

    // this.testRender();
    this.bindLoop = this.loop.bind(this);
    this.hasEventBind = false;

    // 清除上一局的动画
    window.cancelAnimationFrame(this.aniId);

    this.aniId = window.requestAnimationFrame(this.bindLoop, canvas);
  }

  /**
   * 随着帧数变化的敌机生成逻辑
   * 帧数取模定义成生成的频率
   */
  enemyGenerate() {
    if (databus.frame % 30 === 0) {
      let enemy = databus.pool.getItemByClass("enemy", Enemy);
      enemy.init(6);
      databus.enemys.push(enemy);
    }
  }

  // 全局碰撞检测
  collisionDetection() {
    let that = this;

    databus.bullets.forEach((bullet) => {
      for (let i = 0, il = databus.enemys.length; i < il; i++) {
        let enemy = databus.enemys[i];

        if (!enemy.isPlaying && enemy.isCollideWith(bullet)) {
          enemy.playAnimation();
          that.music.playExplosion();

          bullet.visible = false;
          databus.score += 1;

          break;
        }
      }
    });

    for (let i = 0, il = databus.enemys.length; i < il; i++) {
      let enemy = databus.enemys[i];

      if (this.player.isCollideWith(enemy)) {
        databus.gameOver = true;

        // 获取历史高分
        if (this.personalHighScore) {
          if (databus.score > this.personalHighScore) {
            this.personalHighScore = databus.score;
          }
        }

        // 上传结果
        // 调用 uploadScore 云函数
        wx.cloud.callFunction({
          name: "uploadScore",
          // data 字段的值为传入云函数的第一个参数 event
          data: {
            score: databus.score,
          },
          success: (res) => {
            if (this.prefetchHighScoreFailed) {
              this.prefetchHighScore();
            }
          },
          fail: (err) => {
            console.error("upload score failed", err);
          },
        });

        break;
      }
    }
  }

  // 游戏结束后的触摸事件处理逻辑
  touchEventHandler(e) {
    e.preventDefault();

    let x = e.touches[0].clientX;
    let y = e.touches[0].clientY;

    let area = this.gameinfo.btnArea;

    if (
      x >= area.startX &&
      x <= area.endX &&
      y >= area.startY &&
      y <= area.endY
    )
      this.start();
  }

  /**
   * canvas重绘函数
   * 每一帧重新绘制所有的需要展示的元素
   */
  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.bg.render(ctx);
    this.pokers.render(ctx);

    // databus.bullets.concat(databus.enemys).forEach((item) => {
    //   item.drawToCanvas(ctx);
    // });

    // this.player.drawToCanvas(ctx);

    // databus.animations.forEach((ani) => {
    //   if (ani.isPlaying) {
    //     ani.aniRender(ctx);
    //   }
    // });

    // this.gameinfo.renderGameScore(ctx, databus.score);

    // // 游戏结束停止帧循环
    // if (databus.gameOver) {
    //   this.gameinfo.renderGameOver(ctx, databus.score, this.personalHighScore);

    //   if (!this.hasEventBind) {
    //     this.hasEventBind = true;
    //     this.touchHandler = this.touchEventHandler.bind(this);
    //     canvas.addEventListener("touchstart", this.touchHandler);
    //   }
    // }
  }

  // render() {
  //   console.log('render')
  //   const scene = makeScene(2);
  //   console.log(scene, 111)
  //   scene.map((item, index) => {
  //     // ctx.drawImage(
  //     ctx.font = "20px Georgia";
  //     const x =  item.status === 0
  //     ? item.x
  //     : item.status === 1
  //     ? sortedQueue[item.id]
  //     : -1000;
  //     const y = item.status === 0 ? item.y : 895;
  //     // ctx.fillText(item.icon, item.status === 0
  //     // ? item.x
  //     // : item.status === 1
  //     // ? sortedQueue[item.id]
  //     // : -1000, item.status === 0 ? item.y : 895);
  //     // ctx.fillStyle = gradient;
  //     // ctx.font = "30px Verdana";
  //     // ctx.fillRect(x, y, 100, 100);
  //     // // ctx.clearRect(45, 45, 60, 60);
  //     // ctx.strokeRect(x, y, 50, 50);
  //     console.log(x, y, icon)
  //     ctx.drawImage(
  //       'images/hero.png',
  //       x,
  //       y,
  //       50,
  //       50
  //     )
  //   })
  // }

  // 游戏逻辑更新主函数
  update() {
    if (databus.gameOver) return;

    this.bg.update();

    // databus.bullets.concat(databus.enemys).forEach((item) => {
    //   item.update();
    // });

    // this.enemyGenerate();

    // this.collisionDetection();

    // if (databus.frame % 20 === 0) {
    //   this.player.shoot();
    //   this.music.playShoot();
    // }
  }

  // 实现游戏帧循环
  loop() {
    databus.frame++;

    // console.log(databus);

    this.update();
    this.render();

    this.aniId = window.requestAnimationFrame(this.bindLoop, canvas);
  }
}
