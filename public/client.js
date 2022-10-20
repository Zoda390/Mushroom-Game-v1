var channel;
var tile_map;
var tileSize = 64;
var player = {x: 0, y: 0, z: 5, hand: 1, id: 0};

var img_map = [];
function preload(){
    img_map.push(0);
    img_map.push(loadImage("imgs/stone-v1.png"));
    img_map.push(loadImage("imgs/grass-v1.png"));
    img_map.push(loadImage("imgs/water-v1.png"));
    img_map.push(loadImage("imgs/player-v1.png"));
    img_map.push(loadImage("imgs/player2-v1.png"));
    img_map.push(loadImage("imgs/wood-v1.png"));
}

function setup(){
    for (let element of document.getElementsByClassName("p5Canvas")) {
        element.addEventListener("contextmenu", (e) => e.preventDefault());
    }

    channel = geckos({ port: 3000 });

    channel.onConnect(error => {
        if (error) {
            console.error(error.message)
            return
        }

        channel.emit('join', {x: 0, y: 0, z: 5, id: channel.id});

        channel.on('give_world', data => {
            tile_map = data;
        })

        channel.on('update_id', data => {
            if(player.id === 0){
                player.id = data;
            }
        })

        channel.on('change', data => {
            tile_map[data.y][data.x][data.z] = data.to;
        })
    })

    createCanvas(tileSize*30, tileSize*14);
}

function draw(){
    background(139, 176, 173);
    if(tile_map != undefined){
        translate((-player.x*tileSize)+(tileSize*15), (-player.y*tileSize)+(tileSize*7));
        push();
        for(let y = 0; y < tile_map.length; y++){
            for(let x = 0; x < tile_map[y].length; x++){
                for(let z = 0; z < tile_map[y][x].length; z++){
                    imageMode(CORNER);
                    if(tile_map[y][x][z] != 0){
                        if(tile_map[y][x][z] === 4){
                            fill(0, 70);
                            stroke(0);
                            let shadowZ = 0;
                            for(let z2 = 0; z2 < tile_map[y][x].length; z2++){
                                if(tile_map[y][x][z2] != 0 && tile_map[y][x][z2] != 4){
                                    shadowZ = z2;
                                }
                            }
                            circle((x*tileSize) + (tileSize/2), (y*tileSize) - (shadowZ * tileSize/2) + (tileSize/2), (10-(z-shadowZ)) * (tileSize/20));
                            if(player.x === x && player.y === y && player.z === z){
                                image(img_map[(tile_map[y][x][z])], (x*tileSize), (y*tileSize) - (z * tileSize/2), tileSize, tileSize + (tileSize/2));
                            }
                            else{
                                image(img_map[(tile_map[y][x][z])+1], (x*tileSize), (y*tileSize) - (z * tileSize/2), tileSize, tileSize + (tileSize/2));
                            }
                        }
                        else{
                            image(img_map[(tile_map[y][x][z])], (x*tileSize), (y*tileSize) - (z * tileSize/2), tileSize, tileSize + (tileSize/2));
                        }
                    }
                    if(x == (player.x + floor(mouseX/tileSize) - 15) && y == (player.y + floor(mouseY/tileSize) - 5) && z == player.z-1){
                        fill(255, 10);
                        stroke(255, 200);
                        rect((player.x + floor(mouseX/tileSize) - 15)*tileSize, (player.y + floor((mouseY/tileSize)) - 5 - (player.z-1)/2)*tileSize, tileSize, tileSize);
                    }
                }
            }
        }
        pop();


        takeInput();
    }
}

var move_right_button = 68; //d
var move_left_button = 65; //a
var move_up_button = 87; //w
var move_down_button = 83; //s
var move_fly_up_button = 81; //q
var move_fly_down_button = 69; //e
var run_button = 16; //shift
var lastmoveMilli = 0;
var lastbuildMilli = 0;
var build_wait = 100;
var move_wait = 120;
var run_wait = 40;
var slot1_button = 49;
var slot2_button = 50;
var slot3_button = 51;
var slot4_button = 52;
function takeInput(){
    if (keyIsDown(move_right_button) && player.x != tile_map[0].length-1 && tile_map[player.y][player.x+1][player.z] === 0) {
        if (millis() - lastmoveMilli > ((keyIsDown(run_button)) ? run_wait:move_wait)) {
            channel.emit('change', {x: player.x, y: player.y, z: player.z, to: 0});
            player.x += 1;
            channel.emit('change', {x: player.x, y: player.y, z: player.z, to: 4});
            lastmoveMilli = millis();
        }
    }
    if (keyIsDown(move_left_button) && player.x != 0 && tile_map[player.y][player.x-1][player.z] === 0) {
        if (millis() - lastmoveMilli > ((keyIsDown(run_button)) ? run_wait:move_wait)) {
            channel.emit('change', {x: player.x, y: player.y, z: player.z, to: 0});
            player.x -= 1;
            channel.emit('change', {x: player.x, y: player.y, z: player.z, to: 4});
            lastmoveMilli = millis();
        }
    }
    if (keyIsDown(move_up_button) && player.y != 0 && tile_map[player.y-1][player.x][player.z] === 0) {
        if (millis() - lastmoveMilli > ((keyIsDown(run_button)) ? run_wait:move_wait)) {
            channel.emit('change', {x: player.x, y: player.y, z: player.z, to: 0});
            player.y -= 1;
            channel.emit('change', {x: player.x, y: player.y, z: player.z, to: 4});
            lastmoveMilli = millis();
        }
    }
    if (keyIsDown(move_down_button) && player.y != tile_map.length-1 && tile_map[player.y+1][player.x][player.z] === 0) {
        if (millis() - lastmoveMilli > ((keyIsDown(run_button)) ? run_wait:move_wait)) {
            channel.emit('change', {x: player.x, y: player.y, z: player.z, to: 0});
            player.y += 1;
            channel.emit('change', {x: player.x, y: player.y, z: player.z, to: 4});
            lastmoveMilli = millis();
        }
    }
    if (keyIsDown(move_fly_up_button) && player.z != 1 && tile_map[player.y][player.x][player.z-1] === 0) {
        if (millis() - lastmoveMilli > ((keyIsDown(run_button)) ? run_wait:move_wait)) {
            channel.emit('change', {x: player.x, y: player.y, z: player.z, to: 0});
            player.z -= 1;
            channel.emit('change', {x: player.x, y: player.y, z: player.z, to: 4});
            lastmoveMilli = millis();
        }
    }
    if (keyIsDown(move_fly_down_button) && player.z != tile_map[0][0].length-1 && tile_map[player.y][player.x][player.z+1] === 0) {
        if (millis() - lastmoveMilli > ((keyIsDown(run_button)) ? run_wait:move_wait)) {
            channel.emit('change', {x: player.x, y: player.y, z: player.z, to: 0});
            player.z += 1;
            channel.emit('change', {x: player.x, y: player.y, z: player.z, to: 4});
            lastmoveMilli = millis();
        }
    }
    if (keyIsDown(slot1_button)){
        player.hand = 1;
    }
    if (keyIsDown(slot2_button)){
        player.hand = 2;
    }
    if (keyIsDown(slot3_button)){
        player.hand = 3;
    }
    if (keyIsDown(slot4_button)){
        player.hand = 6;
    }
}

function mouseReleased() {
    if(millis() - lastbuildMilli > build_wait && tile_map[player.y + floor(mouseY/tileSize) - 5][player.x + floor(mouseX/tileSize) - 15][player.z - 1] !== undefined){
        if(mouseButton == LEFT){ //mine
            channel.emit('change', {x: player.x + floor(mouseX/tileSize) - 15, y: player.y + floor(mouseY/tileSize) - 5, z: player.z - 1, to: 0});
        }
        else{  //build
            channel.emit('change', {x: player.x + floor(mouseX/tileSize) - 15, y: player.y + floor(mouseY/tileSize) - 5, z: player.z - 1, to: player.hand});
        }
        lastbuildMilli = millis();
    }
}