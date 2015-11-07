if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
      Meteor.call("checkNpr", function(error, results) {
        console.log(results.content);
      });
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    var watson = Meteor.npmRequire('watson-developer-cloud');
    console.log(watson);
  });

  Meteor.methods({checkNpr: function () {
      this.unblock();
      var result = Meteor.http.call("GET", "http://api.npr.org/query?date.current&apiKey=MDExMDE5NDY5MDEzNjI4NzgwNTc3MjMxMw001");
  }});
}
