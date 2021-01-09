const Discord = require("discord.js"); // Подключаем модуль D.JS: Установка npm install discord.js
const bot = new Discord.Client(); // Создаем нового клиента
let config = require("./botconfig.json") // Подключаем файл с настройкой бота
let token = config.token // Ищем в файле botconfig.json токен
let prefix = config.prefix // Ищем в файле botconfig.json префикс
// Делаем после запуска:
bot.on("ready", () => {
  console.log(`Запустился бот ${bot.user.tag}!`);
  //Создаем приглашение и отправляем его в консоль
  bot.generateInvite(["ADMINISTRATOR"]).then(link => {
     console.log(link);
  });
});
// Что делаем если пользователь отправил сообщение:
bot.on("message", message => {
  if (message.content === `${prefix}ping`) {
    message.channel.send('Pong!');
  }
  if (message.content === `${prefix}examplembed`) {
      let embed = new Discord.MessageEmbed()
        .setTitle(`Название`)
        .setDescription(`Описание`)
        .setAuthor(`Автор`)
        .setUrl(`Здесь ссылка`)
        .addField(`Название поля`, `Содержание поля`)
        .setThumbnail(message.author.displayAvatarURL()) // Аватарка
        .setTimestamp() // Указываем время
        .setFooter(`Подпись снизу`, `Аватарка`)
      message.channel.send(embed)
  }
});

bot.login(token); // Авторизовываем бота
