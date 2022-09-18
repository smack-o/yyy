import Pool from "./base/pool";

let instance;

/**
 * 全局状态管理器
 */
export default class DataBus {
  constructor() {
    if (instance) return instance;

    instance = this;
    this.pool = new Pool();
    this.animating = false;
    this.level = 1;
    this.score = 0;
    this.popCount = 5;
    this.recoverCount = 5;
    this.pCount = 5;
    this.reset();
  }

  reset(allReset) {
    if (allReset) {
      this.level = 1;
      this.score = 0;
      this.popCount = 5;
      this.recoverCount = 5;
      this.pCount = 5;
    }

    this.frame = 0;
    // this.animating = false;

    this.pokers = [];
    this.barPokers = [];

    this.bullets = [];
    this.enemys = [];
    this.animations = [];
    this.gameOver = false;
  }

  // removePoker() {
  //   let temp = this.pokers.shift();

  //   temp.visible = false;

  //   this.pool.recover("enemy", enemy);
  // }

  /**
   * 回收敌人，进入对象池
   * 此后不进入帧循环
   */
  removeEnemey(enemy) {
    let temp = this.enemys.shift();

    temp.visible = false;

    this.pool.recover("enemy", enemy);
  }

  /**
   * 回收子弹，进入对象池
   * 此后不进入帧循环
   */
  removeBullets(bullet) {
    let temp = this.bullets.shift();

    temp.visible = false;

    this.pool.recover("bullet", bullet);
  }
}
