/**
 * bad points
 * **責務が分割されていない**
 * - 関数が長く複雑で見通しが悪い
 * - オブジェクトへの代入でUI、挙動を作るため処理が追いづらく、破壊も容易
 * 
 * todosデータを管理することで、UIが更新できれば見通しが良さそう
 * 状態に応じてUIがそれにあった状態になってくれたら、状態を操作するだけで、UIも変化してくれる。
 * 既存の処理だと、状態を変化させると同時に、UIも変化させる必要がある
 * => 宣言的
 */
function handleFormSubmit() {
    const inputEl = document.getElementById("task-input");
    const inputValue = inputEl.value;

    if(!inputValue.length > 0) {
        alert("テキストを入力してください。");
        return;
    }

    const todosEl = document.getElementById("todos");
    const todoEl = createTodoElement(inputValue);

    todosEl.appendChild(todoEl);

    inputEl.value = "";
}

function createTodoElement(task) {
    const todoEl = document.createElement("li");

    const checkBoxEl = document.createElement("input");
    checkBoxEl.type = "checkbox";
    checkBoxEl.onchange = (e) => {
        const checked = e.target.checked;
        todoEl.className = checked ? "checked" : "";
    }

    const labelEl = document.createElement("label");
    labelEl.innerHTML = task;

    const buttonEl = document.createElement("button");
    buttonEl.innerText = "削除";
    buttonEl.onclick = () => {
        todoEl.remove();
    }

    todoEl.appendChild(checkBoxEl);
    todoEl.appendChild(labelEl);
    todoEl.appendChild(buttonEl);

    return todoEl;
}