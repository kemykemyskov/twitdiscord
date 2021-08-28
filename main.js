require('dotenv').config()
const Twit = require('twit')
var getImagesFromTweet = require('get-images-from-tweet');
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
    T.get('friends/ids', { screen_name: 'kemyskov'},  function (err, friends, response) {
        var stream = T.stream('statuses/filter', { follow: friends.ids });
        stream.on('tweet', function (tweet) {
            var str = tweet.text;
            var str_low = str.toLowerCase();  
            var reg = /(post|publication)/g;  
                if (reg.test(str_low)){
                    var url = "https://twitter.com/" + tweet.user.screen_name + "/status/" + tweet.id_str;
                    T.post('statuses/update', { status: '@SneaksFamily Discord: [Sneaks](www.discord.com) 📍 🇧🇪 / 🇫🇷  '+ url }, function(err, data, response) { })
                    txt = str.replace(str.substr( str.length - 23 ),'');

                    const exampleEmbed = new Discord.MessageEmbed()
                    .setColor('#ffb800')
                    .setAuthor('@'+ tweet.user.screen_name , tweet.user.profile_image_url, url)
                    .addFields(
                      { name: '__Twitter moniteur__ ', value: '[@SFbot](https://twitter.com/SFbot)', inline: true },
                      { name: '__Twitter__ ', value: '[@SneaksFamily](https://twitter.com/SneaksFamily)', inline: true },
                      { name: '__Discord__ ', value: '[@SneaksFamily](https://discord.gg/dRAWYbjhcE)', inline: true }
                  )
                   // .addField('\u200b', '\u200b')
                    .setDescription('\n' + txt + '\n ')
                    .setImage(getImagesFromTweet(tweet).toString())
                    .setTimestamp()
                    .setFooter("Twitter : @SneaksFamily \nDiscord : https://discord.gg/dRAWYbjhcE \n📍 🇧🇪 / 🇫🇷 ", tweet.user.profile_image_url);
                    ;
                    
                  try {
                      let channel = client.channels.fetch(process.env.DISCORD_CHANNEL_ID).then(channel => {
                        channel.send(exampleEmbed);
              
                      }).catch(err => {
                        console.log(err)
                      })
                  } catch (error) {
                          console.error(error);
                    }
                }else{
                    console.log("nope")
                }
        })
    })
})
