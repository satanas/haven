'use strict';

function bitmapTextCentered(y, font, text, size, cameraOffset) {
  var label = game.add.bitmapText(0, y, font, text, size);
  label.updateTransform();
  label.x = (game.width - label.width) / 2;
  if (cameraOffset) {
    label.y += game.camera.y;
    label.x += game.camera.x;
  }
  return label;
}
