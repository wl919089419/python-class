import { Category } from '../types';

export const CATEGORIES: Category[] = [
  // ==========================================
  // 阶段 1: 启蒙阶段 (Python Turtle 海龟绘图)
  // ==========================================
  {
    id: 'turtle-canvas-pen',
    title: '画布与画笔控制',
    stageId: 'turtle',
    icon: 'fa-solid fa-paintbrush',
    badge: '海龟控制',
    description: '设置小海龟的画笔粗细、颜色、爬行速度以及隐藏显示，搭建属于你的作画舞台。',
    items: [
      {
        id: 'turtle-import',
        name: 'import turtle',
        title: '导入海龟模块',
        stageId: 'turtle',
        categoryId: 'turtle-canvas-pen',
        level: '启蒙阶段',
        difficulty: '⭐',
        summary: '给 Python 发出召唤暗号，从工具箱里请出神奇的小海龟画家！',
        syntax: 'import turtle\nt = turtle.Turtle()',
        returnType: 'None (导入模块)',
        params: [],
        codeExample: `import turtle\n\n# 召唤一只名字叫 t 的小海龟\nt = turtle.Turtle()\nt.pencolor("dodgerblue")\nt.forward(100)`,
        expectedOutput: '屏幕弹出绘图窗口，小海龟带着蓝色画笔向前爬行 100 像素',
        interactiveType: 'turtle',
        pitfall: '千万不要把你的 Python 代码文件命名为 turtle.py！如果文件名叫 turtle.py，Python 在 import turtle 时就会导入你自己的空文件，从而报 AttributeError！',
        examTip: '启蒙与校内编程入门最常考的文件名避坑点。',
        tags: ['turtle', 'import', '海龟初始化'],
      },
      {
        id: 'turtle-pensize',
        name: 'pensize() / width()',
        title: '设置画笔粗细 (粗细对比)',
        stageId: 'turtle',
        categoryId: 'turtle-canvas-pen',
        level: '',
        difficulty: '⭐',
        summary: '调节小海龟手里画笔的粗细（像素）。对比测试：1px 细线 vs 6px 中等画笔 vs 15px 特粗毛笔，线条粗细一目了然！',
        syntax: 'turtle.pensize(width=1) 或 turtle.width(width=1)',
        returnType: 'None',
        params: [
          { name: 'width', type: 'int', required: true, desc: '画笔粗细像素值，默认为 1。数字越大，画出的线越粗！' },
        ],
        codeExample: `import turtle\nt = turtle.Turtle()\n\n# 粗细对比测试：1px 细线 -> 6px 中等线 -> 15px 特粗线\nt.pensize(1)\nt.forward(60)\n\nt.pensize(6)\nt.forward(60)\n\nt.pensize(15)\nt.forward(60)`,
        expectedOutput: '小海龟连续画出 3 段线条：第1段为 1px 细线，第2段为 6px 中等线条，第3段为 15px 超粗线条，粗细对比一目了然！',
        interactiveType: 'turtle',
        pitfall: '参数必须是正整数。如果写成负数或 0，画笔可能不显示或保持默认最细状态。',
        tags: ['pensize', 'width', '画笔粗细', '粗细对比'],
      },
      {
        id: 'turtle-pencolor',
        name: 'pencolor()',
        title: '设置画笔颜色 (常规颜色与3D浮点RGB)',
        stageId: 'turtle',
        categoryId: 'turtle-canvas-pen',
        level: '',
        difficulty: '⭐',
        summary: '给小海龟蘸上彩色颜料。支持两类常用模式：1. 常规英文颜色（如 "red", "royalblue", "gold"）；2. 三维浮点数 RGB 模式（R, G, B 各在 0.0 到 1.0 之间，例如 (0.0, 0.6, 1.0) 为亮天蓝，(1.0, 0.8, 0.0) 为亮金）。',
        syntax: 'turtle.pencolor("color_name") 或 turtle.pencolor(r, g, b)',
        returnType: 'None 或 返回当前颜色',
        params: [
          { name: 'color', type: 'str / (float, float, float)', required: true, desc: '常规英文颜色名如 "red", "royalblue", "gold" 或 3D 浮点三元组 (0.0~1.0)' },
        ],
        codeExample: `import turtle\nt = turtle.Turtle()\nt.pensize(8)\n\n# 方式一：常用英文常规颜色 ("red", "royalblue", "gold")\nt.pencolor("red")\nt.forward(60)\n\n# 方式二：Python 3D 浮点数 RGB 模式 (范围 0.0 ~ 1.0)\n# (0.0, 0.6, 1.0) 为亮天蓝，(1.0, 0.8, 0.0) 为亮金色\nt.pencolor(0.0, 0.6, 1.0)\nt.forward(60)\n\nt.pencolor(1.0, 0.8, 0.0)\nt.forward(60)`,
        expectedOutput: '小海龟依次画出 3 段 8px 粗的不同颜色线条：第1段鲜红("red")，第2段浮点数RGB亮天蓝(0.0, 0.6, 1.0)，第3段浮点数RGB金色(1.0, 0.8, 0.0)！',
        interactiveType: 'turtle',
        pitfall: '【考题常客】英文颜色名必须加引号如 "red"，如果不写引号会报 NameError；而三维浮点数 RGB 模式传入 0.0~1.0 的小数（不带引号），如 pencolor(0.0, 0.6, 1.0)。',
        tags: ['pencolor', '常规颜色', '3D浮点RGB', '色板测试'],
      },
      {
        id: 'turtle-speed',
        name: 'speed()',
        title: '设置爬行速度',
        stageId: 'turtle',
        categoryId: 'turtle-canvas-pen',
        level: '启蒙阶段',
        difficulty: '⭐',
        summary: '给小海龟喂能量棒，调节作画动作的快慢，数字 0 代表极速瞬间画完！',
        syntax: 'turtle.speed(speed_val)',
        returnType: 'None',
        params: [
          { name: 'speed_val', type: 'int (0-10)', required: true, desc: '1 为最慢，10 为极快，0 为瞬间无动画完成' },
        ],
        codeExample: `import turtle\nt = turtle.Turtle()\n\nt.speed(0) # 开启极速瞬移模式！`,
        expectedOutput: '小海龟作画速度提升至最快',
        interactiveType: 'turtle',
        pitfall: '【考题常客】0 不是“静止不动”，而是“最快瞬间画完”！1 才是最慢的速度！',
        examTip: '选择题高频选项辨析：速度 0 代表瞬间完成无需等待。',
        tags: ['speed', '速度', '瞬移'],
      },
      {
        id: 'turtle-hideturtle',
        name: 'hideturtle() / ht()',
        title: '隐藏海龟箭头',
        stageId: 'turtle',
        categoryId: 'turtle-canvas-pen',
        level: '启蒙阶段',
        difficulty: '⭐',
        summary: '给小海龟穿上隐身斗篷，画画时不挡住精美的艺术作品！',
        syntax: 'turtle.hideturtle() 或 turtle.ht()',
        returnType: 'None',
        params: [],
        codeExample: `import turtle\nt = turtle.Turtle()\n\nt.circle(50)\nt.hideturtle() # 画完藏起小海龟`,
        expectedOutput: '绘制一个圆，最后把代表海龟的箭头隐藏',
        interactiveType: 'turtle',
        pitfall: '隐藏海龟并不会停止作画，之后继续调用 forward() 依然会在画布上画出线条，只是看不到那只箭头。',
        tags: ['hideturtle', 'ht', '隐身'],
      },
      {
        id: 'turtle-bgcolor',
        name: 'bgcolor()',
        title: '设置画布背景颜色',
        stageId: 'turtle',
        categoryId: 'turtle-canvas-pen',
        level: '',
        difficulty: '⭐',
        summary: '给整个绘图舞台铺上漂亮的底色壁纸，例如黑色星空 "black" 或深蓝夜幕！',
        syntax: 'turtle.bgcolor("color_name") 或 turtle.bgcolor(r, g, b)',
        returnType: 'None 或 返回当前背景色',
        params: [
          { name: 'color', type: 'str / (float, float, float)', required: true, desc: '颜色英文名如 "black", "navy" 或 3D 浮点 RGB' },
        ],
        codeExample: `import turtle\nt = turtle.Turtle()\n\n# 切换黑色星空背景\nt.bgcolor("black")\nt.pencolor("gold")\nt.pensize(3)\n\n# 在黑底上画出闪耀的金星\nt.circle(50, steps=5)`,
        expectedOutput: '画布背景切换为深邃黑色，小海龟带着金色画笔画出五边形',
        interactiveType: 'turtle',
        pitfall: 'bgcolor() 是针对整块画布窗口生效的，不需要每次绘制都重复调用。',
        tags: ['bgcolor', 'background', '背景色', '黑夜模式'],
      },
    ],
  },
  {
    id: 'turtle-motion',
    title: '运动与转向命令',
    stageId: 'turtle',
    icon: 'fa-solid fa-compass',
    badge: '方向与步数',
    description: '小海龟前进、后退、左转、右转、飞跃坐标与回原点，构成图形的骨架。',
    items: [
      {
        id: 'turtle-forward',
        name: 'forward(fd)',
        title: '向前前进',
        stageId: 'turtle',
        categoryId: 'turtle-motion',
        level: '启蒙阶段',
        difficulty: '⭐',
        summary: '命令小海龟沿着当前面朝的方向挺进指定步数（像素）。',
        syntax: 'turtle.forward(distance) 或 turtle.fd(distance)',
        returnType: 'None',
        params: [
          { name: 'distance', type: 'int / float', required: true, desc: '前进的像素距离，若为负数则代表反向' },
        ],
        codeExample: `import turtle\nt = turtle.Turtle()\n\nt.forward(100) # 前进 100 步\nt.fd(50)       # 简写，再走 50 步`,
        expectedOutput: '向前笔直前进 150 像素',
        interactiveType: 'turtle',
        pitfall: 'forward(fd) 永远是沿着海龟“当前朝向”走，不是屏幕绝对右边！每次转向后朝向都会改变。',
        tags: ['forward', 'fd', '前进'],
      },
      {
        id: 'turtle-backward',
        name: 'backward(bk)',
        title: '向后倒退',
        stageId: 'turtle',
        categoryId: 'turtle-motion',
        level: '启蒙阶段',
        difficulty: '⭐',
        summary: '小海龟屁股倒车，朝当前朝向的反方向倒退指定步数，朝向角度不会改变！',
        syntax: 'turtle.backward(distance) 或 turtle.bk(distance)',
        returnType: 'None',
        params: [
          { name: 'distance', type: 'int / float', required: true, desc: '倒退的距离' },
        ],
        codeExample: `import turtle\nt = turtle.Turtle()\nt.forward(100)\nt.backward(40) # 倒退 40 步`,
        expectedOutput: '向前 100 步，再沿着原路倒退 40 步',
        interactiveType: 'turtle',
        pitfall: 'backward() 只是倒车，小海龟的面部朝向 angle 并不会转 180 度！',
        tags: ['backward', 'bk', '倒退'],
      },
      {
        id: 'turtle-right-left',
        name: 'right(rt) / left(lt)',
        title: '顺时针与逆时针旋转',
        stageId: 'turtle',
        categoryId: 'turtle-motion',
        level: '启蒙阶段',
        difficulty: '⭐',
        summary: '像军训喊口令一样原地踏步转身：right 向右顺时针转，left 向左逆时针转！',
        syntax: 'turtle.right(angle) / turtle.left(angle)',
        returnType: 'None',
        params: [
          { name: 'angle', type: 'int / float', required: true, desc: '转动角度（0-360度）' },
        ],
        codeExample: `import turtle\nt = turtle.Turtle()\n\n# 画正方形：4 次前进 + 右转 90 度\nfor _ in range(4):\n    t.forward(100)\n    t.right(90)`,
        expectedOutput: '画出一个周长 400 像素的正方形',
        interactiveType: 'turtle',
        pitfall: '画正多边形时外角公式是 360 / n。比如画等边三角形，右转角度必须是 120 度（360/3），而不是内角 60 度！这是小学做几何题最易写错的坑！',
        examTip: '常考等边三角形外角转向 120°，五角星每次右转 144°。',
        tags: ['right', 'left', 'rt', 'lt', '转向', '外角'],
      },
      {
        id: 'turtle-goto-home',
        name: 'goto() & home()',
        title: '坐标瞬移与回家',
        stageId: 'turtle',
        categoryId: 'turtle-motion',
        level: '启蒙阶段',
        difficulty: '⭐',
        summary: '以屏幕中心 (0, 0) 为直角坐标系原点，goto(x, y) 瞬移至指定坐标点，home() 直奔温暖小窝 (0, 0)。',
        syntax: 'turtle.goto(x, y)\nturtle.home()',
        returnType: 'None',
        params: [
          { name: 'x', type: 'float', required: true, desc: '目标横坐标' },
          { name: 'y', type: 'float', required: true, desc: '目标纵坐标' },
        ],
        codeExample: `import turtle\nt = turtle.Turtle()\n\nt.penup()        # 抬笔，避免在瞬移路上划线\nt.goto(100, 100) # 飞到第一象限 (100, 100)\nt.pendown()      # 落笔\nt.circle(20)\nt.home()         # 飞回原点 (0, 0) 并面向正东方`,
        expectedOutput: '移动到右上角画小圆，再飞回中心原点',
        interactiveType: 'turtle',
        pitfall: '调用 home() 之后，小海龟不仅回到 (0, 0)，而且朝向会自动重置为正东方向（0 度）！',
        tags: ['goto', 'home', '坐标', '原点'],
      },
    ],
  },
  {
    id: 'turtle-shapes-fill',
    title: '图形与颜色填充',
    stageId: 'turtle',
    icon: 'fa-solid fa-shapes',
    badge: '画圆与涂色',
    description: '圆圈、实心圆点、多边形封口以及填充闭合色彩。',
    items: [
      {
        id: 'turtle-circle',
        name: 'circle()',
        title: '绘制圆形、圆弧与正多边形 (steps 参数)',
        stageId: 'turtle',
        categoryId: 'turtle-shapes-fill',
        level: '',
        difficulty: '⭐⭐',
        summary: '以海龟左侧距离为 radius 的点为圆心，逆时针画圆、画弧或通过 steps 参数直接画正多边形（如 steps=6 画正六边形，steps=3 画等边三角形）！',
        syntax: 'turtle.circle(radius, extent=None, steps=None)',
        returnType: 'None',
        params: [
          { name: 'radius', type: 'float', required: true, desc: '半径（正数圆心在左侧，负数圆心在右侧）' },
          { name: 'extent', type: 'float', required: false, defaultVal: '360', desc: '绘制角度，如 180 画半圆弧' },
          { name: 'steps', type: 'int', required: false, defaultVal: 'None', desc: '做内接正多边形的边数：steps=6 六边形，steps=3 三角形' },
        ],
        codeExample: `import turtle\nt = turtle.Turtle()\nt.pensize(3)\n\n# 1. 普通画圆\nt.circle(40)\n\n# 2. 神奇 steps 参数：steps=6 直接绘制正六边形！\nt.pencolor("purple")\nt.circle(60, steps=6)\n\n# 3. steps=3 直接绘制等边三角形！\nt.pencolor("crimson")\nt.circle(50, steps=3)`,
        expectedOutput: '小海龟先画一个圆形，接着利用 steps=6 精确画出正六边形，再画出等边三角形！',
        interactiveType: 'turtle',
        pitfall: '【考题核心】steps 参数控制多边形边数。如 circle(50, steps=6) 绘制正六边形；绘制圆弧时 extent 默认是 360 度，写 180 就是半圆。',
        tags: ['circle', '圆', '圆弧', 'steps', '正多边形', '六边形'],
      },
      {
        id: 'turtle-write',
        name: 'write()',
        title: '在画布上书写文本印记',
        stageId: 'turtle',
        categoryId: 'turtle-shapes-fill',
        level: '',
        difficulty: '⭐',
        summary: '让小海龟化身书法家，在画布当前坐标点印上文字、题目说明或通关得分！',
        syntax: 'turtle.write(arg, move=False, align="left", font=("Arial", 14, "bold"))',
        returnType: 'None',
        params: [
          { name: 'arg', type: 'str / int', required: true, desc: '待书写的文字或数字，如 "Hello" 或 100' },
          { name: 'move', type: 'bool', required: false, defaultVal: 'False', desc: '是否跟随文字移动画笔' },
          { name: 'align', type: 'str', required: false, defaultVal: '"left"', desc: '文字对齐方式："left"、"center" 或 "right"' },
          { name: 'font', type: 'tuple', required: false, defaultVal: '("Arial", 14, "bold")', desc: '字体三元组 (字体名, 字号, 字形)' },
        ],
        codeExample: `import turtle\nt = turtle.Turtle()\n\nt.penup()\nt.goto(0, 30)\nt.pencolor("dodgerblue")\nt.write("Python GESP 100分！", align="center")\n\nt.goto(0, -20)\nt.pencolor("crimson")\nt.write("write() 文本印记演示", align="center")`,
        expectedOutput: '在画布中央分别印出蓝色粗体标题和红色印记文字',
        interactiveType: 'turtle',
        pitfall: 'align 参数必须是 "left", "center", "right" 之一；font 参数通常是一个元组如 ("Arial", 16, "bold")。',
        tags: ['write', '写字', '文字印记', 'font', 'align'],
      },
      {
        id: 'turtle-fill',
        name: 'begin_fill() & end_fill()',
        title: '图形色彩闭合填充',
        stageId: 'turtle',
        categoryId: 'turtle-shapes-fill',
        level: '启蒙阶段',
        difficulty: '⭐⭐',
        summary: '就像拿油画桶倒颜料：画图形前先喊“开始填充”，画完闭合图形后喊“结束填充”，内部就会染上灿烂颜色！',
        syntax: 'turtle.fillcolor(color)\nturtle.begin_fill()\n# 绘制图形...\nturtle.end_fill()',
        returnType: 'None',
        params: [],
        codeExample: `import turtle\nt = turtle.Turtle()\n\nt.fillcolor("gold")\nt.begin_fill() # 1. 开启填充记号\nfor _ in range(5):\n    t.forward(120)\n    t.right(144)\nt.end_fill()   # 2. 灌满金色颜料！`,
        expectedOutput: '绘制一个闪闪发光的金色实心五角星！',
        interactiveType: 'turtle',
        pitfall: 'begin_fill() 和 end_fill() 必须成对出现！中间围成的路径必须尽量闭合，否则填充效果可能破损拉花。',
        tags: ['begin_fill', 'end_fill', 'fillcolor', '涂色'],
      },
      {
        id: 'turtle-dot',
        name: 'dot()',
        title: '画实心圆点',
        stageId: 'turtle',
        categoryId: 'turtle-shapes-fill',
        level: '启蒙阶段',
        difficulty: '⭐',
        summary: '像盖印章一样，在当前海龟所在的位置盖一个圆溜溜的实心小圆点！',
        syntax: 'turtle.dot(size=None, color=None)',
        returnType: 'None',
        params: [
          { name: 'size', type: 'int', required: false, defaultVal: 'max(pensize+4, 2*pensize)', desc: '圆点直径' },
          { name: 'color', type: 'str', required: false, defaultVal: '当前笔色', desc: '圆点颜色' },
        ],
        codeExample: `import turtle\nt = turtle.Turtle()\n\nt.dot(30, "crimson") # 盖一个直径 30 的红点\nt.forward(50)\nt.dot(20, "navy")`,
        expectedOutput: '在原地留下红色大圆点，前进 50 步再留下一个深蓝圆点',
        interactiveType: 'turtle',
        pitfall: 'dot() 的参数是“直径”而不是半径！而 circle() 的参数是“半径”，考试填空容易混淆！',
        tags: ['dot', '实心圆点', '印章'],
      },
    ],
  },
  {
    id: 'turtle-state',
    title: '状态控制与清屏',
    stageId: 'turtle',
    icon: 'fa-solid fa-power-off',
    badge: '抬笔与收工',
    description: '抬笔不画线、落笔继续画、橡皮擦清屏与保持窗口。',
    items: [
      {
        id: 'turtle-pu-pd',
        name: 'penup(pu) / pendown(pd)',
        title: '抬笔与落笔',
        stageId: 'turtle',
        categoryId: 'turtle-state',
        level: '启蒙阶段',
        difficulty: '⭐',
        summary: '抬笔时小海龟就像会轻功一样凌空飞行，移动不留墨迹；落笔后重新开始画画。',
        syntax: 'turtle.penup() 或 turtle.pu()\nturtle.pendown() 或 turtle.pd()',
        returnType: 'None',
        params: [],
        codeExample: `import turtle\nt = turtle.Turtle()\n\nt.forward(50)\nt.penup()        # 抬起笔尖\nt.forward(50)    # 空白位移\nt.pendown()      # 再次落笔\nt.forward(50)`,
        expectedOutput: '画出一条断开的虚线效果（实线-空隙-实线）',
        interactiveType: 'turtle',
        pitfall: '如果瞬移 goto() 之前忘记 penup()，就会在画布上拖出一条丑陋的斜线！',
        tags: ['penup', 'pendown', 'pu', 'pd', '抬笔', '落笔'],
      },
      {
        id: 'turtle-clear-done',
        name: 'clear() / reset() / done()',
        title: '清屏橡皮擦与绘图结束',
        stageId: 'turtle',
        categoryId: 'turtle-state',
        level: '启蒙阶段',
        difficulty: '⭐',
        summary: 'clear() 擦除画布所有线条保留海龟位置；reset() 全部重置回初始状态；done() 阻止画完后窗口秒退！',
        syntax: 'turtle.clear()\nturtle.reset()\nturtle.done()',
        returnType: 'None',
        params: [],
        codeExample: `import turtle\nt = turtle.Turtle()\n\nt.circle(50)\n# turtle.clear() # 擦除线条\nturtle.done()    # 保持窗口常驻不闪退`,
        expectedOutput: '保持绘画窗口一直打开，直到用户手动点击关闭',
        interactiveType: 'turtle',
        pitfall: '很多孩子在本地跑 Python turtle 脚本时抱怨“画完窗口闪一下就消失了”，原因就是末尾忘记写 turtle.done()！',
        tags: ['clear', 'reset', 'done', '闪退', '清屏'],
      },
    ],
  },

  // ==========================================
  // 阶段 2: 入门阶段 (GESP 1-3级 ⭐重点打造)
  // ==========================================
  {
    id: 'gesp13-io-lab',
    title: '输入与输出专题 (做题丢分大王)',
    stageId: 'gesp13',
    icon: 'fa-solid fa-terminal',
    badge: '⭐ 核心必考',
    description: 'GESP 考级试卷 1-3 级每套题必出的核心考点：print() 的 sep 与 end 参数、input() 的字符串陷阱与一行多数字读取！',
    items: [
      {
        id: 'api-print-lab',
        name: 'print() 全参数实验室',
        title: 'print() 详解与 sep/end 交互实验室',
        stageId: 'gesp13',
        categoryId: 'gesp13-io-lab',
        level: 'GESP 1-2级必考',
        difficulty: '⭐⭐',
        summary: 'Python 的传声大喇叭！不仅能打印内容，还能用 sep 定制变量间的连接符，用 end 决定最后是换行还是空格！',
        syntax: 'print(*objects, sep=" ", end="\\n")',
        returnType: 'None',
        params: [
          { name: '*objects', type: 'any', required: true, desc: '需要输出的一个或多个变量、文字或表达式' },
          { name: 'sep', type: 'str', required: false, defaultVal: '" "', desc: '多个输出内容之间的分隔符，默认为单个空格' },
          { name: 'end', type: 'str', required: false, defaultVal: '"\\n"', desc: '末尾追加的字符，默认换行符 \\n，改成 " " 可实现不换行连续打印' },
        ],
        codeExample: `# 1. 默认情况：sep 为单个空格，end 为回车换行
print(1, 2, 3) # 输出: 1 2 3

# 2. 修改 sep：用星号连接
print("A", "B", "C", sep="***") # 输出: A***B***C

# 3. 循环中不换行输出 (做题极高频)：
for i in range(1, 4):
    print(i, end=" ") # 输出: 1 2 3 

# 4. f-string 格式化输出浮点数保留2位小数：
pi = 3.1415926
print(f"保留两位小数: {pi:.2f}") # 输出: 保留两位小数: 3.14`,
        expectedOutput: '1 2 3\nA***B***C\n1 2 3 \n保留两位小数: 3.14',
        interactiveType: 'print_lab',
        pitfall: '1. sep 只有在 print 里面传入多个逗号隔开的参数时才起作用！如果写 print("1 2 3", sep="*")，因为只有一个字符串整体，星号不会被插入！\n2. 打印九九乘法表或连续数字时，内层循环必须用 end=" "，内层结束后必须写一个空 print() 实现换行！',
        examTip: 'GESP 1级必考选择题：print(1, 2, 3, sep="#", end="!") 的输出结果是什么？（答案是 1#2#3!）',
        tags: ['print', 'sep', 'end', '换行', '格式化'],
      },
      {
        id: 'api-input-map',
        name: 'input() 与 map() 输入全解',
        title: 'input() 字符串避坑与 map() 输入流水线全解',
        stageId: 'gesp13',
        categoryId: 'gesp13-io-lab',
        level: 'GESP 1-3级必考',
        difficulty: '⭐⭐⭐',
        summary: '彻底搞懂从单数读取到一行多数字读取的全套逻辑！掌握 input() 的字符串引号陷阱与 int() 转换，以及 a, b = map(int, input().split()) 自动化传送带流水线机制与底层原理。',
        syntax: '# 1. 单数读取（必须用 int 脱去引号）\nx = int(input())\n\n# 2. 一行两到三个数字（解包赋值）\na, b = map(int, input().split())\n\n# 3. 一行未知数量数字（转为整数列表）\nnums = list(map(int, input().split()))',
        returnType: 'int / tuple / list[int]',
        params: [
          { name: 'input()', type: 'str', required: true, desc: '键盘输入一整行原始文本（注意：永远是自带双引号的字符串 str）' },
          { name: '.split()', type: 'list[str]', required: false, defaultVal: '按空格切分', desc: '把一行长字符串按空格拆碎成独立的子字符串列表' },
          { name: 'map(int, ...)', type: 'iterator', required: false, desc: '自动化加工传送带，让 int() 批量将列表中每个子字符串转化为整数' },
        ],
        codeExample: `# 1. 读入单数（千万不要加提示语如 input("请输入:")）
x = int(input())

# 2. 读入一行两个由空格隔开的整数（解包赋值）
a, b = map(int, input().split())
print("两数之和:", a + b)

# 3. 读入一行未知数量的整数（封装为列表）
nums = list(map(int, input().split()))
print("总个数:", len(nums), "最大值:", max(nums))`,
        expectedOutput: '两数之和: 30\n总个数: 5 最大值: 9',
        interactiveType: 'input_lab',
        pitfall: '1. 【考级致命扣分坑】：严禁写 input("请输入数字:")！在线评测机是自动文本比对，提示词会导致输出错位直接判 0 分！\n2. 不能写 int(input().split())！因为 int() 一次只能处理单个数字，吞不下一整箱列表，会报 TypeError！必须用 map 批量处理。\n3. map 生成的是迭代器对象，如果后续需要通过下标 nums[0] 访问或多次求值，必须用 list(...) 包裹转为真实列表！',
        examTip: 'GESP 1-3 级 100% 必考！选择题必考 "3"+"5"="35" 陷阱，编程题第 1 题必写 input() 或 a, b = map(int, input().split())。',
        tags: ['input', 'map', 'split', 'str', 'int', '类型转换', '多输入', '机考规范', '机考模板'],
      },
      {
        id: 'api-fstring-lab',
        name: 'f-string 格式化专题全解',
        title: 'Python 3.6+ 变量插值、对齐、补零与算式全能解析',
        stageId: 'gesp13',
        categoryId: 'gesp13-io-lab',
        level: 'GESP 2-3级必考',
        difficulty: '⭐⭐',
        summary: '在字符串前加一个字母 f，引号里的大花括号 {} 就会变成魔法变色龙！不仅能放变量、做加减乘除、保留指定小数，还能左对齐、居中、甚至时分秒自动补零（如 09:05:03）！',
        syntax: 'f"固定文字 {变量或算式:格式规范}"\n例: f"{val:.2f}", f"{h:02d}:{m:02d}", f"{text:*^12}"',
        returnType: 'str (格式化后的字符串)',
        params: [
          { name: '{expr}', type: 'expression', required: true, desc: '花括号内可放入变量、四则运算、函数调用或三元表达式' },
          { name: ':[fill][align][width]', type: 'format', required: false, desc: '< 左对齐，> 右对齐，^ 居中对齐，可指定填充字符' },
          { name: ':.Nf', type: 'float format', required: false, desc: '浮点数保留 N 位小数，如 .2f' },
          { name: ':0Nd', type: 'integer format', required: false, desc: '整数固定 N 位宽度不足补零，如 :02d' },
        ],
        codeExample: `# 1. 变量插值与直接运算
name = "小明"
score = 98
print(f"学员 {name} 本次得分为 {score}，超过及格线 {score - 60} 分！")

# 2. 居中对齐与星号填充 (制作成绩单与表头必备)
print(f"{' 优秀榜单 ':=^20}")

# 3. 时间与编号自动补零 (考级高频大题：时钟输出)
h, m, s = 8, 5, 2
print(f"标准时间: {h:02d}:{m:02d}:{s:02d}") # 输出: 08:05:02

# 4. 百分比与千分位
accuracy = 0.952
money = 1000000
print(f"准确率: {accuracy:.1%}") # 95.2%
print(f"奖金: {money:,} 元")      # 1,000,000 元`,
        expectedOutput: '学员 小明 本次得分为 98，超过及格线 38 分！\n====== 优秀榜单 ======\n标准时间: 08:05:02\n准确率: 95.2%\n奖金: 1,000,000 元',
        interactiveType: 'fstring_lab',
        pitfall: '1. 引号嵌套冲突：如果 f-string 外层用了双引号，花括号内部访问字典时必须用单引号，例如 f"{student[\'name\']}"，如果内层也写双引号会直接报 SyntaxError 语法错误！\n2. 字面打印花括号：如果真的想在 f-string 输出一个字符 "{" 或 "}"，必须写成双花括号 {{}}，如 f"字典: {{1: \'A\'}}"！',
        examTip: 'GESP 考级中格式化输出题目（如保留2位小数、时分秒补零 09:05:03）首选 f-string，比 % 格式化简洁百倍且不易出错。',
        tags: ['f-string', '格式化', '补零', '对齐', '保留小数', '千分位'],
      },
    ],
  },
  {
    id: 'gesp13-vars-types',
    title: '变量与基础数据类型',
    stageId: 'gesp13',
    icon: 'fa-solid fa-cube',
    badge: '数字与类型',
    description: '整数 int、浮点数 float、字符串 str、布尔值 bool 以及类型检测与互转。',
    items: [
      {
        id: 'api-int-float',
        name: 'int() & float()',
        title: '整数与浮点数转换',
        stageId: 'gesp13',
        categoryId: 'gesp13-vars-types',
        level: 'GESP 1级',
        difficulty: '⭐',
        summary: 'int() 将小数或纯数字字符串变成规整的整数（直接截断小数部分，不四舍五入！）；float() 则将整数变成带小数点的浮点数。',
        syntax: 'int(x, base=10)\nfloat(x)',
        returnType: 'int / float',
        params: [
          { name: 'x', type: 'int / float / str', required: true, desc: '被转换的数据对象' },
        ],
        codeExample: `print(int(3.99))   # 输出: 3 (直接砍掉小数！不是 4！)
print(int(-3.99))  # 输出: -3 (向零截断)
print(float(5))    # 输出: 5.0
print(int("123"))  # 输出: 123`,
        expectedOutput: '3\n-3\n5.0\n123',
        interactiveType: 'terminal',
        pitfall: '【特大陷阱】：int(3.99) 的结果是 3，而不是 4！int 转换是“向下取整/向零截断”，绝对不是四舍五入！想要四舍五入必须使用 round()！另外，int("3.14") 会直接报错 ValueError，必须先 float("3.14") 再 int()！',
        tags: ['int', 'float', '取整', '类型转换'],
      },
      {
        id: 'api-bool-type',
        name: 'bool() & type()',
        title: '布尔真假与类型侦探',
        stageId: 'gesp13',
        categoryId: 'gesp13-vars-types',
        level: 'GESP 1-2级',
        difficulty: '⭐',
        summary: 'type() 像显微镜一样看穿变量真实类型；bool() 判断是非：0、空字符串 ""、空列表 [] 都代表 False，其余全为 True！',
        syntax: 'type(obj)\nbool(x)',
        returnType: 'type / bool',
        params: [
          { name: 'x', type: 'any', required: true, desc: '需要判定真假或类型的对象' },
        ],
        codeExample: `print(type(42))      # <class 'int'>
print(type("42"))    # <class 'str'>
print(bool(0))       # False
print(bool(100))     # True
print(bool(""))      # False (空串为假)
print(bool("False")) # True！(注意：里面有字符就为真！)`,
        expectedOutput: "<class 'int'>\n<class 'str'>\nFalse\nTrue\nFalse\nTrue",
        interactiveType: 'terminal',
        pitfall: '【考题巨坑】：bool("False") 是 True！因为字符串 "False" 不是空字符串，只要引号里面有字符，布尔判定统统是 True！只有 bool("") 才是 False！',
        tags: ['bool', 'type', '真假判定', '零与非零'],
      },
    ],
  },
  {
    id: 'gesp13-operators-math',
    title: '运算符与数学函数',
    stageId: 'gesp13',
    icon: 'fa-solid fa-calculator',
    badge: '算术与运算',
    description: '+ - * / // % ** 运算符优先级，以及 abs(), max(), min(), round(), pow()。',
    items: [
      {
        id: 'api-arithmetic-ops',
        name: '+ - * / // % ** 运算符',
        title: '做题必备 7 大算术运算符',
        stageId: 'gesp13',
        categoryId: 'gesp13-operators-math',
        level: 'GESP 1级必考',
        difficulty: '⭐⭐',
        summary: '// 是地板除法（向下取整整除），% 是求余数（模运算），** 是乘方幂运算，/ 单斜杠除法永远得到浮点数 float！',
        syntax: 'a // b (整除)\na % b (模/余数)\na ** b (幂)',
        returnType: 'int 或 float',
        params: [
          { name: 'a, b', type: 'number', required: true, desc: '参与运算的操作数' },
        ],
        codeExample: `print(7 / 2)   # 3.5 (单斜杠除法必得浮点数)
print(7 // 2)  # 3 (双斜杠整除向下取整)
print(7 % 2)   # 1 (求余数：7 除以 2 余 1)
print(2 ** 3)  # 8 (2 的 3 次方)

# 做题巧用：提取个位数与砍掉个位数
n = 1234
last_digit = n % 10    # 4 (个位数)
without_last = n // 10 # 123 (砍掉个位)`,
        expectedOutput: '3.5\n3\n1\n8',
        interactiveType: 'terminal',
        pitfall: '1. 7 / 2 结果是 3.5，即使是 4 / 2 结果也是 2.0（浮点数），考级如果要求输出整数切记要用 // 或 int() 包裹！\n2. 负数整除陷阱：-7 // 2 结果是 -4 而不是 -3！因为向更小的负方向取整。',
        examTip: '提取一个整数的每一位数字（结合 % 10 和 // 10）是 GESP 1-2 级水仙花数、回文数题目的核心必考套路！',
        tags: ['运算符', '整除', '求余', '拆位', '幂'],
      },
      {
        id: 'api-math-funcs',
        name: 'abs(), max(), min(), round(), pow()',
        title: '5 大常用内置数学函数',
        stageId: 'gesp13',
        categoryId: 'gesp13-operators-math',
        level: 'GESP 1-2级',
        difficulty: '⭐',
        summary: 'abs 取绝对值（负号变正），max/min 选出最大最小值，pow 计算乘方，round 进行四舍五入。',
        syntax: 'abs(x)\nmax(a, b, ...)\nmin(a, b, ...)\nround(x, n=0)\npow(base, exp, mod=None)',
        returnType: 'number',
        params: [
          { name: 'x', type: 'number', required: true, desc: '待处理的数值或序列' },
        ],
        codeExample: `print(abs(-15))          # 15 (曼哈顿距离核心)
print(max(3, 9, 2))      # 9
print(min([10, 4, 88]))  # 4 (也支持列表传参)
print(round(3.14159, 2)) # 3.14 (保留两位小数)
print(pow(2, 5))         # 32 (等价于 2**5)`,
        expectedOutput: '15\n9\n4\n3.14\n32',
        interactiveType: 'terminal',
        pitfall: 'Python 的 round() 遵循“奇进偶舍（银行家舍入）”规则，比如 round(2.5) 结果是 2，而 round(3.5) 结果是 4！如果做题要求严格保留小数格式，推荐使用 f"{val:.2f}" 格式化输出。',
        tags: ['abs', 'max', 'min', 'round', 'pow'],
      },
    ],
  },
  {
    id: 'gesp13-control-structures',
    title: '三大程序结构 (分支与循环)',
    stageId: 'gesp13',
    icon: 'fa-solid fa-arrows-split-up-and-left',
    badge: '流程控制',
    description: '顺序、分支(if-elif-else)、循环(for in range / while) 与 break/continue。',
    items: [
      {
        id: 'api-if-elif-else',
        name: 'if - elif - else 分支',
        title: '条件分支与严格缩进',
        stageId: 'gesp13',
        categoryId: 'gesp13-control-structures',
        level: 'GESP 1-2级',
        difficulty: '⭐',
        summary: '像十字路口的红绿灯，根据条件真假决定走哪条道路，Python 用 4 个空格的对齐缩进定义代码块！',
        syntax: 'if 条件1:\n    代码块1\nelif 条件2:\n    代码块2\nelse:\n    备用代码块',
        returnType: 'None',
        params: [
          { name: '条件', type: 'bool expression', required: true, desc: '运算结果为 True 或 False 的比较表达式' },
        ],
        codeExample: `score = 85

if score >= 90:
    print("优秀 🌟")
elif score >= 60:
    print("及格 👍")
else:
    print("继续努力 💪")`,
        expectedOutput: '及格 👍',
        interactiveType: 'terminal',
        pitfall: '1. 判断两个值相等必须用双等号 ==！写成单个等号 = 是赋值操作，会直接报 SyntaxError 语法错误！\n2. 冒号 : 千万不要漏掉！在 if/elif/else 这一行末尾必须加英文半角冒号。',
        tags: ['if', 'elif', 'else', '双等号', '缩进'],
      },
      {
        id: 'api-for-range',
        name: 'for ... in ... 循环本质与 range()',
        title: 'for 循环本质：遍历可迭代容器的机械臂',
        stageId: 'gesp13',
        categoryId: 'gesp13-control-structures',
        level: 'GESP 1-2级必考',
        difficulty: '⭐⭐',
        summary: '【循环本质大揭秘】：Python 的 for 循环不是冷冰冰的数字计数器，而是“逐个取物遍历器”！它像一条机械臂流水线：for item in 可迭代容器:，每次从容器（列表、字符串、range、元组）中按顺序抓取一个元素塞进变量 item，执行缩进代码；容器中的物品拿光了，循环立即优雅结束！',
        syntax: 'for 变量 in 可迭代容器:\n    执行缩进代码块\n\n# 常见容器遍历形式：\nfor x in [10, 20, 30]:      # 列表遍历\nfor ch in "PYTHON":         # 字符串逐字拆解\nfor i in range(5):          # 数字序列 0, 1, 2, 3, 4 (不含 5)\nfor k in range(1, 10, 2):   # 步长为 2 遍历奇数',
        returnType: 'None (遍历容器)',
        params: [
          { name: '变量', type: 'variable', required: true, desc: '暂存抽屉，每一轮循环自动接收从容器中掏出的当前元素' },
          { name: '可迭代容器', type: 'iterable', required: true, desc: '任何可被遍历的对象，如 list 列表、str 字符串、range 序列等' },
          { name: 'range(start, stop[, step])', type: 'range object', required: false, desc: '数字序列发生器：左闭右开 [start, stop)，永远不含 stop！' },
        ],
        codeExample: `# 1. 列表遍历：从水果篮逐个掏水果
fruits = ["🍎 苹果", "🍌 香蕉", "🍇 葡萄"]
for item in fruits:
    print("吃到:", item)

# 2. 字符串也是容器：逐个字符取字
for ch in "CODE":
    print("字母:", ch)

# 3. range(5) 计数器：生成 0, 1, 2, 3, 4 (共 5 次，绝不含 5！)
for i in range(5):
    print("计数:", i)

# 4. 带步长：range(1, 10, 2) 打印奇数
for odd in range(1, 10, 2):
    print("奇数:", odd)`,
        expectedOutput: '吃到: 🍎 苹果\n吃到: 🍌 香蕉\n吃到: 🍇 葡萄\n字母: C\n字母: O\n字母: D\n字母: E\n计数: 0\n计数: 1\n计数: 2\n计数: 3\n计数: 4',
        interactiveType: 'for_lab',
        pitfall: '【考级三大致命坑】：\n1. 【左闭右开大坑】：range(1, 10) 只生成 1 到 9，绝对不包含 10！如果做题要求算 1 到 n 的和，循环必须写 range(1, n + 1)！\n2. 【循环内改变量无用】：在循环体内写 i = 999 并不会跳过循环！下一轮迭代时 Python 依然会按部就班从容器掏出下一个原值覆盖它！\n3. 【遍历中删改列表】：绝对不要在 for x in my_list 循环内部使用 remove() 或 pop() 删除当前列表元素，这会导致遍历指针错位漏项！',
        examTip: 'GESP 考级选择题必考两类核心：① 循环执行次数计算；② range 边界与步长判定；③ 字符串与列表累计求和。',
        tags: ['for', 'in', '遍历', 'range', '循环本质', '左闭右开', '机械臂'],
      },
      {
        id: 'api-while-loop',
        name: 'while 循环与死循环规避',
        title: '条件循环与计数递增',
        stageId: 'gesp13',
        categoryId: 'gesp13-control-structures',
        level: 'GESP 2级',
        difficulty: '⭐⭐',
        summary: '只要条件满足就一直转圈，常用于不知道具体循环多少次的情况（例如折半、辗转相除法、逐位拆数）。',
        syntax: 'while 条件:\n    循环体代码\n    更新条件变量 (千万别漏！)',
        returnType: 'None',
        params: [
          { name: '条件', type: 'bool expression', required: true, desc: '每次循环前重新评估的真假条件' },
        ],
        codeExample: `# 经典数位拆解：求 1234 的数位和
n = 1234
digit_sum = 0
while n > 0:
    digit_sum += n % 10 # 累加个位
    n //= 10            # 砍掉个位
print("数位和为:", digit_sum)`,
        expectedOutput: '数位和为: 10',
        interactiveType: 'terminal',
        pitfall: '【死循环警报】：在 while 循环体内部，必须有改变循环条件的语句（如 n //= 10 或 i += 1）！如果忘记更新变量，条件永远为 True，程序就会陷入死循环（TLE 超时判 0 分）！',
        tags: ['while', '死循环', '数位拆解', 'TLE'],
      },
      {
        id: 'api-break-continue',
        name: 'break & continue',
        title: '跳出整个循环与跳过本轮',
        stageId: 'gesp13',
        categoryId: 'gesp13-control-structures',
        level: 'GESP 2级',
        difficulty: '⭐⭐',
        summary: 'break 是急刹车（直接彻底结束整个循环）；continue 是瞬移下一轮（立刻跳过当前这轮剩余代码，直接开始下一次）！',
        syntax: 'break\ncontinue',
        returnType: 'None',
        params: [],
        codeExample: `# 1. break 示例：找到 3 就彻底终止
for i in range(1, 6):
    if i == 3:
        break
    print(i, end=" ") # 输出: 1 2 
print()

# 2. continue 示例：跳过 3 继续打印其余
for i in range(1, 6):
    if i == 3:
        continue
    print(i, end=" ") # 输出: 1 2 4 5`,
        expectedOutput: '1 2 \n1 2 4 5 ',
        interactiveType: 'terminal',
        pitfall: 'break 只能跳出它“所在的最内层那层循环”！如果是双重嵌套循环（两层 for），内层的 break 不会把外层循环停掉！',
        tags: ['break', 'continue', '急刹车', '跳过'],
      },
    ],
  },
  {
    id: 'gesp13-lists',
    title: '列表 list 核心容器',
    stageId: 'gesp13',
    icon: 'fa-solid fa-layer-group',
    badge: '顺序容器',
    description: 'Python 的超级百宝箱！列表的增删改查 append/pop/insert/remove、0 索引、常用统计 max/min/sum 与列表推导式。',
    items: [
      {
        id: 'api-list-ops',
        name: 'list 增删改查',
        title: '列表操作与 0 索引法则',
        stageId: 'gesp13',
        categoryId: 'gesp13-lists',
        level: 'GESP 2-3级必考',
        difficulty: '⭐⭐',
        summary: 'Python 的可变大抽屉！可以按顺序装入任何数据。首个元素的下标是从 0 开始排号的！',
        syntax: 'lst.append(x)\nlst.pop([index])\nlst.insert(index, x)\nlst.remove(x)\nlen(lst)',
        returnType: '各种',
        params: [
          { name: 'lst', type: 'list', required: true, desc: '待操作的列表' },
        ],
        codeExample: `fruits = ["苹果", "香蕉", "橘子"]

# 1. 访问元素（从 0 开始！）
print("第一个水果:", fruits[0]) # 苹果
print("最后一个水果:", fruits[-1]) # 橘子 (负数索引倒着数)

# 2. 末尾追加与指定插入
fruits.append("西瓜")
fruits.insert(1, "葡萄") # 在下标 1 处插入葡萄
print("插入后:", fruits)

# 3. 删除元素
removed = fruits.pop(2) # 删掉下标 2 的香蕉并返回它
fruits.remove("苹果")    # 直接按内容删除第一个匹配项"苹果"
print("删除了:", removed)
print("现存列表:", fruits)`,
        expectedOutput: "第一个水果: 苹果\n最后一个水果: 橘子\n插入后: ['苹果', '葡萄', '香蕉', '橘子', '西瓜']\n删除了: 香蕉\n现存列表: ['葡萄', '橘子', '西瓜']",
        interactiveType: 'terminal',
        pitfall: '【IndexError 越界错误】：长度为 3 的列表，最大有效下标是 2，访问 fruits[3] 会直接崩溃报错 IndexError: list index out of range！做题循环遍历下标一定要写 for i in range(len(lst))。\n【remove 找不到报错】：如果调用 lst.remove("不存在的项") 会报 ValueError，做题前应先用 if item in lst: 判断！',
        examTip: '负数下标（如 -1 代表倒数第 1 个元素）是 GESP 2-3 级高频考题。',
        tags: ['list', 'append', 'pop', 'insert', 'remove', '下标越界'],
      },
      {
        id: 'api-list-advanced',
        name: '列表常用内置函数与推导式',
        title: '极速统计与列表推导式',
        stageId: 'gesp13',
        categoryId: 'gesp13-lists',
        level: 'GESP 3级必考',
        difficulty: '⭐⭐⭐',
        summary: '一行算出最大值、最小值、总和与平均数；用列表推导式 [x*2 for x in ...] 一秒生成新列表！',
        syntax: 'max(lst), min(lst), sum(lst)\n[表达式 for 变量 in 迭代对象 if 条件]',
        returnType: '数值或 list',
        params: [
          { name: 'lst', type: 'list', required: true, desc: '纯数字列表' },
        ],
        codeExample: `scores = [85, 92, 78, 96, 60]

# 1. 常用内置四大统计函数
print("最高分:", max(scores))
print("最低分:", min(scores))
print("总分:", sum(scores))
print("平均分:", sum(scores) / len(scores))

# 2. 列表推导式（机考提速神器）
# 挑选出所有大于等于 80 的优秀成绩，并各加 2 分奖励
bonus_scores = [x + 2 for x in scores if x >= 80]
print("奖励后的优秀分:", bonus_scores)`,
        expectedOutput: '最高分: 96\n最低分: 60\n总分: 411\n平均分: 82.2\n奖励后的优秀分: [87, 94, 98]',
        interactiveType: 'terminal',
        pitfall: '对空列表调用 max([]) 或 min([]) 会抛出 ValueError: max() arg is an empty sequence 导致程序崩溃！在做题前必须先确认列表不为空。',
        tags: ['max', 'min', 'sum', '列表推导式', '统计'],
      },
    ],
  },
  {
    id: 'gesp13-strings',
    title: '字符串 str 专项全解 (做题高频武器)',
    stageId: 'gesp13',
    icon: 'fa-solid fa-quote-left',
    badge: '⭐ 文本武器',
    description: 'GESP 考级单项独立专题！字符串索引切片、回文判断、不可变性避坑、四大高频方法与字符统计判断。',
    items: [
      {
        id: 'api-str-basics',
        name: '字符串基础与不可变特性',
        title: '引号、转义字符与只读不可改铁律',
        stageId: 'gesp13',
        categoryId: 'gesp13-strings',
        level: 'GESP 1-2级必考',
        difficulty: '⭐⭐',
        summary: '用单引号、双引号或三引号括起来的文本。请牢记核心法则：字符串是“不可变(Immutable)”的，只能看不能局部改！',
        syntax: 's = "Hello"\ns = \'World\'\ns = """多行文本"""',
        returnType: 'str',
        params: [],
        codeExample: `# 1. 引号与转义字符
print("第一行\\n第二行")   # \\n 换行
print("姓名:\\t小明")     # \\t 制表符对齐
print("他说: \\"学编程真好玩！\\"") # \\" 转义双引号

# 2. 字符串拼接 (+) 与重复 (*)
print("Python" + "GESP") # PythonGESP
print("ABC" * 3)         # ABCABCABC

# 3. ⚠️ 不可变性演示
s = "cat"
# ❌ 错误写法（机考大坑）：s[0] = "b" -> 报 TypeError: 'str' object does not support item assignment
# ✅ 正确做法：拼接生成新字符串
s = "b" + s[1:]
print("修改后的新字符串:", s) # bat`,
        expectedOutput: '第一行\n第二行\n姓名:\t小明\n他说: "学编程真好玩！"\nPythonGESP\nABCABCABC\n修改后的新字符串: bat',
        interactiveType: 'terminal',
        pitfall: '【TypeError 考题常客】：Python 字符串绝不支持 s[0] = "x" 这种单字符修改操作！如果想修改某个字符，必须通过切片拼接生成新字符串或用 replace() 重新赋值接收！',
        examTip: 'GESP 1-2 级选择题几乎必考字符串的不可变性与转义字符 \\n、\\t、\\\\ 的计算。',
        tags: ['字符串', '不可变性', '转义字符', '拼接', 'TypeError'],
      },
      {
        id: 'api-str-slice',
        name: '字符串索引与切片大全',
        title: '正负索引、[start:stop:step] 与 [::-1] 回文',
        stageId: 'gesp13',
        categoryId: 'gesp13-strings',
        level: 'GESP 2-3级必考',
        difficulty: '⭐⭐',
        summary: '像切西瓜一样提取任意片段：[start:stop] 遵从左闭右开；step=-1 瞬间将整句话倒流反转（判断回文串第一绝技）！',
        syntax: 's[index]\ns[start:stop]\ns[start:stop:step]\ns[::-1] (反转)',
        returnType: 'str',
        params: [
          { name: 'start', type: 'int', required: false, defaultVal: '0', desc: '起始索引（包含）' },
          { name: 'stop', type: 'int', required: false, defaultVal: 'len', desc: '结束索引（不包含！）' },
          { name: 'step', type: 'int', required: false, defaultVal: '1', desc: '步长，负数代表倒序提取' },
        ],
        codeExample: `s = "GESP-PYTHON"

# 1. 单字符索引（首字符 0，末字符 -1）
print("首字符:", s[0])   # G
print("尾字符:", s[-1])  # N

# 2. 经典切片（左闭右开，不含右边界！）
print(s[0:4])   # GESP (下标 0, 1, 2, 3)
print(s[5:])    # PYTHON (从下标 5 到末尾)
print(s[:4])    # GESP (从开头到下标 4 前)
print(s[::2])   # GS-YHN (隔一个取一个)

# 3. 倒序反转与回文判断（考级大题最爱！）
text = "上海自来水来自海上"
print("倒序字符串:", text[::-1])
if text == text[::-1]:
    print("恭喜：是回文串！")`,
        expectedOutput: '首字符: G\n尾字符: N\nGESP\nPYTHON\nGESP\nGS-YHN\n倒序字符串: 上海自来水来自海上\n恭喜：是回文串！',
        interactiveType: 'terminal',
        pitfall: '1. 切片是“左闭右开”！s[1:4] 只包含下标 1, 2, 3，绝不包含下标 4！\n2. 访问单个越界下标如 s[100] 会报 IndexError，但切片 s[0:100] 不会报错，会安全返回全部字符！',
        examTip: '判断回文数/回文字符串：s == s[::-1]，考级压轴填空题秒杀秘籍。',
        tags: ['切片', 'slice', '回文串', '反转', '负索引'],
      },
      {
        id: 'api-str-methods',
        name: 'split(), join(), strip(), replace()',
        title: '字符串做题 4 大核心神技',
        stageId: 'gesp13',
        categoryId: 'gesp13-strings',
        level: 'GESP 2-3级必考',
        difficulty: '⭐⭐',
        summary: 'split 砍成列表，strip 剃掉两端多余空格，replace 换字，join 把列表各元素用符号紧紧串成新字符串！',
        syntax: 's.split(sep=None)\ns.strip()\ns.replace(old, new)\nsep.join(list_of_str)',
        returnType: 'str 或 list[str]',
        params: [
          { name: 'sep', type: 'str', required: false, desc: '分割或连接的分隔符' },
        ],
        codeExample: `raw = "   apple,banana,orange,watermelon   "

# 1. strip() 剔除两端空白或回车
clean = raw.strip()
print(f"清洗后: '{clean}'")

# 2. split() 按特定逗号切碎成列表
fruit_list = clean.split(",")
print("切碎成列表:", fruit_list)

# 3. join() 用 ' -> ' 缝合回新字符串
chain = " -> ".join(fruit_list)
print("缝合展示:", chain)

# 4. replace() 替换敏感词
msg = "I love C++, C++ is cool!"
print(msg.replace("C++", "Python"))`,
        expectedOutput: "清洗后: 'apple,banana,orange,watermelon'\n切碎成列表: ['apple', 'banana', 'orange', 'watermelon']\n缝合展示: apple -> banana -> orange -> watermelon\nI love Python, Python is cool!",
        interactiveType: 'terminal',
        pitfall: '【千万别忘了重新赋值】：s.replace("a", "b") 不会改变原变量 s！必须写 s = s.replace("a", "b")！另外，join 必须由分隔符调用，如 "-".join(lst)，不能写成 lst.join("-")！',
        tags: ['split', 'join', 'strip', 'replace', '清洗', '缝合'],
      },
      {
        id: 'api-str-search',
        name: 'find(), index(), count() 与 in 运算',
        title: '字符查找、计数与包含检测',
        stageId: 'gesp13',
        categoryId: 'gesp13-strings',
        level: 'GESP 2-3级',
        difficulty: '⭐⭐',
        summary: '寻找某个字母在字符串中的第几次出现位置；count() 统计出现了多少次；in 关键字直接判断是否包含！',
        syntax: 's.find(sub)\ns.index(sub)\ns.count(sub)\nsub in s',
        returnType: 'int 或 bool',
        params: [
          { name: 'sub', type: 'str', required: true, desc: '待查找的子字符串' },
        ],
        codeExample: `poem = "床前明月光，疑是地上霜"

# 1. in 成员检测（最简单直观）
if "明月" in poem:
    print("诗句中包含'明月' 🌙")

# 2. find() 查找首次出现下标 (找不到返回 -1，安全不闪退)
print("'明月' 的下标位置:", poem.find("明月")) # 2
print("'太阳' 的下标位置:", poem.find("太阳")) # -1 (找不到)

# 3. index() 查找 (找不到会抛出 ValueError 崩溃！)
# print(poem.index("太阳")) # ❌ 崩溃警告

# 4. count() 统计子串出现次数
text = "banana"
print("'a' 出现的次数:", text.count("a")) # 3`,
        expectedOutput: "诗句中包含'明月' 🌙\n'明月' 的下标位置: 2\n'太阳' 的下标位置: -1\n'a' 出现的次数: 3",
        interactiveType: 'terminal',
        pitfall: '【find vs index 区别】：在做题判断子串是否存在时，优先使用 in 或 find()！千万不要轻易用 index()，因为如果子串不存在，index() 会直接抛出 ValueError 导致整套题判 0 分！',
        tags: ['find', 'index', 'count', 'in', '查找', '包含'],
      },
      {
        id: 'api-str-check-case',
        name: 'isdigit(), isalpha() 与大小写转换',
        title: '字符类型鉴定与 upper() / lower()',
        stageId: 'gesp13',
        categoryId: 'gesp13-strings',
        level: 'GESP 2-3级必考',
        difficulty: '⭐⭐',
        summary: '密码与输入校验神器！isdigit 判断是否全是纯数字，isalpha 判断是否全为纯字母，upper / lower 转换大小写。',
        syntax: 's.isdigit() -> bool\ns.isalpha() -> bool\ns.lower() -> str\ns.upper() -> str',
        returnType: 'bool 或 str',
        params: [],
        codeExample: `# 1. 字符类型鉴定
print("12345".isdigit()) # True (纯数字)
print("123a".isdigit())  # False
print("Hello".isalpha()) # True (纯字母)

# 2. 常见考题：统计一行字符串中的数字个数
content = "PyKids2026-GESP3"
digit_count = sum(1 for ch in content if ch.isdigit())
print("数字字符总数:", digit_count) # 5

# 3. 大小写转换与首尾判断
s = "Python"
print("全大写:", s.upper())
print("全小写:", s.lower())
print("是否以 'Py' 开头:", s.startswith("Py")) # True
print("是否以 'on' 结尾:", s.endswith("on"))   # True`,
        expectedOutput: "True\nFalse\nTrue\n数字字符总数: 5\n全大写: PYTHON\n全小写: python\n是否以 'Py' 开头: True\n是否以 'on' 结尾: True",
        interactiveType: 'terminal',
        pitfall: 'isdigit() 只能识别非负纯整数（"123" 是 True），如果字符串带负号（"-123"）或带小数点（"3.14"），isdigit() 返回的都是 False！',
        tags: ['isdigit', 'isalpha', 'upper', 'lower', 'startswith', '字符校验'],
      },
    ],
  },

  // ==========================================
  // 阶段 3: 基础阶段 (GESP 4-6级)
  // ==========================================
  {
    id: 'gesp46-funcs',
    title: '函数与作用域',
    stageId: 'gesp46',
    icon: 'fa-solid fa-code-branch',
    badge: '函数封装',
    description: 'def 自定义函数、形参实参、return 返回值与 global 全局变量穿透。',
    items: [
      {
        id: 'api-def-return',
        name: 'def 自定义函数 & return',
        title: '模块化封装与返回值',
        stageId: 'gesp46',
        categoryId: 'gesp46-funcs',
        level: 'GESP 4级必考',
        difficulty: '⭐⭐',
        summary: '把一段常用的逻辑打包成一台有名字的小机器，塞入原料（参数），生产出产品并用 return 吐出来！',
        syntax: 'def 函数名(参数1, 参数2=默认值):\n    函数体代码\n    return 返回结果',
        returnType: '任意类型',
        params: [
          { name: '参数', type: 'any', required: false, desc: '函数需要的输入数据' },
        ],
        codeExample: `def add(a, b=10):
    return a + b

res1 = add(3, 5)
res2 = add(7) # 缺省第二个参数，使用默认值 10
print("结果1:", res1)
print("结果2:", res2)`,
        expectedOutput: '结果1: 8\n结果2: 17',
        interactiveType: 'terminal',
        pitfall: '1. return 就像游戏里的传送门，只要执行到 return，函数就会立刻终止弹出，后面的代码全部不会被执行！\n2. 如果函数里没有写 return，函数默认会返回 None！在做题时千万不要写 print(foo()) 结果打印出了 None。',
        tags: ['def', 'return', '默认参数', 'None'],
      },
      {
        id: 'api-global-scope',
        name: 'global 全局变量穿透',
        title: '局部作用域与 global 声明',
        stageId: 'gesp46',
        categoryId: 'gesp46-funcs',
        level: 'GESP 4级',
        difficulty: '⭐⭐⭐',
        summary: '函数内部默认只能看全局变量，不能修改它！想要在函数内修改外面的全局变量，必须先用 global 递交通行证！',
        syntax: 'global 变量名',
        returnType: 'None',
        params: [],
        codeExample: `count = 0

def click_counter():
    global count # 必须声明，否则 count += 1 会报错 UnboundLocalError
    count += 1

click_counter()
click_counter()
print("点击次数:", count) # 输出: 2`,
        expectedOutput: '点击次数: 2',
        interactiveType: 'terminal',
        pitfall: '【考题高频报错】：如果在函数内写 count += 1 而没加 global count，Python 会在编译时将其视作未赋值的局部变量，运行时报 UnboundLocalError: local variable referenced before assignment！',
        tags: ['global', '作用域', '全局变量', '局部变量'],
      },
    ],
  },
  {
    id: 'gesp46-containers',
    title: '复合数据结构 (字典与集合)',
    stageId: 'gesp46',
    icon: 'fa-solid fa-boxes-stacked',
    badge: '字典与集合',
    description: '字典 dict 键值对查询、集合 set 极速去重与并交差集、二维列表矩阵遍历。',
    items: [
      {
        id: 'api-dict-ops',
        name: 'dict 字典键值对',
        title: '名册与查字典 (Key-Value)',
        stageId: 'gesp46',
        categoryId: 'gesp46-containers',
        level: 'GESP 4-5级必考',
        difficulty: '⭐⭐',
        summary: '像新华字典一样：拼音是“键(Key)”，汉字解释是“值(Value)”。通过 Key 可以在 O(1) 瞬间查出 Value！',
        syntax: 'd = {key: value}\nd.get(key, default)\nd.keys(), d.values(), d.items()',
        returnType: 'dict / values',
        params: [
          { name: 'key', type: 'hashable (str/int/tuple)', required: true, desc: '不可变的键，不能是列表！' },
        ],
        codeExample: `scores = {"小明": 95, "小红": 98, "小刚": 88}

# 增加/修改
scores["小明"] = 100
scores["小美"] = 92

# 安全查询：使用 get 防止 KeyError
print("小红得分:", scores.get("小红", 0))
print("不存在的同学:", scores.get("大华", 0))

# 统计词频做题必备模板
freq = {}
for ch in "banana":
    freq[ch] = freq.get(ch, 0) + 1
print("字母频率:", freq)`,
        expectedOutput: "小红得分: 98\n不存在的同学: 0\n字母频率: {'b': 1, 'a': 3, 'n': 2}",
        interactiveType: 'terminal',
        pitfall: '1. 字典的 Key 必须是不可变类型（数字、字符串、元组），不能把列表作为 Key，如 d[[1, 2]] = 3 会报 TypeError: unhashable type: \'list\'！\n2. 直接用 d[key] 访问如果 key 不存在会抛出 KeyError 闪退，考级推荐优先使用 d.get(key, 0)！',
        tags: ['dict', 'key', 'value', 'get', '词频统计'],
      },
      {
        id: 'api-set-dedup',
        name: 'set 集合去重与集合运算',
        title: '瞬间去重与并集/交集',
        stageId: 'gesp46',
        categoryId: 'gesp46-containers',
        level: 'GESP 4级',
        difficulty: '⭐⭐',
        summary: '天然的“消重过滤器”！集合里绝对不允许出现重复元素，放入的重复值会被自动合并！',
        syntax: 's = set(iterable)\ns.add(x)\na & b (交集), a | b (并集), a - b (差集)',
        returnType: 'set',
        params: [],
        codeExample: `# 1. 列表一行极速去重 (做题高频)
raw_ids = [101, 102, 101, 103, 102, 104]
unique_ids = list(set(raw_ids))
print("去重后元素:", unique_ids)

# 2. 集合运算
setA = {1, 2, 3, 4}
setB = {3, 4, 5, 6}
print("共有元素(交集):", setA & setB)
print("合并所有(并集):", setA | setB)`,
        expectedOutput: '去重后元素: [101, 102, 103, 104]\n共有元素(交集): {3, 4}\n合并所有(并集): {1, 2, 3, 4, 5, 6}',
        interactiveType: 'terminal',
        pitfall: '1. 集合是“无序”的！set(lst) 转出来后元素的排列顺序可能会改变，不能通过下标 setA[0] 访问元素！\n2. 创建空集合必须写 s = set()，如果写 s = {}，Python 会默认创建成一个空字典！',
        tags: ['set', '去重', '交集', '并集', '无序'],
      },
    ],
  },
  {
    id: 'gesp46-base-encoding',
    title: '进制转换与字符编码',
    stageId: 'gesp46',
    icon: 'fa-solid fa-binary',
    badge: '进制与ASCII',
    description: '二进制 bin()、八进制 oct()、十六进制 hex()、任意进制解析 int(x, base)、ord() 与 chr()。',
    items: [
      {
        id: 'api-base-convert',
        name: 'bin(), oct(), hex(), int(x, base)',
        title: '四大进制互转',
        stageId: 'gesp46',
        categoryId: 'gesp46-base-encoding',
        level: 'GESP 4-5级必考',
        difficulty: '⭐⭐',
        summary: '电脑的世界只有 0 和 1（二进制），人类常用十进制，程序员爱用十六进制。Python 内置函数一键互转！',
        syntax: 'bin(n) -> "0b..."\noct(n) -> "0o..."\nhex(n) -> "0x..."\nint(s, base) -> int',
        returnType: 'str 或 int',
        params: [
          { name: 'n', type: 'int', required: true, desc: '待转十进制数' },
          { name: 'base', type: 'int', required: false, defaultVal: '10', desc: '源进制基数（如 2, 8, 16）' },
        ],
        codeExample: `num = 42

# 1. 十进制转其他进制（注意前缀）
print(bin(num)) # '0b101010' (二进制前缀 0b)
print(oct(num)) # '0o52'     (八进制前缀 0o)
print(hex(num)) # '0x2a'     (十六进制前缀 0x)

# 2. 剥离前缀只取纯进制串
pure_bin = bin(num)[2:]
print("纯二进制:", pure_bin)

# 3. 任意进制解析转回十进制
print(int("101010", 2)) # 42
print(int("2A", 16))     # 42`,
        expectedOutput: '0b101010\n0o52\n0x2a\n纯二进制: 101010\n42\n42',
        interactiveType: 'terminal',
        pitfall: 'bin(), oct(), hex() 返回的是以 0b, 0o, 0x 开头的“字符串”，做题如果要求纯数字串，必须用 [2:] 截取掉前两位前缀！',
        examTip: 'GESP 4级选择题必考进制计算题，比如求二进制 1101 + 八进制 17 的十进制值。',
        tags: ['bin', 'oct', 'hex', '进制转换', '0b前缀'],
      },
      {
        id: 'api-ord-chr',
        name: 'ord() & chr()',
        title: 'ASCII 码与字符转换 (凯撒密码必备)',
        stageId: 'gesp46',
        categoryId: 'gesp46-base-encoding',
        level: 'GESP 4级必考',
        difficulty: '⭐⭐',
        summary: '字符与数字身份证的翻译官！ord("A") 查出 A 的 ASCII 码是 65，chr(65) 将数字翻译回字母 A！',
        syntax: 'ord(char) -> int\nchr(code) -> str',
        returnType: 'int / str',
        params: [
          { name: 'char', type: 'str (单字符)', required: true, desc: '长度为 1 的字符' },
          { name: 'code', type: 'int', required: true, desc: '0~1114111 范围内的整数编码' },
        ],
        codeExample: `print(ord("A")) # 65 (大写 A)
print(ord("a")) # 97 (小写 a，比大写多 32)
print(ord("0")) # 48 (数字 0)

# 经典考题：大写字母加密后移 1 位 (凯撒密码)
c = "B"
next_char = chr(ord(c) + 1)
print(f"'{c}' 的后一位是 '{next_char}'") # 'C'

# 大小写转换原理
upper = "G"
lower = chr(ord(upper) + 32)
print(f"'{upper}' 转小写是 '{lower}'") # 'g'`,
        expectedOutput: "65\n97\n48\n'B' 的后一位是 'C'\n'G' 转小写是 'g'",
        interactiveType: 'terminal',
        pitfall: '【背诵黄金常量】：GESP 考级必须熟记 3 个基准 ASCII 码：\'0\' 是 48，\'A\' 是 65，\'a\' 是 97！大写与小写之间相差固定 32！',
        tags: ['ord', 'chr', 'ASCII', '字符加密', '凯撒密码'],
      },
    ],
  },
  {
    id: 'gesp46-algo-sort',
    title: '基础算法、递归与排序',
    stageId: 'gesp46',
    icon: 'fa-solid fa-arrow-down-a-z',
    badge: '递归与算法',
    description: '递推与递归、自定义排序 sort(key=...) / sorted()、二分查找 binary_search 与贪心。',
    items: [
      {
        id: 'api-sort-sorted',
        name: 'sort() vs sorted()',
        title: '原地排序与生成新列表 (key 参数)',
        stageId: 'gesp46',
        categoryId: 'gesp46-algo-sort',
        level: 'GESP 4-5级必考',
        difficulty: '⭐⭐',
        summary: '整理杂乱的数据！lst.sort() 直接在原列表身上动手术；sorted(lst) 不改变原列表，而是克隆一份排好序的新列表！',
        syntax: 'lst.sort(key=None, reverse=False)\nsorted(iterable, key=None, reverse=False)',
        returnType: 'None (sort) / list (sorted)',
        params: [
          { name: 'key', type: 'function', required: false, desc: '排序依据函数，如 key=abs 按绝对值排序' },
          { name: 'reverse', type: 'bool', required: false, defaultVal: 'False', desc: '设为 True 则从大到小降序排列' },
        ],
        codeExample: `nums = [5, -2, 8, -9, 1]

# 1. 降序从大到小排列
nums.sort(reverse=True)
print("降序:", nums)

# 2. 按绝对值大小自定义排序 (利用 key 参数)
students = [("小明", 80), ("小红", 95), ("小刚", 90)]
# 按分数升序排列
students.sort(key=lambda item: item[1])
print("按成绩升序:", students)`,
        expectedOutput: "降序: [8, 5, 1, -2, -9]\n按成绩升序: [('小明', 80), ('小刚', 90), ('小红', 95)]",
        interactiveType: 'terminal',
        pitfall: '【考题高发坑点】：lst.sort() 的返回值是 None！如果写 a = lst.sort()，此时 a 的值是 None，原列表虽然排好了但 a 会变成 None 导致后续报错！想赋值给新变量必须写 a = sorted(lst)！',
        tags: ['sort', 'sorted', 'reverse', 'lambda', '自定义排序'],
      },
      {
        id: 'api-recursion-fib',
        name: '递归思想 (Recursion)',
        title: '自己调用自己的艺术 (以斐波那契为例)',
        stageId: 'gesp46',
        categoryId: 'gesp46-algo-sort',
        level: 'GESP 5-6级必考',
        difficulty: '⭐⭐⭐',
        summary: '像俄罗斯套娃一样，把一个大问题拆解为结构相同但规模更小的子问题，直到触碰最底层的基准条件（Base Case）！',
        syntax: 'def func(n):\n    if 基准条件:\n        return 已知解\n    return func(缩小规模)',
        returnType: 'any',
        params: [
          { name: 'n', type: 'int', required: true, desc: '问题规模' },
        ],
        codeExample: `# 计算阶乘 n! = n * (n-1)!
def factorial(n):
    if n <= 1: # 基准出口
        return 1
    return n * factorial(n - 1)

print("5! =", factorial(5)) # 120

# 斐波那契数列: 1, 1, 2, 3, 5, 8...
def fib(n):
    if n <= 2:
        return 1
    return fib(n - 1) + fib(n - 2)

print("第 7 项斐波那契数:", fib(7)) # 13`,
        expectedOutput: '5! = 120\n第 7 项斐波那契数: 13',
        interactiveType: 'terminal',
        pitfall: '【RecursionError 爆栈崩溃】：写递归第一件事必须写终止条件（if n <= 1: return 1）！如果漏掉终止条件，Python 会无限下潜直到触发 RecursionError: maximum recursion depth exceeded 崩溃！',
        tags: ['递归', 'factorial', 'fibonacci', '基准条件', '爆栈'],
      },
    ],
  },

  // ==========================================
  // 阶段 4: 提高阶段 (GESP 6-8级)
  // ==========================================
  {
    id: 'gesp68-oop',
    title: '面向对象编程 (OOP)',
    stageId: 'gesp68',
    icon: 'fa-solid fa-shapes',
    badge: '类与对象',
    description: 'class 类定义、__init__ 构造方法、self 指针、实例属性与继承。',
    items: [
      {
        id: 'api-class-init',
        name: 'class 与 __init__ 构造',
        title: '图纸与实体制造 (类与对象)',
        stageId: 'gesp68',
        categoryId: 'gesp68-oop',
        level: 'GESP 6级',
        difficulty: '⭐⭐⭐',
        summary: '“类(Class)”是造汽车的蓝图设计稿，“对象(Instance)”是按蓝图造出来的真实汽车；self 代表当前被造出来的这辆车自己！',
        syntax: 'class ClassName:\n    def __init__(self, arg1):\n        self.prop = arg1',
        returnType: 'Instance',
        params: [
          { name: 'self', type: 'self', required: true, desc: '实例自身引用，方法必须作为第一个参数' },
        ],
        codeExample: `class Student:
    def __init__(self, name, score):
        self.name = name
        self.score = score
        
    def show_info(self):
        print(f"学生: {self.name}, 成绩: {self.score}")

# 实例化两个不同的学生对象
s1 = Student("小明", 95)
s2 = Student("小红", 99)
s1.show_info()
s2.show_info()`,
        expectedOutput: '学生: 小明, 成绩: 95\n学生: 小红, 成绩: 99',
        interactiveType: 'terminal',
        pitfall: '__init__ 前后各有“两个下划线”（Double Underscore / Dunder），不是单下划线！写成 _init_ 会导致构造方法失效。同时类方法里的首个参数必须是 self！',
        tags: ['class', '__init__', 'self', 'OOP', '实例'],
      },
    ],
  },
  {
    id: 'gesp68-data-structures',
    title: '核心数据结构 (栈与队列)',
    stageId: 'gesp68',
    icon: 'fa-solid fa-layer-group',
    badge: '栈与队列',
    description: '栈 (Stack) 后进先出、队列 (Queue / deque) 先进先出、括号匹配与逆波兰表达式。',
    items: [
      {
        id: 'api-stack-lifo',
        name: '栈 Stack (后进先出 LIFO)',
        title: '弹夹与洗盘子模型 (括号匹配核心)',
        stageId: 'gesp68',
        categoryId: 'gesp68-data-structures',
        level: 'GESP 6-7级必考',
        difficulty: '⭐⭐⭐',
        summary: '像往弹夹里压子弹，最后压进去的子弹最先被发射（Last In, First Out）！Python 中直接用列表 append() 入栈，pop() 出栈！',
        syntax: 'stack.append(x) # 入栈\nx = stack.pop() # 出栈 (弹出栈顶)',
        returnType: 'any',
        params: [],
        codeExample: `# 经典考题：括号有效性匹配检查
def is_valid_brackets(s):
    stack = []
    pairs = {")": "(", "}": "{", "]": "["}
    for char in s:
        if char in "({[":
            stack.append(char) # 左括号进栈
        elif char in ")}]":
            if not stack or stack.pop() != pairs[char]:
                return False
    return len(stack) == 0

print(is_valid_brackets("()[]{}")) # True
print(is_valid_brackets("([)]"))   # False`,
        expectedOutput: 'True\nFalse',
        interactiveType: 'terminal',
        pitfall: '从空栈中 pop() 会引发 IndexError: pop from empty list！在弹出之前必须先检查 if stack 判断栈非空！',
        examTip: 'GESP 6-7 级高频大题：表达式求值、中缀转后缀、括号匹配必考栈。',
        tags: ['stack', 'LIFO', 'pop', '括号匹配'],
      },
      {
        id: 'api-deque-fifo',
        name: '队列 Queue / deque (先进先出 FIFO)',
        title: '排队模型与 collections.deque',
        stageId: 'gesp68',
        categoryId: 'gesp68-data-structures',
        level: 'GESP 6-7级必考',
        difficulty: '⭐⭐⭐',
        summary: '像排队买冰淇淋，排在最前面的人最先拿到（First In, First Out）！deque 支持 O(1) 极速队首出队，是 BFS 搜索的核心引擎！',
        syntax: 'from collections import deque\nq = deque()\nq.append(x)\nq.popleft()',
        returnType: 'deque',
        params: [],
        codeExample: `from collections import deque

q = deque()
q.append("小明") # 队尾入队
q.append("小红")
q.append("小华")

first = q.popleft() # 队首出队 (O(1) 效率极高)
print("买到冰淇淋出队:", first)
print("当前排队剩余:", list(q))`,
        expectedOutput: "买到冰淇淋出队: 小明\n当前排队剩余: ['小红', '小华']",
        interactiveType: 'terminal',
        pitfall: '千万不要用普通列表 lst.pop(0) 做队列出队！普通列表 pop(0) 会导致后面所有元素往前挪移，时间复杂度是 O(n)，数据量一大必然超时 TLE！必须使用 collections.deque 的 popleft()！',
        tags: ['deque', 'queue', 'FIFO', 'popleft', 'BFS必备'],
      },
    ],
  },
  {
    id: 'gesp68-graphs-search',
    title: '经典搜索与图论 (DFS & BFS)',
    stageId: 'gesp68',
    icon: 'fa-solid fa-network-wired',
    badge: 'DFS与BFS',
    description: '深度优先搜索 (DFS 迷宫与全排列)、广度优先搜索 (BFS 最短路径) 与邻接表建图。',
    items: [
      {
        id: 'api-dfs-search',
        name: '深度优先搜索 DFS',
        title: '不撞南墙不回头 (迷宫与回溯)',
        stageId: 'gesp68',
        categoryId: 'gesp68-graphs-search',
        level: 'GESP 7-8级必考',
        difficulty: '⭐⭐⭐⭐',
        summary: '像探险家走迷宫，认准一条死胡同走到底，撞了南墙再一步一步倒退回溯，尝试另一条岔路！',
        syntax: 'def dfs(node, visited):\n    visited.add(node)\n    for next_node in graph[node]:\n        if next_node not in visited:\n            dfs(next_node, visited)',
        returnType: 'None / result',
        params: [],
        codeExample: `# 图的邻接表表示
graph = {
    'A': ['B', 'C'],
    'B': ['D', 'E'],
    'C': ['F'],
    'D': [], 'E': ['F'], 'F': []
}

def dfs_traverse(node, visited):
    visited.append(node)
    for neighbor in graph[node]:
        if neighbor not in visited:
            dfs_traverse(neighbor, visited)

order = []
dfs_traverse('A', order)
print("DFS 遍历顺序:", " -> ".join(order))`,
        expectedOutput: 'DFS 遍历顺序: A -> B -> D -> E -> F -> C',
        interactiveType: 'terminal',
        pitfall: '图遍历必须维护 visited 标记已访问节点！如果有环路但没有 visited，DFS 会在环里无限死循环直接爆栈！',
        tags: ['DFS', '回溯', '图论', '递归', '迷宫'],
      },
      {
        id: 'api-bfs-search',
        name: '广度优先搜索 BFS',
        title: '水波纹逐层扩散 (最短步数利器)',
        stageId: 'gesp68',
        categoryId: 'gesp68-graphs-search',
        level: 'GESP 7-8级必考',
        difficulty: '⭐⭐⭐⭐',
        summary: '像向池塘扔进一颗石子，水波一层一层均匀向外扩散。由于先近后远，第一次碰到终点所走的步数必定是最短步数！',
        syntax: 'queue = deque([(start, 0)])\nvisited = {start}',
        returnType: 'int (最短步数)',
        params: [],
        codeExample: `from collections import deque

# 寻找从 1 乘2或加1 到达 10 的最少操作步数
def min_steps(start, target):
    q = deque([(start, 0)])
    visited = {start}
    
    while q:
        curr, step = q.popleft()
        if curr == target:
            return step
        # 两种选择：+1 或 *2
        for nxt in [curr + 1, curr * 2]:
            if nxt <= target and nxt not in visited:
                visited.add(nxt)
                q.append((nxt, step + 1))
    return -1

print("从 1 到 10 的最少操作次数:", min_steps(1, 10))`,
        expectedOutput: '从 1 到 10 的最少操作次数: 4',
        interactiveType: 'terminal',
        pitfall: '必须在节点加入队列 append() 的瞬间就放入 visited 集合！如果等到出队 popleft() 时才标记 visited，同一层的节点会被重复入队成千上万次，导致内存溢出爆内存！',
        tags: ['BFS', 'deque', '最短路', '波浪扩散'],
      },
    ],
  },
  {
    id: 'gesp68-dp-math',
    title: '动态规划与数学进阶 (DP & 素数筛)',
    stageId: 'gesp68',
    icon: 'fa-solid fa-chart-line',
    badge: 'DP与数论',
    description: '记忆化与动态规划 (爬楼梯/0-1背包)、埃氏素数筛法 Sieve of Eratosthenes 与快速幂。',
    items: [
      {
        id: 'api-dp-climb-stairs',
        name: '线性 DP (以爬楼梯为例)',
        title: '动态规划开门砖：大问题拆解为历史状态转移',
        stageId: 'gesp68',
        categoryId: 'gesp68-dp-math',
        level: 'GESP 7-8级必考',
        difficulty: '⭐⭐⭐⭐',
        summary: '不重复计算重叠子问题！到达第 n 级台阶，要么从第 n-1 级跨一步上来，要么从第 n-2 级跨两步上来，状态转移方程：dp[n] = dp[n-1] + dp[n-2]！',
        syntax: 'dp[i] = dp[i-1] + dp[i-2]',
        returnType: 'int',
        params: [],
        codeExample: `def climb_stairs(n):
    if n <= 2:
        return n
    dp = [0] * (n + 1)
    dp[1] = 1 # 到达第 1 阶只有 1 种方法
    dp[2] = 2 # 到达第 2 阶有 2 种方法 (1+1 或 2)
    
    for i in range(3, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]

print("爬 5 级台阶的总方法数:", climb_stairs(5))`,
        expectedOutput: '爬 5 级台阶的总方法数: 8',
        interactiveType: 'terminal',
        pitfall: '动态规划做题三部曲：1. 明确 dp[i] 的具体含义；2. 找准初始边界值（dp[1], dp[2]）；3. 写出状态转移方程。不要直接递归，一定要用数组保存结果，否则会大量重复计算超时！',
        tags: ['DP', '动态规划', '爬楼梯', '状态转移方程'],
      },
      {
        id: 'api-sieve-primes',
        name: '埃氏素数筛法 (Sieve of Eratosthenes)',
        title: '区间批量素数闪电筛选',
        stageId: 'gesp68',
        categoryId: 'gesp68-dp-math',
        level: 'GESP 7-8级必考',
        difficulty: '⭐⭐⭐⭐',
        summary: '如果要找出 1 到 100 万以内的所有素数，逐个判断会超时。埃氏筛像一张滤网：每发现一个素数 p，就把它的所有倍数 2p, 3p, 4p... 统统打上叉剔除！',
        syntax: 'is_prime = [True] * (n + 1)\nis_prime[0] = is_prime[1] = False',
        returnType: 'list[int]',
        params: [
          { name: 'n', type: 'int', required: true, desc: '筛选上限范围' },
        ],
        codeExample: `def sieve(n):
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    
    p = 2
    while p * p <= n:
        if is_prime[p]:
            # 从 p*p 开始将 p 的倍数标记为合数
            for i in range(p * p, n + 1, p):
                is_prime[i] = False
        p += 1
        
    return [i for i in range(2, n + 1) if is_prime[i]]

primes_under_30 = sieve(30)
print("30 以内的素数:", primes_under_30)`,
        expectedOutput: '30 以内的素数: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]',
        interactiveType: 'terminal',
        pitfall: '标记倍数时内层循环的起点是 p * p，而不是 2 * p，因为比 p * p 小的倍数早已经在前面的更小素数循环中被标记过了，从 p * p 开始能省去大量无用计算！',
        tags: ['素数筛', '埃氏筛', '数论', 'O(n log log n)'],
      },
    ],
  },
];
