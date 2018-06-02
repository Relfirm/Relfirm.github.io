let keyList = [];

for(let i = 0; i < 255; i++) {
  keyList.push(false);
}

document.onkeydown = (e) => {
  keyList[event.keyCode] = true;
}

document.onkeyup = (e) => {
  keyList[event.keyCode] = false;
}
