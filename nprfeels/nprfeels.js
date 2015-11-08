Posts = new Mongo.Collection('posts');

if (Meteor.isClient) {

  Session.setDefault('nprData', Posts.find().fetch());
  Session.setDefault('title', 'None');
  Session.setDefault('link', '#');
  Session.setDefault('stub', 'text');

  Template.retrieve.helpers({
    nprData: function () {
      Session.set('title', nprData[0]);
      Session.get('title');

    }
  });

  Template.retrieve.events({
    'click #fetchButton': function () {
      Meteor.call('requestArticles');
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {

    Meteor.methods({

      'requestArticles': function() {
        Meteor.http.call('GET', 'http://api.npr.org/query?date.current&numResults=20&apiKey=MDExMDE5NDY5MDEzNjI4NzgwNTc3MjMxMw001&output=JSON&fields=title,text,teaser,image', {}, function(error, jsonData) {

          var stories = jsonData['data']['list']['story'];
          for(var i = 0; i < stories.length; i++){
            var story = stories[i];
            var storyId = story['id'];
            var storyUrl = story['link'][0]['$text'];
            var storyTitle = story['title']['$text'];
            var storyTeaser = story['teaser']['$text'];
            var paragraphs = story['text']['paragraph'];

            var storyText = "";
            for(var j = 0; j < paragraphs.length; j++) {
              storyText += paragraphs[j]['$text'];
            };

            var post = {
              "id": storyId,
              "url": storyUrl,
              "title": storyTitle,
              "teaser": storyTeaser
            };

            Meteor.call('requestAnalysis',storyText,post);

          }
        });
      },


      'requestAnalysis': function(storyText, post) {


          Meteor.http.post('https://gateway.watsonplatform.net/tone-analyzer-experimental/api/v1/tone', {
          auth: "0dbedc88-6434-4ecc-921e-952eba4261c1:v6zxf14AqPDs",
          data: { "text": storyText },
          headers: { "content-type":"text/plain" }
          }, function(error, data) {
            // do stuffs

            var toneData = data['data']['children'][0]['children'];
            post["cheer"] = toneData[0]['normalized_score'];
            post["negative"] = toneData[1]['normalized_score'];
            post["anger"] = toneData[2]['normalized_score'];

            Posts.insert(post);
        });
      }


    });
  });

}
