extern crate open;
use reqwest::header::USER_AGENT;
use std::time::Duration;

#[tauri::command]
fn open_website(link: String) {
  open::that(link).unwrap();
}


#[tauri::command]
async fn run_fetch(url: String, ua: String) {
  let client = reqwest::Client::new();
  client
    .get(url)
    .header(USER_AGENT, ua)
    .timeout(Duration::from_secs(10))
    .send()
    .await;

  // if needed to receive feedback
  // let result = client.get...
  // 
  // let result = match result {
  //     Ok(response) => response.status().to_string(),
  //     Err(error) => error.to_string()
  // };
  // println!("res {}", result);
}


fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![run_fetch, open_website])
    .run(tauri::generate_context!())
    .expect("failed to run app");
}
