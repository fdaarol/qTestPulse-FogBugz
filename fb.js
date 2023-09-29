const request = require('request');
const { Webhooks } = require('@qasymphony/pulse-sdk');

exports.handler = function ({ event: body, constants, triggers }, context, callback) {
function emitEvent(name, payload) {
    let t = triggers.find(t => t.name === name);
    return t && new Webhooks().invoke(t, payload);
}

let data = body;
let tokenHeaders = {
    'Content-Type': 'application/json',
    'Authorization': "bearer " + constants.QTEST_TOKEN
}


request({
    uri: constants.ServerURL + "/api/v3/projects/" + constants.ProjectID + "/defects",
    method: 'POST',
    headers: tokenHeaders,
    json: {
        "properties": [
        {   
            // summary
            "field_id": 793306,
            "field_name": "Summary",
            "field_value": data['casenumber'] + " - " + data['title'], 
        },
        {
            // description
            "field_id": 793309,
            "field_name": "Description",
            "field_value":  "Created by: " + data['personeditingname']
        },
        {
            // URL - CUSTOM field to add to your qTest Manager
            "field_id": 795510,
            "field_name": "FogBugz",
            "field_value":  constants.fbURL + "/f/cases/" + data['casenumber']
        }],

        "id": "",
        "pid": "",
        "submitted_date": new Date(), 
        "last_modified_date": new Date(),
        "name": data['casenumber'] + " - " + data['title'],
        "submitter_id": 1,
        "last_modified_user_id": 1

    }
}, function(error, response, body) {
    if (error) {
        console.error('Error:', error);
    }    
    console.log('Response:', body); 
});


}
