//require
const express = require ("express");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require ("ejs");

//use
const app = express(); // start using express
app.use (bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// connect to db
mongoose.connect ("mongodb://localhost:27017/wikiDB",{ useNewUrlParser: true});

//create a schema
const articleSchema = {
  title: String,
  content: String
};

//create a model
const Article = mongoose.model("Article", articleSchema);


// HTTP REQUESTS TO ALL ARTICLES

app.route("/articles")

.get(function(req,res) {
Article.find(function(err,foundArticles) {
  console.log(foundArticles);

  if (!err) {
    res.send (foundArticles);
  }else {
    res.send(err);
  }
});
})

.post(function(req,res) {
  console.log(req.body.title);  // title and content will be inputs in html page
  console.log(req.body.content);

 const newArticle = new Article ({
   title:req.body.title,
   content: req.body.content
 });

newArticle.save(function(err) {
  if (!err) {
   console.log("succesfully saved to database");
  }else {
   console.log(err);
  };
});
})

.delete(function (req,res) {
Article.deleteMany (function(err){
  if (!err) {
    res.send("succesfully deleted all articles")
  }else {
    res.send(err);
  }
});
});

//  HTTP REQUESTS TO A SPECIFIC ARTICLES

app.route("/articles/:articleTitle")

.get (function (req,res) {
  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){  //req.params.articleTitle is a param, that is put in the route
    if (foundArticle) {
      res.send(foundArticle)
    }else {
      res.send ("No articles with this title were found.")
    }
  });
})
.put (function (req,res) {
  Article.update(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function (err) {
      if (!err) {
        res.send("succesfully updated");
      }
    }
);
})
.patch (function(req,res){
  Article.update (
    {title:req.params.articleTitle},
    {$set: req.body},
    function (err) {
      if (!err) {
        res.send ("Successfully updated.")  // only changes specific value. request: PATCH, route: localhost:3035/articles/fname%20lastname
      }else {
        res.send(err);
      }
    }
  );
})
.delete (function (req,res) {
  Article.deleteOne (
    {title:req.params.articleTitle},
    function (err) {
      if (!err) {
        res.send ("Successfully deleted.")
      }else {
        res.send(err);
      }
    }
  );
});



app.listen (3035, function() {
  console.log("server started on 3035 port");
});
