const express = require("express"); //allows use of express s a dependency fom the modules

const ejs = require("ejs"); //allows the use of ejs s a dependency fom the modules

const bodyParser = require("body-Parser"); //allows use of body-Parser as a dependency fom the modules

const mongoose = require("mongoose"); //allows use of mongoose as a dependency fom the modules

const app = express(); 

app.use(bodyParser.urlencoded({extended:true}));//use body-Parser to grab stuff from the client

//this helps us use express to serve up static files to the browser like CSS for this case
app.use(express.static("public"));


app.set("view engine", "ejs"); //use our app that is generated by ejs as its view engine

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser:true}); //helps to use mongoose to connect to our database & property is added for errors

//set up document schema for the db
const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema); //this creates the article model using mongoose

////////////////////////////// REQUEST TARGETING ALL  ARTICLES ////////////////////////////////////////

//GPPPD same as CRUD 
//Use mongoose method for the Chained route handlers to use a single app.route to target all the articles
app.route("/articles")
.get(function (req, res) {
    // GET aka CREATE
    //Create the GET route to enable to Read our articles from the database
    //using mongoose to find the documents in our db
    Article.find({}, function (err, foundArticles) {
        if (!err) {
            res.send(foundArticles);
        } else {
            res.send(err);
        }
    })
})

.post(function(req, res){
    // POST aka READ
    //this creates our new articles thru the API and passes it thre the server and save it onto our database
    //Create a new object to add to the db
    const newArticle = new Article({
        //using body-parser to tap into the title and content of our articles
        title: req.body.title,
        content:req.body.content
    });

    //this saves the new article to enter onto the db using  mongodb
    newArticle.save(function(err){
        if(!err){
            res.send("Success on adding your new Article")
        }else{
            res.send(err);
        }
    });

})

.delete(function(req, res){
    // DELETE
    //The delete method for the deleting stuff from our database using Postman and our built API
    Article.deleteMany(function(err){
        if(!err){
           res.send("Successfully deleted all the documents!! Voila!!!")
        }else{
            res.send(err)
        }
    });
}); 

////////////////////////////////////// REQUEST TARGETING A SPECIFIC ARTICLE ///////////////////////////////

//use the chained method for a specific article
app.route("/articles/:articleTitle")

.get(function(req, res){

    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){ //this uses the the route parameter needed to get the specific article
        if(!err){
            res.send(foundArticle)
        }else{
            res.send(" Opps!! did not find the specific article you were looking for!!")
        }
    });
});


//this is the route thru which the server runs 
app.listen(3000,()=>{

    console.log("server is up and running!!!");

});