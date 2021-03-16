/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

// prints "hi" in the browser's dev tools console
class Board{
  constructor(){
    this.board = [[' ',' ',' '],[' ',' ',' '],[' ',' ',' ']];
  }
  
  place(char, r, c){
    this.board[r][c]=char;
  }
  
  remove(r, c){
    this.board[r][c]=" ";
  }
  
  isClear(r,c){
    return (this.board[r][c]==" ");
  }
  
  toString(){
    var str = ""
    for(var r =0;r<3;r++){
      for(var c =0;c<3;c++){
        if(c<2){
          str+=this.board[r][c]+"|";
        }else{
          str+="\n";
        }
      }
      if(r<2){
        str+="-----\n";
      }
    }
    return str+"\n";
  }
  
  eval(){
    for(var r =0;r<3;r++){
      if (this.board[r][0]=="X" && this.board[r][1]=="X" && this.board[r][2]=="X"){
        return 10;
      } else if( this.board[r][0]=="O" && this.board[r][1]=="O" && this.board[r][2]=="O"){
        return -10;
      }
    }
    
    for(var c =0;c<3;c++){
      if (this.board[0][c]=="X" && this.board[1][c]=="X" && this.board[2][c]=="X"){
        return 10;
      } else if( this.board[0][c]=="O" && this.board[1][c]=="O" && this.board[2][c]=="O"){
        return -10;
      }
    }
    
    if (this.board[0][0]=="X" && this.board[1][1]=="X" && this.board[2][2]=="X"){
      return 10;
    } else if( this.board[0][0]=="O" && this.board[1][1]=="O" && this.board[2][2]=="O"){
      return -10;
    } 
    
    if (this.board[0][2]=="X" && this.board[1][1]=="X" && this.board[2][0]=="X"){
      return 10;
    } else if (this.board[0][2]=="O" && this.board[1][1]=="O" && this.board[2][0]=="O"){
      return -10;
    }
    
    return 0;
  }
};

function miniMax(Board, turn, alpha=-Infinity, beta=Infinity){
  if (Board.eval()!=0 || turn==9){
    return Board.eval()-turn;
  }
  if(turn%2==1){
    var bestVal=-Infinity;
    for(var r =0;r<3;r++){
      for(var c =0;c<3;c++){
        if (Board.isClear(r,c)){
          Board.place("X",r,c);
          var score = miniMax(Board, turn+1, alpha, beta);
          Board.remove(r,c);
          if(score>bestVal){
            bestVal = score;
          }
          if (score>alpha){
            alpha=score;
          } 
          
          if (score>=beta){
            return bestVal;
          }
        }
      }
    }
    return bestVal;
  }else{
    var bestVal = Infinity;
    for(var r =0;r<3;r++){
      for(var c =0;c<3;c++){
        if (Board.isClear(r,c)){
          Board.place("O",r,c);
          var score = miniMax(Board, turn+1, alpha, beta);
          
          Board.remove(r,c);
          if(score<bestVal){
            bestVal = score;
          }
          if (score<beta){
            beta=score;
          } 
          
          if (score<=alpha){
            return bestVal;
          }
        }
      }
    }
    return bestVal;
  }
};

function findBestMove(Board, turn){
  var bestRow = null;
  var bestCol = null;
  var bestVal = -Infinity;
  for(var r =0;r<3;r++){
    for(var c =0;c<3;c++){
      if (Board.isClear(r,c)){
        Board.place("X",r,c);
        var score = miniMax(Board, turn+1);
        Board.remove(r,c);
        if (score>bestVal){
          bestVal=score;
          bestRow = r;
          bestCol = c;
        }
      }
    }
  }
  return [bestVal, bestRow, bestCol];
}

var turn = 0;
let MyBoard = new Board();

function makeMove(pos){
  if (turn==0){
    $("#reset-button").show();
    $("#reset-button").text("Restart Game");
  }
  var row = Math.floor(pos/3);
  var col = pos%3;
  $("#cell-"+String(pos)).text("O");
  $("#cell-"+String(pos)).prop('disabled', true);
  MyBoard.place("O", row, col);
  turn+=1;
  
  if (MyBoard.eval()>0){
    $("#instructions").text("Computer Wins!");
    $(".game-cell").prop('disabled', true);
    $("#reset-button").text("New Game");
    return;
  } else if (MyBoard.eval()<0){
    $("#instructions").text("You Win!");
    $(".game-cell").prop('disabled', true);
    $("#reset-button").text("New Game");
    return;
  } else if (turn>=8){
    $("#instructions").text("It's a Draw!");
    $("#reset-button").text("New Game");
    return;
  }
  
  let bestMove = findBestMove(MyBoard, turn);
  let compSpot = bestMove[1]*3+bestMove[2];
  $("#cell-"+String(compSpot)).text("X");
  $("#cell-"+String(compSpot)).prop('disabled', true);
  MyBoard.place("X", bestMove[1], bestMove[2]);
  turn+=1;
  
  if (MyBoard.eval()>0){
    $("#instructions").text("Computer Wins!");
    $(".game-cell").prop('disabled', true);
    $("#reset-button").text("New Game");
    return;
  } else if (MyBoard.eval()<0){
    $("#instructions").text("You Wins!");
    $(".game-cell").prop('disabled', true);
    $("#reset-button").text("New Game");
    return;
  } 
};

function reset(){
  $(".game-cell").prop('disabled', false);
  $(".game-cell").text("");
  $("#reset-button").hide();
  $("#instructions").text("Click on a space to play!")
  MyBoard = new Board();
  turn =0;
  
}



