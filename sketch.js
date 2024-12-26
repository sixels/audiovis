let fft, audioSample;

let zRotation = 0,
  hueRotation = 0;

const WIDTH = 800,
  HEIGHT = 800;

// scale
const SCL = 20;

const rows = HEIGHT / SCL,
  cols = WIDTH / SCL;

const centerRow = cols / 2,
  centerCol = rows / 2;

const R = 170;
let heightMap = Array.from({ length: 180 }, () =>
  Array.from({ length: 360 }, () => 0)
);

const zGrid = Array.from({ length: rows + 1 }, () =>
  Array.from({ length: cols }, () => 0)
);

function preload() {
  soundFormats("mp3", "ogg");
  audioSample = loadSound("sample4.mp3");
}

function setup() {
  canv = createCanvas(WIDTH, HEIGHT, WEBGL);
  angleMode(DEGREES);
  colorMode(HSB);

  fft = new p5.FFT(0.5);
  audioSample.connect(fft);
  // strokeWeight(3);

  document.addEventListener("keypress", (e) => {
    if (e.key === " ") {
      if (audioSample.isPlaying()) {
        audioSample.pause();
      } else {
        audioSample.play();
      }
    }
  });
}

function draw() {
  background(0);
  orbitControl();

  noFill();
  stroke(255);

  // scale(0.7);

  rotateX(60);

  if (audioSample.isPlaying()) {
    zRotation = (zRotation + 0.3) % 360;
    // hueRotation = (hueRotation + 0.05) % 360;
  }
  rotateZ(zRotation);
  rotateX(zRotation);

  // rotateY(PI / 3 + frameCount * 0.005);

  // translate(-WIDTH / 2, -HEIGHT / 2);

  // updateZ();

  // for (let y = 0; y < rows; y++) {
  //   beginShape();
  //   for (let x = 0; x < cols; x++) {
  //     let distance = dist(x, y, centerCol, centerRow);
  //     const z1 = zGrid[y][x],
  //       z2 = zGrid[y + 1][x];

  //     // fill(200, 70, z1 * 30 + 50);
  //     // noStroke();

  //     stroke(hueRotation, 70, z1 * 30 + 50);

  //     vertex(x * SCL, y * SCL, z1 * SCL);
  //     // vertex(x * SCL, (y + 1) * SCL, z2 * SCL);
  //   }
  //   endShape(LINES);
  // }

  updateHeights();

  for (let phi = 0; phi < 180; phi += 4) {
    beginShape();
    for (let theta = 0; theta < 360; theta += 4) {
      let r = R + heightMap[phi][theta];

      let x =
        r *
        // (1 + 0.2 * sin(theta * 6) * sin(phi * 5)) *
        cos(phi);
      let y =
        r *
        // (1 + 0.2 * sin(theta * 6) * sin(phi * 5)) *
        // sin(phi) *
        sin(phi) *
        sin(theta);

      let z =
        r *
        // (1 + 0.2 * sin(theta * 6) * sin(phi * 5)) *
        // sin(phi) *
        sin(phi) *
        cos(theta);

      fill(353, 70, map(z, 0, 360, 100, 200));
      noStroke();

      vertex(x, y, z);
      // vertex(z, y, x);
    }
    endShape(CLOSE);
  }
}

function updateZ() {
  // for (let y = 0; y <= rows; y++) {
  //   for (let x = 0; x < cols; x++) {
  //     let distance = dist(x, y, centerCol, centerRow);
  //     zGrid[y][x] = sin(distance + frameCount * 0.1);
  //   }
  // }

  if (!audioSample.isPlaying()) return;

  let spectrum = fft.analyze();
  let heightScale = map(fft.getEnergy("bass"), 0, 255, 1, 5);
  for (let y = 0; y <= rows; y++) {
    for (let x = 0; x < cols; x++) {
      let distance = dist(x, y, centerCol, centerRow);
      let index = Math.floor(map(distance, 0, 30, 0, spectrum.length - 1));
      zGrid[y][x] = map(spectrum[index], 0, 255, 0, 2) * heightScale;
    }
  }
}

function updateHeights() {
  if (!audioSample.isPlaying()) return;
  // update heights based on audio spectrum and the distance from the center
  let spectrum = fft.analyze();
  let heightScale = map(fft.getEnergy("bass"), 0, 255, 1, 5) * 2.5;
  for (let phi = 0; phi < 180; phi++) {
    for (let theta = 0; theta < 360; theta++) {
      let distance = dist(theta, phi, 180, 90);
      // distance = theta;
      let index = Math.floor(
        map(distance, 0, 180, 0, 200, spectrum.length - 1)
      );
      heightMap[phi][theta] = map(spectrum[index], 0, 255, 0, 10) * heightScale;
    }
  }
}

function keyPressed() {
  if (key === "s") {
    saveGif("mySketch", 5, { delay: 1 });
  }
}
