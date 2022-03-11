extern crate open;
use tauri::Manager;

fn main() {
  
  tauri::Builder::default()
  .setup(|app| {
    let _id = app.listen_global("open-website", |_| {
      open::that("https://github.com/redblackfury/AttackRussianWeb").unwrap();
    });
    Ok(())
  })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
