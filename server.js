import geckos from '@geckos.io/server'
import express from 'express'

const port = 3000;
const app = express()
const server = app.listen(port)
const io = geckos()

io.addServer(server)

app.use(express.static("public"));
console.log("My server is running on port " + port);

var tile_map = [];
for(let y = 0; y < 20; y++){
    tile_map[y] = [];
    for(let x = 0; x < 40; x++){
        tile_map[y][x] = [];
        tile_map[y][x][0] = 1;
        tile_map[y][x][1] = 3;
        tile_map[y][x][2] = 1;
        tile_map[y][x][3] = 2;
        tile_map[y][x][4] = 2;
        tile_map[y][x][5] = 0;
        tile_map[y][x][6] = 0;
        tile_map[y][x][7] = 0;
        tile_map[y][x][8] = 0;
        tile_map[y][x][9] = 0;
    }
}

io.onConnection(channel => {
    channel.onDisconnect(() => {
        console.log(`${channel.id} got disconnected`);
    })

    channel.on('join', data => {
        tile_map[data.y][data.x][data.z] = 4;
        io.room(channel.roomId).emit('give_world', tile_map);
        io.room(channel.roomId).emit('update_id', data.id);
    })

    channel.on('change', data => {
        tile_map[data.y][data.x][data.z] = data.to;
        io.room(channel.roomId).emit('change', {x: data.x, y: data.y, z: data.z, to: data.to});
    })
})