function Block(blocks, x, y) {
   this.blocks = blocks;
   this.x = x;
   this.y = y;
}

Block.prototype.x = null;

Block.prototype.y = null;

Block.prototype.blocks = null;

Block.rotate = function(block) {
   var originalHeight = block.blocks.length;
   var rotatedBlocks = Block.rotateBlocks(block.blocks);
   var height = rotatedBlocks.length;

   return new Block(rotatedBlocks, block.x, block.y - height + originalHeight);	
};

Block.rotateBlocks = function(blocks) {
   return blocks.reduce(function(result, row, i, rows){
      for (var j = 0, l = row.length; j < l; j++) {
         if (!result[l-1-j]) {
            result[l-1-j] = [];
         }
         result[l-1-j][i] = rows[i][j];	
      }
      return result;
   }, []);
};

Block.build = function(x, y, index) {
   var blockTypes = Block.TYPES;
   return new Block(blockTypes[index || Math.floor(Math.random() * blockTypes.length)], x, y);
};

Block.WIDTH = 4;

Block.HEIGHT = 3;

Block.TYPES = [
   [[0,0,0,0],
    [1,1,1,1],
    [0,0,0,0]],

   [[0,0,0],
    [2,2,2],
    [0,0,2]],

   [[0,0,0],
    [3,3,3],
    [3,0,0]],

   [[4,4],
    [4,4]],

   [[0,5,5],
    [5,5,0]],

   [[0,0,0],
    [6,6,6],
    [0,6,0]],

   [[7,7,0],
    [0,7,7]],
];