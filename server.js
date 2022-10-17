import geckos from '@geckos.io/server'
import express from 'express'

const port = 3000;
const app = express()
const server = app.listen(port)
const io = geckos()

io.addServer(server)

app.use(express.static("public"));
console.log("My server is running on port " + port);

var players = [];

io.onConnection(channel => {
    channel.onDisconnect(() => {
        console.log(`${channel.id} got disconnected`)
    })

    channel.on('join', data => {
        players.push(data);
        io.room(channel.roomId).emit('update', players);
    })

    channel.on('move', data => {
        for(let i = 0; i < players.length; i++){
            if(data.id === players[i].id){
                players[i] = data;
            }
        }
        io.room(channel.roomId).emit('update', players);
    })
})