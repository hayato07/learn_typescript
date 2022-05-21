import { ReactElement } from "react";

interface SquareProps {
    value: string | null;
    onClick: () => void;
}

export type SquaresType = (string | null)[];

export const Square: React.FC<SquareProps> = (props:SquareProps):ReactElement => {
    return (
        <button className='square' onClick={props.onClick}>
            {props.value}
        </button>
    )
}