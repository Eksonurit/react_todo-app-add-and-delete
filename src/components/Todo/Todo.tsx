/* eslint-disable jsx-a11y/label-has-associated-control */

import { Todo } from '../../types/Todos';
import classNames from 'classnames';

interface Props {
  todo: Todo;
  handleOnHover: (event: React.MouseEvent<HTMLDivElement>) => void;
  deleteTodo: (id: number) => void;
  onTodoHover: boolean;
  processingIds: number[];
}

export const TodoItem: React.FC<Props> = ({
  todo,
  handleOnHover,
  deleteTodo,
  onTodoHover,
  processingIds,
}) => {
  return todo.completed ? (
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
        <input data-cy="TodoStatus" type="checkbox" className="todo__status" />
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
  );
};
