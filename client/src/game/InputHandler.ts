type ClickHandler = (x: number, y: number, isDragStart?: boolean) => void;
type KeyHandler = () => void;

export class InputHandler {
  private canvas: HTMLCanvasElement;
  private clickHandlers: ClickHandler[] = [];
  private dragHandlers: ClickHandler[] = [];
  private moveHandlers: ClickHandler[] = [];
  private keyHandlers: Map<string, KeyHandler[]> = new Map();
  private isMouseDown = false;
  
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.setupListeners();
  }
  
  private setupListeners() {
    // Mouse click
    this.canvas.addEventListener('mousedown', (e) => {
      this.isMouseDown = true;
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      this.clickHandlers.forEach(handler => handler(x, y));
    });
    
    // Mouse up
    this.canvas.addEventListener('mouseup', (e) => {
      this.isMouseDown = false;
      
      // Get mouse coordinates
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Notify click handlers about drag end
      this.clickHandlers.forEach(handler => handler(x, y, false));
    });
    
    // Mouse leave
    this.canvas.addEventListener('mouseleave', () => {
      this.isMouseDown = false;
    });
    
    // Mouse move
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Call move handlers
      this.moveHandlers.forEach(handler => handler(x, y));
      
      // If mouse is down, also call drag handlers
      if (this.isMouseDown) {
        this.dragHandlers.forEach(handler => handler(x, y));
      }
    });
    
    // Keyboard
    this.canvas.addEventListener('keydown', (e) => {
      // Prevent default actions for game keys
      if (['q', 'w', 'e', ' ', '1', '2', '3', '4', '5', 'm'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
      
      // Handle number keys 1-5 for mode switching
      if (['1', '2', '3', '4', '5'].includes(e.key)) {
        console.log(`Mode switch to: ${e.key}`);
        // Will call handlers if registered
      }
      
      // Handle m key for mode panel toggle
      if (e.key.toLowerCase() === 'm') {
        console.log('Mode panel toggle');
        // Will call handlers if registered
      }
      
      const handlers = this.keyHandlers.get(e.key.toLowerCase());
      if (handlers) {
        handlers.forEach(handler => handler());
      }
    });
    
    // Make sure canvas can receive keyboard events
    this.canvas.tabIndex = 0;
  }
  
  onClick(handler: ClickHandler) {
    this.clickHandlers.push(handler);
  }
  
  onDrag(handler: ClickHandler) {
    this.dragHandlers.push(handler);
  }
  
  onMove(handler: ClickHandler) {
    this.moveHandlers.push(handler);
  }
  
  onKeyPress(key: string, handler: KeyHandler) {
    const keyLower = key.toLowerCase();
    if (!this.keyHandlers.has(keyLower)) {
      this.keyHandlers.set(keyLower, []);
    }
    this.keyHandlers.get(keyLower)?.push(handler);
  }
  
  destroy() {
    // Clear all handlers
    this.clickHandlers = [];
    this.dragHandlers = [];
    this.moveHandlers = [];
    this.keyHandlers.clear();
  }
}
