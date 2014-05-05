function View(dCanvas, game) {
	this._dCanvas = dCanvas;
	this._game = game;
	this._initialise();
}

View.prototype._initialise = function() {
	this._initialiseDom();
	this._initialiseEvents();
	setInterval(this._loop.bind(this), 1000/30);
};

View.prototype._initialiseDom = function() {
	var borders = View.LINEWIDTH * 2,
		boardWidth = (Game.COLUMNS * View.BOXSIZE) + borders,
		previewWidth = (Block.WIDTH * View.BOXSIZE) + View.BOXSIZE,
		holdWidth = (Block.WIDTH * View.BOXSIZE) + View.BOXSIZE;
	this._dCanvas.className = 'tetris';
	this._holdWidth = holdWidth;
	this._boardWidth = boardWidth;
	this._dCanvas.width = boardWidth + previewWidth + holdWidth;
	this._dCanvas.height = (Game.ROWS * View.BOXSIZE) + borders;
	this._ctx = canvas.getContext('2d');
};

View.prototype._resetCanvas = function() {
	this._dCanvas.width = this._dCanvas.width;
	this._ctx.rect(0, 0, this._dCanvas.width, this._dCanvas.height);
	this._ctx.fillStyle = View.BACKGROUND;
	this._ctx.fill();
};

View.prototype._drawSquare = function(x, y, size, value) {
    this._ctx.beginPath()
	this._ctx.rect(x, y, size, size);
	
	if (value) {
		this._ctx.shadowBlur = 5;
		this._ctx.shadowColor = View.COLORS[0];
		this._ctx.shadowOffsetX = -1;
		this._ctx.shadowOffsetY = -1;
	}
	this._ctx.fillStyle = value ? View.COLORS[value] : View.GRIDBACKGROUND; 
	this._ctx.fill();
	this._ctx.shadowColor = null;
	this._ctx.shadowOffsetX = 0;
	this._ctx.shadowOffsetY = 0;
	this._ctx.shadowBlur = 0;
	
	this._ctx.lineWidth = View.LINEWIDTH;
	this._ctx.strokeStyle = View.COLORS[0];
	this._ctx.stroke();
	this._ctx.closePath();
};

View.prototype._initialiseEvents = function() {
	window.addEventListener('keydown', function(e) {
		switch(e.keyCode) {
	        case View.KEYCODES.UP:
	            this._game.rotate();
	            break;
	        case View.KEYCODES.LEFT:
	            this._game.move(false);
	            break;
	        case View.KEYCODES.RIGHT:
	            this._game.move(true);
	            break;
	        case View.KEYCODES.DOWN:
	            this._game.drop();
	            break;
		    case View.KEYCODES.P:
	        	this._game.pause();
	        	break;
		    case View.KEYCODES.SPACE:
		       	this._game.hold();
		       	break;
	        default:
	            return;
	    }

	    e.preventDefault();
	}.bind(this), false);
};

View.prototype._loop = function(){
    this._resetCanvas();
	var boxSize = View.BOXSIZE;
	var holdOffset = this._holdWidth;
	var boardOffset = this._boardWidth;
    this._game.grid.forEach(function(row, i) {
		var y = i * boxSize;
		row.forEach(function(col, j) {
			this._drawSquare(holdOffset + j * boxSize, y, boxSize, col);
		}, this)
	}, this);
	
	if (this._game.block) {
		this._game.block.blocks.forEach(function(row, i) {
			row.forEach(function(col, j) {
				if (col) {
					this._drawSquare(holdOffset + (game.block.x * boxSize) + (boxSize * j), (game.block.y * boxSize) + (boxSize * i), boxSize, col);
				}
			}, this);
		}, this);
	}
	
	if (this._game.holdingBlock) {
		this._game.holdingBlock.blocks.forEach(function(row, i) {
			row.forEach(function(col, j) {
				if (col) {
					this._drawSquare((boxSize / 2) + (boxSize * j), boxSize + (boxSize * i), boxSize, col);
				}
			}, this);
		}, this);
	}
	
	var rowOffset = boxSize;
	this._game.queue.forEach(function(queueBlock, queueIndex) {	
		queueBlock.blocks.forEach(function(row, i) {
			if (+row.join('') == 0) {
				return false;
			}
			row.forEach(function(col, j) {
				if (col) {
					var x = (holdOffset + boardOffset + (boxSize / 2)) + (boxSize * j);
					var y = (queueIndex * boxSize) + (boxSize * i) + rowOffset;
					this._drawSquare(x, y, boxSize, col);
				}
			}, this);
		}, this);
		rowOffset += boxSize * 2;
	}, this);
	
	this._ctx.font = View.FONTSIZE = 'pt Electrolize';
    this._ctx.fillStyle = View.TEXTCOLOR;
    this._ctx.fillText('Level: ' + this._game.level, holdOffset + 10, 20);
    this._ctx.fillText('Remaining: ' + (Game.TARGET - this._game.score), holdOffset + (Game.COLUMNS * View.BOXSIZE) - 120, 20);
};

View.COLORS = ['grey', '#FCDC3B', '#E04006', '#C82536', '#2B4F81', '#B0E0E6', '#8BA446', '#DE85B1'];

View.BACKGROUND = '#556';

View.GRIDBACKGROUND = 'white';

View.TEXTCOLOR = '#302B54';

View.LINEWIDTH = .5;

View.KEYCODES = {
	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40,
	SPACE: 32,
	P: 80
};

VIEW.FONTSIZE = window.innerHeight

View.BOXSIZE = 30;