let instance;

/**
 * 统一的音效管理器
 */
export default class Music {
  constructor() {
    if (instance) return instance;

    instance = this;

    this.bgmAudio = new Audio();
    this.bgmAudio.loop = true;
    this.bgmAudio.src = "audio/1.mp3";

    this.shootAudio = new Audio();
    this.shootAudio.src = "audio/click.mp3";

    // this.boomAudio = new Audio();
    // this.boomAudio.src = "audio/boom.mp3";

    this.playBgm();

    this.playShoot = this.handlePlayShoot.bind(this);
  }

  playBgm() {
    this.bgmAudio.play();
  }

  handlePlayShoot() {
    this.shootAudio.currentTime = 0;
    this.shootAudio.play();
  }
}
