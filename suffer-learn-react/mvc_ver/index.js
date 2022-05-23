/**
 * MVC version
 * 
 * naive Versionより責務が分割されており、どこでどういった操作がされているかを追いやすくなった。
 * 一方で、コード量が増えてしまっており、見通しが悪い。
 * Reactはどのようにこの問題に対処するのか
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
     * todoをUIに追加
     * @param {id:number, task: string, isChecked: boolean} todo 
     */
    addTodo(todo) {
        const todosEl = document.getElementById("todos");
        const todoEl = this._createTodoElement(todo);
        todosEl.appendChild(todoEl);
    }

    /**
   * todoをチェックに応じてスタイルを変える
   * @param {*} id todoのid
   */
    check(id) {
        const todoEl = document.getElementById(`todo-${id}`);
        todoEl.className = `checked`;
    }

    /**
     * todoをチェックに応じてスタイルを変える
     * @param {*} id todoのid
     */
    unCheck(id) {
        const todoEl = document.getElementById(`todo-${id}`);
        todoEl.className = "";
    }

    /**
     * input form をリセットする
     */
    resetTodo() {
        const input = document.getElementById("task-input");
        input.value = "";
    }

    /**
     * 指定したtodoをDOMから削除する
     * @param {*} id todoのid
     */
    removeTodo(id) {
        const todoEl = document.getElementById(`todo-${id}`);
        todoEl.remove();
    }

    /**
     * todo要素を作成
     * @param {id:number, task:string, isChecked: boolean} todo 
     * @returns todoのHTML要素
     */
    _createTodoElement(todo) {
        const { id, task } = todo;
        const todoEl = document.createElement("li");
        todoEl.id = `todo-${id}`;

        const checkBoxEl = document.createElement("input");
        todoEl.appendChild(checkBoxEl);

        const labelEl = document.createElement("label");
        labelEl.innerText = task;
        checkBoxEl.type = "checkbox";
        checkBoxEl.id = `checkbox-${todo.id}`;
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

            // UI に追加するtodoを取得
            const todo = todoList.getTodo(addedTodoId);

            // UI に反映
            view.addTodo(todo);
            this.handleCheckTask(todo.id);
            this.handleClickDeleteTask(todo.id);
            view.resetTodo();
        });
    }

    /**
     * 指定したcheckboxの状態変化に応じてtodo更新とUI反映をする
     * @param {number} id todoのid
     */
    handleCheckTask(id) {
        const checkBoxEl = document.getElementById(`checkbox-${id}`);
        checkBoxEl.onchange = function (e) {
            const checked = e.target.checked;
            const stateChangedTodo = todoList.checkTodo(id, checked);
            if (stateChangedTodo.checked) {
                view.check(stateChangedTodo.id);
            } else {
                view.unCheck(stateChangedTodo.id);
            }
        };
    }

    /**
     * 指定したtodo削除とUI反映をする
     * @param {*} id todoのid
     */
    handleClickDeleteTask(id) {
        const buttonEl = document.getElementById(`button-${id}`);
        buttonEl.onclick = function () {
            view.removeTodo(id);
            todoList.removeTodo(id);
        };
    }
}

const formController = new Controller();
formController.setup();