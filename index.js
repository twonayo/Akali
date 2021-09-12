const Discord = require("discord.js");
const { prefix, token, guugrou, webclient_id, comandos, commands, events, } = require("./config.json");
const ytdl = require("ytdl-core");
const google = require ('googleapis');

const youtube = new google.youtube_v3.Youtube({
  version: 'v3' ,
  auth: guugrou
});
const client = new Discord.Client();

const queue = new Map();

client.once("ready", () => {
  console.log("Akali Esta Pronta Para Enfrentar Os Inimigos !");
});

client.once("reconnecting", () => {
  console.log("Reconnecting!");
});

client.once("disconnect", () => {
  console.log("Disconnect!");
});

client.on("message", async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const serverQueue = queue.get(message.guild.id);

  if (message.content.startsWith(`${prefix}play`)) {
    execute(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}skip`)) {
    skip(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}stop`)) {
    stop(message, serverQueue);
    return;
  } else {
    message.channel.send("Voce precisa inserir um comando valido. tudo que eu preciso e de um alvo e uma lamina afiada");
  }
});

async function execute(message, serverQueue) {
  const args = message.content.split(" ");

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel)
    return message.channel.send(
      "Voce precisa estar em um canal de voz para tocar musica! Achei Que Voce Mandava Melhor"
    );
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send(
      "Preciso das permissoes para entrar e falar no seu canal de voz! Podem Ate Me ver mas Nao Podem Me Impedir mesmo"
    );
  }

  const songInfo = await ytdl.getInfo(args[1]);
  const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
   };

  if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    };

    queue.set(message.guild.id, queueContruct);

    queueContruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play(message.guild, queueContruct.songs[0]);
    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    return message.channel.send(`${song.title} foi adicionado a fila!!Bjos da Akali`);
  }
}

function skip(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "Voce tem que estar em um canal de voz para parar a musica! Achei Que Voce Mandava Melhor"
    );
  if (!serverQueue)
    return message.channel.send("Nao ha musica que eu possa pular! ja to pensando no proximo alvo");
  serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "Voce tem que estar em um canal de voz para parar a musica!! faremos do meu jeito rapido e mortal"
    );
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 10);
  serverQueue.textChannel.send(`Akali Tocando Agora Para Voce : **${song.title}**`);
}


const get = async () => {
	return Promise.reject('Oops!').catch(err => {
		throw new Error(err);
	});
};

get()
	.then(console.log)
	.catch(function(e) {
		console.log(e);
	});

  client.commands = new Discord.Collection()

  
client.login(token);