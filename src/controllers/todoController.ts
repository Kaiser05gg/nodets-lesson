import { Router } from "express";
import { ITodoService } from "../services/interFace";
import { NotFoundDataError } from "../utils/error";

export class TodoController {
  private todoService: ITodoService;
  public router: Router;

  constructor(todoService: ITodoService) {
    this.todoService = todoService;
    this.router = Router();

    this.router.get("/todos", async (_, res) => {
      const result = await this.todoService.findAll();

      if (result instanceof Error) {
        res.status(500).send();
        return;
      }

      res.status(200).json(result);
    });

    this.router.get("/todos/:id", async (req, res) => {
      const id = parseInt(req.params.id);
      const result = await this.todoService.getByID(id);

      if (result instanceof NotFoundDataError) {
        res.status(404).json(result.message);
        return;
      }

      if (result instanceof Error) {
        res.status(500).send();
        return;
      }

      res.status(200).json(result);
    });

    this.router.post("/todos/", async (req, res) => {
      const todo = req.body;
      const result = await this.todoService.create(todo);

      if (result instanceof Error) {
        res.status(500).send();
        return;
      }

      res.status(200).json(result);
    });

    this.router.put("/todos/:id", async (req, res) => {
      const id = parseInt(req.params.id);
      const todo = req.body;
      const result = await this.todoService.update(id, todo);

      if (result instanceof Error) {
        res.status(404).send();
        return;
      }

      res.status(200).json(result);
    });

    this.router.delete("/todos/:id", async (req, res) => {
      const id = parseInt(req.params.id);
      const result = await this.todoService.delete(id);

      if (result instanceof Error) {
        res.status(500).send();
        return;
      }

      res.status(204).json(result);
    });
  }
}
