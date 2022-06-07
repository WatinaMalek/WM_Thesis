const AWS = require('aws-sdk')

AWS.config.update({
    region: 'eu-central-1'
})

const dynamodb = new AWS.DynamoDB.DocumentClient();
const dynamodbTableName = 'tweet-details'

exports.handler = (tweets) => {
    console.log("test: "+tweets.length);
    Array.isArray(tweets) && tweets.forEach((tweet) => {
      saveTweet(tweet)
      
    });
}

async function saveTweet(tweet) {
//function saveTweet(tweet) {  
  console.log ("saving tweet");
    const params = {
      TableName: dynamodbTableName,
      Item: {
        'id': tweet.id,
        'text': tweet.text
      }
    }
    console.log(params)
    dynamodb.put(params, function(err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Success", data);
      }
    })
    console.log(params)
    
}
