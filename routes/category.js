var express = require('express'); 
var router = express.Router();
var mongoose = require('mongoose');
var categoryModel = require('../models/category');
/* GET category listing. */

//fetching data from mongodb
router.get('/', function(request,response){ //link url in browser
  mongoose.model('category').find({}, function(err,data){ //db.categories.find()
  //response.json(data);
    if(err){
      throw err;
    }
    response.json(data);
  }).sort({id: 1}); //filter

});

router.get('/:ccid', function(request,response){ //link url in browser
  mongoose.model('category').find({id: request.params.ccid}, function(err,data){ //db.categories.find()
  
    if(err){
      throw err;
    }
    response.json(data);
  });
});

router.delete('/deleteCategory/:pid', function(request,response){ //link url in browser
	mongoose.model('category').remove({id: request.params.pid}, function(err,data){
		 if(err){
      throw err;
    }
	});
	
	   mongoose.model('category').find({}, function(err,data){ //db.categories.find()
  
    if(err){
      throw err;
    }
    response.json(data);
  });
});
//npm install body-parser --save
router.put('/editCategory', function(request,response){ //link url in browser
	

	 mongoose.model('category').update({id: request.body.cid},{name: request.body.categoryName}, function(err,data){ //db.categories.find()
	    if(err){
	      throw err;
	    }
				     mongoose.model('category').find({}, function(err,data){ //db.categories.find()
				
					    if(err){
					      throw err;
					    }
					     response.json(data);
				 		
				 			 }).sort({id: 1}); //filter
	     });


});



router.get('/decending', function(request,response){ //link url in browser
  mongoose.model('category').find({}, function(err,data){ //db.categories.find()

    if(err){
      throw err;
    }
    response.json(data);
  }).sort({name: -1});
});

router.put('/addCategory', function(request,response){ //link url in browser
	var datalength;
	mongoose.model('category').find({}, function(err,data){
		datalength =data.length;
		mongoose.model('category').update({id: datalength},{name: request.body.categoryName},{upsert:true}, function(err,data){ //db.categories.find()
		    if(err){
		      throw err;
		    }
					     mongoose.model('category').find({}, function(err,data){ //db.categories.find()
					
						    if(err){
						      throw err;
						    }
						     response.json(data);
					 		
					 			 }).sort({id: 1}); //filter
		     });


		});
	});



module.exports = router;



//send string message
/*
router.get('/message',function(request,response){
	response.send("helloworld");

	if(err){
      throw err;
    }
});
*/