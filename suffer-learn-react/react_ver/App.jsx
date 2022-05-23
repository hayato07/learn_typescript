import { useState } from "react";

/**
 * Reactで書くとstate管理に集中すればよい
 * またコンポーネントで処理を管理できるので、修正範囲が把握しやすい
 * 責務をどのように分離するかはプロジェクトによって考慮の必要がありそう。
 */

function App() {
    const [idCounter, setIdCounter] = useState(0);
    const [todos, setTodos] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const inputText = e.target["task"].value;
        const nextId = idCounter + 1;
        setIdCounter(nextId);
        setTodos([...todos], { id: nextId, task: inputText, checked: false });
    }

    const handleChangeCheckBox = (id) => {
        const changeTodos = todos.map((todo) => {
            if (todo.id === id) {
                return { ...todo, checked: !todo.checked };
            }

            return todo;
        });
        setTodos(changeTodos);
    }

    const handleClickDeleteTodo = (id) => {
        setTodos(todos.filter(todo => todo.id !== id));
    }

    return (
        <div className="App">
            <form onSubmit={handleSubmit}>
                <input type="text" name="task" />
                <button>登録</button>
            </form>
            <div>
                {todos.map((todo) => {
                    <div key={todo.id} className={todo.checked ? "checked" : ""}>
                        <input type="checkbox" onChange={() => handleChangeCheckBox(todo.id)} />
                        {todo.task}
                        <button onClick={() => handleClickDeleteTodo(todo.id)}>
                            削除
                        </button>
                    </div>
                })}
            </div>
        </div>
    )
}

export default App;
