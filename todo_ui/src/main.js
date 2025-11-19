import './style.css'
import initWasm, { TodoList } from './wasm/todo_wasm.js'
import { FILTERS, applyFilter, remainingCount } from './lib/filters.js'

const STORAGE_KEY = 'todo-wasm-items'

const app = document.querySelector('#app')

app.innerHTML = `
  <main class="todo-app">
    <header>
      <p class="badge">✨ 낯선 도구 해커톤</p>
      <h1>Rust + WASM To-Do</h1>
      <p class="muted" id="summary">오늘의 할 일 (0)</p>
    </header>

    <form id="todo-form" autocomplete="off">
      <input
        id="todo-input"
        type="text"
        placeholder="해야 할 일을 입력하고 Enter 를 누르세요"
      />
      <button type="submit">추가</button>
    </form>
    <p class="error" id="todo-error" role="alert"></p>

    <section class="toolbar">
      <div class="filters" id="filters">
        <button type="button" data-filter="all" class="active">전체</button>
        <button type="button" data-filter="active">진행중</button>
        <button type="button" data-filter="done">완료</button>
      </div>
      <span id="counter">0개 남음</span>
    </section>

    <ul id="todo-list" class="todo-list"></ul>
  </main>
`

const elements = {
  form: document.getElementById('todo-form'),
  input: document.getElementById('todo-input'),
  list: document.getElementById('todo-list'),
  counter: document.getElementById('counter'),
  summary: document.getElementById('summary'),
  error: document.getElementById('todo-error'),
  filters: document.getElementById('filters'),
}

let todoList = null
let currentFilter = 'all'

const formatSummary = (items) =>
  `오늘의 할 일 (${remainingCount(items)})`

const persist = (items) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch (error) {
    console.warn('로컬 저장에 실패했습니다.', error)
  }
}

const loadInitialItems = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch (error) {
    console.warn('저장된 데이터를 읽을 수 없습니다.', error)
    return null
  }
}

const setError = (message = '') => {
  elements.error.textContent = message
  elements.error.hidden = !message
}

const renderEmptyState = () => {
  elements.list.innerHTML = `
    <li class="empty">
      <span>아직 할 일이 없습니다. 첫 할 일을 추가해 보세요!</span>
    </li>
  `
}

const renderTodos = () => {
  const items = todoList.items()
  const visible = applyFilter(items, currentFilter)

  if (visible.length === 0) {
    renderEmptyState()
  } else {
    elements.list.innerHTML = visible
      .map(
        (item) => `
        <li class="todo-item ${item.completed ? 'completed' : ''}" data-id="${item.id}">
          <button class="toggle" data-action="toggle" aria-label="완료 토글">
            <span>${item.completed ? '✓' : ''}</span>
          </button>
          <span class="title">${item.title}</span>
          <button class="delete" data-action="delete" aria-label="삭제">×</button>
        </li>
      `
      )
      .join('')
  }

  elements.counter.textContent = `${remainingCount(items)}개 남음`
  elements.summary.textContent = formatSummary(items)
  persist(items)
}

const handleSubmit = (event) => {
  event.preventDefault()
  const value = elements.input.value

  try {
    todoList.add(value)
    elements.input.value = ''
    setError('')
    renderTodos()
  } catch (error) {
    if (typeof error === 'string') {
      setError(error)
      return
    }

    if (error && typeof error.message === 'string') {
      setError(error.message)
    } else {
      setError('알 수 없는 오류가 발생했습니다.')
    }
  }
}

const handleListClick = (event) => {
  const button = event.target.closest('button[data-action]')
  if (!button) return

  const itemEl = button.closest('.todo-item')
  if (!itemEl) return

  const id = Number(itemEl.dataset.id)
  if (button.dataset.action === 'toggle') {
    todoList.toggle(id)
  } else if (button.dataset.action === 'delete') {
    todoList.remove(id)
  }

  renderTodos()
}

const handleFilterClick = (event) => {
  const button = event.target.closest('button[data-filter]')
  if (!button) return

  currentFilter = button.dataset.filter
  FILTERS.forEach((filter) => {
    const target = elements.filters.querySelector(`[data-filter="${filter}"]`)
    target.classList.toggle('active', filter === currentFilter)
  })

  renderTodos()
}

const bootstrap = async () => {
  await initWasm()

  const storedItems = loadInitialItems()
  if (storedItems) {
    try {
      todoList = TodoList.fromJson(storedItems)
    } catch (error) {
      console.warn('저장된 데이터를 복원할 수 없습니다.', error)
      todoList = new TodoList()
    }
  } else {
    todoList = new TodoList()
  }

  elements.form.addEventListener('submit', handleSubmit)
  elements.list.addEventListener('click', handleListClick)
  elements.filters.addEventListener('click', handleFilterClick)
  setError('')

  renderTodos()
}

bootstrap()
