require('dotenv').config()
const Twit = require('twit')
const Discord = require('discord.js');
const client = new Discord.Client();


var T = new Twit({
  consumer_key:         process.env.TWITTER_CONSUMER_KEY,
  consumer_secret:      process.env.TWITTER_CONSUMER_SECRET,
  access_token:         process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret:  process.env.TWITTER_ACCESS_TOKEN_SECRET,
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  strictSSL:            true,     // optional - requires SSL certificates to be valid.
})




client.login(process.env.DISCORD_TOKEN);
client.once('ready', () => {
  var stream = T.stream('statuses/filter', { follow: [ process.env.TWITTER_USER_ID] })

  stream.on('tweet', function (tweet) {
    //only show owner tweets
    if(tweet.user.id == ( process.env.TWITTER_USER_ID)) {
     tweet.is_quote_status =true;
      var url = "https://twitter.com/" + tweet.user.screen_name + "/status/" + tweet.id_str;
     

      T.post('statuses/update', { status: '@SneaksFamily Discord: [Sneaks](www.discord.com) 📍 🇧🇪 / 🇫🇷  '+ url }, function(err, data, response) {
        console.log(data)
      })
    console.log(tweet)
      const exampleEmbed = new Discord.MessageEmbed()
      .setColor('#ffb800')
     // .setTitle(tweet.user.screen_name )
     // .setURL('https://twitter.com/anadoluimages/status/1419165088263675906')
      .setAuthor('@'+ tweet.user.screen_name , tweet.user.profile_image_url, url)
      .setDescription('[@SneaksFamily](https://twitter.com/SneaksFamily) \n Discord: [SneaksFamily](www.discord.com) 📍 🇧🇪 / 🇫🇷  \n' + url)
     // .setImage('https://pbs.twimg.com/media/E7ILScqXoAEL10Y.jpg')
      .setTimestamp()
      .setFooter("[@SneaksFamily](https://twitter.com/SneaksFamily) \n Discord: [SneaksFamily](www.discord.com) 📍 🇧🇪 / 🇫🇷  " + "\n", tweet.user.profile_image_url);
      ;
      
   
    try {
        let channel = client.channels.fetch(process.env.DISCORD_CHANNEL_ID).then(channel => {
          channel.send(exampleEmbed);
          console.log(exampleEmbed) ;
        }).catch(err => {
          console.log(err)
        })
    } catch (error) {
            console.error(error);
      }
    }
  })
})
