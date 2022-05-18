import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
    return (
        <button className='square' onClick={props.onClick}>
            {props.value}
        </button>
    )
}

class Board extends React.Component {
    renderSquare(i) {
        return <Square
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
        />;
    }

    render() {
        const winner_line = getWinnerLine(this.props.squares);
        let boardSquares = [];
        for (let row = 0; row < 3; row++) {
            let boardRow = [];
            for (let col = 0; col < 3; col++) {
                const squareNumber = (row * 3) + col;
                const className = (winner_line && winner_line.includes(squareNumber))
                ? 'win_square'
                : '';

                boardRow.push(<span className={className} key={squareNumber}>{this.renderSquare(squareNumber)}</span>);
            }
            boardSquares.push(<div className='board-row' key={row}>{boardRow}</div>);
        };

        return (
            <div>
                {boardSquares}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            IsHistoryAsc: true,
            stepNumber: 0,
            xIsNext: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            squares: squares,
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        })
    }

    handleSortClick() {
        this.setState({
            IsHistoryAsc: !this.state.IsHistoryAsc,
        })
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const isDraw = history.length === 10;
        const status = (winner)
            ? 'Winner: ' + winner
            : (isDraw) 
            ? 'Draw'
            :'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

        let moves = history.map((step, move) => {
            let move_index;
            if (move) {
                history[move].squares.forEach((value, index) => {
                    if (history[move - 1].squares[index] !== value) {
                        move_index = index;
                    }
                })
            }

            const desc = move ?
                'Go to move #' + move + " 列: " + (move_index % 3 + 1) + " 行:" + (Math.floor(move_index / 3) + 1) :
                'Go to game start';
            const className = (move === this.state.stepNumber) ? "current" : "";

            return (
                <li className={className} key={move}>
                    <button onClick={() => this.jumpTo(move)}>
                        {desc}
                    </button>
                </li>
            );
        });

        moves = this.state.IsHistoryAsc
            ? moves
            : moves.reverse();

        const sort_status = this.state.IsHistoryAsc ? "昇順": "逆順";
        
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
                    <button onClick={() => this.handleSortClick()}>sort: {sort_status}</button>
                    <ul className='game-history'>{moves}</ul>
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
        [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];

        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }

    return null;
}

function getWinnerLine(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];

        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return [a, b, c];
        }
    }

    return null;
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
