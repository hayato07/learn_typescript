import { ReactElement } from 'react';
import { getWinnerLine } from '../functions/getWinnerLine';
import {Square, SquaresType} from './Square';

interface BoardProps {
    squares: SquaresType;
    onClick: (i:number) => void;
}

export const Board: React.FC<BoardProps> = (props):ReactElement => {
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