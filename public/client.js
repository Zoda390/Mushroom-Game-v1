var channel;
var tile_map = [];
var tileSize = 32;
var player = {x: 0, y: 0, z: 2};

function setup(){
    channel = geckos({ port: 3000 })

    channel.onConnect(error => {
        if (error) {
            console.error(error.message)
            return
        }

        channel.on('give_world', data => {
            tile_map = data;
        })

        channel.on('change', data => {
            tile_map[data.y][data.x][data.z] = data.to;
        })

        channel.emit('join', {x: 0, y: 0, z: 2, id: channel.id})
    })

    createCanvas(1200, 700);
}

function draw(){
    background(220);
    for(let y = 0; y < tile_map.length; y++){
        for(let x = 0; x < tile_map[y].length; x++){
          for(let z = 0; z < tile_map[y][x].length; z++){
            let color = {r: 0, g: 0, b: 0, a: 0};
            if(tile_map[y][x][z] == 1){
                color = {r: 100, g: 100, b: 100, a: 255};
            }
            else if(tile_map[y][x][z] == 2){
                color = {r: 0, g: 255, b: 0, a: 255};
            }
            else if(tile_map[y][x][z] == 3){
                color = {r: 0, g: 255, b: 255, a: 70};
            }
            else if(tile_map[y][x][z] == 4){
                color = {r: 255, g: 0, b: 0, a: 255};
            }
            let shadow = 50;
            strokeWeight(2);
            stroke(color.r - shadow, color.g - shadow, color.b - shadow, color.a)
            fill(color.r, color.g, color.b, color.a);
            rect(((x+1)*tileSize)+(x+1), ((y+2)*tileSize) - ((z+1) * tileSize/2) - z, tileSize, tileSize)
            stroke(color.r - shadow*2, color.g - shadow*2, color.b - shadow*2, color.a)
            fill(color.r - shadow, color.g - shadow, color.b - shadow, color.a);
            rect(((x+1)*tileSize)+(x+1), ((y+2)*tileSize) - z - ((z+1) * tileSize/2) + tileSize, tileSize, tileSize/2)
          }
        }
      }

    takeInput();
}

function takeInput(){
    if (keyIsDown(LEFT_ARROW) && player.x != 0) {
        channel.emit('change', {x: player.x, y: player.y, z: player.z, to: 0});
        player.x -= 1;
        channel.emit('change', {x: player.x, y: player.y, z: player.z, to: 4});
    }
    if (keyIsDown(RIGHT_ARROW) && player.x != tile_map[0].length-1) {
        channel.emit('change', {x: player.x, y: player.y, z: player.z, to: 0});
        player.x += 1;
        channel.emit('change', {x: player.x, y: player.y, z: player.z, to: 4});
    }
    if (keyIsDown(UP_ARROW) && player.y != 0) {
        channel.emit('change', {x: player.x, y: player.y, z: player.z, to: 0});
        player.y -= 1;
        channel.emit('change', {x: player.x, y: player.y, z: player.z, to: 4});
    }
    if (keyIsDown(DOWN_ARROW) && player.y != tile_map.length-1) {
        channel.emit('change', {x: player.x, y: player.y, z: player.z, to: 0});
        player.y += 1;
        channel.emit('change', {x: player.x, y: player.y, z: player.z, to: 4});
    }
}