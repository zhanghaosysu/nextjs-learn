// 任务类型定义
export interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: number; // SQLite 使用 0/1 表示布尔值
  created_at: string;
  updated_at: string;
}

// 创建任务的输入类型
export interface CreateTaskInput {
  title: string;
  description?: string;
}

// 更新任务的输入类型
export interface UpdateTaskInput {
  title?: string;
  description?: string;
  completed?: boolean;
}
