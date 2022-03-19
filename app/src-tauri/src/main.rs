extern crate open;
use reqwest::header::USER_AGENT;
use std::time::{Duration, Instant};
use serde_derive::Deserialize;
use futures::future::join_all;

#[tauri::command]
fn open_website(link: String) {
  open::that(link).unwrap();
}

async fn do_req(url: String, ua: &String) -> Result<(), reqwest::Error> {
 let client = reqwest::Client::new();
 client
    .get(url)
    .header(USER_AGENT, ua)
    .timeout(Duration::from_secs(10))
    .send()
    .await?;
  Ok::<(), reqwest::Error>(())
}

#[derive(Deserialize)]
struct InData {
  urls: Vec<String>,
  ua: String,
}


#[tauri::command]
async fn run_fetch(data: String) -> () {
  let v: InData = serde_json::from_str(&data).unwrap();
  let mut futures = Vec::new();
  let now = Instant::now();
  println!("prepare");
  for url in v.urls {
    futures.push(do_req(url, &v.ua))
  }
  println!("before join");
  
  join_all(futures).await;
  // results = j..
  // for res in results {
    // if let Err(e) = res {
    // println!("Error: {}", e);
    // }
  //}
  println!("finished in {}", now.elapsed().as_secs());
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![run_fetch, open_website])
    .run(tauri::generate_context!())
    .expect("failed to run app");
}
