var _ = require('lodash');

function modelToJSON (Model, fn) {      	
	var fields = Model.fields;     
	
	Model.schema.set('toJSON', { transform: function(doc, rtn, options) {
		var j = { id: rtn._id };
		//rtn.id = rtn._id;
		//delete rtn._id;
		//delete rtn.__v;
    _.forOwn(fields, function(k, v) {
        if(k.options.ui && doc._doc[v] !== undefined){
            j[v] = rtn[v];                
    	}  
    });
		if (fn) {
			var result = fn.call(doc, j, options);
			if (result) j = result;
		}		
		return j;
	}});
}

exports.toJSON = modelToJSON;

// function modelToJSON(schema, fn) {
// 	// support KeystoneJS Lists, which have the schema property nested
// 	schema = schema.schema || schema;
//     var fields = schema.paths;
    
// 	schema.post('init', { transform: function(doc, rtn, options) {        
//         rtn.ui.id = rtn._id;
// 		//delete rtn._id;
// 		//delete rtn.__v;        
//         _.forOwn(fields, function(k, v) {
//             if(k.options.ui && doc[v] !== undefined){
//                 rtn.ui.v = doc[v];                
//             }  
//         });        
// 		// if (fn) {
// 		// 	var result = fn.call(doc, rtn, options);
// 		// 	if (result) rtn = result;
// 		// }
//         console.log(rtn.ui);
// 		return rtn;
// 	}});
// }

// exports.getUI = modelToJSON;