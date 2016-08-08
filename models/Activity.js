var keystone = require('keystone');
//var transform = require('model-transform');
var Types = keystone.Field.Types;

var Activity = new keystone.List('Activity', {	
        track: true,
	    autokey: { path: 'slug', from: 'name', unique: true },        
        defaultSort: '-createdAt'
});    
    
Activity.add({
	name: { type: String, required: true, index: true },	
    category: { type: Types.Relationship, ref: 'ActivityCategory', required: true, initial: true, indiex: true },
    title: { type: String },
    description: { type: String },
    duration: { type: Number, required: false, index: false },	
    activityType: { type: Types.Select, 
                    options: ['personal', 'group', 'personal with menter', 'instructor led group'], 
                    required: true, initial: true, indiex: true },
    visibility: {   type: Types.Select, 
                    options: ['private', 'group', 'public'], 
                    required: true, index: true, initial: true },
    location: { type: Types.Location },	
    phone: { type: String },
    regularPrice: { type: Number },
    priceUoM: {   type: Types.Select, options: ['hr', 'day', 'week', 'month', 'year'] }
});

//transform.toJSON(Activity);
Activity.defaultColumns = 'name, category, title, duration, activityType, visibility, location, phone, regularPrice';
Activity.register();