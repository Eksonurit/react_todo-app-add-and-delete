import { Todo } from '../../../types/Todos';
import { TempTodo } from '../../TempTodo/TempTodo';
import { TodoItem } from '../../Todo/Todo';

interface Props {
  filterBy: string | null;
  filtredTodos: (filterQuery: string | null) => Todo[];
  handleOnHover: (event: React.MouseEvent<HTMLDivElement>) => void;
  deleteTodo: (id: number) => void;
  onTodoHover: boolean;
  processingIds: number[];
  tempTodo: Todo | null;
}

export const TodoList: React.FC<Props> = ({
  filterBy,
  filtredTodos,
  handleOnHover,
  deleteTodo,
  onTodoHover,
  processingIds,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filtredTodos(filterBy).map(todoItem => (
        <TodoItem
          key={todoItem.id}
          todo={todoItem}
          handleOnHover={handleOnHover}
          deleteTodo={deleteTodo}
          onTodoHover={onTodoHover}
          processingIds={processingIds}
        />
      ))}
      {tempTodo && <TempTodo tempTodo={tempTodo} />}
    </section>
  );
};
