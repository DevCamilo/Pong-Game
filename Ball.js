/**	
 * La Bola
 * 
 * @type {Object}
 **/
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
	 **/
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
	 **/
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
	 **/
	draw: function() {
		ctx.fillRect(this.x, this.y, this.side, this.side);
	}
};