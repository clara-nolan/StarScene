let comet;
let sparks = [];
let noofsparks = 120;
let timecheck = 5;
//stars
let x, y;
let c;
let down;
let stars = [];
let sky = 0;
let ufo = { x: 50, y: 80, width: 80, speed: 1 };

//ufo goes across screen

function setup() {
  createCanvas(600, 600);
  background(0, 255);

  //star stuff
  x = width / 2;
  y = height / 2;
  c = 255;

  for (let i = 0; i < 1000; i++) {
    stars[i] = new Star(
      random(width),
      random(height),
      random(255),
      random(0.1, 3),
      random(1)
    );
  }
  //comet stuff
  comet = new fireball();

  for (let i = 0; i < noofsparks; i++) {
    sparks.push(new minifireball());
  }
}

function draw() {
  background(0, 255);
  //ufo
  drawUfo();
  moveUfo();
  //star stuff
  for (let i = 0; i < stars.length; i++) {
    stars[i].twinkle();
    stars[i].showStar();
  }
  //comet stuff
  let s = second();

  if (s / timecheck === int(s / timecheck)) {
    comet.newcomet();
    for (let i = 0; i < noofsparks; i++) {
      sparks[i].newborn();
    }
  }
  comet.update();
  comet.bounds();

  if (comet.mass > 1 && s / timecheck !== int(s / timecheck)) {
    comet.render();
  }

  if (s / timecheck !== int(s / timecheck)) {
    for (let i = 0; i < noofsparks; i++) {
      let yesspark = random(1);
      if (yesspark < 0.01) {
        sparks[i].makenew(comet.pos, comet.vel);
      }
      sparks[i].update();
    }
  }
  //foreground
  noStroke();
  fill(30, 33, 46);
  rect(0, 500, width, 140);
  fill(105, 106, 181);
  let from = color(218, 165, 32);
  let to = color(72, 61, 139);
  colorMode(RGB);
  let interA = lerpColor(from, to, 0.33);
  triangle(0, 500, 100, 300, 200, 500);
  fill(interA);
  triangle(100, 500, 250, 400, 300, 500);
  fill(to);
  triangle(70, 500, 170, 300, 270, 500);
  //trees
  fill(66, 47, 3);
  rect(545, 440, 10, 60);
  fill(15, 145, 80);
  triangle(530, 450, 550, 400, 570, 450);
}

function drawUfo() {
  fill("gray");
  ellipse(ufo.x, ufo.y, ufo.width, 20);
  ellipse(ufo.x, ufo.y - 10, ufo.width / 2, 25);
}

function moveUfo() {
  ufo.x += ufo.speed;
  if (ufo.x > width || ufo.x < 0) {
    ufo.speed = -ufo.speed;
  }
}

//comet func

function fireball() {
  this.pos = createVector(random(-45, width * 0.4), height * random(0.1, 0.5));

  this.vel = createVector(random(2, 4), random(1.75));

  this.vel.mult(2);

  this.mass = random(9, 18);

  this.update = function () {
    this.pos.add(this.vel);
  };
  this.bounds = function () {
    if (this.pos.x > width || this.pos.y > height) {
      this.pos = createVector(
        random(-45, width * 0.4),
        height * random(0.1, 0.5)
      );
    }
  };

  this.render = function () {
    push();
    stroke(200, 255, 255, 180);
    strokeWeight(this.mass * random(2, 4));
    point(this.pos);
    pop();
  };

  this.newcomet = function () {
    this.pos = createVector(
      random(-45, width * 0.4),
      height * random(0.1, 0.5)
    );

    this.vel = createVector(random(2, 4), random(1.75));

    this.vel.mult(2);

    this.mass = random(9, 18);
  };
}

function minifireball() {
  this.pos = createVector(comet.pos.x, comet.pos.y);
  this.vel = createVector(comet.vel.x, comet.vel.y);
  this.lifespan = 0;
  this.burnrate = random(1.75, 4.5);

  this.makenew = function (cometpos, cometvel) {
    comet.mass -= 0.1;
    if (comet.mass <= 1) {
      comet.mass = 1;
    }
    if (comet.mass > 1) {
      this.pos = createVector(cometpos.x, cometpos.y);
      this.vel = createVector(
        cometvel.x,
        comet.vel.y + random(-0.05, random(-0.07, 0.25))
      );
      this.lifespan = 0;

      let yesspire = random(1);
      if (yesspire < 0.25) {
        push();
        translate(this.pos);
        stroke(255, 255, 0, 180);
        strokeWeight(random(2, 4));
        let spire = random(comet.mass, comet.mass * 3);
        line(-spire * 1.5, 0, spire * 1.5, 0);
        line(0, -spire * 1.5, 0, -spire * 1.5);
        line(-spire, -spire, spire, spire);
        line(spire, -spire, -spire, spire);
        pop();
      }
    }
  };

  this.update = function () {
    this.lifespan += this.burnrate;
    if (this.lifespan >= 255) {
      this.lifespan = 255;
    }
    if (this.lifespan < 255) {
      this.vel.mult(0.98);
      this.pos.add(this.vel);
      push();
      stroke(255, 255 - this.lifespan, 0, 255);
      strokeWeight(random(5, 8) - this.lifespan * 0.015);
      point(this.pos);
      pop();
    }
  };

  this.newborn = function () {
    this.pos = createVector(comet.pos.x, comet.pos.y);
    this.vel = createVector(comet.vel.x, comet.vel.y);
    this.lifespan = 0;
    this.burnrate = random(1, 2);
  };
}

class Star {
  constructor(tx, ty, tc, tf, td) {
    this.x = tx;
    this.y = ty;
    this.c = tc;
    this.f = tf;
    this.down = td;
  }

  showStar() {
    stroke(this.c);
    point(this.x, this.y);
  }

  twinkle() {
    if (this.c >= 255) {
      this.down = true;
    }
    if (this.c <= 0) {
      this.down = false;
    }

    if (this.down) {
      this.c -= this.f;
    } else {
      this.c += this.f;
    }
  }
}
