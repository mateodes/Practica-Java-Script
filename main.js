(function(){
    self.Board = function(width,height){ // Elementos del tablero
        this.width = width;
        this.height = height;
        this.playing = false;
        this.game_over = false;
        this.bars = [];
        this.ball = null;
        this.playing = false;
    }

    self.Board.prototype = {
        get elements(){
        var elements = this.bars.map(function(bar){ return bar; });
        elements.push(this.ball);
        return elements;
        }
    }
})();
(function(){
    self.Ball = function(x,y,radius,board){
    // Elementos de la pelota
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed_y = 0;
        this.speed_x = 3;
        this.board = board;
        this.direction = 1;
        this.bounce_angle = 0;
        this.max_bounce_angle = Math.PI / 12;
        this.speed = 3;
        board.ball = this;
        this.kind = "circle";
    }

    self.Ball.prototype = {
        move: function(){ // Movimiento de la pelota
            this.x += (this.speed_x * this.direction);
            this.y += (this.speed_y);
        },
        get width(){
            return this.radius * 2;
        },
        get height(){
            return this.radius * 2;
        },
        collision: function(bar){
        // Reaccion de colision con una barra que se recibe como parametro
            var relative_intersect_y = (bar.y + (bar.height / 2)) - this.y;

            var normalized_intersect_y = relative_intersect_y / (bar.height / 2);

            this.bounce_angle = normalized_intersect_y * this.max_bounce_angle;

            this.speed_y = this.speed * -Math.sin(this.bounce_angle);
            this.speed_x = this.speed * Math.cos(this.bounce_angle);
            if(this.x > (this.board.width / 2)) this.direction = -1;
            else this.direction = 1;
        },
        colisionTablero: function(){ //Colicion de pelota con bordes del tablero
                if (this.y < 0 || this.y > this.board.height) {
                    this.speed_y *= -1;
                }
                if (this.x < 0 || this.x > this.board.width) {
                    this.speed_x *= -1;
                }
        }
    }
})();

(function(){
    self.Bar = function(x,y,width,height,board){
    // Elementos de la barra
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.board = board;
        this.board.bars.push(this);
        this.kind = "rectangle";
        this.speed = 10;
    }

// Movimiento de las barras
    self.Bar.prototype = {
        down: function(){
            this.y += this.speed;
        },
        up: function(){
            this.y -= this.speed;
        },
        toString: function(){
            return "x: "+ this.x +"y: "+ this.y ;
        }
    }
})();

(function(){
    //Creacion del tablero
    self.BoardView = function(canvas,board){
        this.canvas = canvas;
        this.canvas.width = board.width;
        this.canvas.height = board.height;
        this.board = board;
        this.ctx = canvas.getContext("2d");
    }

    self.BoardView.prototype = {
        clean: function(){ //Funcion para borrar las barras antes de volverlas a dibujar en una nueva ubicacion
            this.ctx.clearRect(0,0,this.board.width,this.board.height);
        },
        draw: function(){
            for (var i = this.board.elements.length - 1; i >= 0; i--){
                var el = this.board.elements[i];
                draw(this.ctx,el);
            }
        },
        play: function(){ //Funcion de control del juego sobre la ejecucion
            if(this.board.playing){
                this.clean();
                this.draw();
                this.check_collisions();
                this.board.ball.move();
                this.board.ball.colisionTablero();
            }
        },
        check_collisions: function(){
            for (var i = this.board.bars.length - 1; i >= 0; i--){
                var bar = this.board.bars[i];
                if(hit(bar, this.board.ball)){
                    this.board.ball.collision(bar);
                }
            };
        }
    }

    function hit(a,b){
        //Verifica la colicion entre A y B
        var hit = false;
            //Colisiones hirizontales
        if (b.x + b.width >= a.x && b.x < a.x + a.width) {
            //Colisiones verticales
            if (b.y + b.height >= a.y && b.y < a.y + a.height)
                hit = true;
        }
            //Colisión de a con b
        if (b.x <= a.x && b.x + b.width >= a.x + a.width) {
            if (b.y <= a.y && b.y + b.height >= a.y + a.height)
                hit = true;
            }
            //Colision de b con a
        if (a.x <= b.x && a.x + a.width >= b.x + b.width) {
            if (a.y <= b.y && a.y + a.height >= b.y + b.height)
                hit = true;
        }
        return hit;
    }

    function draw(ctx,element){
        switch(element.kind){
            case "rectangle": //Dibujar barras
                ctx.fillRect(element.x,element.y,element.width,element.height);
                break;
            case "circle": //Dibujar pelota
                ctx.beginPath();
                ctx.arc(element.x,element.y,element.radius,0,7);
                ctx.fill();
                ctx.closePath();
                break;
        }
    }

})();

// Creacion de tablero, barras y pelota
var board = new Board(800,400);
var bar = new Bar(20,100,40,100,board);
var bar2 = new Bar(730,100,40,100,board);
var canvas = document.getElementById('canvas');
var board_view = new BoardView(canvas,board);
var ball = new Ball(350,100,10,board);


// Evento precionar teclas
document.addEventListener("keydown",function(ev){
    if(ev.keyCode == 38){
        // Tecla flecha hacia arriba
        ev.preventDefault();
        bar2.up();
    }else if(ev.keyCode == 40){
        // Tecla flecha hacia abajo
        ev.preventDefault();
        bar2.down();
    }else if(ev.keyCode == 87){
        // Tecla W
        ev.preventDefault();
        bar.up();
    }else if(ev.keyCode == 83){
        // Tecla S
        bar.down();
        ev.preventDefault();
    }else if(ev.keyCode == 32){
        // Tecla Espacio
        ev.preventDefault();
        board.playing = !board.playing;
    }

});

board_view.draw();
window.requestAnimationFrame(controller);

function controller(){
    board_view.play();
    window.requestAnimationFrame(controller);
}