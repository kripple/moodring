if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);
  Session.setDefault('nprData', "nothing yet");
/*
  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });*/

  Template.refresh.helpers({
    nprData: function () {
      return Session.get('nprData');
    }
  });

  Template.refresh.events({
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
    // code to run on server at startup
    var watson = Meteor.npmRequire('watson-developer-cloud');
    console.log(watson);

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
