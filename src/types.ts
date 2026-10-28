/**
 * PyKids Data Types & Definitions
 */

export type StageId = 'turtle' | 'gesp13' | 'gesp46' | 'gesp68';

export interface ParamDef {
  name: string;
  type: string;
  required: boolean;
  defaultVal?: string;
  desc: string;
}

export type InteractiveType = 
  | 'terminal'      // Standard Python code snippet with simulated interactive terminal run
  | 'turtle'        // HTML5 Canvas Turtle simulator
  | 'print_lab'     // Specialized print() parameter lab
  | 'input_lab'     // Specialized input() traps & 3-step pipeline visualizer
  | 'fstring_lab'   // Specialized f-string interactive lab
  | 'slice_lab'     // Visual string / list index and slice visualizer
  | 'custom';

export interface ApiItem {
  id: string;
  name: string;
  title: string;
  stageId: StageId;
  categoryId: string;
  level: string; // e.g. "启蒙", "GESP 1级", "GESP 2级", "GESP 3级", "GESP 4级", etc.
  difficulty: '⭐' | '⭐⭐' | '⭐⭐⭐' | '⭐⭐⭐⭐' | '⭐⭐⭐⭐⭐';
  summary: string; // 1. 小学生秒懂解释
  syntax: string; // 2. 语法格式
  returnType: string;
  params: ParamDef[]; // 参数解剖
  codeExample: string; // 标准代码
  expectedOutput: string;
  interactiveType: InteractiveType;
  pitfall: string; // 4. GESP 做题常见坑点（避坑指南）
  examTip?: string; // GESP 做题高频考点点拨
  tags: string[];
}

export interface Category {
  id: string;
  title: string;
  stageId: StageId;
  icon: string;
  badge: string;
  description: string;
  items: ApiItem[];
}

export interface Stage {
  id: StageId;
  title: string;
  subtitle: string;
  gespLevels: string;
  badge: string;
  accentColor: string;
  bgGradient: string;
  icon: string;
  description: string;
}

export interface CodeTemplate {
  id: string;
  title: string;
  gespLevel: string;
  category: string;
  summary: string;
  code: string;
  explanation: string;
  pitfall: string;
}
