import React, { useState } from "react"

type Task = {
    id: number;
    title: string;
    checked: boolean;
    trashed: boolean;
};

type Filter = 'all' | 'complete' | 'incomplete' | 'trashed';

const TasksComponent = () => {
    const [text, setText] = useState<string>('');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filter, setFilter] = useState<Filter>('all');

    const handleTaskInputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
    }

    const handleTaskInputOnSubmit = () => {
        if (!text) return;

        const newTask: Task = {
            id: new Date().getTime(),
            title: text,
            checked: false,
            trashed: false,
        };

        setTasks([...tasks, newTask]);
        setText('');
    }

    const handleOnEdit = (id: number, title: string) => {
        const deepCopy = tasks.map((task) => ({ ...task }));

        const newTasks = deepCopy.map((task: Task) => {
            if (task.id === id) {
                task.title = title;
            }

            return task;
        });

        setTasks(newTasks);
    }

    const handleOnCheck = (id: number, checked: boolean) => {
        const deepCopy = tasks.map((task) => ({ ...task }));

        const newTasks = deepCopy.map((task) => {
            if (task.id === id) {
                task.checked = !checked;
            }
            return task;
        });

        setTasks(newTasks);
    };

    const handleOnRemove = (id: number, trashed: boolean) => {
        const deepCopy = tasks.map((task) => ({ ...task }));

        const newTasks = deepCopy.map((task) => {
            if (task.id === id) {
                task.trashed = !trashed;
            }
            return task;
        });

        setTasks(newTasks);
    };

    const handleOnEmpty = () => {
        const newTasks = tasks.filter((task) => !task.trashed);
        setTasks(newTasks);
    };

    const filteredTasks = tasks.filter((task) => {
        switch (filter) {
            case 'all':
                return !task.trashed;
            case 'complete':
                return task.checked && !task.trashed;
            case 'incomplete':
                return !task.checked && !task.trashed;
            case 'trashed':
                return task.trashed;
            default:
                return task;
        }
    });

    return (
        <div>
          <select
            defaultValue="all"
            onChange={(e) => setFilter(e.target.value as Filter)}
          >
            <option value="all">?????????????????????</option>
            <option value="complete">?????????????????????</option>
            <option value="incomplete">??????????????????</option>
            <option value="trashed">?????????</option>
          </select>
          {filter === 'trashed' ? (
            <button
              onClick={handleOnEmpty}
              disabled={tasks.filter((task) => task.trashed).length === 0}
            >
              ????????????????????????
            </button>
          ) : (
            filter !== 'complete' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleTaskInputOnSubmit();
                }}
              >
                <input
                  type="text"
                  value={text}
                  onChange={(e) => handleTaskInputOnChange(e)}
                />
                <input type="submit" value="??????" onSubmit={handleTaskInputOnSubmit} />
              </form>
            )
          )}
          <ul>
            {filteredTasks.map((task) => {
              return (
                <li key={task.id}>
                  <input
                    type="checkbox"
                    disabled={task.trashed}
                    checked={task.checked}
                    onChange={() => handleOnCheck(task.id, task.checked)}
                  />
                  <input
                    type="text"
                    disabled={task.checked || task.trashed}
                    value={task.title}
                    onChange={(e) => handleOnEdit(task.id, e.target.value)}
                  />
                  <button onClick={() => handleOnRemove(task.id, task.trashed)}>
                    {task.trashed ? '??????' : '??????'}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      );
}

export const App = () => {
    return (
        <TasksComponent/>
    );
};