const axios = require('axios')

const AWS = require('aws-sdk')

AWS.config.update({
    region: 'eu-central-1'
})

const dynamodb = new AWS.DynamoDB.DocumentClient()
const dynamodbTableName = 'tweet-details'
const lambda = new AWS.Lambda({
    region: 'eu-central-1'});

exports.handler = async(event) => {
    const date = new Date();
    date.setHours(date.getHours() - 3)

    var tweets = await fetchTweets(date.toISOString())
    
    //tweets.forEach((tweet) => saveTweet(tweet))
    
    //console.log("%o", tweets);

   var params = {
                    FunctionName: 'TweetProcessor',
                    InvocationType: 'Event',
                    //LogType: 'Tail',
                    Payload: JSON.stringify(tweets)
                 };
                 
    await lambda.invoke(params, function(err, data) {
        console.log('hello');
        if (err) console.log("error: "+err, err.stack); // an error occurred
        else     console.log("data: "+ data);           // successful response
    });

    return tweets
}

async function fetchTweets(date) {
    const token = process.env.TWEETER_BEARER_TOKEN
    //const token = 'AAAAAAAAAAAAAAAAAAAAAPO8bwEAAAAA060QN8LcwRQJI5NAevJymn0shX4%3DqsdVzkRFpi44RPlHygaQOPvG18hGImF0CbeAUBHO8kAEG8nyEX'

    try {
        const response = await axios.get(`https://api.twitter.com/2/tweets/search/recent?query=entity:"Ukraine"&max_results=100&end_time=${date}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return response.data.data
    } catch (err) {
        return []
    }
}

