/*
 * robotMaze.js
 *
 * The blue key is inside a labyrinth, and extracting
 * it will not be easy.
 *
 * It's a good thing that you're a AI expert, or
 * we would have to leave empty-handed.
 */

function startLevel(map) {
    // Hint: you can press R or 5 to "rest" and not move the
    // player, while the robot moves around.

    map.getRandomInt = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    map.placePlayer(map.getWidth()-1, map.getHeight()-1);
    var player = map.getPlayer();

    map.defineObject('robot', {
        'type': 'dynamic',
        'symbol': 'R',
        'color': 'gray',
        'onCollision': function (player, me) {
            me.giveItemTo(player, 'blueKey');
        },
        'behavior': function (me) {
            
    		var myX = me.getX();
            var myY = me.getY();
			function myGetAdjacentEmptyCells(x, y)
            { 
            	// can be optimized, but just wanted to complete this level
            	var possibleMoves = []; // reset
            	var up = map.getObjectTypeAt(x , y-1);
                var right = map.getObjectTypeAt(x+1, y);
                var down = map.getObjectTypeAt(x,y+1);
                var left = map.getObjectTypeAt(x-1, y);
                
                var hasEmpty = false;
                // check empty first
                if(  up === 'empty'
                  || up === 'visited'
                  || up === 'blueKey'
				  || up === 'barrier')
                {
                	possibleMoves.push([[x, y-1], 'up', up]);
                }
                
                if(  down === 'empty' 
                  || down === 'visited'
                  || down === 'blueKey'
                  || down === 'barrier')
                {
                	possibleMoves.push([[x, y+1], 'down', down]);
                }
                
                if(  right === 'empty'
                  || right === 'visited'
                  || right === 'blueKey'
                  || right === 'barrier')
                {
                	possibleMoves.push([[x+1, y], 'right', right]);
                }
                
                if(  left === 'empty'
                  || left === 'visited'
                  || left === 'blueKey'
                  || left === 'barrier')
                {
                	possibleMoves.push([[x-1, y], 'left', left]);
                }
                
              return possibleMoves;
            }
            
            function isBetterMove(previousBest, currentOption)
            {
            	// always go for the key/barrier
            	if(currentOption === 'blueKey' 
                || currentOption === 'barrier')
                {
                	return true;
                }
                // never give up on key/barrier
            	if(previousBest === 'blueKey' || previousBest === 'barrier')
                {
                	return false;
                }
                // choose empty over visited
                if(currentOption === 'empty')
                {
                	return true;
                }
                
                if(currentOption === 'visited'
                && previousBest === 'visited')
                {
                	return true;
                }
                
                return false;
                
            }
            
            function getBestPossibleMove(allPossibleMoves)
            {
            	// assume first option is best
                // compare with best option to see if 
                // the assumption needs to be changed
                var bestMoveType = allPossibleMoves[0][2];
                var bestMove = allPossibleMoves[0][1];
                var len = allPossibleMoves.length;
                for ( var i = 1 ;
                      i < len; 
                      ++i)
                {
                	var currentMoveType = allPossibleMoves[i][2];
                	if(isBetterMove(bestMoveType, currentMoveType))
                    {
                    	bestMoveType = currentMoveType;
                        bestMove = allPossibleMoves[i][1];
                    }
				}
                return bestMove;
            }
            
            var moves = 
            myGetAdjacentEmptyCells(myX, myY);
            
            //tells you if there is any value in coming back to this cell
			function returnToThisCell(allmoves)
            {
            	
            	if(allmoves.length === 1)
                {
                	// don't return if its a dead end
                	return false;
                }
                else if(allmoves.length === 2)
                {
                    var firstEmptyCell = allmoves[0];
                    var secondEmptyCell = allmoves[1];
                    
                    
                    
                    if( firstEmptyCell[0][0] === secondEmptyCell[0][0]
                    ||  firstEmptyCell[0][1] === secondEmptyCell[0][1])
                    {
                    	// if X or Y co-ordinates are same for the next
                        // two moves, we probably want to return to this cell
                        return true;
                    }
                    else
                    {
                    	var diagonallyOppositeCellX 
                    		= firstEmptyCell[0][0] === myX ? 
                            	secondEmptyCell[0][0]: firstEmptyCell[0][0];
                        
                        var diagonallyOppositeCellY 
                    		= firstEmptyCell[0][1] === myY ? 
                            	secondEmptyCell[0][1]: firstEmptyCell[0][1];
                                
                        // checkDiagonallyOppositeCell
                        var diagonalObject
                        	=map.getObjectTypeAt(diagonallyOppositeCellX,
                        					   diagonallyOppositeCellY);
                        if(    diagonalObject === 'block')
                          {
                          	return true;
                          }
                          else
                          {
                          
                    		// reached a metaphorical dead end
                            // because no new information can be gotten here
                    		return false;
                          }
                    }
                }
                return true;
            }
            
            
            //var availablemoves 
            //    	= map.getAdjacentEmptyCells(me.getX(), me.getY());
            var nextMove = getBestPossibleMove(moves);
          	if(me.canMove(nextMove))
            {
            	me.move(nextMove);
            }
            
			if(!returnToThisCell(moves))
            {
            	map.placeObject(myX , myY, 'block');
            }
            else
            {
            	map.placeObject(myX, myY, 'visited');
            }
            }});
     map.defineObject('visited', {
     			'type': 'item',
                'symbol': 'V',
                'color': 'gray',
                'passableFor':['robot','dontvisit','block'],
                'impassable':true,
                'onCollision' : function (){
        }
    });

    map.defineObject('barrier', {
        'symbol': '░',
        'color': 'purple',
        'impassable': true,
        'passableFor': ['robot']
    });

    map.placeObject(0, map.getHeight() - 1, 'exit');
    map.placeObject(1, 1, 'robot');
    map.placeObject(map.getWidth() - 2, 8, 'blueKey');
    map.placeObject(map.getWidth() - 2, 9, 'barrier');

    var autoGeneratedMaze = new ROT.Map.DividedMaze(map.getWidth(), 10);
    autoGeneratedMaze.create( function (x, y, mapValue) {
        // don't write maze over robot or barrier
        if ((x == 1 && y == 1) || (x == map.getWidth() - 2 && y >= 8)) {
            return 0;
        } else if (mapValue === 1) { //0 is empty space 1 is wall
            map.placeObject(x,y, 'block');
        } else {
            map.placeObject(x,y,'empty');
        }
    });
}

function validateLevel(map) {
    map.validateExactlyXManyObjects(1, 'exit');
    map.validateExactlyXManyObjects(1, 'robot');
    map.validateAtMostXObjects(1, 'blueKey');
}

function onExit(map) {
    if (!map.getPlayer().hasItem('blueKey')) {
        map.writeStatus("We need to get that key!");
        return false;
    } else {
        return true;
    }
}
 	