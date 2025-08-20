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
      strokeColor: string;
      backgroundColor: string;
      fillStyle: "hachure" | "cross" | "solid" | null;
      strokeWidth: number;
      strokeStyle: "solid" | "dashed" | "dotted" | null;
    }
  | {
      id: number;
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
      selected: boolean;
      strokeColor: string;
      backgroundColor: string;
      fillStyle: "hachure" | "cross" | "solid" | null;
      strokeWidth: number;
      strokeStyle: "solid" | "dashed" | "dotted" | null;
    }
  | {
      id: number;
      type: "pencil";
      points: { x: number; y: number }[];
      selected: boolean;
      strokeColor: string;
      strokeWidth: number;
      strokeStyle: "solid" | "dashed" | "dotted" | null;
    };

export type Tool = "circle" | "rect" | "pencil" | "eraser" | "select";
type FilledShape = Shape & {
  fillStyle: "hachure" | "cross" | "solid" | null;
  backgroundColor: string;
};

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
  private strokeColor: string;
  private backgroundColor: string;
  private fillStyle: "hachure" | "cross" | "solid" | null;
  private strokeWidth: number;
  private strokeStyle: "solid" | "dashed" | "dotted" | null;
  socket: WebSocket;
  private cameraX = 0; // pixel offset for panning
  private cameraY = 0;
  private isPanningCamera = false;
  private panStartScreen = { x: 0, y: 0 };
  private lastCamera = { x: 0, y: 0 };

  private wheelHandler = (e: WheelEvent) => {
    if (e.ctrlKey || e.metaKey) return;
    e.preventDefault(); 

    this.cameraX -= e.deltaX;
    this.cameraY -= e.deltaY;
    this.clearCanvas();
  };

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.existingShapes = [];
    this.roomId = roomId;
    this.clicked = false;
    this.isDraggedShape = false;
    this.selectedShape = null;
    this.strokeColor = "#e4e4e4";
    this.backgroundColor = "url(/transparent.png)";
    this.fillStyle = "hachure";
    this.strokeWidth = 1.25;
    this.strokeStyle = "solid";
    this.socket = socket;
    this.init();
    this.initHandlers();
    this.initMouseHandlers();
  }

  destroy() {
    this.canvas.removeEventListener("mousedown", this.mouseDownHandler);

    this.canvas.removeEventListener("mouseup", this.mouseUpHandler);

    this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
    this.canvas.removeEventListener("wheel", this.wheelHandler);
  }

  setTool(tool: Tool) {
    this.selectedTool = tool;
  }

  setDrawingStyles(styles: {
    strokeColor: string;
    backgroundColor: string;
    fillStyle: "hachure" | "cross" | "solid" | null;
    strokeWidth: "thin" | "medium" | "thick" | null;
    strokeStyle: "solid" | "dashed" | "dotted" | null;
  }) {
    this.strokeColor = styles.strokeColor;
    this.backgroundColor = styles.backgroundColor;
    this.fillStyle = styles.fillStyle;
    const widths = { thin: 1.25, medium: 2.5, thick: 3.75 };
    this.strokeWidth = styles.strokeWidth ? widths[styles.strokeWidth] : 1.25;
    this.strokeStyle = styles.strokeStyle;
  }

  async init() {
    try {
      const shapes = await getExistingShapes(this.roomId);
      this.existingShapes = shapes.map((shape) => ({
        ...shape,
        selected: false,
        strokeColor: shape.strokeColor || this.strokeColor,
        backgroundColor:
          shape.type !== "pencil"
            ? shape.backgroundColor || this.backgroundColor
            : undefined,
        fillStyle:
          shape.type !== "pencil"
            ? shape.fillStyle || this.fillStyle
            : undefined,
        strokeWidth: shape.strokeWidth || this.strokeWidth,
        strokeStyle: shape.strokeStyle || this.strokeStyle,
      })) as Shape[];
      this.clearCanvas();
    } catch (error) {
      console.error("Failed to fetch shapes:", error);
      this.existingShapes = [];
      this.clearCanvas();
    }
  }

  initHandlers() {
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("Received message:", JSON.stringify(message));
      if (message.type == "chat") {
        const shape = {
          ...message.shape,
          selected: false,
          strokeColor: message.shape.strokeColor || this.strokeColor,
          backgroundColor:
            message.shape.type !== "pencil"
              ? message.shape.backgroundColor || this.backgroundColor
              : undefined,
          fillStyle:
            message.shape.type !== "pencil"
              ? message.shape.fillStyle || this.fillStyle
              : undefined,
          strokeWidth: message.shape.strokeWidth || this.strokeWidth,
          strokeStyle: message.shape.strokeStyle || this.strokeStyle,
        };
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

    this.canvas.addEventListener("wheel", this.wheelHandler as any, {
      passive: false,
    });
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

  private screenToWorld(screenX: number, screenY: number) {
    return {
      x: screenX - this.cameraX,
      y: screenY - this.cameraY,
    };
  }

  mouseDownHandler = (e: MouseEvent) => {
    if (e.button === 1) {
      this.isPanningCamera = true;
      this.panStartScreen = { x: e.clientX, y: e.clientY };
      this.lastCamera = { x: this.cameraX, y: this.cameraY };
      this.canvas.style.cursor = "grabbing";
      return;
    }

    this.clicked = true;
    const world = this.screenToWorld(e.offsetX, e.offsetY);
    this.startX = world.x;
    this.startY = world.y;
    this.currentPath = [{ x: world.x, y: world.y }];

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
    if (this.isPanningCamera) {
      this.isPanningCamera = false;
      this.canvas.style.cursor = "";
      return;
    }

    this.clicked = false;

    if (this.selectedTool === "select") {
      this.isDraggedShape = false;
      return;
    }
    const world = this.screenToWorld(e.offsetX, e.offsetY);
    const width = world.x - this.startX;
    const height = world.y - this.startY;
    const selectedTool = this.selectedTool;
    let shape: Shape | null = null;
    if (selectedTool === "rect") {
      shape = {
        type: "rect",
        x: this.startX,
        y: this.startY,
        height,
        width,
        selected: false,
        strokeColor: this.strokeColor,
        backgroundColor: this.backgroundColor,
        fillStyle: this.fillStyle,
        strokeWidth: this.strokeWidth,
        strokeStyle: this.strokeStyle,
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
        selected: false,
        strokeColor: this.strokeColor,
        backgroundColor: this.backgroundColor,
        fillStyle: this.fillStyle,
        strokeWidth: this.strokeWidth,
        strokeStyle: this.strokeStyle,
      };
      // this.existingShapes.push(shape);
    } else if (selectedTool === "pencil") {
      shape = {
        type: "pencil",
        points: this.currentPath,
        selected: false,
        strokeColor: this.strokeColor,
        strokeWidth: this.strokeWidth,
        strokeStyle: this.strokeStyle,
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
    if (this.isPanningCamera) {
      const dx = e.clientX - this.panStartScreen.x;
      const dy = e.clientY - this.panStartScreen.y;
      this.cameraX = this.lastCamera.x + dx;
      this.cameraY = this.lastCamera.y + dy;
      this.clearCanvas();
      return;
    }

    const world = this.screenToWorld(e.offsetX, e.offsetY);
    const mouseX = world.x;
    const mouseY = world.y;

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

      this.ctx.save();
      this.ctx.translate(this.cameraX, this.cameraY);

      this.ctx.strokeStyle = this.strokeColor;
      this.ctx.lineWidth = this.strokeWidth;
      if (this.strokeStyle === "dashed") {
        this.ctx.setLineDash([5, 5]);
      } else if (this.strokeStyle === "dotted") {
        this.ctx.setLineDash([2, 5]);
      } else {
        this.ctx.setLineDash([]);
      }
      const selectedTool = this.selectedTool;
      if (selectedTool === "rect") {
        if (
          this.fillStyle &&
          this.backgroundColor !== "url(/transparent.png)"
        ) {
          this.applyFill({
            type: "rect",
            fillStyle: this.fillStyle,
            backgroundColor: this.backgroundColor,
          } as FilledShape);
          this.ctx.fillRect(this.startX, this.startY, width, height);
        }
        this.ctx.strokeRect(this.startX, this.startY, width, height);
      } else if (selectedTool === "circle") {
        const centerX = this.startX + width / 2;
        const centerY = this.startY + height / 2;
        const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        if (
          this.fillStyle &&
          this.backgroundColor !== "url(/transparent.png)"
        ) {
          this.applyFill({
            type: "circle",
            fillStyle: this.fillStyle,
            backgroundColor: this.backgroundColor,
          } as FilledShape);
          this.ctx.fill();
        }
        this.ctx.stroke();
        this.ctx.closePath();
      } else if (selectedTool === "pencil") {
        this.currentPath.push({ x: mouseX, y: mouseY });

        this.ctx.beginPath();
        if (this.currentPath.length > 0) {
          this.ctx.moveTo(this.currentPath[0].x, this.currentPath[0].y);
          for (let i = 1; i < this.currentPath.length; i++) {
            const point = this.currentPath[i];
            this.ctx.lineTo(point.x, point.y);
          }
          this.ctx.stroke();
          this.ctx.closePath();
        }
      }
      this.ctx.restore();
    }
  };

  initMouseHandlers() {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);

    this.canvas.addEventListener("mouseup", this.mouseUpHandler);

    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
  }

  private applyFill(shape: FilledShape) {
    this.ctx.fillStyle = shape.backgroundColor;
    if (shape.fillStyle === "hachure") {
      this.ctx.fillStyle = this.createHachurePattern(shape.backgroundColor);
    } else if (shape.fillStyle === "cross") {
      this.ctx.fillStyle = this.createCrossHatchPattern(shape.backgroundColor);
    }
  }

  private createHachurePattern(color: string): CanvasPattern {
    const patternCanvas = document.createElement("canvas");
    patternCanvas.width = 8;
    patternCanvas.height = 8;
    const pctx = patternCanvas.getContext("2d")!;
    pctx.strokeStyle = color;
    pctx.lineWidth = 1;
    pctx.beginPath();
    pctx.moveTo(0, 8);
    pctx.lineTo(8, 0);
    pctx.stroke();
    return this.ctx.createPattern(patternCanvas, "repeat")!;
  }

  private createCrossHatchPattern(color: string): CanvasPattern {
    const patternCanvas = document.createElement("canvas");
    patternCanvas.width = 8;
    patternCanvas.height = 8;
    const pctx = patternCanvas.getContext("2d")!;
    pctx.strokeStyle = color;
    pctx.lineWidth = 1;
    pctx.beginPath();
    pctx.moveTo(0, 8);
    pctx.lineTo(8, 0);
    pctx.moveTo(0, 0);
    pctx.lineTo(8, 8);
    pctx.stroke();
    return this.ctx.createPattern(patternCanvas, "repeat")!;
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "#121212";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    // console.log(JSON.stringify(this.existingShapes) + "existing shapes arr");
    this.ctx.save();
    this.ctx.translate(this.cameraX, this.cameraY);

    this.existingShapes.forEach((shape) => {
      if (!shape) return;

      this.ctx.strokeStyle = shape.strokeColor;
      this.ctx.lineWidth = shape.strokeWidth;
      if (shape.strokeStyle === "dashed") {
        this.ctx.setLineDash([5, 5]);
      } else if (shape.strokeStyle === "dotted") {
        this.ctx.setLineDash([2, 5]);
      } else {
        this.ctx.setLineDash([]);
      }

      if (shape.type === "rect") {
        if (
          shape.fillStyle &&
          shape.backgroundColor !== "url(/transparent.png)"
        ) {
          this.applyFill(shape as FilledShape);
          this.ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
        }
        this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      } else if (shape.type === "circle") {
        const { centerX, centerY, radius } = shape;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        if (
          shape.fillStyle &&
          shape.backgroundColor !== "url(/transparent.png)"
        ) {
          this.applyFill(shape as FilledShape);
          this.ctx.fill();
        }
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
    this.ctx.restore();
  }
}
