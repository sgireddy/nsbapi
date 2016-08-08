var keystone = require('keystone');
//var transform = require('model-transform');
var Types = keystone.Field.Types;

var Event = new keystone.List('Event', {	
	track: true,
});

Event.add({
	activity: { type: Types.Relationship, ref: 'Activity', required: true, initial: true, indiex: true },
	memberId: { type: Types.Relationship, ref: 'Member', required: true, initial: true, indiex: true },
    groupId: { type: Types.Relationship, ref: 'Group' },
    menterId: { type: Types.Relationship, ref: 'Member' },
    startTime: {type: Date, required: true, initial: true, index: true},
    duration: { type: Number, required: false, index: false, initial: true },
    description: { type: String },    
    visibility: { type: Types.Select, options: ['private', 'group', 'public'], required: true, index: true, default: 'group' },
    remainderInMinutes: { type: Number },
    price: { type: Number },    
    priceUoM: { type: Types.Select, options: ['hr', 'day', 'week', 'month', 'year'] },
    discount: { type: Number },
    total: { type: Number }	
});

// var deps = {
// 	videoEmbed: { videoEmbed: true, videoEmbedData: { exists: true } },
// };

// Event.add({
// 	name: { type: String, initial: true, required: true, index: true },
// 	eventType: { type: Types.Select, options: [ 'workshop', 'retreat', 'course', 'festival' ], index: true },
// 	eventState: { type: Types.Select, options: 'new, draft, published, suspended, archived', index: true },
// 	startDate: { type: Types.Date, initial: true, required: true },
// 	endDate: { type: Types.Date, initial: true },
// });

// Event.add('Contact Information', {
// 	phone: { type: String, width: 'short' },
// 	website: { type: Types.Url, collapse: true },
// 	location: { type: Types.Location, collapse: true, initial: true, required: ['suburb'] },
// 	bookingUrl: { type: Types.Url, collapse: true },
// });

// Event.add('Description', {
// 	price: { type: String, collapse: true },
// 	content: {
// 		brief: { type: Types.Html, wysiwyg: true, height: 150 },
// 		summary: { type: Types.Html, hidden: true },
// 		extended: { type: Types.Html, wysiwyg: true, height: 400 },
// 	},
// 	schedule: { type: Types.Html, wysiwyg: true, collapse: true },
// });

//transform.toJSON(Event);
Event.defaultColumns = 'activity, group|10%, menter|10%, member|10%, description|15%, remainderInMinutes';
Event.register();
