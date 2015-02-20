var express = require('express');
var multer  = require('multer');
var app = express();
var fs = require('fs');
var exec = require('child_process').exec;

var UPLOAD_DIR = '../openQS';
app.use(express.static('./public'));

console.log('launching server...');

function S4() {
  return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
}

function generateUUID() { 
	return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
}

app.use(
	multer({
		dest: UPLOAD_DIR,
		rename: function (fieldname, filename) {
    	return generateUUID();
  	},
		onFileUploadStart: function (file) {
 			console.log(file.originalname + ' is starting ...')
		},
		onFileUploadComplete: function (file) {
  		console.log(file.fieldname + ' uploaded to  ' + file.path)
  		done = true;
		}
	})
);

app.get('/', function(req, res) {
    res.render('./public/index.html');
});


app.post('/share', function(req, res) {
	console.log(req.body);
	console.log(req.files);

	if (req.files) {
		var data = {
			birthYear : req.body.inputBirth,
			gender : req.body.inputGender,
			weight : req.body.inputWeight,
			height : req.body.inputHeight,
			jobPosture : req.body.inputJob,
			health : req.body.inputHealth,
			device : req.body.device,
			data : req.files.inputFile.name
		}
		fs.writeFileSync(req.files.inputFile.path + '.info', JSON.stringify(data));
		exec("cd " + UPLOAD_DIR + "; git add -A; git commit -am 'data'; git pull; git push origin master;")
	}

  res.sendfile('./public/thanks.html');
});


var server = app.listen(80, function () {
});

