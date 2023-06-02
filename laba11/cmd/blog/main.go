package main

import (
	"database/sql"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
)

const (
	port         = ":3000"
	dbDriverName = "mysql"
)

func main() {

	db, err := openDB()
	if err != nil {
		log.Fatal(err)
	}

	dbx := sqlx.NewDb(db, dbDriverName)

	mux := mux.NewRouter()
	mux.HandleFunc("/home", index(dbx))
	mux.HandleFunc("/post/{postId}/{title}", post(dbx))
	mux.HandleFunc("/login", login(dbx))
	mux.HandleFunc("/admin", admin(dbx))
	mux.HandleFunc("/api/post", createPost(dbx)).Methods(http.MethodPost)
	mux.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir("./static"))))
	http.ListenAndServe(port, mux)
}

func openDB() (*sql.DB, error) {
	// Здесь прописываем соединение к базе данных
	return sql.Open(dbDriverName, "root:root@tcp(127.0.0.1:3306)/blog?charset=utf8mb4&collation=utf8mb4_unicode_ci&parseTime=true")
}
