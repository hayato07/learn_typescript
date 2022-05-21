import { useState } from "react";
import { calculateWinner } from "../functions/calculateWinner";
import { Board } from "./Board";
import { SquaresType } from "./Square";

interface History {
    squares: SquaresType;
}

export const Game: React.FC = () => {
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