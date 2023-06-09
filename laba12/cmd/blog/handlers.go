package main

import (
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"os"
	"strings"
	"time"

	"html/template"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
)

const authCookieName = "authCookieName"

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

type User struct {
	Id       int    `db:"user_id"`
	Email    string `json:"email" db:"email"`
	Password string `json:"password" db:"password"`
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

		err := authByCookie(db, w, r)
		fmt.Println(err)
		if err != nil {
			return
		}
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

func authByCookie(db *sqlx.DB, w http.ResponseWriter, r *http.Request) error {
	cookie, err := r.Cookie(authCookieName)
	if err != nil {
		if err == http.ErrNoCookie {
			http.Error(w, "No authcookie passed", 401)
			log.Println(err)
			return err
		}
		http.Error(w, "Internal Server Error", 500)
		log.Println(err)
		return err
	}

	userID, _ := strconv.Atoi(cookie.Value)
	if !isCorrectUserId(db, userID) {
		http.Error(w, "No authcookie passed", 401)
		return errors.New("Incorrect user id")
	}
	return nil
}

func isCorrectUserId(db *sqlx.DB, userId int) bool {
	var IDs []int
	query := `select user_id from user`
	err := db.Select(&IDs, query)
	fmt.Println(err)
	if err != nil {
		return false
	}
	fmt.Println(len(IDs), IDs)
	if len(IDs) == 0 {
		return false
	}

	return true
}

func loginUser(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		defer r.Body.Close()

		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "1Error", 500)
			log.Println("1" + err.Error())
			return
		}

		var user User
		err = json.Unmarshal(body, &user)

		if err != nil {
			http.Error(w, "2Error", 500)
			log.Println("2" + err.Error())
			return
		}
		if isRegisteredUser(db, user) {
			http.SetCookie(w, &http.Cookie{
				Name:    authCookieName,
				Value:   fmt.Sprint(user.Id),
				Path:    "/",
				Expires: time.Now().AddDate(0, 0, 1),
			})
			w.WriteHeader(http.StatusOK)
		} else {
			http.Error(w, "Incorrect password or email", 401)
		}
	}
}

func isRegisteredUser(db *sqlx.DB, user User) bool {
	query := `SELECT user_id, email, password FROM user WHERE email =?`

	var users []User
	err := db.Select(&users, query, user.Email)
	if err != nil {
		return false
	}

	if len(users) == 0 {
		return false
	}
	if users[0].Password != user.Password {
		return false
	}
	return true
}

func logoutUser(w http.ResponseWriter, r *http.Request) {
	http.SetCookie(w, &http.Cookie{
		Name:    authCookieName,
		Path:    "/",
		Expires: time.Now().AddDate(0, 0, -1),
	})
	w.WriteHeader(http.StatusOK)
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
		err = json.Unmarshal(reqData, &req)
		if err != nil {
			http.Error(w, "2Error", 500)
			log.Println(err.Error())
			return
		}

		authorImg, err := base64.StdEncoding.DecodeString(req.AuthorPhoto[strings.IndexByte(req.AuthorPhoto, ',')+1:])
		if err != nil {
			http.Error(w, "img", 500)
			log.Println(err.Error())
			return
		}

		fileAuthor, err := os.Create("static/img/" + req.AuthorPhotoName)
		_, err = fileAuthor.Write(authorImg)

		image, err := base64.StdEncoding.DecodeString(req.Image[strings.IndexByte(req.Image, ',')+1:])
		if err != nil {
			http.Error(w, "img", 500)
			log.Println(err.Error())
			return
		}

		fileImage, err := os.Create("static/img/" + req.ImageName)
		_, err = fileImage.Write(image)

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
