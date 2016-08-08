var client = require('then-redis').createClient({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT });

function cache (key, value, isTransient){
    if (isTransient) {
        return client.set(key, value)
                     .then(function() {                            
                                return client.expire(key, process.env.SESSION_TIMEOUT || 60);
                        });        
    } else {
        return client.set(key, value);
    }    
}

exports.set = function set(key, value, isTransient) {
    return cache(key, value, isTransient);
}

exports.setJSON = function (key, value, isTransient) {
    var k = key.toString(),
        v = JSON.stringify(value);
    return cache(k, v, isTransient);    
}

exports.setMongoObject = function (obj, isTransient) {
    var k = obj._id.toString(),
        v = JSON.stringify(obj);
    return cache(k, v, isTransient);    
}

exports.get = function (key){
    return client.get(key);
}

exports.getJSON = function (key){
    return client.get(JSON.parse(key));
}

exports.getMongoObject = function (key) {
    if (id.match(/^[0-9a-fA-F] { 24 } $/)) {
        return client.get(JSON.parse(key));
    } else {
        return client.get(key);
    }    
}