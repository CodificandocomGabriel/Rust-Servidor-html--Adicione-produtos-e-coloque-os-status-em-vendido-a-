use actix_web::{post, get, App, HttpServer, Responder, HttpResponse};
use std::sync::Mutex;
use once_cell::sync::Lazy;
use actix_cors::Cors;

pub static PRODUTOS: Lazy<Mutex<Vec<String>>> = Lazy::new(|| Mutex::new(Vec::new()));
pub static STATUS: Lazy<Mutex<Vec<String>>> = Lazy::new(|| Mutex::new(Vec::new()));

#[post("/add")]
async fn add(body: String) -> impl Responder {
    let mut produtos = PRODUTOS.lock().unwrap();
    let mut status = STATUS.lock().unwrap();

    produtos.push(body.clone());
    status.push("Não vendido(a)".to_string());

    println!("{}", body);
    HttpResponse::Ok().finish()
}

#[get("/listarProdutos")]
async fn listar_produtos() -> impl Responder {
    let produtos = PRODUTOS.lock().unwrap();

    HttpResponse::Ok().json(&*produtos)
}

#[get("/listarStatus")]
async fn listar_status() -> impl Responder {
    let status = STATUS.lock().unwrap();

    HttpResponse::Ok().json(&*status)
}

#[post("/deletar")]
async fn deletar(body: String) -> impl Responder {
    let mut produto = PRODUTOS.lock().unwrap();
    let mut status = STATUS.lock().unwrap();

    println!("{}", body);

    produto.remove(body.trim().parse::<usize>().expect("Erro no programa"));
    status.remove(body.trim().parse::<usize>().expect("Erro no programa"));
    HttpResponse::Ok().finish()
}

#[post("/vender")]
async fn vender(body: String) -> impl Responder {
    let mut status = STATUS.lock().unwrap();

    println!("{}", body);

    status[body.trim().parse::<usize>().expect("Erro no programa")] = "vendido(a)".to_string();
    HttpResponse::Ok().finish()
}

#[tokio::main]
async fn main() -> std::io::Result<()> {
    let server = HttpServer::new(|| App::new().wrap(Cors::permissive()).service(add).service(listar_produtos).service(listar_status).service(deletar).service(vender))
    .bind("127.0.0.1:1122")?;

    server.run().await
}