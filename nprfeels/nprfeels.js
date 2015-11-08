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

          console.log(storyText);


      
          // var data = xml2js.parseString(xmlData, function(error, results) {
          //   console.log('Results:');
          //   console.log(error);
          //   console.log(results);
          // });


          // parse data, add to db
          // example post:
          // {
          //   title: 'My First entry',
          //   slug: 'my-first-entry',
          //   description: 'Lorem ipsum dolor sit amet.',
          //   text: 'Lorem ipsum dolor sit amet...',
          //   author: 'John Doe'
          // }
          // _.each(nprPosts, function(post){
          //   Posts.upsert(post);
          // });
        });
      }
    });



    
  }); 
}
