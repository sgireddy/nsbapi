var keystone = require('keystone'),
	Types = keystone.Field.Types;

var MemberHistory = new keystone.List('MemberHistory', {track: true});

MemberHistory.add({
    member: { type: Types.Relationship, ref: 'Member', initial: true, index: true, required: true },
    token: { type: String, initial: true, required: true },
    coords: { type: Types.GeoPoint },
    gpsAccuracy: { type: Number },
    ipAddress: { type: String }
	});

function isActive(value)
{
  return (value.createdAt + 60 * 100) < Date.now();
}

MemberHistory.add('Meta', {

	isActive : {type: Boolean, validate: isActive }

});


MemberHistory.defaultColumns = 'Member, isActive';

MemberHistory.register();