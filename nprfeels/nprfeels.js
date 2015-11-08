Posts = new Mongo.Collection('posts');

if (Meteor.isClient) {

  Session.setDefault('nprData', "nothing yet");

  Template.retrieve.helpers({
    nprData: function () {
      return Session.get('nprData');
    }
  });

  Template.retrieve.events({
    'click #fetchButton': function () {
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

    var url = 'http://api.npr.org/query?date.current&numResults=1&apiKey=MDExMDE5NDY5MDEzNjI4NzgwNTc3MjMxMw001&output=JSON&fields=title,text,teaser,image';

    Meteor.methods({
      'request': function() {
        return Meteor.http.call('GET', url, {}, function(error, jsonData) {
          var story = jsonData['data']['list']['story'][0];
          var storyId = story['id'];
          var storyUrl = story['link'][0]['$text'];
          var storyTitle = story['title']['$text'];
          var storyTeaser = story['teaser']['$text'];
          var paragraphs = story['text']['paragraph'];

          var storyText = "";
          for(var i = 0; i < paragraphs.length; i++) {
            storyText += paragraphs[i]['$text'];
          };

          // analyze text

        
          // example post:
          // {
          //   id: storyId,
          //   url: storyUrl,
          //   title: storyTitle,
          //   teaser: storyTeaser,
          //   tonedatastuf: ?????????????????????
          // }

          // _.each(nprPosts, function(post){
          //   Posts.upsert(post);
          // });
        });
      }
    });



    
  }); 
}
