/**
 * Pure simulation logic for Python functions, print parameters, input pipelines, and turtle geometry
 */

export interface TurtlePosition {
  x: number;
  y: number;
  angle: number; // degrees, 0 = facing right (east)
  isPenDown: boolean;
  penColor: string;
  penSize: number;
  fillColor: string;
  isFilling: boolean;
  bgColor?: string;
  currentFillPath: Array<{ x: number; y: number }>;
  history: Array<{
    type: 'line' | 'dot' | 'circle' | 'move' | 'polygon' | 'text';
    fromX: number;
    fromY: number;
    toX?: number;
    toY?: number;
    radius?: number;
    extent?: number;
    steps?: number;
    text?: string;
    align?: 'left' | 'center' | 'right';
    font?: string;
    color: string;
    size: number;
    fillColor?: string;
    points?: Array<{ x: number; y: number }>;
  }>;
}

/**
 * Simulates Python's print(*values, sep=' ', end='\n')
 */
export function simulatePrint(options: {
  values: string[];
  sep?: string;
  end?: string;
  repeatTimes?: number;
}): { renderedOutput: string; lineCount: number } {
  const sep = options.sep !== undefined ? options.sep : ' ';
  const end = options.end !== undefined ? options.end : '\n';
  const repeatTimes = Math.max(1, Math.min(options.repeatTimes || 1, 10));

  let combined = '';
  for (let i = 0; i < repeatTimes; i++) {
    const line = options.values.join(sep);
    combined += line + end;
  }

  const lines = combined.split('\n');
  return {
    renderedOutput: combined,
    lineCount: lines.length - (combined.endsWith('\n') ? 1 : 0),
  };
}

/**
 * Visual breakdown of: raw string -> .split() -> map(int, ...) -> list / unpacking
 */
export interface InputPipelineStep {
  stepIndex: number;
  title: string;
  description: string;
  data: any;
  dataType: string;
  isError?: boolean;
  errorMessage?: string;
}

export function simulateInputPipeline(rawInput: string): {
  steps: InputPipelineStep[];
  success: boolean;
  integers: number[];
  unpackedVars: { a?: number; b?: number; c?: number };
} {
  const trimmed = rawInput.trim();
  const step1: InputPipelineStep = {
    stepIndex: 1,
    title: '第一步：input() 捕获整行文本',
    description: '不论你输入的是数字还是文字，input() 拿到的全部都是字符串(str)！',
    data: rawInput,
    dataType: 'str (字符串)',
  };

  const tokens = trimmed ? trimmed.split(/\s+/) : [];
  const step2: InputPipelineStep = {
    stepIndex: 2,
    title: '第二步：.split() 按空格切成小碎块',
    description: '将长字符串拆分为字符串列表，每个数字外面依然带着引号！',
    data: tokens,
    dataType: 'list[str] (字符串列表)',
  };

  const integers: number[] = [];
  let errorFound: string | null = null;

  for (const token of tokens) {
    const num = Number(token);
    if (isNaN(num) || token === '') {
      errorFound = `ValueError: 无效的字面值 '${token}'，无法转成整数 int！`;
      break;
    } else {
      integers.push(Math.trunc(num));
    }
  }

  const step3: InputPipelineStep = {
    stepIndex: 3,
    title: '第三步：map(int, ...) 每个元素脱去引号转为整数',
    description: errorFound 
      ? '❌ 发生类型转换错误！考级做题切记输入内容必须全是纯整数'
      : '每一个字符串都被调用了一次 int()，变成了真正的数学数字！',
    data: errorFound ? null : integers,
    dataType: errorFound ? 'ValueError 报错' : 'map object -> [int, int, ...]',
    isError: !!errorFound,
    errorMessage: errorFound || undefined,
  };

  const step4: InputPipelineStep = {
    stepIndex: 4,
    title: '第四步：打包为列表或多变量独立解包赋值',
    description: integers.length >= 2
      ? `解包赋值成功！各变量独立存放：a = ${integers[0]}, b = ${integers[1]}${integers[2] !== undefined ? `, c = ${integers[2]}` : ''}（注意：这是独立变量，并非字典）`
      : `转为整数列表：nums = [${integers.join(', ')}]`,
    data: integers.length >= 2
      ? { a: integers[0], b: integers[1], ...(integers[2] !== undefined ? { c: integers[2] } : {}) }
      : integers,
    dataType: integers.length >= 2 ? '多变量独立解包 (Unpacking，非字典)' : 'list[int]',
    isError: !!errorFound,
  };

  return {
    steps: [step1, step2, step3, step4],
    success: !errorFound,
    integers,
    unpackedVars: {
      a: integers[0],
      b: integers[1],
      c: integers[2],
    },
  };
}

/**
 * Simulates Python range(start, stop, step)
 * Key GESP Pitfall: [start, stop) - stop is NEVER included!
 */
export function simulateRange(start: number, stop?: number, step: number = 1): {
  result: number[];
  actualStart: number;
  actualStop: number;
  actualStep: number;
  isStopIncluded: boolean;
  length: number;
} {
  let s = 0;
  let e = 0;
  let st = step === 0 ? 1 : step;

  if (stop === undefined) {
    s = 0;
    e = start;
  } else {
    s = start;
    e = stop;
  }

  const arr: number[] = [];
  if (st > 0) {
    for (let i = s; i < e; i += st) {
      arr.push(i);
      if (arr.length > 500) break;
    }
  } else {
    for (let i = s; i > e; i += st) {
      arr.push(i);
      if (arr.length > 500) break;
    }
  }

  return {
    result: arr,
    actualStart: s,
    actualStop: e,
    actualStep: st,
    isStopIncluded: arr.includes(e),
    length: arr.length,
  };
}

/**
 * Parses color inputs: conventional string names ("red", "royalblue", "gold"),
 * 3D float RGB tuples (0.0 to 1.0) and 0-255 RGB integers
 */
export function parseColorInput(arg: any, arg2?: any, arg3?: any): string | null {
  if (typeof arg === 'number' && typeof arg2 === 'number' && typeof arg3 === 'number') {
    let r = arg;
    let g = arg2;
    let b = arg3;
    const isFloat = (r <= 1.0 && g <= 1.0 && b <= 1.0) && (r > 0 || g > 0 || b > 0 || String(arg).includes('.') || String(arg2).includes('.') || String(arg3).includes('.'));
    if (isFloat) {
      r = Math.round(Math.max(0, Math.min(1, r)) * 255);
      g = Math.round(Math.max(0, Math.min(1, g)) * 255);
      b = Math.round(Math.max(0, Math.min(1, b)) * 255);
    } else {
      r = Math.round(Math.max(0, Math.min(255, r)));
      g = Math.round(Math.max(0, Math.min(255, g)));
      b = Math.round(Math.max(0, Math.min(255, b)));
    }
    return `rgb(${r}, ${g}, ${b})`;
  }

  if (Array.isArray(arg) && arg.length >= 3) {
    return parseColorInput(arg[0], arg[1], arg[2]);
  }

  if (typeof arg === 'string') {
    const s = arg.trim();
    if (s.startsWith('(') && s.endsWith(')')) {
      const parts = s.slice(1, -1).split(',').map((n) => Number(n.trim()));
      if (parts.length === 3 && parts.every((n) => !isNaN(n))) {
        return parseColorInput(parts[0], parts[1], parts[2]);
      }
    }
    return s;
  }

  return null;
}

/**
 * Turtle geometry coordinate update with support for:
 * fd, bk, rt, lt, circle(radius, extent, steps), write, bgcolor, goto,
 * begin_fill, end_fill, fillcolor, pencolor, pensize, pu, pd, home, clear, reset
 */
export function applyTurtleCommand(
  pos: TurtlePosition,
  command: string,
  arg?: any,
  arg2?: any,
  arg3?: any,
  arg4?: any
): TurtlePosition {
  const next: TurtlePosition = {
    ...pos,
    currentFillPath: [...pos.currentFillPath],
    history: [...pos.history],
  };

  const rad = (next.angle * Math.PI) / 180;

  switch (command) {
    case 'forward':
    case 'fd': {
      const dist = typeof arg === 'number' ? arg : 50;
      const newX = next.x + dist * Math.cos(rad);
      const newY = next.y + dist * Math.sin(rad);
      if (next.isPenDown) {
        next.history.push({
          type: 'line',
          fromX: next.x,
          fromY: next.y,
          toX: newX,
          toY: newY,
          color: next.penColor,
          size: next.penSize,
        });
      }
      next.x = newX;
      next.y = newY;
      if (next.isFilling) {
        next.currentFillPath.push({ x: newX, y: newY });
      }
      break;
    }
    case 'backward':
    case 'bk': {
      const dist = typeof arg === 'number' ? arg : 50;
      const newX = next.x - dist * Math.cos(rad);
      const newY = next.y - dist * Math.sin(rad);
      if (next.isPenDown) {
        next.history.push({
          type: 'line',
          fromX: next.x,
          fromY: next.y,
          toX: newX,
          toY: newY,
          color: next.penColor,
          size: next.penSize,
        });
      }
      next.x = newX;
      next.y = newY;
      if (next.isFilling) {
        next.currentFillPath.push({ x: newX, y: newY });
      }
      break;
    }
    case 'goto': {
      let targetX = 0;
      let targetY = 0;
      if (typeof arg === 'number' && typeof arg2 === 'number') {
        targetX = arg;
        targetY = arg2;
      } else if (Array.isArray(arg)) {
        targetX = Number(arg[0]) || 0;
        targetY = Number(arg[1]) || 0;
      } else if (typeof arg === 'number') {
        targetX = arg;
        targetY = typeof arg2 === 'number' ? arg2 : 0;
      }
      if (next.isPenDown) {
        next.history.push({
          type: 'line',
          fromX: next.x,
          fromY: next.y,
          toX: targetX,
          toY: targetY,
          color: next.penColor,
          size: next.penSize,
        });
      }
      next.x = targetX;
      next.y = targetY;
      if (next.isFilling) {
        next.currentFillPath.push({ x: targetX, y: targetY });
      }
      break;
    }
    case 'right':
    case 'rt': {
      const deg = typeof arg === 'number' ? arg : 90;
      next.angle = (next.angle - deg + 360000) % 360;
      break;
    }
    case 'left':
    case 'lt': {
      const deg = typeof arg === 'number' ? arg : 90;
      next.angle = (next.angle + deg) % 360;
      break;
    }
    case 'circle': {
      // Standard Python turtle.circle(radius, extent=None, steps=None)
      const radius = typeof arg === 'number' ? arg : 40;
      const extent = typeof arg2 === 'number' ? arg2 : 360;
      let steps = typeof arg3 === 'number' ? Math.round(arg3) : undefined;

      if (!steps || steps < 1) {
        const frac = Math.abs(extent) / 360;
        steps = Math.max(12, Math.round(frac * 36));
      }

      // Exact Python turtle.py polygon chord formula:
      // w = extent / steps; w2 = 0.5 * w; l = 2.0 * radius * sin(w2 * pi / 180)
      // When radius < 0: l = -l, w = -w, w2 = -w2
      let w = extent / steps;
      let w2 = 0.5 * w;
      let l = 2.0 * radius * Math.sin((w2 * Math.PI) / 180);

      if (radius < 0) {
        l = -l;
        w = -w;
        w2 = -w2;
      }

      // Initial tangential heading adjustment: left(w2)
      next.angle = (next.angle + w2) % 360;

      for (let i = 0; i < steps; i++) {
        const curRad = (next.angle * Math.PI) / 180;
        const nx = next.x + l * Math.cos(curRad);
        const ny = next.y + l * Math.sin(curRad);

        if (next.isPenDown) {
          next.history.push({
            type: 'line',
            fromX: next.x,
            fromY: next.y,
            toX: nx,
            toY: ny,
            color: next.penColor,
            size: next.penSize,
          });
        }
        next.x = nx;
        next.y = ny;
        if (next.isFilling) {
          next.currentFillPath.push({ x: nx, y: ny });
        }
        next.angle = (next.angle + w) % 360;
      }

      // Final tangential heading realignment: right(w2) -> angle = angle - w2
      next.angle = (next.angle - w2 + 360000) % 360;
      break;
    }
    case 'write': {
      // Python: write(arg, move=False, align="left", font=("Arial", 12, "normal"))
      const text = arg !== undefined ? String(arg) : '';
      const move = !!arg2;
      const align = (typeof arg3 === 'string' && ['left', 'center', 'right'].includes(arg3.toLowerCase()))
        ? (arg3.toLowerCase() as 'left' | 'center' | 'right')
        : 'left';
      
      let fontStr = '14px JetBrains Mono, sans-serif';
      if (Array.isArray(arg4) && arg4.length >= 2) {
        const fontName = arg4[0] || 'Arial';
        const fontSize = arg4[1] || 14;
        const fontStyle = arg4[2] || 'normal';
        fontStr = `${fontStyle} ${fontSize}px ${fontName}, sans-serif`;
      } else if (typeof arg4 === 'string') {
        fontStr = arg4;
      }

      next.history.push({
        type: 'text',
        fromX: next.x,
        fromY: next.y,
        text,
        align,
        font: fontStr,
        color: next.penColor,
        size: next.penSize,
      });

      if (move) {
        const approxAdvance = Math.max(10, text.length * 10);
        const curRad = (next.angle * Math.PI) / 180;
        next.x += approxAdvance * Math.cos(curRad);
        next.y += approxAdvance * Math.sin(curRad);
      }
      break;
    }
    case 'bgcolor':
    case 'background': {
      const parsed = parseColorInput(arg, arg2, arg3);
      if (parsed) next.bgColor = parsed;
      break;
    }
    case 'begin_fill': {
      next.isFilling = true;
      next.currentFillPath = [{ x: next.x, y: next.y }];
      break;
    }
    case 'end_fill': {
      if (next.isFilling && next.currentFillPath.length >= 3) {
        next.history.push({
          type: 'polygon',
          fromX: next.x,
          fromY: next.y,
          points: [...next.currentFillPath],
          fillColor: next.fillColor,
          color: next.penColor,
          size: next.penSize,
        });
      }
      next.isFilling = false;
      next.currentFillPath = [];
      break;
    }
    case 'fillcolor': {
      const parsed = parseColorInput(arg, arg2, arg3);
      if (parsed) next.fillColor = parsed;
      break;
    }
    case 'penup':
    case 'pu':
      next.isPenDown = false;
      break;
    case 'pendown':
    case 'pd':
      next.isPenDown = true;
      break;
    case 'pencolor': {
      const parsed = parseColorInput(arg, arg2, arg3);
      if (parsed) next.penColor = parsed;
      break;
    }
    case 'pensize':
    case 'width':
      if (typeof arg === 'number') next.penSize = Math.max(1, Math.min(arg, 50));
      break;
    case 'home':
      if (next.isPenDown) {
        next.history.push({
          type: 'line',
          fromX: next.x,
          fromY: next.y,
          toX: 0,
          toY: 0,
          color: next.penColor,
          size: next.penSize,
        });
      }
      next.x = 0;
      next.y = 0;
      next.angle = 0;
      if (next.isFilling) {
        next.currentFillPath.push({ x: 0, y: 0 });
      }
      break;
    case 'clear':
      next.history = [];
      next.currentFillPath = [];
      next.isFilling = false;
      break;
    case 'reset':
      return {
        x: 0,
        y: 0,
        angle: 0,
        isPenDown: true,
        penColor: '#2563eb',
        penSize: 3,
        fillColor: '#fbbf24',
        bgColor: undefined,
        isFilling: false,
        currentFillPath: [],
        history: [],
      };
  }

  return next;
}

/**
 * Parses Python turtle syntax expressions such as:
 * - goto(100, 50) or t.goto(100, 50)
 * - forward(80) or fd(80) or t.forward(80)
 * - circle(50, steps=6) or circle(50, 180, 4)
 * - write("Hello", align="center")
 * - bgcolor("black")
 * - begin_fill() / end_fill()
 * - fillcolor("yellow")
 * - pencolor("red")
 */
export function executePythonTurtleScript(
  current: TurtlePosition,
  scriptText: string
): TurtlePosition {
  let state = { ...current, history: [...current.history], currentFillPath: [...current.currentFillPath] };

  // Split lines
  const lines = scriptText.split('\n');

  for (let rawLine of lines) {
    let line = rawLine.trim();

    // Strip inline comments (# ...) first
    const commentIdx = line.indexOf('#');
    if (commentIdx >= 0) {
      line = line.slice(0, commentIdx).trim();
    }

    if (!line || line.startsWith('import ') || line.includes('turtle.Turtle()')) {
      continue;
    }

    // Handle semicolon separated statements on single line (e.g., fd(100); rt(90))
    const statements = line.split(';');

    for (let stmt of statements) {
      stmt = stmt.trim();
      if (!stmt) continue;

      // Strip leading "t." or "turtle."
      const cleanStmt = stmt.replace(/^(t|turtle)\./, '');

      // Match standard Python func call: funcName(args...)
      const match = cleanStmt.match(/^([a-zA-Z_]+)\s*\(([\s\S]*)\)$/);
      if (match) {
        const func = match[1].toLowerCase();
        let rawArgs = match[2].trim();

        // Check if wrapped in tuple like ((0.0, 0.6, 1.0))
        if (rawArgs.startsWith('(') && rawArgs.endsWith(')') && !rawArgs.slice(1, -1).includes('(')) {
          rawArgs = rawArgs.slice(1, -1).trim();
        }

        // Parse arguments: handle keyword arguments (e.g., steps=6, align="center")
        // Split by commas while respecting inner quotes/parentheses
        const parsedArgs: any[] = [];
        let curToken = '';
        let inQuotes = false;
        let quoteChar = '';
        let parenDepth = 0;

        for (let i = 0; i < rawArgs.length; i++) {
          const ch = rawArgs[i];
          if ((ch === '"' || ch === "'") && parenDepth === 0) {
            if (!inQuotes) {
              inQuotes = true;
              quoteChar = ch;
            } else if (quoteChar === ch) {
              inQuotes = false;
            }
            curToken += ch;
          } else if (ch === '(' && !inQuotes) {
            parenDepth++;
            curToken += ch;
          } else if (ch === ')' && !inQuotes) {
            parenDepth = Math.max(0, parenDepth - 1);
            curToken += ch;
          } else if (ch === ',' && !inQuotes && parenDepth === 0) {
            parsedArgs.push(curToken.trim());
            curToken = '';
          } else {
            curToken += ch;
          }
        }
        if (curToken.trim()) {
          parsedArgs.push(curToken.trim());
        }

        // Process keyword arguments and values
        const finalArgs: any[] = [];
        const kwargs: Record<string, any> = {};

        for (const argStr of parsedArgs) {
          // Check if kwarg like `steps=6` or `align="center"`
          const kwMatch = argStr.match(/^([a-zA-Z_]+)\s*=\s*([\s\S]+)$/);
          if (kwMatch) {
            const k = kwMatch[1].toLowerCase();
            let v: any = kwMatch[2].trim();
            if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
              v = v.slice(1, -1);
            } else if (v === 'True' || v === 'true') {
              v = true;
            } else if (v === 'False' || v === 'false') {
              v = false;
            } else if (!isNaN(Number(v))) {
              v = Number(v);
            }
            kwargs[k] = v;
          } else {
            let val: any = argStr;
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
              val = val.slice(1, -1);
            } else if (val === 'True' || val === 'true') {
              val = true;
            } else if (val === 'False' || val === 'false') {
              val = false;
            } else if (!isNaN(Number(val)) && val !== '') {
              val = Number(val);
            }
            finalArgs.push(val);
          }
        }

        if (func === 'goto') {
          state = applyTurtleCommand(state, 'goto', finalArgs[0], finalArgs[1]);
        } else if (['forward', 'fd'].includes(func)) {
          state = applyTurtleCommand(state, 'fd', finalArgs[0]);
        } else if (['backward', 'bk'].includes(func)) {
          state = applyTurtleCommand(state, 'bk', finalArgs[0]);
        } else if (['right', 'rt'].includes(func)) {
          state = applyTurtleCommand(state, 'rt', finalArgs[0]);
        } else if (['left', 'lt'].includes(func)) {
          state = applyTurtleCommand(state, 'lt', finalArgs[0]);
        } else if (func === 'circle') {
          const radius = finalArgs[0];
          const extent = kwargs.extent !== undefined ? kwargs.extent : (finalArgs.length >= 2 && kwargs.steps === undefined ? finalArgs[1] : 360);
          const steps = kwargs.steps !== undefined ? kwargs.steps : (finalArgs.length >= 3 ? finalArgs[2] : undefined);
          state = applyTurtleCommand(state, 'circle', radius, extent, steps);
        } else if (func === 'write') {
          const text = finalArgs[0];
          const move = kwargs.move !== undefined ? kwargs.move : finalArgs[1];
          const align = kwargs.align !== undefined ? kwargs.align : finalArgs[2];
          const font = kwargs.font !== undefined ? kwargs.font : finalArgs[3];
          state = applyTurtleCommand(state, 'write', text, move, align, font);
        } else if (['bgcolor', 'background'].includes(func)) {
          if (finalArgs.length >= 3) {
            state = applyTurtleCommand(state, 'bgcolor', finalArgs[0], finalArgs[1], finalArgs[2]);
          } else {
            state = applyTurtleCommand(state, 'bgcolor', finalArgs[0]);
          }
        } else if (func === 'begin_fill') {
          state = applyTurtleCommand(state, 'begin_fill');
        } else if (func === 'end_fill') {
          state = applyTurtleCommand(state, 'end_fill');
        } else if (func === 'fillcolor') {
          if (finalArgs.length >= 3) {
            state = applyTurtleCommand(state, 'fillcolor', finalArgs[0], finalArgs[1], finalArgs[2]);
          } else {
            state = applyTurtleCommand(state, 'fillcolor', finalArgs[0]);
          }
        } else if (func === 'pencolor') {
          if (finalArgs.length >= 3) {
            state = applyTurtleCommand(state, 'pencolor', finalArgs[0], finalArgs[1], finalArgs[2]);
          } else {
            state = applyTurtleCommand(state, 'pencolor', finalArgs[0]);
          }
        } else if (func === 'color') {
          if (finalArgs.length >= 3 && typeof finalArgs[0] === 'number') {
            state = applyTurtleCommand(state, 'pencolor', finalArgs[0], finalArgs[1], finalArgs[2]);
          } else if (finalArgs.length >= 2) {
            state = applyTurtleCommand(state, 'pencolor', finalArgs[0]);
            state = applyTurtleCommand(state, 'fillcolor', finalArgs[1]);
          } else if (finalArgs.length === 1) {
            state = applyTurtleCommand(state, 'pencolor', finalArgs[0]);
          }
        } else if (['pensize', 'width'].includes(func)) {
          const sz = kwargs.width !== undefined ? kwargs.width : finalArgs[0];
          state = applyTurtleCommand(state, 'pensize', sz);
        } else if (['penup', 'pu'].includes(func)) {
          state = applyTurtleCommand(state, 'pu');
        } else if (['pendown', 'pd'].includes(func)) {
          state = applyTurtleCommand(state, 'pd');
        } else if (func === 'home') {
          state = applyTurtleCommand(state, 'home');
        } else if (func === 'clear') {
          state = applyTurtleCommand(state, 'clear');
        } else if (func === 'reset') {
          state = applyTurtleCommand(state, 'reset');
        }
      }
    }
  }

  return state;
}
