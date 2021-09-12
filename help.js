exports.run = async(client, message) => {
    message.channel.send({
        embed: {
            title: '**Akali Ajudas Para Musicas 🎶**',
            description: `
            __**Comandos De Musicas Da Akali**__
            
            \`play\` <songName> => Akali Tocando Agora do Youtube Para Voce.
            \`pause\` => Pausar a Musica.
            \`resume\` => Retornar a tocar a Musica.
            \`np\` => Informacoes da Musica atual.
            \`skip\` => Skip Para Pular a Musica.
            \`stop\` => Stop Para Parar a Musica.
            \`volume\` <value> => Para Alterar o Volume Da Musica.
            \`queue\` => Para Colocar a Musica Na Lista De Fila Proxima.


            `,
            color: 'BLACK'
        }
    })
}
