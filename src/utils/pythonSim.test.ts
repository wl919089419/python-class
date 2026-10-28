import test from 'node:test';
import assert from 'node:assert/strict';
import {
  simulatePrint,
  simulateInputPipeline,
  simulateRange,
  applyTurtleCommand,
  executePythonTurtleScript,
  TurtlePosition,
} from './pythonSim';

test('simulatePrint formats with custom sep and end', () => {
  const result1 = simulatePrint({
    values: ['苹果', '香蕉', '橘子'],
    sep: '---',
    end: '!',
  });
  assert.equal(result1.renderedOutput, '苹果---香蕉---橘子!');
});

test('simulateInputPipeline handles valid integer space-separated string', () => {
  const parsed = simulateInputPipeline('10 20 30');
  assert.equal(parsed.success, true);
  assert.deepEqual(parsed.integers, [10, 20, 30]);
});

test('simulateRange correctly enforces left-closed right-open [start, stop)', () => {
  const r1 = simulateRange(1, 5);
  assert.deepEqual(r1.result, [1, 2, 3, 4]);
  assert.equal(r1.isStopIncluded, false);
});

test('applyTurtleCommand moves and turns accurately', () => {
  const initial: TurtlePosition = {
    x: 0,
    y: 0,
    angle: 0,
    isPenDown: true,
    penColor: '#000000',
    penSize: 2,
    fillColor: '#ffff00',
    isFilling: false,
    currentFillPath: [],
    history: [],
  };

  const moved = applyTurtleCommand(initial, 'fd', 100);
  assert.equal(Math.round(moved.x), 100);

  const goTo = applyTurtleCommand(moved, 'goto', 50, -50);
  assert.equal(goTo.x, 50);
  assert.equal(goTo.y, -50);
});

test('executePythonTurtleScript parses standard Python syntax with goto and fill', () => {
  const initial: TurtlePosition = {
    x: 0,
    y: 0,
    angle: 0,
    isPenDown: true,
    penColor: '#2563eb',
    penSize: 3,
    fillColor: '#fbbf24',
    isFilling: false,
    currentFillPath: [],
    history: [],
  };

  const code = `
    t.goto(100, 50)
    t.fillcolor("gold")
    t.begin_fill()
    t.fd(60)
    t.rt(90)
    t.fd(60)
    t.end_fill()
  `;

  const result = executePythonTurtleScript(initial, code);
  assert.equal(result.x, 160);
  assert.equal(result.y, -10);
  assert.equal(result.fillColor, 'gold');
  assert.equal(result.history.some((h) => h.type === 'polygon'), true);
});

test('executePythonTurtleScript supports pensize thickness contrast and 3D float RGB pencolor', () => {
  const initial: TurtlePosition = {
    x: 0,
    y: 0,
    angle: 0,
    isPenDown: true,
    penColor: '#000000',
    penSize: 1,
    fillColor: '#ffffff',
    isFilling: false,
    currentFillPath: [],
    history: [],
  };

  // Test pensize change: 1px -> 6px -> 15px
  const pensizeScript = `
    t.pensize(1)
    t.fd(50)
    t.pensize(6)
    t.fd(50)
    t.pensize(15)
    t.fd(50)
  `;
  const sizeResult = executePythonTurtleScript(initial, pensizeScript);
  assert.equal(sizeResult.history.length, 3);
  assert.equal(sizeResult.history[0].size, 1);
  assert.equal(sizeResult.history[1].size, 6);
  assert.equal(sizeResult.history[2].size, 15);

  // Test pencolor conventional strings and 3D float RGB: (0.0, 0.6, 1.0)
  const colorScript = `
    t.pencolor("red")
    t.fd(50)
    t.pencolor(0.0, 0.6, 1.0)
    t.fd(50)
    t.pencolor((1.0, 0.8, 0.0))
    t.fd(50)
  `;
  const colorResult = executePythonTurtleScript(initial, colorScript);
  assert.equal(colorResult.history[0].color, 'red');
  assert.equal(colorResult.history[1].color, 'rgb(0, 153, 255)');
  assert.equal(colorResult.history[2].color, 'rgb(255, 204, 0)');
});

test('circle with steps parameter draws polygons and write/bgcolor works', () => {
  const initial: TurtlePosition = {
    x: 0,
    y: 0,
    angle: 0,
    isPenDown: true,
    penColor: '#000000',
    penSize: 2,
    fillColor: '#ffffff',
    isFilling: false,
    currentFillPath: [],
    history: [],
  };

  // Test hexagon: circle(60, steps=6)
  const hexScript = `
    t.circle(60, steps=6)  # 正六边形
  `;
  const hexResult = executePythonTurtleScript(initial, hexScript);
  assert.equal(hexResult.history.length, 6);
  // After drawing 360-degree regular polygon, turtle returns close to starting coordinate
  assert.ok(Math.abs(hexResult.x) < 2);
  assert.ok(Math.abs(hexResult.y) < 2);

  // Test write and bgcolor
  const script2 = `
    t.bgcolor("black")  # 设置黑色画布背景
    t.write("Hello PyKids", align="center")
  `;
  const res2 = executePythonTurtleScript(initial, script2);
  assert.equal(res2.bgColor, 'black');
  const textItem = res2.history.find((h) => h.type === 'text');
  assert.ok(textItem);
  assert.equal(textItem?.text, 'Hello PyKids');
  assert.equal(textItem?.align, 'center');
});

