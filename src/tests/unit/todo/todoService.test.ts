import { Todo } from "../../../models/todo";
import { ITodoRepository } from "../../../repositories/interface";
import { TodoService } from "../../../services/todoService";

function createMockTodoRepository(): ITodoRepository {
  const mockRepository: ITodoRepository = {
    findAll: jest.fn().mockRejectedValue(new Error("Function not implemented")),
    getByID: jest.fn().mockRejectedValue(new Error("Function not implemented")),
    create: jest.fn().mockRejectedValue(new Error("Function not implemented")),
    update: jest.fn().mockRejectedValue(new Error("Function not implemented")),
    delete: jest.fn().mockRejectedValue(new Error("Function not implemented")),
  };
  return mockRepository;
}

function createMockTodoList(num: number): Todo[] {
  const todoList: Todo[] = [];
  for (let index = 0; index < num; index++) {
    const todo: Todo = {
      id: index,
      title: `sample titlec${index}`,
      description: `sample description${index}`,
    };
    todoList.push(todo);
  }
  return todoList;
}

describe("todoService", () => {
  describe("findAll", () => {
    it("should return 5 todo", async () => {
      const mockRepository = createMockTodoRepository();
      const service = new TodoService(mockRepository);
      const mockTodos: Todo[] = createMockTodoList(5);
      mockRepository.findAll = jest.fn().mockResolvedValue(mockTodos);

      const result = await service.findAll();
      if (result instanceof Error) {
        throw new Error(`Test failed because an error has occured":${result.message}`);
      }

      expect(result.length).toBe(5);

      for (const todo of result) {
        const expectTodo = mockTodos.filter((t) => t.id === todo.id)[0];
        expect(todo.id).toBe(expectTodo.id);
        expect(todo.title).toBe(expectTodo.title);
        expect(todo.description).toBe(expectTodo.description);
      }

      expect(result[0].id).toBe(mockTodos[0].id);
      expect(result[0].title).toBe(mockTodos[0].title);
      expect(result[0].description).toBe(mockTodos[0].description);
    });
    it("should return repository error", async () => {
      const mockRepository = createMockTodoRepository();
      mockRepository.findAll = jest.fn().mockResolvedValue(new Error("repository error"));
      const service = new TodoService(mockRepository);

      const result = await service.findAll();
      if (!(result instanceof Error)) {
        throw new Error(`Test failed because an error has occured`);
      }

      expect(result instanceof Error).toBeTruthy();
    });
  });
});
