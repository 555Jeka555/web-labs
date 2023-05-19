package main

import (
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"io"
	"os"
	"strings"

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

type createPostRequest struct {
	Title           string `json:"title"`
	Description     string `json:"description"`
	AuthorName      string `json:"author"`
	AuthorPhoto     string `json:"avatar"`
	AuthorPhotoName string `json:"avatar_name"`
	Date            string `json:"date"`
	Image           string `json:"hero"`
	ImageName       string `json:"hero_name"`
	Content         string `json:"content"`
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

func login(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html")

		ts, err := template.ParseFiles("pages/login.html")
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err.Error())
			return
		}

		err = ts.Execute(w, nil)
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err.Error())
			return
		}
	}
}

func admin(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html")

		ts, err := template.ParseFiles("pages/admin.html")
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

func createPost(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		reqData, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "1Error", 500)
			log.Println(err.Error())
			return
		}

		var req createPostRequest

		authorImg, err := base64.StdEncoding.DecodeString(req.AuthorPhoto)
		if err != nil {
			http.Error(w, "img", 500)
			log.Println(err.Error())
			return
		}

		fileAuthor, err := os.Create("static/img/" + req.AuthorPhotoName)
		_, err = fileAuthor.Write(authorImg)

		image, err := base64.StdEncoding.DecodeString(req.Image)
		if err != nil {
			http.Error(w, "img", 500)
			log.Println(err.Error())
			return
		}

		fileImage, err := os.Create("static/img/" + req.ImageName)
		_, err = fileImage.Write(image)

		err = json.Unmarshal(reqData, &req)
		if err != nil {
			http.Error(w, "2Error", 500)
			log.Println(err.Error())
			return
		}

		req.Date = formatDate(req.Date)

		

		err = saveOrder(db, req)
		if err != nil {
			http.Error(w, "bd", 500)
			log.Println(err.Error())
			return
		}

		return
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

	for index, post := range posts {
		post.PostURL = "/post/" + post.PostId + "/" + strings.ReplaceAll(post.Title, " ", "-")
		posts[index] = post
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

func saveOrder(db *sqlx.DB, req createPostRequest) error {
	const query = `
		INSERT INTO
			post
		(
			title,
			subtitle,
			author,
			path_author_image,
			publish_date,
			path_image,
			content,
			featured
		)
		VALUES
		(
			?,
			?,
			?,
			CONCAT('static/img/', ?),
			?,
			CONCAT('static/img/', ?),
			?,
			?
		)
	`

	_, err := db.Exec(query, req.Title, req.Description, req.AuthorName, req.AuthorPhotoName, req.Date, req.ImageName, req.Content, 0)
	return err
}

func formatDate(oldDate string) string {
	dateStr := strings.Split(oldDate, "-")
	newDateStr := dateStr[2] + "/" + dateStr[1] + "/" + dateStr[0]
	return newDateStr
}
