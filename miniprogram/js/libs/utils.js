// simple uuid
export const randomString = (len) => {
  const pool = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let res = "";
  while (len >= 0) {
    res += pool[Math.floor(pool.length * Math.random())];
    len--;
  }
  return res;
};

export const waitTimeout = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });
};

const icons = [`🎨`, `🌈`, `⚙️`, `💻`, `📚`, `🐯`, `🐤`, `🐼`, `🐏`, `🍀`];

// 最大关卡
const maxLevel = 50;

export const POKER_WIDTH = 37.5;
export const POKER_HEIGHT = (POKER_WIDTH / 120) * 135;

export const makeScene = (level) => {
  const curLevel = Math.min(maxLevel, level);
  const iconPool = icons.slice(0, 2 * curLevel);
  const offsetPool = [0, POKER_WIDTH / 2, -POKER_WIDTH / 2].slice(
    0,
    1 + curLevel
  );

  const scene = [];

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
    const column = range[0] + Math.floor((range[1] - range[0]) * Math.random());
    scene.push({
      isCover: false,
      status: 0,
      icon,
      id: randomString(4),
      x: column * POKER_WIDTH * 2 + offset,
      y: row * POKER_HEIGHT * 2 + offset,
    });
  };

  // 大于5级别增加icon池
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

  console.log(scene, "111", level, curLevel);

  return checkCover(scene);
};

export const checkCover = (scene) => {
  const updateScene = scene.slice();
  for (let i = 0; i < updateScene.length; i++) {
    // 当前item对角坐标
    const cur = updateScene[i];
    cur.isCover = false;
    if (cur.status !== 0) continue;
    const { x: x1, y: y1 } = cur;
    const x2 = x1 + POKER_WIDTH * 2,
      y2 = y1 + POKER_HEIGHT * 2;

    for (let j = i + 1; j < updateScene.length; j++) {
      const compare = updateScene[j];
      if (compare.status !== 0) continue;

      // 两区域有交集视为选中
      // 两区域不重叠情况取反即为交集
      const { x, y } = compare;

      if (
        !(
          y + POKER_WIDTH * 2 <= y1 ||
          y >= y2 ||
          x + POKER_HEIGHT * 2 <= x1 ||
          x >= x2
        )
      ) {
        cur.isCover = true;
        break;
      }
    }
  }
  return updateScene;
};
