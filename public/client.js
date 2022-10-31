var channel;
var map1;
var tileSize = 64;
var player = {x: 0, y: 0, z: 5, hand: 1, id: 0};

var img_map = [];
function preload(){
    img_map.push(0);
    img_map.push([loadImage("imgs/stone-v1.png")]);
    img_map.push([loadImage("imgs/grass-v1.png")]);
    img_map.push([loadImage("imgs/water-v1.png")]);
    img_map.push([loadImage("imgs/player-v1.png"), loadImage("imgs/player(left)-v1.png"), loadImage("imgs/player(back)-v1.png"), loadImage("imgs/player(right)-v1.png"), loadImage("imgs/playerOutline-v1.png"), loadImage("imgs/playerOutline(left)-v1.png"), loadImage("imgs/playerOutline(back)-v1.png"), loadImage("imgs/playerOutline(right)-v1.png"), loadImage("imgs/player2-v1.png"), loadImage("imgs/player2(left)-v1.png"), loadImage("imgs/player2(back)-v1.png"), loadImage("imgs/player2(right)-v1.png"), loadImage("imgs/player2Outline-v1.png"), loadImage("imgs/player2Outline(left)-v1.png"), loadImage("imgs/player2Outline(back)-v1.png"), loadImage("imgs/player2Outline(right)-v1.png")]);
    img_map.push([loadImage("imgs/wood-v1.png")]);
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
            map1 = new ClientMap(data.name, 0, 0);
            map1.fromStr(data.str);
        })

        channel.on('update_id', data => {
            if(player.id === 0){
                player.id = data;
            }
        })

        channel.on('change', data => {
            if(data.to !== 0){
                map1.tile_map[data.y][data.x][data.z] = new ClientTile(tile_type_map[data.to.type], tile_name_map[data.to.name], data.x, data.y, data.z);
            }
            else{
                map1.tile_map[data.y][data.x][data.z] = 0;
            }
        })
    })

    createCanvas(tileSize*30, tileSize*14);
    map1 = new ClientMap('unUpdated', 0, 0);
}

function draw(){
    background(139, 176, 173);
    if(map1.tile_map != undefined){
        map1.render();
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
    if (keyIsDown(move_right_button) && player.x != map1.tile_map[0].length-1 && map1.tile_map[player.y][player.x+1][player.z] === 0) {
        if (millis() - lastmoveMilli > ((keyIsDown(run_button)) ? run_wait:move_wait)) {
            channel.emit('change', {x: player.x, y: player.y, z: player.z, to: 0});
            player.x += 1;
            channel.emit('change', {x: player.x, y: player.y, z: player.z, to: {type: 3, name: 4}});
            lastmoveMilli = millis();
        }
    }
    if (keyIsDown(move_left_button) && player.x != 0 && map1.tile_map[player.y][player.x-1][player.z] === 0) {
        if (millis() - lastmoveMilli > ((keyIsDown(run_button)) ? run_wait:move_wait)) {
            channel.emit('change', {x: player.x, y: player.y, z: player.z, to: 0});
            player.x -= 1;
            channel.emit('change', {x: player.x, y: player.y, z: player.z, to: {type: 3, name: 4}});
            lastmoveMilli = millis();
        }
    }
    if (keyIsDown(move_up_button) && player.y != 0 && map1.tile_map[player.y-1][player.x][player.z] === 0) {
        if (millis() - lastmoveMilli > ((keyIsDown(run_button)) ? run_wait:move_wait)) {
            channel.emit('change', {x: player.x, y: player.y, z: player.z, to: 0});
            player.y -= 1;
            channel.emit('change', {x: player.x, y: player.y, z: player.z, to: {type: 3, name: 4}});
            lastmoveMilli = millis();
        }
    }
    if (keyIsDown(move_down_button) && player.y != map1.tile_map.length-1 && map1.tile_map[player.y+1][player.x][player.z] === 0) {
        if (millis() - lastmoveMilli > ((keyIsDown(run_button)) ? run_wait:move_wait)) {
            channel.emit('change', {x: player.x, y: player.y, z: player.z, to: 0});
            player.y += 1;
            channel.emit('change', {x: player.x, y: player.y, z: player.z, to: {type: 3, name: 4}});
            lastmoveMilli = millis();
        }
    }
    if (keyIsDown(move_fly_up_button) && player.z != 1 && map1.tile_map[player.y][player.x][player.z-1] === 0) {
        if (millis() - lastmoveMilli > ((keyIsDown(run_button)) ? run_wait:move_wait)) {
            channel.emit('change', {x: player.x, y: player.y, z: player.z, to: 0});
            player.z -= 1;
            channel.emit('change', {x: player.x, y: player.y, z: player.z, to: {type: 3, name: 4}});
            lastmoveMilli = millis();
        }
    }
    if (keyIsDown(move_fly_down_button) && player.z != map1.tile_map[0][0].length-1 && map1.tile_map[player.y][player.x][player.z+1] === 0) {
        if (millis() - lastmoveMilli > ((keyIsDown(run_button)) ? run_wait:move_wait)) {
            channel.emit('change', {x: player.x, y: player.y, z: player.z, to: 0});
            player.z += 1;
            channel.emit('change', {x: player.x, y: player.y, z: player.z, to: {type: 3, name: 4}});
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
        player.hand = 5;
    }
}

function mouseReleased() {
    if(millis() - lastbuildMilli > build_wait && map1.tile_map[player.y + floor((mouseY - ((player.z-((player.z%2 == 0)? 1:0)) * 32))/tileSize) - 7 + floor(player.z/2) - ((player.z%2 == 0)? 1:0)][player.x + floor(mouseX/tileSize) - 15][player.z - 1] !== undefined && map1.tile_map[player.y + floor((mouseY - ((player.z-((player.z%2 == 0)? 1:0)) * 32))/tileSize) - 7 + floor(player.z/2) - ((player.z%2 == 0)? 1:0)][player.x + floor(mouseX/tileSize) - 15][player.z - 1] !== 4){
        if(mouseButton == LEFT){ //mine
            channel.emit('change', {x: player.x + floor(mouseX/tileSize) - 15, y: player.y + floor((mouseY - ((player.z-((player.z%2 == 0)? 1:0)) * 32))/tileSize) - 7 + floor(player.z/2) - ((player.z%2 == 0)? 1:0), z: player.z - 1, to: 0});
        }
        else{  //build
            channel.emit('change', {x: player.x + floor(mouseX/tileSize) - 15, y: player.y + floor((mouseY - ((player.z-((player.z%2 == 0)? 1:0)) * 32))/tileSize) - 7 + floor(player.z/2) - ((player.z%2 == 0)? 1:0), z: player.z - 1, to: {type: 1, name: player.hand}});
        }
        lastbuildMilli = millis();
    }
}