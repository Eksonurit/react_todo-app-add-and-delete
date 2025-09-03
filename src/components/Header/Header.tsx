interface Props {
  onTodoSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  newTodoTitle: string;
  setNewTodoTitle: (value: string) => void;
}

export const Header: React.FC<Props> = ({
  onTodoSubmit,
  newTodoTitle,
  setNewTodoTitle,
}) => {
  return (
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
  );
};
