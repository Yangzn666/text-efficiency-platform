<template>
  <div class="todo-dashboard">
    <!-- 今日待办 -->
    <div class="dashboard-section">
      <div class="section-header">
        <h2 class="section-title">📅 今日待办</h2>
        <el-button type="primary" @click="showAddDialog = true">
          <el-icon><Plus /></el-icon>
          添加任务
        </el-button>
      </div>
      
      <div class="today-todos">
        <div 
          v-if="todoStore.todayTodos.length === 0" 
          class="empty-state"
        >
          <el-icon size="60" color="#999"><Check /></el-icon>
          <h3>今日无待办事项</h3>
          <p>做得好！可以添加新的学习任务</p>
        </div>
        
        <div 
          v-else 
          class="todo-list"
        >
          <div 
            v-for="todo in todoStore.todayTodos" 
            :key="todo.id"
            class="todo-item"
            :class="{ completed: todo.completed }"
          >
            <div class="todo-content">
              <el-checkbox 
                :model-value="todo.completed"
                @change="todoStore.toggleTodo(todo.id)"
                size="large"
              />
              
              <div class="todo-info">
                <h4 class="todo-title">{{ todo.title }}</h4>
                <p v-if="todo.description" class="todo-desc">{{ todo.description }}</p>
                
                <div class="todo-meta">
                  <el-tag 
                    :color="todoStore.getPriorityColor(todo.priority)"
                    effect="dark"
                    size="small"
                  >
                    {{ todoStore.getPriorityText(todo.priority) }}
                  </el-tag>
                  
                  <span v-if="todo.category" class="todo-category">
                    {{ todo.category }}
                  </span>
                  
                  <span class="todo-date">
                    {{ formatDate(todo.createdAt) }}
                  </span>
                </div>
              </div>
            </div>
            
            <div class="todo-actions">
              <el-button 
                size="small" 
                @click="editTodo(todo)"
              >
                <el-icon><Edit /></el-icon>
              </el-button>
              <el-button 
                size="small" 
                type="danger"
                @click="deleteTodo(todo.id)"
              >
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 学习统计仪表盘 -->
    <div class="dashboard-section">
      <h2 class="section-title">📊 学习统计</h2>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #16345c 0%, #1e4576 100%)">
            <el-icon size="24" color="white"><List /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ todoStore.pendingTodos.length }}</div>
            <div class="stat-label">待完成任务</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #4CAF50 0%, #81C784 100%)">
            <el-icon size="24" color="white"><Check /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ todoStore.completedTodos.length }}</div>
            <div class="stat-label">已完成任务</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)">
            <el-icon size="24" color="white"><Warning /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ todoStore.highPriorityTodos.length }}</div>
            <div class="stat-label">高优先级</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #16345c 0%, #2a5290 100%)">
            <el-icon size="24" color="white"><Calendar /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ todoStore.todayTodos.length }}</div>
            <div class="stat-label">今日任务</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加/编辑任务对话框 -->
    <el-dialog
      v-model="showAddDialog"
      :title="editingTodo ? '编辑任务' : '添加任务'"
      width="500px"
      @close="resetForm"
    >
      <el-form
        ref="todoFormRef"
        :model="todoForm"
        :rules="formRules"
        label-width="80px"
      >
        <el-form-item label="任务标题" prop="title">
          <el-input
            v-model="todoForm.title"
            placeholder="请输入任务标题"
          />
        </el-form-item>
        
        <el-form-item label="任务描述" prop="description">
          <el-input
            v-model="todoForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入任务描述（可选）"
          />
        </el-form-item>
        
        <el-form-item label="优先级" prop="priority">
          <el-select v-model="todoForm.priority" placeholder="选择优先级">
            <el-option label="高优先级" value="high" />
            <el-option label="中优先级" value="medium" />
            <el-option label="低优先级" value="low" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="截止日期" prop="dueDate">
          <el-date-picker
            v-model="todoForm.dueDate"
            type="date"
            placeholder="选择截止日期（可选）"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        
        <el-form-item label="分类" prop="category">
          <el-select v-model="todoForm.category" placeholder="选择分类（可选）">
            <el-option label="数学" value="数学" />
            <el-option label="英语" value="英语" />
            <el-option label="政治" value="政治" />
            <el-option label="计算机" value="计算机" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAddDialog = false">取消</el-button>
          <el-button 
            type="primary" 
            @click="submitForm"
            :loading="submitLoading"
          >
            {{ editingTodo ? '更新' : '添加' }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useTodoStore } from '@/stores/todos'
import type { Todo } from '@/stores/todos'
import type { FormInstance, FormRules } from 'element-plus'

const todoStore = useTodoStore()

// 表单相关
const showAddDialog = ref(false)
const editingTodo = ref<Todo | null>(null)
const submitLoading = ref(false)
const todoFormRef = ref<FormInstance>()

const todoForm = reactive({
  title: '',
  description: '',
  priority: 'medium' as 'low' | 'medium' | 'high',
  dueDate: '',
  category: ''
})

const formRules = reactive<FormRules>({
  title: [
    { required: true, message: '请输入任务标题', trigger: 'blur' },
    { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
  ],
  priority: [
    { required: true, message: '请选择优先级', trigger: 'change' }
  ]
})

// 方法
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric'
  })
}

const editTodo = (todo: Todo) => {
  editingTodo.value = todo
  todoForm.title = todo.title
  todoForm.description = todo.description || ''
  todoForm.priority = todo.priority
  todoForm.dueDate = todo.dueDate || ''
  todoForm.category = todo.category || ''
  showAddDialog.value = true
}

const deleteTodo = async (id: string) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这个任务吗？',
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    todoStore.deleteTodo(id)
    ElMessage.success('任务删除成功')
  } catch {
    // 用户取消删除
  }
}

const submitForm = async () => {
  if (!todoFormRef.value) return
  
  try {
    await todoFormRef.value.validate()
    submitLoading.value = true
    
    const formData = {
      title: todoForm.title,
      description: todoForm.description,
      priority: todoForm.priority,
      dueDate: todoForm.dueDate || undefined,
      category: todoForm.category || undefined,
      completed: false
    }
    
    if (editingTodo.value) {
      todoStore.updateTodo(editingTodo.value.id, formData)
      ElMessage.success('任务更新成功')
    } else {
      todoStore.addTodo(formData)
      ElMessage.success('任务添加成功')
    }
    
    showAddDialog.value = false
    resetForm()
  } catch (error) {
    console.error('表单提交失败:', error)
  } finally {
    submitLoading.value = false
  }
}

const resetForm = () => {
  todoFormRef.value?.resetFields()
  editingTodo.value = null
  Object.assign(todoForm, {
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    category: ''
  })
}

onMounted(() => {
  todoStore.loadTodos()
})
</script>

<style scoped>
.todo-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.dashboard-section {
  background: white;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
}

.section-title {
  font-size: 1.8em;
  color: #333;
  margin: 0;
  font-weight: 700;
}

.today-todos {
  min-height: 200px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-state h3 {
  margin: 20px 0 10px 0;
  color: #666;
  font-size: 1.4em;
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background: #fafafa;
  border-radius: 15px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.todo-item:hover {
  background: #f0f8ff;
  border-color: #ffc53d;
  transform: translateX(5px);
}

.todo-item.completed {
  opacity: 0.7;
  background: #f5f5f5;
}

.todo-content {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  flex: 1;
}

.todo-info {
  flex: 1;
}

.todo-title {
  font-size: 1.2em;
  color: #333;
  margin: 0 0 8px 0;
  font-weight: 600;
}

.todo-desc {
  color: #666;
  margin: 0 0 12px 0;
  font-size: 0.95em;
  line-height: 1.5;
}

.todo-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.todo-category {
  background: #eef3fa;
  color: #16345c;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.85em;
  font-weight: 500;
}

.todo-date {
  color: #999;
  font-size: 0.85em;
}

.todo-actions {
  display: flex;
  gap: 10px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 25px;
  background: #fafafa;
  border-radius: 15px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 2em;
  font-weight: 800;
  color: #333;
  margin-bottom: 5px;
}

.stat-label {
  color: #666;
  font-size: 1em;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .todo-dashboard {
    padding: 15px;
  }
  
  .dashboard-section {
    padding: 20px;
  }
  
  .section-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .todo-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .todo-actions {
    align-self: flex-end;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-card {
    padding: 20px;
  }
}
</style>