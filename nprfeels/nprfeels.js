

// Messages = new Meteor.Collection('messages');

if (Meteor.isClient) {

  // Session.setDefault('ABC', "nothing yet");

  // Template.messages.helpers = function () {
  //   return Messages.find({}, { sort: {time: -1} });
  // };

  // Template.messages.events = function () {
  //   'ABC': function () {
  //     return Session.get('ABC');
  //   }
  // };


  Session.setDefault('nprData', "nothing yet");


  Template.retrieve.helpers({
    nprData: function () {
      return Session.get('nprData');
    }
  });

  Template.retrieve.events({
    'click #fetchButton': function () {

      // debugger;
      // var result = Meteor.call('request');

      Meteor.call('request', function(error, data){
        Session.set('nprData', data);
 

      });

    }
  });
}

if (Meteor.isServer) {

  Meteor.startup(function () {
    // var watson = Meteor.npmRequire('watson-developer-cloud');
    // console.log(watson);

    var url = 'http://api.npr.org/query?date.current&apiKey=MDExMDE5NDY5MDEzNjI4NzgwNTc3MjMxMw001';

    Meteor.methods({
      'request': function() {
        return Meteor.http.call('GET', url, {}, function(error, data) {
          // console.log(error);
          // console.log(data);
        });
      }
    });
  
  });
}
