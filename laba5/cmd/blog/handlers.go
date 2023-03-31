package main

import (
	"html/template"
	"log"
	"net/http"
)

type featuredPostData struct {
	Title       string
	Subtitle    string
	ImgModifier string
	Author      string
	AuthorImg   string
	PublishDate string
}

type mostRecentPostData struct {
	Title       string
	Subtitle    string
	ImgModifier string
	Author      string
	AuthorImg   string
	PublishDate string
}

type indexPage struct {
	Title           string
	FeaturedPosts   []featuredPostData
	MostRecentPosts []mostRecentPostData
}

func index(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html")
	ts, err := template.ParseFiles("pages/index.html")
	if err != nil {
		http.Error(w, "Internal Server Error", 500)
		log.Println(err.Error())
		return
	}

	data := indexPage{
		Title:           "Escape.",
		FeaturedPosts:   featuredPosts(),
		MostRecentPosts: mostRecentPosts(),
	}
	err = ts.Execute(w, data)

	if err != nil {
		http.Error(w, "Internal Server Error", 500)
		log.Println(err.Error())
		return
	}
}

func post(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html")
	ts, err := template.ParseFiles("pages/the-road-ahead.html")
	if err != nil {
		http.Error(w, "Internal Server Error", 500)
		log.Println(err.Error())
		return
	}

	data := struct {
		Title string
	}{
		Title: "Es",
	}

	err = ts.Execute(w, data)
	if err != nil {
		http.Error(w, "Internal Server Error", 500)
		log.Println(err.Error())
		return
	}
}

func featuredPosts() []featuredPostData {
	return []featuredPostData{
		{
			Title:       "The Road Ahead",
			Subtitle:    "The road ahead might be paved - it might not be.",
			ImgModifier: "static/img/mouns.png",
			Author:      "Mat Vogels",
			AuthorImg:   "static/img/head-mat-vogels.png",
			PublishDate: "September 25, 2015",
		},
		{
			Title:       "From Top Down",
			Subtitle:    "Once a year, go someplace you’ve never been before.",
			ImgModifier: "static/img/fires.png",
			Author:      "William Wong",
			AuthorImg:   "static/img/head-william-wong.png",
			PublishDate: "September 25, 2015",
		},
	}
}

func mostRecentPosts() []mostRecentPostData {
	return []mostRecentPostData{
		{
			Title:       "Still Standing Tall",
			Subtitle:    "Life begins at the end of your comfort zone.",
			ImgModifier: "static/img/balls.jpg",
			Author:      "Mat Vogels",
			AuthorImg:   "static/img/head-mat-vogels.png",
			PublishDate: "9/25/2015",
		},
		{
			Title:       "Sunny Side Up",
			Subtitle:    "No place is ever as bad as they tell you it’s going to be.",
			ImgModifier: "static/img/brige.png",
			Author:      "Mat Vogels",
			AuthorImg:   "static/img/head-mat-vogels.png",
			PublishDate: "9/25/2015",
		},
		{
			Title:       "Water Falls",
			Subtitle:    "We travel not to escape life, but for life not to escape us.",
			ImgModifier: "static/img/field.png",
			Author:      "Mat Vogels",
			AuthorImg:   "static/img/head-mat-vogels.png",
			PublishDate: "9/25/2015",
		},
		{
			Title:       "Through the Mist",
			Subtitle:    "Travel makes you see what a tiny place you occupy in the world.",
			ImgModifier: "static/img/ocean.png",
			Author:      "William Wong",
			AuthorImg:   "static/img/head-william-wong.png",
			PublishDate: "9/25/2015",
		},
		{
			Title:       "Awaken Early",
			Subtitle:    "Not all those who wander are lost.",
			ImgModifier: "static/img/clouds.png",
			Author:      "Mat Vogels",
			AuthorImg:   "static/img/head-mat-vogels.png",
			PublishDate: "9/25/2015",
		},
		{
			Title:       "Try it Always",
			Subtitle:    "The world is a book, and those who do not travel read only one page.",
			ImgModifier: "static/img/waterfall.png",
			Author:      "Mat Vogels",
			AuthorImg:   "static/img/head-william-wong.png",
			PublishDate: "9/25/2015",
		},
	}
}
