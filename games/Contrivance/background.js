Steampunk = function() {
  this.x = Math.round(Math.random() * canvas.width);
  this.y = Math.round(Math.random() * canvas.height);
  this.width = Math.round(Math.random() * 120 + 50);
  this.rotation = (Math.PI / 180) * Math.random() * 360;
  this.rotationDir = (Math.random() < 0.5) ? "clockwise" : "anticlockwise";
  this.rotationSpeed = 80 / this.width;
  this.img = img.steampunk;
  this.alpha = 1 - (this.width / 300 + 0.2);
}

Steampunk.prototype.tick = function() {
  if(this.rotationDir === "clockwise") {
    this.rotation += (Math.PI / 180) * this.rotationSpeed;
  } else {
    this.rotation -= (Math.PI / 180) * this.rotationSpeed;
  }

  ctx.save();

  ctx.globalAlpha = this.alpha;
  ctx.translate(this.x, this.y);
  ctx.rotate(this.rotation);
  ctx.drawImage(this.img, -this.width/2, -this.width/2, this.width, this.width);

  ctx.restore();
}
