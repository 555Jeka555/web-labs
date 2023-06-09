package main

import (
	"database/sql"
	"html/template"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
)

type postData struct {
	PostId      string `db:"post_id"`
	Title       string `db:"title"`
	Subtitle    string `db:"subtitle"`
	ImgModifier string `db:"path_image"`
	Author      string `db:"author"`
	AuthorImg   string `db:"path_author_image"`
	PublishDate string `db:"publish_date"`
	PostURL     string
}

type postContent struct {
	Title       string `db:"title"`
	Subtitle    string `db:"subtitle"`
	Content     string `db:"content"`
	ImgModifier string `db:"path_image"`
}

type indexPage struct {
	Title           string
	FeaturedPosts   []postData
	MostRecentPosts []postData
}

func index(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		posts, err := getPosts(db, 1)
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err)
			return
		}

		miniPosts, err := getPosts(db, 0)
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err)
			return
		}

		w.Header().Set("Content-Type", "text/html")
		ts, err := template.ParseFiles("pages/index.html")
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err.Error())
			return
		}

		data := indexPage{
			Title:           "Escape.",
			FeaturedPosts:   posts,
			MostRecentPosts: miniPosts,
		}
		err = ts.Execute(w, data)

		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err.Error())
			return
		}
	}
}

func post(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html")

		postIdStr := mux.Vars(r)["postId"]
		postId, err := strconv.Atoi(postIdStr)
		if err != nil {
			http.Error(w, "Invalid order id", 403)
			log.Println(err)
			return
		}

		post, err := postById(db, postId)
		if err != nil {
			if err == sql.ErrNoRows {
				http.Error(w, "Order not found", 404)
				log.Println(err)
				return
			}
			http.Error(w, "Internal Server Error", 500)
			log.Println(err)
			return
		}

		ts, err := template.ParseFiles("pages/post.html")
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err.Error())
			return
		}

		err = ts.Execute(w, post)
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err.Error())
			return
		}
	}
}

func getPosts(db *sqlx.DB, feature int) ([]postData, error) {
	var query = ""
	if feature == 1 {
		query = `
		SELECT
			post_id,
			title,
			subtitle,
			path_image,
			author,
			path_author_image,
			publish_date
		FROM
			post
		WHERE featured = 1
	`
	} else if feature == 0 {
		query = `
		SELECT
			post_id,
			title,
			subtitle,
			path_image,
			author,
			path_author_image,
			publish_date
		FROM
			post
		WHERE featured = 0
	`
	}

	var posts []postData
	err := db.Select(&posts, query)
	if err != nil {
		return nil, err
	}

	for _, post := range posts {
		post.PostURL = "/post/" + post.PostId
	}

	return posts, nil
}

func postById(db *sqlx.DB, postID int) (postContent, error) {
	const query = `
		SELECT
			title,
			subtitle,
			path_image,
			content
		FROM
			post
		WHERE
			post_id = ?
	`
	var post postContent

	err := db.Get(&post, query, postID)
	if err != nil {
		return postContent{}, err
	}

	return post, nil
}
