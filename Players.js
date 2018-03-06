/**
 * La Paleta del Jugador
 * 
 * @type {Object}
 **/
player = {
	x: null,
	y: null,
	width:  20,
	height: 100,
	/**
	* Actualiza la posicion dependiendo de la tecla precionada 
	**/
	update: function() {
		if (keystate[UpArrow]) this.y -= 7;
		if (keystate[DownArrow]) this.y += 7;
		// keep the paddle inside of the canvas
		this.y = Math.max(Math.min(this.y, HEIGHT - this.height), 0);
	},
	/**
	 * Dibuja la paleta del jugador en el canvas
	 **/
	draw: function() {
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
},
/**
 * La paleta de la "Inteligencia Artificial" XD
 * 
 * @type {Object}
 **/
ai = {
	x: null,
	y: null,
	width:  20,
	height: 100,
	/**
	 * Actualiza la posicion dependiendo de la posicion de la bola
	 **/
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
	 **/
	draw: function() {
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
}