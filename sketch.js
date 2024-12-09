const WIDTH = 600,
  HEIGHT = 600;

// scale
const SCL = 20;

const rows = HEIGHT / SCL,
  cols = WIDTH / SCL;

const centerRow = cols / 2,
  centerCol = rows / 2;

const zGrid = Array.from({ length: rows + 1 }, () =>
  Array.from({ length: cols }, () => 0)
);

function setup() {
  createCanvas(WIDTH, HEIGHT, WEBGL);
  colorMode(HSB);
}

function draw() {
  background(0);

  noFill();
  stroke(255);

  scale(0.7);
  rotateX(PI / 3);
  translate(-WIDTH / 2, -HEIGHT / 2);

  updateZ();

  for (let y = 0; y < rows; y++) {
    beginShape(TRIANGLE_STRIP);
    for (let x = 0; x < cols; x++) {
      let distance = dist(x, y, centerCol, centerRow);
      const z1 = zGrid[y][x],
        z2 = zGrid[y + 1][x];

      fill(200, 70, z1 * 30 + 50);
      noStroke();

      vertex(x * SCL, y * SCL, z1 * SCL);
      vertex(x * SCL, (y + 1) * SCL, z2 * SCL);
    }
    endShape();
  }
}

function updateZ() {
  for (let y = 0; y <= rows; y++) {
    for (let x = 0; x < cols; x++) {
      let distance = dist(x, y, centerCol, centerRow);
      zGrid[y][x] = sin(distance + frameCount * 0.1);
    }
  }
}

function keyPressed() {
  if (key === "s") {
    saveGif("mySketch", 5, { delay: 1 });
  }
}
