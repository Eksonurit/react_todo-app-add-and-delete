/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todosService from './api/todos';
import classNames from 'classnames';
import { Todo } from './types/Todos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [onTodoHover, setOnTodoHover] = useState(false);
  const [filterBy, setFilterBy] = useState<string | null>(null);
  const [anyCompleted, setAnyCompleted] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const handleOnHover = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.type === 'mouseover') {
      setOnTodoHover(true);
    } else if (event.type === 'mouseout') {
      setOnTodoHover(false);
    }
  };

  useEffect(() => {
    todosService
      .getTodos()
      .then(setTodos)
      .catch(error => {
        setErrorMessage('Unable to load todos');
        throw error;
      });
  }, []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    setAnyCompleted(todos.some(todo => todo.completed));
  }, [todos]);

  const addTodo = ({ title, completed, userId }: Todo) => {
    if (!title.trim()) {
      setErrorMessage('Title is required');

      return;
    }

    setTempTodo({ id: 0, title, completed, userId });
    todosService
      .addTodo({ title, completed, userId })
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
        setNewTodoTitle('');
      })
      .catch(() => setErrorMessage('Unable to add a todo'))
      .finally(() => setTempTodo(null)); // ховаємо tempTodo
  };

  const deleteTodo = (todoId: number) => {
    setProcessingIds(ids => [...ids, todoId]);
    todosService
      .deleteTodo(todoId)
      .then(() => setTodos(prev => prev.filter(todo => todo.id !== todoId)))
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => setProcessingIds(ids => ids.filter(id => id !== todoId)));
  };

  const onTodoSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    addTodo({
      title: newTodoTitle.trim(),
      completed: false,
      id: 0,
      userId: todosService.USER_ID,
    });
  };

  const filtredTodos = (filterQuery: string | null): Todo[] => {
    if (!filterQuery) {
      return todos;
    }

    if (filterQuery === 'completed') {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      return todos.filter(todo => todo.completed);
    }

    if (filterQuery === 'active') {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      return todos.filter(todo => !todo.completed);
    }

    return todos;
  };

  if (!todosService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form onSubmit={onTodoSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              value={newTodoTitle}
              onChange={e => {
                setNewTodoTitle(e.target.value);
              }}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {filtredTodos(filterBy).map(todo =>
            todo.completed ? (
              <div
                data-cy="Todo"
                className="todo completed"
                key={todo.id}
                onMouseOver={handleOnHover}
                onMouseOut={handleOnHover}
              >
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    checked
                  />
                </label>
                <span data-cy="TodoTitle" className="todo__title">
                  {todo.title}
                </span>
                {onTodoHover && (
                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                    onClick={() => {
                      deleteTodo(todo.id);
                    }}
                  >
                    ×
                  </button>
                )}
                <div
                  data-cy="TodoLoader"
                  className={classNames('modal overlay', {
                    'is-active': processingIds.includes(todo.id),
                  })}
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            ) : (
              <div
                data-cy="Todo"
                className="todo"
                key={todo.id}
                onMouseOver={handleOnHover}
                onMouseOut={handleOnHover}
              >
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                  />
                </label>

                <span data-cy="TodoTitle" className="todo__title">
                  {todo.title}
                </span>
                {onTodoHover && (
                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                    onClick={() => {
                      deleteTodo(todo.id);
                    }}
                  >
                    ×
                  </button>
                )}
                <div
                  data-cy="TodoLoader"
                  className={classNames('modal overlay', {
                    'is-active': processingIds.includes(todo.id),
                  })}
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            ),
          )}
          {tempTodo && (
            <div className="todo">
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                />
              </label>
              <span className="todo__title">{tempTodo.title}</span>
              <div className="modal overlay is-active">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          )}
        </section>

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todos.length} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  'is-selected': filterBy === null,
                })}
                data-cy="FilterLinkAll"
                onClick={() => setFilterBy(null)}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  'is-selected': filterBy === 'active',
                })}
                data-cy="FilterLinkActive"
                onClick={() => setFilterBy('active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
                  'is-selected': filterBy === 'completed',
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilterBy('completed')}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              disabled={!anyCompleted}
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {errorMessage}
      </div>
    </div>
  );
};
