var keystone = require('keystone');
var transform = require('../util/transform');
var Types = keystone.Field.Types;

var MemberRelation = new keystone.List('MemberRelation', {	
	track: true,
});

MemberRelation.add({
    member: { type: Types.Relationship, ref: 'Member', required: true, initial: true, index: true },
	provider:  { type: Types.Relationship, ref: 'Member', required: true, initial: true, index: true },
    relation: { type: Types.Select, options: 'Parent, Family, CareGiver', default: 'CareGiver', index: true },	
    status: { type: Types.Select, options: 'pending, active, suspended, inactive, orphaned, deleted', default: 'pending', index: true },
    isPaid: {type: Types.Boolean, default: false }    
});

transform.toJSON(MemberRelation, function (rtn){
    rtn.message = "Hello MemberRelation !!!!!";
});
MemberRelation.defaultColumns = 'provider, member, relation, status, isPaid';
MemberRelation.register();

//Hooks needed to validate roles