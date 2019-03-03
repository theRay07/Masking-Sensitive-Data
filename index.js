let express = require('express')
let bodyParser = require('body-parser')
let multer = require('multer')
let storage = multer.memoryStorage()
let upload = multer({storage: storage})
let app = express()
let path = require("path")

app.use(bodyParser.urlencoded({
  extended:true
}))
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.get('/', function(req, res){
  res.render(path.join(__dirname, 'views', 'index.ejs'));
})


var name;
app.post('/form',function(req,res){
  name= req.body.firstname;

  var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
  var naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
    'version': '2018-11-16',
    'iam_apikey': 'RKPAc0LoO_Ig2aILeUI-dIAYVedRsoF9bF3hWZfa2cS_',
    'url': 'https://gateway-fra.watsonplatform.net/natural-language-understanding/api'
  });

  var parameters = {
     'text' : name,
    'features': {
      "entities": {

        "model": "f4a3635e-3428-4ffe-bbfe-dd758c8c500d"
      }
      },
      'keywords': {
        'emotion': true,
        'sentiment': true,
        'limit': 2
      }
    }


  naturalLanguageUnderstanding.analyze(parameters, function(err, response) {
    if (err)
      console.log('error:', err);
    else
      var output = response;
      console.log(response);
      // document.getElementById('output').innerHTML = response;

      array = output.entities;
      length = 0;
      var str = name;
      // console.log(str)
      while (length < array.length)
      {
        str = str.replace(String(array[length].text), "*****");
        // console.log(newStr)
        // array[length].text = newStr;
        length = length +1;
      }
      // console.log(str);
      // var str = name;

      res.render("output2.ejs",{out:str})
  });


})


app.listen(process.env.PORT||5000,function(){
  console.log("server started");
});
