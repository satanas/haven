'use strict';

function bitmapTextCentered(game, y, font, text, size) {
  var label = game.add.bitmapText(0, y, font, text, size);
  label.updateTransform();
  label.x = (game.width - label.width) / 2;
}
