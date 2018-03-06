/**
 * Inicio del Juego
 **/
function main() {
	// Crea, inicializa y agrega el juegos al Canvas
	canvas = document.createElement("canvas");
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	ctx = canvas.getContext("2d");
	document.body.appendChild(canvas);
	keystate = {};
	// Realiza un seguimiento de las teclas precionadas
	document.addEventListener("keydown", function(evt) {
		keystate[evt.keyCode] = true;
	});
	document.addEventListener("keyup", function(evt) {
		delete keystate[evt.keyCode];
	});
	init(); // Inicia los objetos del juegos
	// Funcion que ejecuta constantemenete el juego
	var loop = function() {
		update();
		draw();
		window.requestAnimationFrame(loop, canvas);
	};
	window.requestAnimationFrame(loop, canvas);
}
/**
 * Establece las posiciones de inicio de los objetos
 **/
function init() {
	player.x = player.width;
	player.y = (HEIGHT - player.height)/2;
	ai.x = WIDTH - (player.width + ai.width);
	ai.y = (HEIGHT - ai.height)/2;
	ball.serve(1);
}
/**
 * Actualiza todos los objetos del juego
 **/
function update() {
	ball.update();
	player.update();
	ai.update();
}
/**
 * Limpia el Canvas y dibujar todos los objetos del juego y la red
 **/
function draw() {
	ctx.fillRect(0, 0, WIDTH, HEIGHT);
	ctx.save();
	ctx.fillStyle = "#fff";
	ball.draw();
	player.draw();
	ai.draw();
	// Dibuja la red
	var w = 4;
	var x = (WIDTH - w)*0.5;
	var y = 0;
	var step = HEIGHT/20; // Cuantos segemetos tendrá la red
	while (y < HEIGHT) {
		ctx.fillRect(x, y+step*0.25, w, step*0.5);
		y += step;
	}
	ctx.restore();
}
// Inicia y corre el juego :)
main();
