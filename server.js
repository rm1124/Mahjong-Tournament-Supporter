const http = require("http");
const querystring = require("querystring");
const discord = require("discord.js");
const client = new discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] })
const {Modal,TextInputComponent,TextInputStyle,MessageActionRow,MessageEmbed} = require("discord.js");

var n;//ラウンドを記憶する変数
var postData;
var responseData;
var responseRankData;
var responseResult;
var inputResult;//得点送信結果
const MatchFlg = false;

//ボタンを作成
const buttonA = createButton("A卓","sendButtonA","PRIMARY");
const buttonB = createButton("B卓","sendButtonB","PRIMARY");
const buttonC = createButton("C卓","sendButtonC","PRIMARY");
const buttonD = createButton("D卓","sendButtonD","PRIMARY");
const buttonRow = new MessageActionRow().addComponents([buttonA, buttonB, buttonC, buttonD]);

const axiosBase = require("axios");
const url = "/macros/s/AKfycbwCH0ahwopKONFrwdsWH7DB8ZmRI8l1c1FkvVwxbKMDFkXV97h8dRTeieuvNVnWKvgQBw/exec"; // gasのドメイン以降のurl
const data = {"key" : "value"}; // 送信するデータ

const axios = axiosBase.create({
    baseURL: "https://script.google.com",
    headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
    },
    responseType: "json",
});



http
  .createServer(function (req, res) {
    if (req.method == "POST") {
      var data = "";
      req.on("data", function (chunk) {
        data += chunk;
      });
      req.on("end", function () {
        if (!data) {
          console.log("No post data");
          res.end();
          return;
        }
        var dataObject = querystring.parse(data);
        console.log("post:" + dataObject.type);
        if (dataObject.type == "wake") {
          console.log("Woke up in post");
          res.end();
          return;
        }
        res.end();
      });
    } else if (req.method == "GET") {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Discord Bot is active now\n");
    }
  })
  .listen(3000);

client.on("ready", (message) => {
  console.log("Bot準備完了");
});

//コマンド設定
client.once("ready", async () => {
  const cmdData = [{ 
    name: "championship_start",
    description: "新規大会作成",
  },{ 
    name: "next_matching",
    description: "次対局開始",
  },{
    name: "final_matching",
    description: "順位決定戦開始",
  },{
    name: "get_leaderboard",
    description: "順位表取得",
  }];

  const command = await client.application?.commands.set(cmdData,'763748938909745152');
  console.log("Ready!");
});

//インタラクションへの反応
client.on("interactionCreate", async (interaction) => {
  //大会開始コマンド
  if (interaction.commandName === 'championship_start') {
        MatchFlg == true;
        n = 1;
        postData = n;
        axios.post(url, postData)
        .then(async function (response) {
        responseData = response.data; // 受け取ったデータを格納
        console.log(response["data"]);
        interaction.reply(
        {embeds: [{
          title: "Round1",
          color: 16729344,
          fields: [
            {
              name: "A卓",
              value: `${response["data"][0]},${response["data"][1]},${response["data"][2]},${response["data"][3]}`          
            },
            {
              name: "B卓",
              value: `${response["data"][4]},${response["data"][5]},${response["data"][6]},${response["data"][7]}`
            },
            {
              name: "C卓",
              value: `${response["data"][8]},${response["data"][9]},${response["data"][10]},${response["data"][11]}`
            },
            {
              name: "D卓",
              value: `${response["data"][12]},${response["data"][13]},${response["data"][14]},${response["data"][15]}`
            }
          ]
        }],
          components: [buttonRow]
        });
        
      })
      .catch(function (error) {
          console.log("ERROR!! occurred in Backend.");
          console.log(error);
      }
  )
}
  
  //次対局移行コマンド
  if (interaction.commandName === 'next_matching') {
      postData = n + 1;
      axios.post(url, postData)
    .then(async function (response) {
      responseData = response.data; // 受け取ったデータ一覧(object)
      console.log(response["data"]);
      if(response["data"] == "err")
      {
        let text = "入力されていないセルがあります:r"+ n;
        interaction.reply(text);
      }
      else if(n >= 1 && n <= 4)
      {
        interaction.reply(
      {embeds: [{
        title: "Round" + postData,
        color: 16729344,
      fields: [
        {
          name: "A卓",
          value: `${response["data"][0]},${response["data"][1]},${response["data"][2]},${response["data"][3]}`
        },
        {
          name: "B卓",
          value: `${response["data"][4]},${response["data"][5]},${response["data"][6]},${response["data"][7]}`
        },
        {
          name: "C卓",
          value: `${response["data"][8]},${response["data"][9]},${response["data"][10]},${response["data"][11]}`
        },
        {
          name: "D卓",
          value: `${response["data"][12]},${response["data"][13]},${response["data"][14]},${response["data"][15]}`
        }
      ]
        }],
          components: [buttonRow]
        });
        n = n + 1
      }else{
      console.log("err");
      console.log(n);
    }})    
    .catch(function (error) {
        console.log("ERROR!! occurred in Backend.");
        console.log(error);
    })}
  
  //順位決定戦開始コマンド
  if (interaction.commandName === 'final_matching') {
    postData = 99;
    axios.post(url, postData)
    .then(async function (response) {
      responseData = response.data;
      console.log(response["data"]);
      interaction.reply(
      {embeds:[{
        title: "順位決定戦",
        color: 16729344,
      fields: [
        {
          name: "A卓",
          value: `${response["data"][0]},${response["data"][1]},${response["data"][2]},${response["data"][3]}`
        },
        {
          name: "B卓",
          value: `${response["data"][4]},${response["data"][5]},${response["data"][6]},${response["data"][7]}`
        },
        {
          name: "C卓",
          value: `${response["data"][8]},${response["data"][9]},${response["data"][10]},${response["data"][11]}`
        },
        {
          name: "D卓",
          value: `${response["data"][12]},${response["data"][13]},${response["data"][14]},${response["data"][15]}`
        }
      ]
      }]})
      .catch(function (error) {
        console.log("ERROR!! occurred in Backend.");
        console.log(error);
      })}
          )}
  
  //順位表取得コマンド
  if (interaction.commandName === 'get_leaderboard') {
      postData = 99;
      axios.post(url, postData)
      .then(async function (response) {
        responseRankData = response.data;
        console.log(response["data"]);
        interaction.reply(
          {embeds: [{
          title: "順位表",
          color: 16729344,
          description: `**1位:${response["data"][0]}\n2位:${response["data"][1]}\n3位:${response["data"][2]}\n4位:${response["data"][3]}\n5位:${response["data"][4]}\n6位:${response["data"][5]}\n7位:${response["data"][6]}\n8位:${response["data"][7]}\n9位:${response["data"][8]}\n10位:${response["data"][9]}\n11位:${response["data"][10]}\n12位:${response["data"][11]}\n13位:${response["data"][12]}\n14位:${response["data"][13]}\n15位:${response["data"][14]}\n16位:${response["data"][15]}**`
          }]}
        )
      })
  };
  
  //ModalWindowの入力値を取得
  if(interaction.isModalSubmit()){
    const p1 = interaction.fields.getTextInputValue('inputFirst');
    const p2 = interaction.fields.getTextInputValue('inputSecond');
    const p3 = interaction.fields.getTextInputValue('inputThird');
    const p4 = interaction.fields.getTextInputValue('inputFourth');
    
    //得点を配列に格納してモジュールに渡す
    const pointList = [[p1],[p2],[p3],[p4]];
    inputResult = sendData(pointList,interaction.customId,n);
    await interaction.reply("データの送信を受け付けました")
  }
  
  //ボタンが押された時の挙動
if(interaction.isButton()){
  console.log("ボタンが押下されました");
  if(interaction.customId == "sendButtonA"){
    const modal = createModal("pointsA", "A卓の結果を送信",getIndex(responseData,0),getIndex(responseData,1),getIndex(responseData,2),getIndex(responseData,3));
    await interaction.showModal(modal);
  }
  
  if(interaction.customId == "sendButtonB"){
    const modal = createModal("pointsB", "B卓の結果を送信",getIndex(responseData,4),getIndex(responseData,5),getIndex(responseData,6),getIndex(responseData,7));
    await interaction.showModal(modal);
  }
  
  if(interaction.customId == "sendButtonC"){
    const modal = createModal("pointsC", "C卓の結果を送信",getIndex(responseData,8),getIndex(responseData,9),getIndex(responseData,10),getIndex(responseData,11));
    await interaction.showModal(modal);
  }
  
  if(interaction.customId == "sendButtonD"){
    const modal = createModal("pointsD", "D卓の結果を送信",getIndex(responseData,12),getIndex(responseData,13),getIndex(responseData,14),getIndex(responseData,15));
    await interaction.showModal(modal);
  }
}
});

client.on("messageCreate", (message) => {
  if (message.author.id == client.user.id) {
    return; //botの発言に反応しないようにする
  }  
  
   if(message.mentions.has(client.user)){
   axios.post(url , JSON.stringify(message.content))
    console.log(JSON.stringify(message.content));
   return;
 }
  
    return;
    });

//トークン未設定
if (process.env.DISCORD_BOT_TOKEN == undefined) {
  console.log("DISCORD_BOT_TOKENが設定されていません。");
  process.exit(0);
}

client.login(process.env.DISCORD_BOT_TOKEN);

/*未使用のモジュール
function sendReply(message, text) {
  message
    .reply(text)
    .then(console.log("リプライ送信: " + text))
    .catch(console.error);
}

function sendMsg(channelId, text, option = {}) {
  client.channels
    .get(channelId)
    .send(text, option)
    .then(console.log("メッセージ送信: " + text + JSON.stringify(option)))
    .catch(console.error);
};*/

//配列のインデックス番号を指定しString型で返すモジュール
function getIndex(array,index){
  const getResult = array[index].toString();
  return getResult;
}

//ボタンを作成するモジュール
function createButton(label,customId,style){
const makingButton = new discord.MessageButton()
    .setStyle(style)
    .setLabel(label)
    .setCustomId(customId);
  return makingButton;
}

//ModalWindowを作成するモジュール
function createModal(customId,title,memberA,memberB,memberC,memberD){
  const makingModal = new Modal()
          .setCustomId(customId)
          .setTitle(title);
  const pointInputFirst = new TextInputComponent()
          .setCustomId("inputFirst")
          .setLabel(memberA)
          .setStyle("SHORT");
  const pointInputSecond = new TextInputComponent()
          .setCustomId("inputSecond")
          .setLabel(memberB)
          .setStyle("SHORT");
  const pointInputThird = new TextInputComponent()
          .setCustomId("inputThird")
          .setLabel(memberC)
          .setStyle("SHORT");
  const pointInputFourth = new TextInputComponent()
          .setCustomId("inputFourth")
          .setLabel(memberD)
          .setStyle("SHORT");

  makingModal.addComponents(new MessageActionRow().addComponents(pointInputFirst));
  makingModal.addComponents(new MessageActionRow().addComponents(pointInputSecond));
  makingModal.addComponents(new MessageActionRow().addComponents(pointInputThird));
  makingModal.addComponents(new MessageActionRow().addComponents(pointInputFourth));
  
  return makingModal;
}

//ModalWindowの入力値を送信するモジュール
function sendData(pointList,customId,n){
  postData = [100,pointList, customId,n];
  axios.post(url, postData)
        .then(async function (response) {
        responseResult = response.data; // 受け取ったデータを格納
        console.log(response["data"]);
  });
  return responseResult;
}