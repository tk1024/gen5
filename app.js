const global = {
  COLUMN_TITLES: [
    "西暦",
    "元号",
    "天皇",
    "時代"
  ],
  frame: 10700,
  direction: 0,
  ctx: null
}

const decideVariables = () => {
  global.WIDTH = document.documentElement.clientWidth < 960 ? document.documentElement.clientWidth * 2 : 1920
  global.HEIGHT = document.documentElement.clientHeight < 540 ? document.documentElement.clientHeight * 2 : 1080

  // if (global.WIDTH < global.HEIGHT) {
  //   const tWIDTH = global.WIDTH
  //   global.WIDTH = global.HEIGHT
  //   global.HEIGHT = tWIDTH
  // }

  global.COLUMN_COUNT = global.COLUMN_TITLES.length
  global.TITLE_HEIGHT = 70
  global.BOX_PADDING_X = 100
  global.BOX_PADDING_Y_START = 50
  global.BOX_PADDING_Y_END = 170
  global.BOX_WIDTH = global.WIDTH - global.BOX_PADDING_X * 2
  global.BOX_HEIGHT = global.HEIGHT - global.TITLE_HEIGHT - global.BOX_PADDING_Y_START - global.BOX_PADDING_Y_END
  global.GRAPH_TITLE_WIDTH = 200
  global.BOX_START_POSITION_X = global.BOX_PADDING_X
  global.BOX_START_POSITION_Y = global.TITLE_HEIGHT + global.BOX_PADDING_Y_START
  global.COLUMN_HEIGHT = parseInt(global.BOX_HEIGHT / global.COLUMN_COUNT, 10)
  global.ONE_YEAR_WIDTH = 150
  global.BASE_FONT_SIZE = global.HEIGHT * 0.045

  const canvas = document.getElementById("canvas");
  canvas.width = global.WIDTH
  canvas.height = global.HEIGHT
  canvas.style.width = `${global.WIDTH/2}px`
  canvas.style.height = `${global.HEIGHT/2}px`
  document.querySelector(".wrapper").style.width = `${global.WIDTH/2}px`
  document.querySelector(".wrapper").style.height = `${global.HEIGHT/2}px`
}

document.addEventListener("DOMContentLoaded", () => {
  decideVariables()
  global.ctx = canvas.getContext('2d');
  Draw();
})

window.addEventListener('orientationchange', () => {
  decideVariables()
}, false);

window.addEventListener('resize', () => {
  decideVariables()
}, false);

const Draw = () => {
  global.frame += global.direction;
  global.ctx.clearRect(0, 0, global.WIDTH, global.HEIGHT);
  Title()
  AD()
  Gengou()
  Tennou()
  Era()
  Border()
  GraphTitle()
  FillWhite()
  Frame()
  Border()
  requestAnimationFrame(Draw)
}

const Title = () => {
  const titleFontSize = global.BASE_FONT_SIZE * 1.5
  global.ctx.font = `${titleFontSize}px serif`;
  global.ctx.textAlign = "center";
  global.ctx.fillText("西暦・元号・天皇・時代対応表", global.WIDTH / 2, global.TITLE_HEIGHT / 2 + titleFontSize / 2 + global.BOX_PADDING_Y_START / 2);
}

const Border = () => {
  // 4角の枠を描く
  global.ctx.rect(global.BOX_START_POSITION_X, global.BOX_START_POSITION_Y, global.BOX_WIDTH, global.BOX_HEIGHT);
  global.ctx.stroke();

  // 間の線を描く
  for (let i = 1; i < global.COLUMN_COUNT; i++) {
    const ColumnYLinePosition = global.BOX_START_POSITION_Y + (global.COLUMN_HEIGHT * i)

    global.ctx.beginPath();
    global.ctx.moveTo(global.BOX_START_POSITION_X, ColumnYLinePosition);
    global.ctx.lineTo(global.BOX_START_POSITION_X + global.BOX_WIDTH, ColumnYLinePosition);
    global.ctx.closePath();
    global.ctx.stroke();
  }

  // グラフタイトル線
  global.ctx.beginPath();
  global.ctx.moveTo(global.BOX_START_POSITION_X + global.GRAPH_TITLE_WIDTH, global.BOX_START_POSITION_Y);
  global.ctx.lineTo(global.BOX_START_POSITION_X + global.GRAPH_TITLE_WIDTH, global.BOX_START_POSITION_Y + global.BOX_HEIGHT);
  global.ctx.closePath();
  global.ctx.stroke();
}

const GraphTitle = () => {
  const GraphTitleFontSize = global.BASE_FONT_SIZE
  global.ctx.font = `${GraphTitleFontSize}px serif`;
  global.ctx.textAlign = "center";

  for (let i = 0; i < global.COLUMN_COUNT; i++) {
    const start_x = parseInt(global.BOX_START_POSITION_X, 10)
    const start_y = parseInt(global.BOX_START_POSITION_Y + (global.COLUMN_HEIGHT * i), 10)

    const titleYPosition = global.BOX_START_POSITION_Y + (global.COLUMN_HEIGHT * i)
    global.ctx.fillStyle = "#fff"
    global.ctx.fillRect(start_x, start_y, global.GRAPH_TITLE_WIDTH, global.COLUMN_HEIGHT)
    global.ctx.fillStyle = "#000"
    global.ctx.fillText(global.COLUMN_TITLES[i], global.BOX_START_POSITION_X + global.GRAPH_TITLE_WIDTH / 2, titleYPosition + global.COLUMN_HEIGHT / 2 + GraphTitleFontSize / 2);
  }
}

const FillWhite = () => {
  global.ctx.fillStyle = "#fff"
  global.ctx.fillRect(0, global.BOX_START_POSITION_Y, global.BOX_START_POSITION_X, global.BOX_HEIGHT)
  global.ctx.fillRect(global.BOX_START_POSITION_X + global.BOX_WIDTH, global.BOX_START_POSITION_Y, global.WIDTH, global.BOX_HEIGHT)
  global.ctx.fillStyle = "#000"
}

const Frame = () => {
  global.ctx.font = `20px serif`;
  global.ctx.textAlign = "start";
  global.ctx.fillStyle = "#000"
  global.ctx.fillText(global.frame, 5, global.HEIGHT - 5);
}

const AD = () => {
  const adFontSize = global.BASE_FONT_SIZE
  global.ctx.font = `${adFontSize}px serif`;
  global.ctx.textAlign = "center";
  for (let i = 0; i < 2020; i++) {
    CalcBoxSizeAndPosition(0, i, i + 1, i, null, 1, 1, true)
  }
}

const Gengou = () => {
  for (let i = 0; i < gengou.length; i++) {
    const g = gengou[i]
    const start = g.start.year + (g.start.month / 12) + (g.start.day / 365)
    const end = g.end.year + (g.end.month / 12) + (g.end.day / 365)
    let displayName = (end - start > 5) ? `${g.kanji} (${Math.floor(end - start)}年)` : g.kanji

    // 元号が重なる時期(日本が未熟だった頃)
    if (g.kanji === "元徳") {
      const position = g.end.day === 11 ? 1 : 2
      CalcBoxSizeAndPosition(1, start, end, displayName, g.yomi, 2, position)
      continue;
    }
    if (g.kanji === "建武") {
      const position = g.end.month === 4 ? 1 : 2
      CalcBoxSizeAndPosition(1, start, end, displayName, g.yomi, 2, position)
      continue;
    }
    if (g.era === "大覚寺統" || g.era === "南朝") {
      CalcBoxSizeAndPosition(1, start, end, displayName, g.yomi, 2, 1)
      continue;
    }
    if (g.era === "持明院統" || g.era === "北朝") {
      CalcBoxSizeAndPosition(1, start, end, displayName, g.yomi, 2, 2)
      continue;
    }

    CalcBoxSizeAndPosition(1, start, end, displayName, g.yomi)
  }
}

const Tennou = () => {
  for (let i = 0; i < tennou.length; i++) {
    const t = tennou[i]
    const start = t.start.year + (t.start.month / 12) + (t.start.day / 365)
    const end = t.end.year + (t.end.month / 12) + (t.end.day / 365)
    let displayName = (end - start > 5) ? `${t.num}代 ${t.kanji} (${Math.floor(end - start)}年)` : `${t.num}代 ${t.kanji}`

    if (t.num.indexOf("南") > -1) {
      CalcBoxSizeAndPosition(2, start, end, displayName, t.yomi, 2, 1)
      continue;
    }

    if (t.num.indexOf("北") > -1) {
      CalcBoxSizeAndPosition(2, start, end, displayName, t.yomi, 2, 2)
      continue;
    }

    CalcBoxSizeAndPosition(2, start, end, displayName, t.yomi)
  }
}

const Era = () => {
  for (let i = 0; i < era.length; i++) {
    const e = era[i]
    const start = e.start.year + (e.start.month / 12) + (e.start.day / 365)
    const end = e.end.year + (e.end.month / 12) + (e.end.day / 365)
    let displayName = (end - start > 5) ? `${e.kanji} (${Math.floor(end - start)}年)` : `${e.kanji}`
    CalcBoxSizeAndPosition(3, start, end, displayName, e.yomi)
  }
}

const CalcBoxSizeAndPosition = (columnIndex, startAD, endAD, name, subName = null, divide = 1, position = 1, textNoMove = false) => {
  const duration = endAD - startAD
  const start_x = (global.BOX_START_POSITION_X + global.GRAPH_TITLE_WIDTH) + global.ONE_YEAR_WIDTH * startAD
  const start_y = global.BOX_START_POSITION_Y + (global.COLUMN_HEIGHT * columnIndex)
  const width = global.ONE_YEAR_WIDTH * duration
  const height = global.COLUMN_HEIGHT / divide
  const frameWithIncludeSpeed = 7 * global.frame

  const currentPosition = {
    x: {
      start: start_x - frameWithIncludeSpeed,
      end: start_x - frameWithIncludeSpeed + width
    },
    y: {
      start: start_y + height * (position - 1),
      end: start_y + height
    },
  }

  const BUFFER = 150

  // 画面外の場合は表示しない
  if (currentPosition.x.start < global.BOX_START_POSITION_X + BUFFER + global.BOX_WIDTH && currentPosition.x.end > global.BOX_START_POSITION_X - BUFFER) {
    const FONT_SIZE = global.BASE_FONT_SIZE * 0.9 / divide
    const SUB_FONT_SIZE = global.BASE_FONT_SIZE * 0.6 / divide
    global.ctx.font = `${FONT_SIZE}px serif`;
    let textPosition = {
      x: textNoMove ? start_x + width / 2 - frameWithIncludeSpeed : decideTextPositionX(width, currentPosition.x.start, name),
      y: currentPosition.y.start + height / 2 + FONT_SIZE / 2
    }

    columFillAndBorder(Math.round(start_x - frameWithIncludeSpeed), Math.round(currentPosition.y.start), Math.round(width), Math.round(height), divide = 1, position = 1)

    global.ctx.fillStyle = "#000"
    if (subName !== null) {
      global.ctx.fillText(name, textPosition.x, textPosition.y - global.BASE_FONT_SIZE * 0.3 / divide);
      global.ctx.font = `${SUB_FONT_SIZE}px serif`;
      let subTextPositionX = textNoMove ? start_x + width / 2 - frameWithIncludeSpeed : decideTextPositionX(width, currentPosition.x.start, subName)
      global.ctx.fillText(subName, subTextPositionX, textPosition.y + global.BASE_FONT_SIZE * 0.3 / divide);
    } else {
      global.ctx.fillText(name, textPosition.x, textPosition.y);
    }
  }
}

const columFillAndBorder = (startX, startY, columnWidth, columnHeight, divide, currentIndex) => {
  global.ctx.fillStyle = "#f3f3f3"
  global.ctx.fillRect(startX, startY, columnWidth, columnHeight)

  global.ctx.beginPath()
  global.ctx.moveTo(startX, startY)
  global.ctx.lineTo(startX, startY + columnHeight)
  global.ctx.closePath();
  global.ctx.stroke();

  global.ctx.beginPath()
  global.ctx.moveTo(startX + columnWidth, startY)
  global.ctx.lineTo(startX + columnWidth, startY + columnHeight)
  global.ctx.closePath();
  global.ctx.stroke();

}

const decideTextPositionX = (width, start, name) => {
  const end = start + width
  const textWidth = global.ctx.measureText(name).width
  if (end - start < textWidth) {
    global.ctx.textAlign = "center"
    return start + width / 2
  }
  if (start > global.BOX_START_POSITION_X + global.GRAPH_TITLE_WIDTH - 10) {
    global.ctx.textAlign = "start";
    return start + 10
  } else {
    if (end < global.BOX_START_POSITION_X + global.GRAPH_TITLE_WIDTH + textWidth + 10) {
      global.ctx.textAlign = "end";
      return end - 10
    }
    global.ctx.textAlign = "start";
    return global.BOX_START_POSITION_X + global.GRAPH_TITLE_WIDTH + 10
  }
}