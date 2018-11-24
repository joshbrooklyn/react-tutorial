import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
	return (
		<button className="square" onClick={props.onClick}>
			{props.value}
		</button>
	);
}
    

class Board extends React.Component {
	render() {
  	let divs = [];
  	const colsPerRow = 3;
  	
  	for (let i = 0; i < this.props.squares.length; i += colsPerRow) {
  		let childDivs = [];
  		for (let j = 0; j < colsPerRow; j++){
				childDivs.push(
		    	<Square 
		    	  value={this.props.squares[j + i]}
		    	  onClick={() => this.props.onClick(j + i)}
		    	/>
		    );				
  	  };
  	  
  	  divs.push(<div className="board-row">{childDivs}</div>);
  	}  	
  	
  	return (
  		<div>{divs}</div>
    );
  }
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [{
				squares: Array(9).fill(null),
				moveLocation: null,
			}],
			xIsNext: true,
			stepNumber: 0,
			moveOrder: 'forward',
		};
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		const moveLocation = current.moveLocation;
		
		if (calculateWinner(squares) || squares[i]){
			return;
		}
		squares[i] = this.state.xIsNext ? 'X' : 'O';
		this.setState({
			history: history.concat([{
				squares: squares,	
				moveLocation: i,
			}]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,
		});
	}
	
	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) === 0,			
		});
	}
	
	setMoveDisplayOrder()
	{
		this.setState({
			moveOrder: (this.state.moveOrder == "forward") ? "reverse" : "forward",
		})
	}
  	
  render() {
  	const history = this.state.history;
  	const current = history[this.state.stepNumber];
  	const winner = calculateWinner(current.squares);
  	
  	const moves = history.map((step, move) => {
  		const desc = move ? 'Go to move #' + move + ' (Row: ' + (Math.floor(step.moveLocation / 3) + 1) + ', Col: ' + ((step.moveLocation % 3) + 1) + ')' : 'Go to game start';
  		return (
  		<li key={move}> 
  			<button onClick={() => this.jumpTo(move)} style={move == this.state.stepNumber ? {fontWeight: 'bold'} : {fontWeight: 'normal'}}>{desc}</button>
  		</li>
  		);
  	});
  	
  	let status;
  	if (winner) {
  		status = 'Winner: ' + winner;
  	} else {
  		status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
  	}
  	
  	const orderButton = (
  		<button onClick={() => this.setMoveDisplayOrder()}>View Moves in {(this.state.moveOrder == "forward") ? "reverse" : "forward"} direction</button>
  	);
  	
    return (
      <div className="game">
        <div className="game-board">
          <Board
          	squares={current.squares}
          	onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>{orderButton}</div>
          <ol style={this.state.moveOrder == "reverse" ? {display: 'flex', flexDirection: 'column-reverse'} : {}}>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	];
	
	for (let i = 0; i < lines.length; i++){
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
			return squares[a];
		}
	}
	
	return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
