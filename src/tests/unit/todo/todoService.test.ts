import { Todo } from "../../../models/todo";
import { ITodoRepository } from "../../../repositories/interface";
import { TodoService } from "../../../services/todoService";
import { NotFoundDataError } from "../../../utils/error";

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

  describe("getByID", () => {
    it("should return todo when id exists", async () => {
      const mockRepository = createMockTodoRepository();
      const service = new TodoService(mockRepository);

      const mockTodo: Todo = {
        id: 1,
        title: "sample",
        description: "sample description",
      };

      mockRepository.getByID = jest.fn().mockResolvedValue(mockTodo);

      const result = await service.getByID(1);

      if (result instanceof Error) {
        throw new Error("error");
      }

      expect(result.id).toBe(mockTodo.id);
      expect(result.title).toBe(mockTodo.title);
      expect(result.description).toBe(mockTodo.description);
    });

    it("should return NotFoundDataError if id is not exist", async () => {
      const mockRepository = createMockTodoRepository();
      const service = new TodoService(mockRepository);

      mockRepository.getByID = jest.fn().mockResolvedValue(new NotFoundDataError("not found"));

      const result = await service.getByID(1);

      if (!(result instanceof Error)) {
        throw new Error("Test failed because an error has occured");
      }
      expect(result instanceof NotFoundDataError).toBeTruthy();
    });
    it("should return repository error", async () => {
      const mockRepository = createMockTodoRepository();
      mockRepository.getByID = jest.fn().mockResolvedValue(new Error("repository error"));
      const service = new TodoService(mockRepository);

      const result = await service.getByID(1);
      if (!(result instanceof Error)) {
        throw new Error(`Test failed because an error has occured`);
      }

      expect(result instanceof Error).toBeTruthy();
    });
  });

  describe("create", () => {
    it("should return createdID", async () => {
      const mockRepository = createMockTodoRepository();
      const service = new TodoService(mockRepository);

      const todo: Todo = {
        title: "sample",
        description: "sample description",
      };

      mockRepository.create = jest.fn().mockResolvedValue(1);

      const result = await service.create(todo);

      if (result instanceof Error) {
        throw new Error(`Test failed because an error has occured":${result.message}`);
      }

      expect(result).toBe(1);
    });
    it("should return repository error", async () => {
      const mockRepository = createMockTodoRepository();
      mockRepository.create = jest.fn().mockResolvedValue(new Error("repository error"));
      const service = new TodoService(mockRepository);
      const todo: Todo = {
        title: "sample",
        description: "sample description",
      };

      const result = await service.create(todo);
      if (!(result instanceof Error)) {
        throw new Error(`Test failed because an error has occured`);
      }

      expect(result instanceof Error).toBeTruthy();
    });
  });
  describe("update", () => {
    it("should return updated todo", async () => {
      const mockRepository = createMockTodoRepository();
      const service = new TodoService(mockRepository);

      const updateData: Todo = {
        title: "updatedSample title",
        description: "updatedSample description",
      };

      const todo: Todo = {
        id: 1,
        title: updateData.title,
        description: updateData.description,
      };

      mockRepository.getByID = jest.fn().mockResolvedValue(todo);

      mockRepository.update = jest.fn().mockResolvedValue(todo);

      const result = await service.update(1, updateData);

      if (result instanceof Error) {
        throw new Error(`Test failed because an error has occured":${result.message}`);
      }

      expect(result.id).toBe(1);
      expect(result.title).toBe(updateData.title);
      expect(result.description).toBe(updateData.description);
    });

    it("should return NotFoundDataError if id is not exist", async () => {
      const mockRepository = createMockTodoRepository();
      const service = new TodoService(mockRepository);

      mockRepository.getByID = jest.fn().mockResolvedValue(new NotFoundDataError("not found"));

      const result = await service.update(1, { title: "hogehoge", description: "hugahuga" });

      if (!(result instanceof Error)) {
        throw new Error("Test failed because an error has occured");
      }
      expect(result instanceof NotFoundDataError).toBeTruthy();
    });
    it("should return repository error", async () => {
      const mockRepository = createMockTodoRepository();
      const service = new TodoService(mockRepository);

      const updateData: Todo = {
        title: "updatedSample title",
        description: "updatedSample description",
      };

      const todo: Todo = {
        id: 1,
        title: updateData.title,
        description: updateData.description,
      };

      mockRepository.getByID = jest.fn().mockResolvedValue(todo);
      mockRepository.update = jest.fn().mockResolvedValue(new Error("repository error"));

      const result = await service.update(1, updateData);

      if (!(result instanceof Error)) {
        throw new Error("Test failed because an error has occured");
      }

      expect(result instanceof Error).toBeTruthy();
    });
  });

  describe("delete", () => {
    it("should return deletedID", async () => {
      const mockRepository = createMockTodoRepository();
      const service = new TodoService(mockRepository);

      mockRepository.delete = jest.fn().mockResolvedValue(1);

      const result = await service.delete(1);

      if (result instanceof Error) {
        throw new Error(`Test failed because an error has occured":${result.message}`);
      }

      expect(result).toBe(1);
    });
    it("should return repository error", async () => {
      const mockRepository = createMockTodoRepository();
      mockRepository.delete = jest.fn().mockResolvedValue(new Error("repository error"));
      const service = new TodoService(mockRepository);

      const result = await service.delete(1);
      if (!(result instanceof Error)) {
        throw new Error(`Test failed because an error has occured`);
      }

      expect(result instanceof Error).toBeTruthy();
    });
  });
});
