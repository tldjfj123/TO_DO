use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

const TITLE_MAX_LEN: usize = 128;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct TodoItem {
    pub id: u32,
    pub title: String,
    pub completed: bool,
    pub created_at: u64,
    pub updated_at: Option<u64>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum TodoError {
    EmptyTitle,
    TooLong,
}

impl TodoError {
    fn message(&self) -> &'static str {
        match self {
            TodoError::EmptyTitle => "할 일 제목을 입력해주세요.",
            TodoError::TooLong => "제목은 128자 이하여야 합니다.",
        }
    }
}

#[wasm_bindgen]
pub struct TodoList {
    next_id: u32,
    items: Vec<TodoItem>,
}

impl TodoList {
    fn add_item(&mut self, title: &str) -> Result<TodoItem, TodoError> {
        let normalized = normalize_title(title)?;
        let now = now_millis();

        let item = TodoItem {
            id: self.next_id,
            title: normalized,
            completed: false,
            created_at: now,
            updated_at: None,
        };

        self.next_id += 1;
        self.items.insert(0, item.clone());
        Ok(item)
    }

    fn hydrate_items(&mut self, items: Vec<TodoItem>) {
        self.next_id = items.iter().map(|item| item.id).max().unwrap_or(0) + 1;
        self.items = items;
    }
}

#[wasm_bindgen]
impl TodoList {
    #[wasm_bindgen(constructor)]
    pub fn new() -> TodoList {
        TodoList {
            next_id: 1,
            items: Vec::new(),
        }
    }

    #[wasm_bindgen(js_name = "fromJson")]
    pub fn from_json(raw: JsValue) -> Result<TodoList, JsValue> {
        if raw.is_null() || raw.is_undefined() {
            return Ok(TodoList::new());
        }

        let items: Vec<TodoItem> = serde_wasm_bindgen::from_value(raw).map_err(js_from_error)?;
        let mut list = TodoList::new();
        list.hydrate_items(items);
        Ok(list)
    }

    #[wasm_bindgen(js_name = "items")]
    pub fn items(&self) -> Result<JsValue, JsValue> {
        serde_wasm_bindgen::to_value(&self.items).map_err(js_from_error)
    }

    pub fn add(&mut self, title: String) -> Result<JsValue, JsValue> {
        let item = self.add_item(&title).map_err(js_from_error)?;
        serde_wasm_bindgen::to_value(&item).map_err(js_from_error)
    }

    pub fn toggle(&mut self, id: u32) -> bool {
        if let Some(item) = self.items.iter_mut().find(|todo| todo.id == id) {
            item.completed = !item.completed;
            item.updated_at = Some(now_millis());
            true
        } else {
            false
        }
    }

    pub fn remove(&mut self, id: u32) -> bool {
        if let Some(index) = self.items.iter().position(|todo| todo.id == id) {
            self.items.remove(index);
            true
        } else {
            false
        }
    }

    #[wasm_bindgen(js_name = "hydrate")]
    pub fn hydrate(&mut self, raw: JsValue) -> Result<(), JsValue> {
        if raw.is_null() || raw.is_undefined() {
            return Ok(());
        }

        let items: Vec<TodoItem> = serde_wasm_bindgen::from_value(raw).map_err(js_from_error)?;
        self.hydrate_items(items);
        Ok(())
    }
}

fn normalize_title(input: &str) -> Result<String, TodoError> {
    let trimmed = input.trim();

    if trimmed.is_empty() {
        return Err(TodoError::EmptyTitle);
    }

    if trimmed.chars().count() > TITLE_MAX_LEN {
        return Err(TodoError::TooLong);
    }

    Ok(trimmed.to_owned())
}

#[cfg(target_arch = "wasm32")]
fn now_millis() -> u64 {
    js_sys::Date::now() as u64
}

#[cfg(not(target_arch = "wasm32"))]
fn now_millis() -> u64 {
    use std::time::{SystemTime, UNIX_EPOCH};
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_millis() as u64
}

fn js_from_error<E: ToString>(err: E) -> JsValue {
    JsValue::from_str(&err.to_string())
}

impl ToString for TodoError {
    fn to_string(&self) -> String {
        self.message().to_owned()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn rejects_empty_title() {
        assert!(normalize_title("   ").is_err());
    }

    #[test]
    fn rejects_long_title() {
        let long = "a".repeat(TITLE_MAX_LEN + 1);
        assert!(normalize_title(&long).is_err());
    }

    #[test]
    fn trims_valid_title() {
        let result = normalize_title("  hello  ").unwrap();
        assert_eq!(result, "hello");
    }

    #[test]
    fn add_creates_item() {
        let mut list = TodoList::new();
        let created = list.add_item("첫 번째 할 일").unwrap();

        assert_eq!(created.id, 1);
        assert_eq!(list.items.len(), 1);
        assert!(!created.completed);
    }

    #[test]
    fn toggle_updates_state() {
        let mut list = TodoList::new();
        list.add_item("테스트").unwrap();
        assert!(list.toggle(1));
        assert!(list.items[0].completed);
        assert!(list.toggle(1));
        assert!(!list.items[0].completed);
    }

    #[test]
    fn remove_deletes_item() {
        let mut list = TodoList::new();
        list.add_item("테스트").unwrap();
        assert!(list.remove(1));
        assert!(list.items.is_empty());
    }

    #[test]
    fn hydrate_restores_items() {
        let mut list = TodoList::new();
        list.add_item("테스트").unwrap();
        let snapshot = list.items.clone();

        let mut hydrated = TodoList::new();
        hydrated.hydrate_items(snapshot);

        assert_eq!(hydrated.items.len(), 1);
        assert_eq!(hydrated.next_id, 2);
    }
}
