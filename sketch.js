let fft, audioSample;

let zRotation = 0,
  hueRotation = 0;

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

function preload() {
  soundFormats("mp3", "ogg");
  audioSample = loadSound("sample.mp3");
}

function setup() {
  canv = createCanvas(WIDTH, HEIGHT, WEBGL);
  colorMode(HSB);

  fft = new p5.FFT(0.5);
  audioSample.connect(fft);

  canv.mousePressed(() => {
    if (audioSample.isPlaying()) {
      audioSample.pause();
    } else {
      audioSample.play();
    }
  });
}

function draw() {
  background(0);

  noFill();
  stroke(255);

  scale(0.7);

  rotateX(PI / 3);

  if (audioSample.isPlaying()) {
    zRotation = (zRotation + 0.002) % (2 * PI);
    hueRotation = (hueRotation + 0.05) % 360;
  }
  rotateZ(zRotation);

  // rotateY(PI / 3 + frameCount * 0.005);

  translate(-WIDTH / 2, -HEIGHT / 2);

  updateZ();

  for (let y = 0; y < rows; y++) {
    beginShape(TRIANGLE_STRIP);
    for (let x = 0; x < cols; x++) {
      let distance = dist(x, y, centerCol, centerRow);
      const z1 = zGrid[y][x],
        z2 = zGrid[y + 1][x];

      // fill(200, 70, z1 * 30 + 50);
      // noStroke();

      stroke(hueRotation, 70, z1 * 30 + 50);

      vertex(x * SCL, y * SCL, z1 * SCL);
      vertex(x * SCL, (y + 1) * SCL, z2 * SCL);
    }
    endShape();
  }
}

function updateZ() {
  // for (let y = 0; y <= rows; y++) {
  //   for (let x = 0; x < cols; x++) {
  //     let distance = dist(x, y, centerCol, centerRow);
  //     zGrid[y][x] = sin(distance + frameCount * 0.1);
  //   }
  // }

  let spectrum = fft.analyze();
  let heightScale = map(fft.getEnergy("bass"), 0, 255, 1, 5);
  for (let y = 0; y <= rows; y++) {
    for (let x = 0; x < cols; x++) {
      let distance = dist(x, y, centerCol, centerRow);
      let index = Math.floor(map(distance, 0, 30, 0, spectrum.length - 1));
      zGrid[y][x] = map(spectrum[index], 0, 255, -0, 2) * heightScale;
    }
  }
}

function keyPressed() {
  if (key === "s") {
    saveGif("mySketch", 5, { delay: 1 });
  }
}
