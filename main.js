(function(){
    self.Board = function(width,height){ // Elementos del tablero
        this.width = width;
        this.height = height;
        this.playing = false;
        this.game_over = false;
        this.bars = [];
        this.ball = null;
    }

    self.Board.prototype = {
        get elements(){
        var elements = this.bars;
        elements.push(this.ball);
        return elements;
        }
    }
})();
(function(){
    self.Ball = function(x,y,radius,board){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed_y = 0;
        this.speed_x = 3;
        this.board = board;
        board.ball = this;
        this.kind = "circle";
    }
})();

(function(){
    self.Bar = function(x,y,width,height,board){
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
            this.clean();
            this.draw();
        }
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
    ev.preventDefault(); //Evitar mover el navegador
    if(ev.keyCode == 38){
        // Tecla flecha hacia arriba
        bar2.up();
    }else if(ev.keyCode == 40){
        // Tecla flecha hacia abajo
        bar2.down();
    }else if(ev.keyCode === 87){
        // Tecla W
        bar.up();
    }else if(ev.keyCode === 83){
        // Tecla S
        bar.down();
    }

});

window.requestAnimationFrame(controller);

function controller(){
    board_view.play();
    window.requestAnimationFrame(controller);
}