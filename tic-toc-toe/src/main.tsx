import React, { ReactElement, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

interface SquareProps {
    value: string | null;
    onClick: () => void;
}

const Square: React.FC<SquareProps> = (props:SquareProps):ReactElement => {
    return (
        <button className='square' onClick={props.onClick}>
            {props.value}
        </button>
    )
}

interface BoardProps {
    squares: SquaresType;
    onClick: (i:number) => void;
}

const Board: React.FC<BoardProps> = (props):ReactElement => {
    const renderSquare = (i:number):ReactElement => {
        return <Square
            value={props.squares[i]}
            onClick={() => props.onClick(i)}
        />;
    }

    const winner_line = getWinnerLine(props.squares);
    let boardSquares = [];
    for (let row = 0; row < 3; row++) {
        let boardRow = [];
        for (let col = 0; col < 3; col++) {
            const squareNumber = (row * 3) + col;
            const className = (winner_line && winner_line.includes(squareNumber))
            ? 'win_square'
            : '';

            boardRow.push(<span className={className} key={squareNumber}>{renderSquare(squareNumber)}</span>);
        }
        boardSquares.push(<div className='board-row' key={row}>{boardRow}</div>);
    };

    return (
        <div>
            {boardSquares}
        </div>
    );
}

interface History {
    squares: SquaresType;
}

const Game: React.FC = () => {
    const [stepNumber, setStepNumber] = useState(0);
    const [xIsNext, setXIsNext] = useState(true);
    const [isHistoryAsc, setIsHistoryAsc] = useState(true);
    const [history, setHistory] = useState<History[]>([
        {squares: Array(9).fill(null)}
    ])

    const handleClick = (i:number):void => {
        const currentHistory = history.slice(0, stepNumber + 1);
        const latest = currentHistory[currentHistory.length - 1];
        const squares = latest.squares.slice();

        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = xIsNext ? 'X' : 'O';
        setHistory(currentHistory.concat([{squares: squares}]));
        setStepNumber(currentHistory.length);
        setXIsNext(!xIsNext);
    }

    const handleSortClick = ():void => {
        setIsHistoryAsc(!isHistoryAsc);
    }

    const jumpTo = (step: number): void => {
        setStepNumber(step);
        setXIsNext((step % 2) === 0);
    }

    const currentHistory = [...history];
    const latest = currentHistory[stepNumber];
    const winner = calculateWinner(latest.squares);
    const isDraw = history.length === 10;
    const status = (winner)
                        ? 'Winner: ' + winner
                        : (isDraw) 
                            ? 'Draw'
                            :'Next player: ' + (xIsNext ? 'X' : 'O');

    let moves = currentHistory.map((step, move) => {
        // この部分ちょっと汚い...
        let move_index:number = 0;
        if (move) {
            currentHistory[move].squares.forEach((value, index) => {
                if (currentHistory[move - 1].squares[index] !== value) {
                    move_index = index;
                }
            })
        }

        const desc = move 
            ? '#' + move + "手目に戻る 列: " + (move_index % 3 + 1) + " 行:" + (Math.floor(move_index / 3) + 1)
            : 'はじめから';
        const className = (move === stepNumber) ? "latest" : "";

        return (
            <li className={className} key={move}>
                <button onClick={() => jumpTo(move)}>
                    {desc}
                </button>
            </li>
        );
    });

    moves = isHistoryAsc
        ? moves
        : moves.reverse();

    const sort_status = isHistoryAsc ? "昇順": "逆順";
    
    return (
        <div className="game">
            <div className="game-board">
                <Board
                    squares={latest.squares}
                    onClick={(i) => handleClick(i)}
                />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <button onClick={() => handleSortClick()}>sort: {sort_status}</button>
                <ul className='game-history'>{moves}</ul>
            </div>
        </div>
    );
}

type SquaresType = (string | null)[];
const calculateWinner = (squares: SquaresType): (string | null) => {
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

const getWinnerLine = (squares: SquaresType): (number[] | null) => {
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

const root = ReactDOM.createRoot(document.getElementById("root") as Element);
root.render(<Game />);
