import geckos from '@geckos.io/server'
import express from 'express'

const port = 3000;
const app = express()
const server = app.listen(port)
const io = geckos()

io.addServer(server)

app.use(express.static("public"));
console.log("My server is running on port " + port);

var tile_map = [
        [[1, 2, 0], [1, 1, 2], [1, 1, 2], [1, 2, 2], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0]],
        [[1, 2, 0], [1, 1, 2], [1, 1, 2], [1, 2, 2], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0]],
        [[1, 2, 0], [1, 1, 2], [1, 1, 2], [1, 2, 2], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0]],
        [[1, 2, 0], [1, 1, 2], [1, 1, 2], [1, 2, 2], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0]],
        [[1, 2, 0], [1, 1, 2], [1, 1, 2], [1, 2, 2], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0]],
        [[1, 2, 0], [1, 1, 2], [1, 1, 2], [1, 2, 2], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0]],
        [[1, 2, 0], [1, 1, 2], [1, 1, 2], [1, 2, 2], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0]],
        [[1, 2, 0], [1, 3, 0], [1, 3, 0], [1, 3, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0]],
        [[1, 2, 0], [1, 3, 0], [1, 3, 0], [1, 3, 0], [1, 2, 0], [1, 2, 0], [1, 2, 2], [1, 2, 2], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0]],
        [[1, 2, 0], [1, 3, 0], [1, 3, 0], [1, 3, 0], [1, 2, 0], [1, 2, 0], [1, 2, 2], [1, 2, 2], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0]],
        [[1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 2], [1, 2, 2], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0]],
        [[1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0]],
        [[1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0]],
        [[1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0]],
        [[1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0]],
        [[1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0], [1, 2, 0]]];

io.onConnection(channel => {
    channel.onDisconnect(() => {
        console.log(`${channel.id} got disconnected`)
    })

    channel.on('join', data => {
        tile_map[data.y][data.x][data.z] = 4;
        io.room(channel.roomId).emit('give_world', tile_map);
    })

    channel.on('change', data => {
        tile_map[data.y][data.x][data.z] = data.to;
        io.room(channel.roomId).emit('change', {x: data.x, y: data.y, z: data.z, to: data.to});
    })
})