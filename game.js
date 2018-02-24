// DevCamilo
// 24/02/2018
var
/**
 * Constantes
 */
WIDTH  = 700,
HEIGHT = 600,
pi = Math.PI,
UpArrow   = 38,
DownArrow = 40,
/**
 * Elemntos del Juego
 */
canvas,
ctx,
keystate,
/**
 * La Paleta del Jugador
 * 
 * @type {Object}
 */
player = {
	x: null,
	y: null,
	width:  20,
	height: 100,
	/**
	 * Actualiza la posicion dependiendo de la tecla precionada 
	 */
	update: function() {
		if (keystate[UpArrow]) this.y -= 7;
		if (keystate[DownArrow]) this.y += 7;
		// keep the paddle inside of the canvas
		this.y = Math.max(Math.min(this.y, HEIGHT - this.height), 0);
	},
	/**
	 * Dibuja la paleta del jugador en el canvas
	 */
	draw: function() {
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
},
/**
 * La paleta de la "Inteligencia Artificial" XD
 * 
 * @type {Object}
 */
ai = {
	x: null,
	y: null,
	width:  20,
	height: 100,
	/**
	 * Actualiza la posicion dependiendo de la posicion de la bola
	 */
	update: function() {
		// calculate ideal position
		var desty = ball.y - (this.height - ball.side)*0.5;
		// ease the movement towards the ideal position
		this.y += (desty - this.y) * 0.1;
		// keep the paddle inside of the canvas
		this.y = Math.max(Math.min(this.y, HEIGHT - this.height), 0);
	},
	/**
	 * Dibuja la paleta de la "inteligencia Artificial" XD
	 */
	draw: function() {
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
},
/**	
 * La Bola
 * 
 * @type {Object}
 */
ball = {
	x:   null,
	y:   null,
	vel: null,
	side:  20,
	speed: 12,
	/**
	 * Sirve el balón hacia el lado especificado
	 * 
	 * @param  {number} side 1 right
	 *                       -1 left
	 */
	serve: function(side) {
		// establece la poscion en (x), (y)
		var r = Math.random();
		this.x = side===1 ? player.x+player.width : ai.x - this.side;
		this.y = (HEIGHT - this.side)*r;
		// Calcula el ángulo de salida y la altura baja en el eje y >
		// Hace al angulo más empinado
		var phi = 0.1*pi*(1 - 2*r);
		// Establecer la dirección y la magnitud de la velocidad
		this.vel = {
			x: side*this.speed*Math.cos(phi),
			y: this.speed*Math.sin(phi)
		}
	},
	/**
	 * Actualiza la posición de la bola y la mantenla dentro del Canvas
	 */
	update: function() {
		// Actualiza la posicion según la velocidad actual
		this.x += this.vel.x;
		this.y += this.vel.y;
		// Verifica si esta fuera del Canvas en el eje (y)
		if (0 > this.y || this.y+this.side > HEIGHT) {
			// calcule y agregue el offset correcto, es decir, qué tan lejos
			// Dentro del Canvas la bola es
			var offset = this.vel.y < 0 ? 0 - this.y : HEIGHT - (this.y+this.side);
			this.y += 2*offset;
			// Refleja la velocidad de (y)
			this.vel.y *= -1;
		}
		// función auxiliar para verificar la intersección entre dos
		// cajas delimitadoras alineadas con ejes (AABB)
		var AABBIntersect = function(ax, ay, aw, ah, bx, by, bw, bh) {
			return ax < bx+bw && ay < by+bh && bx < ax+aw && by < ay+ah;
		};
		// Compruebe contra la paleta de destino para verificar la colisión en (x)
		var pdle = this.vel.x < 0 ? player : ai;
		if (AABBIntersect(pdle.x, pdle.y, pdle.width, pdle.height,
				this.x, this.y, this.side, this.side)
		) {	
			// Establecer la posición (x) y calcular el ángulo de reflexión
			this.x = pdle===player ? player.x+player.width : ai.x - this.side;
			var n = (this.y+this.side - pdle.y)/(pdle.height+this.side);
			var phi = 0.25*pi*(2*n - 1); // pi/4 = 45
			// Calcula el valor del choque y actualiza la velocidad
			var smash = Math.abs(phi) > 0.2*pi ? 1.5 : 1;
			this.vel.x = smash*(pdle===player ? 1 : -1)*this.speed*Math.cos(phi);
			this.vel.y = smash*this.speed*Math.sin(phi);
		}
		// Resetea la bola cuando esta se sale del Canvas en la direccion (x)
		if (0 > this.x+this.side || this.x > WIDTH) {
			this.serve(pdle===player ? 1 : -1);
			console.log("Punto");
		}
	},
	/**
	 * Dibuja la bola en el Canvas
	 */
	draw: function() {
		ctx.fillRect(this.x, this.y, this.side, this.side);
	}
};
/**
 * Inicio del Juego
 */
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
 */
function init() {
	player.x = player.width;
	player.y = (HEIGHT - player.height)/2;
	ai.x = WIDTH - (player.width + ai.width);
	ai.y = (HEIGHT - ai.height)/2;
	ball.serve(1);
}
/**
 * Actualiza todos los objetos del juego
 */
function update() {
	ball.update();
	player.update();
	ai.update();
}
/**
 * Limpia el Canvas y dibujar todos los objetos del juego y la red
 */
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