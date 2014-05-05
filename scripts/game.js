function Game() {
   this._init();
}

Game.prototype.grid = null;

Game.prototype.queue = null;

Game.prototype.block = null;

Game.prototype.holdingBlock = null;

Game.prototype._active = true;

Game.prototype._canUseHoldingBlock = true;

Game.prototype._emptyRow = null;

Game.prototype._interval = null;

Game.prototype._timeout = null;
 
Game.prototype._init = function() {
   this.score = 0;
   this.level = 1;
   this._interval = Game.STARTINGINTERVAL;
   this.queue = [];
   for (var i = 0; i < 3; i++) {
      this._addToQueue(Game.createBlock());
   }
   
   this.grid = [];
   this._emptyRow = [];
   for (var i = 0, l = Game.ROWS; i < l; i++) {
      this.grid.push([]);
      for (var j = 0, k = Game.COLUMNS; j < k; j++) {
         this.grid[i][j] = 0;
         if (i === 0) {
           this._emptyRow.push(0);
         }
      }
   }
   this._createBlock();
   this._start();
};

Game.prototype._start = function() {
   this._timeout = setTimeout(this._loop.bind(this), this._interval);
};

Game.prototype._stop = function() {
   clearTimeout(this._timeout);
};

Game.prototype.pause = function(block) {
   if (!this._active) {
      this._start();
      this._active = true;
   } else {
      this._stop();
      this._active = false;
   }
};

Game.prototype.hold = function() {
   if (!this._canUseHoldingBlock) {
      return this;
   }
   var currentHoldingBlock = this.holdingBlock;
   var block = Game.createBlock();
   block.blocks = this.block.blocks.slice();
   
   if (currentHoldingBlock) {
      this.block = currentHoldingBlock;
   } else {
      this.block = this._getFromQueue();
   }
   
   this.holdingBlock = block;
   this._canUseHoldingBlock = false;
   return this;
};

Game.prototype._addToQueue = function(block) {
   this.queue.push(block);
};

Game.prototype._getFromQueue = function() {
   this._addToQueue(
      Game.createBlock()
   );
   return this.queue.shift();
};

Game.prototype._createBlock = function() {
   var block = this._getFromQueue();
   if (this.checkPosition(block, block.x, block.y)) {
      this.block = block;
   } else {
      this._stop();
      this.block = null;
   }
};

Game.prototype._loop = function() {
   var addition = (Game.STARTINGINTERVAL / 85) * this.level;
   this._drop();
   this._timeout = setTimeout(this._loop.bind(this), this._interval - addition);
};

Game.prototype._drop = function() {
   if (this.checkPosition(this.block, this.block.x, this.block.y + 1)) {
      this.block.y += 1;
   } else {
      this._canUseHoldingBlock = true;
      this._addToGrid();
      this._createBlock();
   }
};

Game.prototype.drop = function() {
   if (!this._active) {
      return this;
   }
   this._drop();
   return this;
};

Game.prototype.move = function(direction) {
   if (!this._active) {
      return this;
   }
   var move = direction ? 1 : -1;
   if (this.checkPosition(this.block, this.block.x + move, this.block.y)) {
      this.block.x += move;
   }
   return this;
};

Game.prototype.rotate = function() {
   if (!this._active) {
      return this;
   }
   var block = this.block,
      newBlock = Block.rotate(block),
      result = [0, 1, -1, -2].some(function(x) {
      if (this.checkPosition(newBlock, newBlock.x + x, newBlock.y)) {
         newBlock.x += x;
         return true;   
      }
   }, this);
   
   if (result) {
      this.block = newBlock;
   }
};

Game.prototype.checkPosition = function(block, x, y) {
   var isBlocked = block.blocks.some(function(row, i) {
      return row.some(function(col, j) {
         if (col) {
            return (y + i < 0 || x + j < 0) || (y + i >= this.grid.length)
                  || (x + j >= this.grid[y + i].length) || (this.grid[y + i][x + j]);
         }
      }, this);
   }, this);
   
   return !isBlocked;
};

Game.prototype._addToGrid = function() {
   var blocks = this.block.blocks;
   var x = this.block.x;
   var y = this.block.y;
   blocks.forEach(function(row, i, rows) {
      for (var j = 0, l = row.length; j < l; j++) {
         if (row[j]) {
            this.grid[y+i][x+j] = row[j];
         }
      }
   }, this);
   
   this._clearGrid();
};

Game.prototype._clearGrid = function() {
   var newGrid = this.grid.reduce(function(grid, row) {
         if(row.indexOf(0) === -1) {
            grid.splice(grid.indexOf(row), 1);
         }
         return grid;
      }, this.grid.slice());
      
   while(this.grid.length > newGrid.length) {
      newGrid.unshift(this._emptyRow.slice());
      this.score++;
      if (this.score == Game.TARGET) {
         this.score = 0;
         this.level++;
      }
   }
   this.grid = newGrid;
};

Game.createBlock = function(){ 
   return Block.build(Math.floor(Math.random() * (Game.COLUMNS - Block.WIDTH)), 0);
};
 
Game.ROWS = 20;

Game.COLUMNS = 10;

Game.TARGET = 5;

Game.STARTINGINTERVAL = 1000;