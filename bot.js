const Discord = require("discord.js"); // Подключаем модуль D.JS: Установка npm install discord.js

const bot = new Discord.Client(); // Создаем нового клиента

// bot.commands = new Discord.Collection(); // для работы обработчика команд

let config = require("./botconfig.json"); // Подключаем файл с настройкой бота

let token = config.token; // Ищем в файле botconfig.json токен

let prefix = config.prefix; // Ищем в файле botconfig.json префикс

var mysql = require('mysql'); // Подключаем модуль mysql: Установка: npm install mysql
// Делаем данные для подключения

// Command handler (Обработчик команд)
// fs.readdir('./commands/',(err,files)=>{
//     if(err) console.log(err);
//     let jsfiles = files.filter(f => f.split(".").pop() === "js");
//     if(jsfiles.length <=0) console.log("Нет комманд для загрузки!!");
//     console.log(`Загружено ${jsfiles.length} комманд`);
//     jsfiles.forEach((f,i) =>{
//         let props = require(`./cmds/${f}`);
//         console.log(`${i+1}.${f} Загружен!`);
//         bot.commands.set(props.help.name,props);
//     });
// });

var con = mysql.createConnection({
  host:'127.0.0.1',
  user:'root',
  password:'root',
  database:'testdb'
})

// Создаем новое подключение

con.connect(err => {
  if(err) throw err;
  console.log("[DB] Подключение успешно!")
})

// Делаем после запуска:
bot.on("ready", () => {

  console.log(`Запустился бот ${bot.user.tag}!`);
  
  //Создаем приглашение и отправляем его в консоль 
  bot.generateInvite(["ADMINISTRATOR"]).then(link => {
     console.log(link);
  });
});

// Если бота добавили на сервер:
bot.on("guildCreate", async (guild) => {
  // делаем запрос на проверку сервера: gid - id сервера на который бот вступил
  con.query(`SELECT * FROM guilds WHERE gid = '${guild.id}'`, async (err, result) => {
    
    if(err) throw err;
    // Если нет сервера:
    if(result.length < 1 || !result) {
       con.query(`INSERT INTO guilds (gid) VALUES ('${guild.id}')`)
    } else {
      return; // Если есть, то ничего не делаем
    }
  })
})
bot.on("guildDelete", async (guild) => {
   
  if (err) throw err;
  // Здесь аналогично как и при добавлении на сервер, только мы удаляем из бд
  
  con.query(`SELECT * FROM guilds WHERE gid = '${guild.id}'`, async (err, result) => {
      if(err) throw err;
      if(result.length < 1){
        return;
      } else {
        con.query(`DELETE FROM guilds WHERE gid = '${guild.id}'`)
      }
   })
})
// Что делаем если пользователь отправил сообщение:
bot.on("message", async message => {
  if(message.author.bot) return; // Если автор сообщения бот, ничего не делаем
  if(message.channel.type === dm) return; // Если сообщение в лс, то ничего не делаем
  
  // Просматриваем таблицу в бд
  
  con.query(`SELECT * FROM users WHERE id = '${message.author.id}'`, async (err, result) => {
    
     if(err) throw err;
    // Если пользователя нет в бд, то добавляем
    
     if(result.length < 1 || !result){
       con.query(`INSERT INTO users (id) VALUES ('${message.author.id}')`) // id это id пользователя который отправил сообщение
     } else {
     return; // Если пользователь есть, ничего не делаем
     }
  })
//     let messageArray = message.content.split(" "); // содержкание сообщения
//     let command = messageArray[0].toLowerCase(); // для того, чтобы если сообщение написано верхнем регистром пример: !HELP, бот переводит его в нижний !help
//     let args = messageArray.slice(1); 
//     if(!message.content.startsWith(prefix)) return; // если сообщений не начинается с префикса, то ничего не делаем
//     let cmd = bot.commands.get(command.slice(prefix.length));
//     if(cmd) cmd.run(bot,message,args);
});

bot.login(token); // Авторизовываем бота
