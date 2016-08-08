var keystone = require('keystone');
//var transform = require('model-transform');
var Types = keystone.Field.Types;

var EventHistory = new keystone.List('EventHistory', {	
	track: true,
});

EventHistory.add({
	event: { type: Types.Relationship, ref: 'Event', required: true, initial: true, indiex: true },	
    actionType: { type: Types.Select, options: ['start', 'end', 'suspended', 'canceled', 'remainder', 'moved'], required: true, initial: true, index: true }	
});

//transform.toJSON(EventHistory);
EventHistory.defaultColumns = 'event, actionType';
EventHistory.register();