const WIDTH = 1920
const HEIGHT = 1080

const COLUMN_TITLES = [
  "西暦",
  "元号",
  "天皇",
  "時代"
]

const COLUMN_COUNT = COLUMN_TITLES.length
const TITLE_HEIGHT = 100
const BOX_PADDING_X = 100
const BOX_PADDING_Y_START = 100
const BOX_PADDING_Y_END = 200
const BOX_WIDTH = WIDTH - BOX_PADDING_X * 2
const BOX_HEIGHT = HEIGHT - TITLE_HEIGHT - BOX_PADDING_Y_START - BOX_PADDING_Y_END
const GRAPH_TITLE_WIDTH = 200
const BOX_START_POSITION_X = BOX_PADDING_X
const BOX_START_POSITION_Y = TITLE_HEIGHT + BOX_PADDING_Y_START
const COLUMN_HEIGHT = parseInt(BOX_HEIGHT/COLUMN_COUNT, 10)
const ONE_YEAR_WIDTH = 150

let frame = 10700
let direction = 0
let ctx = null

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  ctx = canvas.getContext('2d');
  Draw();
})

const Draw = () => {
  frame += direction;
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  Title()
  AD()
  Gengou()
  Tennou()
  Era()
  GraphTitle()
  Border()
  FillWhite()
  Frame()
  requestAnimationFrame(Draw)
}

const Title = () => {
  const TITLE_FONT_SIZE = 72
  ctx.font = `${TITLE_FONT_SIZE}px serif`;
  ctx.textAlign = "center";
  ctx.fillText("西暦・元号・天皇・時代対応グラフ", WIDTH/2, TITLE_HEIGHT/2 + TITLE_FONT_SIZE/2 + BOX_PADDING_Y_START/2);
}

const Border = () => {
  // 4角の枠を描く
  ctx.rect(BOX_START_POSITION_X, BOX_START_POSITION_Y, BOX_WIDTH, BOX_HEIGHT);
  ctx.stroke();

  // 間の線を描く
  for(let i = 1; i < COLUMN_COUNT;i++) {
    const COLUMN_Y_LINE_POSITION = BOX_START_POSITION_Y+(COLUMN_HEIGHT*i)

    ctx.beginPath();
    ctx.moveTo(BOX_START_POSITION_X, COLUMN_Y_LINE_POSITION);
    ctx.lineTo(BOX_START_POSITION_X + BOX_WIDTH, COLUMN_Y_LINE_POSITION);
    ctx.stroke();
  }

  // グラフタイトル線
  ctx.beginPath();
  ctx.moveTo(BOX_START_POSITION_X + GRAPH_TITLE_WIDTH, BOX_START_POSITION_Y);
  ctx.lineTo(BOX_START_POSITION_X + GRAPH_TITLE_WIDTH, BOX_START_POSITION_Y + BOX_HEIGHT);
  ctx.stroke();
}

const GraphTitle = () => {
  const GRAPH_TITLE_FONT_SIZE = 48
  ctx.font = `${GRAPH_TITLE_FONT_SIZE}px serif`;
  ctx.textAlign = "center";

  for(let i = 0; i < COLUMN_COUNT;i++) {
    const start_x = parseInt(BOX_START_POSITION_X, 10)
    const start_y = parseInt(BOX_START_POSITION_Y + (COLUMN_HEIGHT * i), 10)

    const TITLE_Y_POSITION = BOX_START_POSITION_Y+(COLUMN_HEIGHT*i)
    ctx.fillStyle = "#fff"
    ctx.fillRect(start_x, start_y, GRAPH_TITLE_WIDTH, COLUMN_HEIGHT)
    ctx.fillStyle = "#000"
    ctx.fillText(COLUMN_TITLES[i], BOX_START_POSITION_X + GRAPH_TITLE_WIDTH/2, TITLE_Y_POSITION + COLUMN_HEIGHT/2 + GRAPH_TITLE_FONT_SIZE/2);
  }
}

const FillWhite = () => {
  ctx.fillStyle = "#fff"
  ctx.fillRect(0, BOX_START_POSITION_Y, BOX_START_POSITION_X, BOX_HEIGHT)
  ctx.fillRect(BOX_START_POSITION_X + BOX_WIDTH, BOX_START_POSITION_Y, WIDTH, BOX_HEIGHT)
  ctx.fillStyle = "#000"
}

const Frame = () => {
  ctx.font = `20px serif`;
  ctx.textAlign = "start";
  ctx.fillStyle = "#000"
  ctx.fillText(frame, 5, HEIGHT - 5);
}

const AD = () => {
  const AD_FONT_SIZE = 48
  ctx.font = `${AD_FONT_SIZE}px serif`;
  ctx.textAlign = "center";
  for(let i = 0; i < 2020;i++) {
    CalcBoxSizeAndPosition(0, i, i+1, i, null, 1, 1, true)
  }
}

const Gengou = () => {
  for(let i = 0; i < gengou.length;i++) {
    const g = gengou[i]
    const start = g.start.year+(g.start.month/12)+(g.start.day/365)
    const end = g.end.year+(g.end.month/12)+(g.end.day/365)
    let displayName = (end - start > 5) ? `${g.kanji} (${Math.floor(end - start)}年)` : g.kanji

    // 元号が重なる時期(日本が未熟だった頃)
    if(g.kanji === "元徳") {
      const position = g.end.day === 11 ? 1 : 2
      CalcBoxSizeAndPosition(1, start, end, displayName, g.yomi, 2, position)
      continue;
    }
    if(g.kanji === "建武") {
      const position = g.end.month === 4 ? 1 : 2
      CalcBoxSizeAndPosition(1, start, end, displayName, g.yomi, 2, position)
      continue;
    }
    if(g.era === "大覚寺統" || g.era === "南朝") {
      CalcBoxSizeAndPosition(1, start, end, displayName, g.yomi, 2, 1)
      continue;
    }
    if(g.era === "持明院統" || g.era === "北朝") {
      CalcBoxSizeAndPosition(1, start, end, displayName, g.yomi, 2, 2)
      continue;
    }
  
    CalcBoxSizeAndPosition(1, start, end, displayName, g.yomi)
  }
}

const Tennou = () => {
  for(let i = 0; i < tennou.length;i++) {
    const t = tennou[i]
    const start = t.start.year+(t.start.month/12)+(t.start.day/365)
    const end = t.end.year+(t.end.month/12)+(t.end.day/365)
    let displayName = (end - start > 5) ? `${t.num}代 ${t.kanji} (${Math.floor(end - start)}年)` : `${t.num}代 ${t.kanji}`

    if(t.num.indexOf("南") > -1) {
      CalcBoxSizeAndPosition(2, start, end, displayName, t.yomi, 2, 1)
      continue;
    }

    if(t.num.indexOf("北") > -1) {
      CalcBoxSizeAndPosition(2, start, end, displayName, t.yomi, 2, 2)
      continue;
    }

    CalcBoxSizeAndPosition(2, start, end, displayName, t.yomi)
  }
}

const Era = () => {
  for(let i = 0; i < era.length;i++) {
    const e = era[i]
    const start = e.start.year+(e.start.month/12)+(e.start.day/365)
    const end = e.end.year+(e.end.month/12)+(e.end.day/365)
    let displayName = (end - start > 5) ? `${e.kanji} (${Math.floor(end - start)}年)` : `${e.kanji}`
    CalcBoxSizeAndPosition(3, start, end, displayName, e.yomi)
  }
}

const CalcBoxSizeAndPosition = (columnIndex, startAD, endAD, name, subName = null, divide = 1, position=1, textNoMove=false) => {
  const duration = endAD - startAD
  const start_x = (BOX_START_POSITION_X + GRAPH_TITLE_WIDTH) + ONE_YEAR_WIDTH*startAD
  const start_y = BOX_START_POSITION_Y + (COLUMN_HEIGHT * columnIndex)
  const width = ONE_YEAR_WIDTH*duration
  const height = COLUMN_HEIGHT / divide
  const frameWithIncludeSpeed = 7 * frame
  
  const currentPosition = {
    x: {
      start: start_x - frameWithIncludeSpeed,
      end: start_x - frameWithIncludeSpeed + width
    },
    y: {
      start: start_y + height*(position-1),
      end: start_y + height
    },
  }

  const BUFFER = 150

  // 画面外の場合は表示しない
  if(currentPosition.x.start < BOX_START_POSITION_X + BUFFER + BOX_WIDTH && currentPosition.x.end > BOX_START_POSITION_X - BUFFER) {
    const FONT_SIZE = 42
    const SUB_FONT_SIZE = 20
    ctx.font = `${FONT_SIZE}px serif`;
    let textPosition = {
      x: textNoMove ? start_x + width/2 - frameWithIncludeSpeed : decideTextPositionX(width, currentPosition.x.start, name),
      y: currentPosition.y.start + height/2 + FONT_SIZE/2
    }

    columFillAndBorder(Math.round(start_x - frameWithIncludeSpeed), Math.round(currentPosition.y.start), Math.round(width), Math.round(height), divide = 1, position = 1)

    ctx.fillStyle = "#000"
    if(subName !== null) {
      ctx.fillText(name, textPosition.x, textPosition.y - 11);
      ctx.font = `${SUB_FONT_SIZE}px serif`;
      let subTextPositionX = textNoMove ? start_x + width/2 - frameWithIncludeSpeed : decideTextPositionX(width, currentPosition.x.start, subName)
      ctx.fillText(subName, subTextPositionX, textPosition.y + 11);
    }else{
      ctx.fillText(name, textPosition.x, textPosition.y);
    }
    ctx.stroke();
  }
}

const columFillAndBorder = (startX, startY, columnWidth, columnHeight, divide, currentIndex) => {
  ctx.fillStyle = "#f3f3f3"
  ctx.fillRect(startX, startY, columnWidth, columnHeight)

  ctx.beginPath()
  ctx.moveTo(startX, startY)
  ctx.lineTo(startX, startY + columnHeight)
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(startX + columnWidth, startY)
  ctx.lineTo(startX + columnWidth, startY + columnHeight)
  ctx.stroke();
}

const decideTextPositionX = (width, start, name) => {
  const end = start + width
  const textWidth = ctx.measureText(name).width
  if(end-start < textWidth) {
    ctx.textAlign = "center"
    return start + width/2
  }
  if(start > BOX_START_POSITION_X + GRAPH_TITLE_WIDTH - 10) {
      ctx.textAlign = "start";
      return start + 10
  }else{
    if(end < BOX_START_POSITION_X + GRAPH_TITLE_WIDTH + textWidth + 10) {
      ctx.textAlign = "end";
      return end - 10
    }
    ctx.textAlign = "start";
    return BOX_START_POSITION_X + GRAPH_TITLE_WIDTH + 10
  }
}