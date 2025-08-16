import { getExistingShapes } from "./http";

type Shape =
  | {
      id: number;
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
      selected: boolean;
    }
  | {
      id: number;
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
      selected: boolean;
    }
  | {
      id: number;
      type: "pencil";
      points: { x: number; y: number }[];
      selected: boolean;
    };

export type Tool = "circle" | "rect" | "pencil" | "eraser" | "select";

export class Board {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private existingShapes: Shape[];
  private roomId: string;
  private clicked: boolean;
  private selectedShape: {
    x: number;
    y: number;
    w: number;
    h: number;
    color?: string;
  } | null;
  private isDraggedShape: boolean;
  private startX = 0;
  private startY = 0;
  private lastX = 0;
  private lastY = 0;
  private selectedTool: Tool = "circle";
  private currentPath: { x: number; y: number }[] = [];

  socket: WebSocket;

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.existingShapes = [];
    this.roomId = roomId;
    this.clicked = false;
    this.isDraggedShape = false;
    this.selectedShape = null;
    this.socket = socket;
    this.init();
    this.initHandlers();
    this.initMouseHandlers();
  }

  destroy() {
    this.canvas.removeEventListener("mousedown", this.mouseDownHandler);

    this.canvas.removeEventListener("mouseup", this.mouseUpHandler);

    this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
  }

  setTool(tool: Tool) {
    this.selectedTool = tool;
  }

  async init() {
    this.existingShapes = await getExistingShapes(this.roomId);
    this.clearCanvas();
  }

  initHandlers() {
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("Received message:", JSON.stringify(message));
      if (message.type == "chat") {
        const shape = message.shape; // Access shape directly
        this.existingShapes.push(shape);
        console.log("Added shape:", shape);
        this.clearCanvas();
      } else if (message.type === "delete") {
        this.existingShapes = this.existingShapes.filter(
          (s) => s.id !== message.shapeId
        );
        console.log("After delete, shapes:", this.existingShapes);
        this.clearCanvas();
      }
    };
  }

  private hitTest(shape: Shape, x: number, y: number): boolean {
    if (shape.type === "rect") {
      return (
        x >= shape.x &&
        x <= shape.x + shape.width &&
        y >= shape.y &&
        y <= shape.y + shape.height
      );
    }
    if (shape.type === "circle") {
      const dx = x - shape.centerX;
      const dy = y - shape.centerY;
      return Math.sqrt(dx * dx + dy * dy) <= shape.radius;
    }
    if (shape.type === "pencil") {
      return shape.points.some((p) => Math.hypot(x - p.x, y - p.y) <= 5);
    }
    return false;
  }

  mouseDownHandler = (e: MouseEvent) => {
    this.clicked = true;
    this.startX = e.offsetX;
    this.startY = e.offsetY;
    this.currentPath = [{ x: e.offsetX, y: e.offsetY }];

    if (this.selectedTool !== "select") {
      this.existingShapes.forEach((s) => (s.selected = false));
      this.selectedShape = null;
    }

    if (this.selectedTool === "eraser") {
      for (let i = this.existingShapes.length - 1; i >= 0; i--) {
        const shape = this.existingShapes[i];
        if (this.hitTest(shape, this.startX, this.startY)) {
          if (shape.id == null) {
            console.warn("Cannot delete shape without an ID:", shape);
            continue; 
          }
          // const shapeId = shape?.id;
          this.existingShapes.splice(i, 1);
          this.clearCanvas();
          this.socket.send(
            JSON.stringify({
              roomId: this.roomId,
              type: "delete",
              shapeId: shape.id,
            })
          );
          break;
        }
      }
      return;
    }

    if (this.selectedTool === "select") {
      for (let i = this.existingShapes.length - 1; i >= 0; i--) {
        const shape = this.existingShapes[i];
        if (this.hitTest(shape, this.startX, this.startY)) {
          this.existingShapes.forEach((s) => (s.selected = false));
          shape.selected = true;
          this.selectedShape = {
            x: this.startX,
            y: this.startY,
            w: shape?.type === "rect" ? shape.width : 0,
            h: shape?.type === "rect" ? shape.height : 0,
            color: "yellow",
          };
          this.isDraggedShape = true;
          this.lastX = this.startX;
          this.lastY = this.startY;
          this.clearCanvas();
          return;
        }
      }
      this.existingShapes.forEach((s) => (s.selected = false));
      this.selectedShape = null;
      this.clearCanvas();
      return;
    }
  };

  mouseUpHandler = (e: MouseEvent) => {
    this.clicked = false;

    if (this.selectedTool === "select") {
      this.isDraggedShape = false;
      return;
    }
    const width = e.offsetX - this.startX;
    const height = e.offsetY - this.startY;
    const selectedTool = this.selectedTool;
    let shape: Shape | null = null;
    if (selectedTool === "rect") {
      shape = {
        type: "rect",
        x: this.startX,
        y: this.startY,
        height,
        width,
        selected: true,
      };
      // this.existingShapes.push(shape);
    } else if (selectedTool === "circle") {
      const centerX = this.startX + width / 2;
      const centerY = this.startY + height / 2;
      const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;

      shape = {
        type: "circle",
        radius,
        centerX,
        centerY,
        selected: true,
      };
      // this.existingShapes.push(shape);
    } else if (selectedTool === "pencil") {
      shape = {
        type: "pencil",
        points: this.currentPath,
        selected: true,
      };
      // this.existingShapes.push(shape);
      this.currentPath = [];
    }

    if (!shape) {
      return;
    }

    this.socket.send(
      JSON.stringify({
        roomId: this.roomId,
        type: "chat",
        shape,
      })
    );
    this.clearCanvas();
  };

  mouseMoveHandler = (e: MouseEvent) => {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    if (
      this.selectedTool === "select" &&
      this.isDraggedShape &&
      this.selectedShape
    ) {
      const dx = mouseX - this.lastX;
      const dy = mouseY - this.lastY;

      const shape = this.existingShapes.find((s) => s.selected);
      if (shape) {
        if (shape.type === "rect") {
          shape.x += dx;
          shape.y += dy;
        } else if (shape.type === "circle") {
          shape.centerX += dx;
          shape.centerY += dy;
        } else if (shape.type === "pencil") {
          shape.points = shape.points.map((p) => ({
            x: p.x + dx,
            y: p.y + dy,
          }));
        }
      }

      this.lastX = mouseX;
      this.lastY = mouseY;
      this.clearCanvas();
      return;
    }

    if (this.clicked) {
      const width = e.offsetX - this.startX;
      const height = e.offsetY - this.startY;
      this.clearCanvas();
      this.ctx.strokeStyle = "rgba(255,255,255)";
      const selectedTool = this.selectedTool;
      if (selectedTool === "rect") {
        this.ctx.strokeRect(this.startX, this.startY, width, height);
      } else if (selectedTool === "circle") {
        const centerX = this.startX + width / 2;
        const centerY = this.startY + height / 2;
        const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.closePath();
      } else if (selectedTool === "pencil") {
        const x = e.offsetX;
        const y = e.offsetY;
        this.currentPath.push({ x, y });

        this.clearCanvas();

        this.ctx.beginPath();
        this.ctx.moveTo("this.currentPath[0].x, this.currentPath[0].y");
        for (let i = 1; i < this.currentPath.length; i++) {
          const point = this.currentPath[i];
          this.ctx.lineTo(point.x, point.y);
        }
        this.ctx.stroke();
        this.ctx.closePath();
      }
    }
  };

  initMouseHandlers() {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);

    this.canvas.addEventListener("mouseup", this.mouseUpHandler);

    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "#121212";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    console.log(JSON.stringify(this.existingShapes) + "existing shapes arr");
    this.existingShapes.forEach((shape) => {
      if (!shape) return;

      this.ctx.strokeStyle = "rgba(255,255,255)";
      if (shape.type === "rect") {
        this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      } else if (shape.type === "circle") {
        const { centerX, centerY, radius } = shape;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.closePath();
      } else if (shape.type === "pencil") {
        const points = shape.points;
        if (points.length < 2) return;
        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          this.ctx.lineTo(points[i].x, points[i].y);
        }
        this.ctx.stroke();
        this.ctx.closePath();
      }

      if (this.selectedTool === "select" && shape.selected) {
        this.ctx.strokeStyle = "#1E90FF";
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([5, 5]);

        let minX: number, minY: number, maxX: number, maxY: number;
        if (shape.type === "rect") {
          minX = shape.x;
          minY = shape.y;
          maxX = shape.x + shape.width;
          maxY = shape.y + shape.height;
        } else if (shape.type === "circle") {
          minX = shape.centerX - shape.radius;
          minY = shape.centerY - shape.radius;
          maxX = shape.centerX + shape.radius;
          maxY = shape.centerY + shape.radius;
        } else if (shape.type === "pencil") {
          if (shape.points.length === 0) return;
          minX = Math.min(...shape.points.map((p) => p.x));
          minY = Math.min(...shape.points.map((p) => p.y));
          maxX = Math.max(...shape.points.map((p) => p.x));
          maxY = Math.max(...shape.points.map((p) => p.y));
        } else {
          return;
        }

        const padding = 4;
        minX -= padding;
        minY -= padding;
        maxX += padding;
        maxY += padding;

        this.ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);
        this.ctx.setLineDash([]);
      }
    });
  }
}
