/**
 * MVC with React Thought version
 * 
 * 情報を一箇所で管理、それを元にUIを作成
 * Viewがシンプルになったが、
 * - 全更新している
 * - データを変更する度にUIを更新する関数を呼んでいる
 * - イベントハンドラをデータ更新の度に登録している
 */

/**
 * Model
 * Todoデータの管理とその操作を行うクラス
 */
class TodoListModel {
    constructor() {
        this.idCounter = 0;
        this.todos = new Map();
    }

    /**
     * taskをtodoとして、todoListに追加
     * @param {string} task 
     * @returns {number|undefined} idCounter(追加されたタスクのid)
     */
    addTodo(task) {
        if (typeof (task) !== 'string') return undefined;

        this.idCounter += 1;
        this.todos.set(this.idCounter, {
            id: this.idCounter,
            task: task,
            checked: false,
        });

        return this.idCounter;
    }

    /**
     * 指定idのtodoを取得
     * @param {number} id 
     * @returns {object} Todo
     */
    getTodo(id) {
        return this.todos.get(id);
    }

    /**
     * todosを全件取得
     * @returns todos
     */
    getTodos() {
        return Array.from(this.todos.values());
    }

    /**
     * 指定idのtodoを削除
     * @param {number} id 
     */
    removeTodo(id) {
        this.todos.delete(id);
    }

    /**
     * todoの完了状態を変更する
     * @param {number} id 
     * @param {boolean} isCheck 
     * @returns {object|undefined} 更新済みTodo
     */
    checkTodo(id, isCheck) {
        const todo = this.todos.get(id);
        if (!todo) return undefined;
        
        todo.checked = isCheck;

        return todo;
    }
}

const todoList = new TodoListModel();

class View {
    /**
     * todoの配列からUIを生成する関数
     * @param {todo[]} todos
     */
    render(todos) {
        const todosEl = document.getElementById("todos");
        todosEl.innerHTML = "";
        const fragment = document.createDocumentFragment();
        todos.forEach((todo) => {
            const todoEl = this._createTodoElement(todo);
            fragment.appendChild(todoEl);
        });
        todosEl.appendChild(fragment);
    }

    /**
     * todo要素を作成
     * @param {id:number, task:string, isChecked: boolean} todo 
     * @returns todoのHTML要素
     */
    _createTodoElement(todo) {
        const { id, task, checked } = todo;
        const todoEl = document.createElement("li");
        todoEl.id = `todo-${id}`;

        const checkBoxEl = document.createElement("input");
        todoEl.appendChild(checkBoxEl);

        const labelEl = document.createElement("label");
        labelEl.innerText = task;
        checkBoxEl.type = "checkbox";
        checkBoxEl.id = `checkbox-${todo.id}`;
        checkBoxEl.checked = checked;
        todoEl.appendChild(labelEl);

        const buttonEl = document.createElement("button");
        buttonEl.innerText = "削除";
        buttonEl.id = `button-${id}`;
        todoEl.appendChild(buttonEl);

        return todoEl;
    }
}

const view = new View();

class Controller {
    setup() {
        this.handleSubmitForm();
    }

    /**
     * タスク送信時にtodo追加とUI反映を行う
     */
    handleSubmitForm() {
        const formEl = document.getElementById("task-send-form");
        formEl.addEventListener("submit", (ev) => {
            ev.preventDefault();

            const input = document.getElementById("task-input");
            const task = input.value;
            if (!task.length > 0) {
                alert("テキストを入力してください。");
                return;
            }

            // model に Todo を追加
            const addedTodoId = todoList.addTodo(task);
            this.flash();
        });
    }

    /**
     * 指定したcheckboxの状態変化に応じてTODO更新とUI反映をする
     * @param {number} id todoのid
     */
    handleCheckTask(id) {
        const checkBoxEl = document.getElementById(`checkbox-${id}`);
        checkBoxEl.addEventListener("change", (e) => {
            const checked = e.target.checked;
            todoList.checkTodo(id, checked);
            const todos = todoList.getTodos();
            this.flash();
        });
    }

    /**
     * 指定したTODO削除とUI反映をする
     * @param {*} id todoのid
     */
    handleClickDeleteTask(id) {
        const buttonEl = document.getElementById(`button-${id}`);
        buttonEl.addEventListener("click", () => {
            todoList.removeTodo(id);
            const todos = todoList.getTodos();
            this.flash();
        });
    }

    flash() {
        const todos = todoList.getTodos();
        view.render(todos);

        // イベントハンドラの付け直し
        todos.forEach((todo) => {
            const id = todo.id;
            this.handleCheckTask(id);
            this.handleClickDeleteTask(id);
        });
    }
}

const formController = new Controller();
formController.setup();