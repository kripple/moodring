if (Meteor.isClient) {

  Session.setDefault('nprData', "nothing yet");


  Template.retrieve.helpers({
    nprData: function () {
      return Session.get('nprData');
    }
  });

  Template.retrieve.events({
    'click #fetchButton': function () {
      Meteor.call('checkNpr', function(err, respJson) {
        if(err) {
          window.alert("Error: " + err.reason);
          console.log("error occured on receiving data on server. ", err);
        } else {
          console.log("respJson: ", respJson);
          Session.set('nprData', respJson);
        }
      });
      $('#fetchButton').removeAttr('disabled').val('Fetch');
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // var watson = Meteor.npmRequire('watson-developer-cloud');
    // console.log(watson);

    Meteor.methods({
      'checkNpr': function () {
        var result = Meteor.http.get("http://api.npr.org/query?date.current&apiKey=MDExMDE5NDY5MDEzNjI4NzgwNTc3MjMxMw001&output.JSON", {timeout:30000});
        if(result.statusCode==200) {
          var respJson = JSON.parse(result.content);
          console.log("response received.");
          return respJson;
        } else {
          console.log("Response issue: ", result.statusCode);
          var errorJson = JSON.parse(result.content);
          throw new Meteor.Error(result.statusCode, errorJson.error);
        }
      }
    });
  });
}
