
JavaScript Snake Game.

By SM si180@yahoo.com  02/18/2018
Demo version.
Tested in Google Chrome Version 64.0.3282.167 (Official Build) (64-bit).
It will not work in IE version before IE9 - not supporting setTimeout with third parameter.
Features from ES6  that are not supported in most of the major browsers are not used because I am not using polyfill - like "fat arrow", "destructuring", "spread".
The js file is not minified so it can be human readable.

Rules supported:
1. Move the snake by using the Arrow keyboard keys.
2. If the head hits the wall - the snake is dead - alert will appear - after click on OK - the game will reload.
3. When the head hits the food - it will eat the food and increase by one size of the head of the snake.
4. The snake simulates twisting the tail.
5. The snake is not allowed to cross it's tail but it has a configurable tolerance.

Starting the game.
1. Open index.html in Chrome browser ( it will work also in the latest versions of the most major browsers but it is fully tested in Chrome).
2. Click on the yellow space ( required for some browsers like IE Edge to get the it in focus).
3. Press keyboard arrow to start the game.
4. Try to touch the green square ( food ) as many times as you could without touching the walls of the yellow game board or croosing the snake tail.

Have fun!
