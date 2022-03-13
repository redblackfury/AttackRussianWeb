extern crate open;
use tauri::Manager;

#[tauri::command]
fn open_website(link: String) {
  open::that(link).unwrap();
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![open_website])
    .run(tauri::generate_context!())
    .expect("failed to run app");
}
