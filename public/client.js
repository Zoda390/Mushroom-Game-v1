var channel;
var players = [];
var pos;
const speed = 3;

function setup(){
    channel = geckos({ port: 3000 })

    channel.onConnect(error => {
        if (error) {
            console.error(error.message)
            return
        }

        channel.on('update', data => {
            players = data;
        })

        channel.emit('join', {x: random(0, width), y: random(0, height), id: channel.id})
    })

    createCanvas(400, 400);
}

function draw(){
    background(220);
    console.log(players);
    for(let i = 0; i < players.length; i++){
        fill(255, 0, 0);
        if(players[i].id === channel.id){
            fill(255, 255, 0);
        }
        circle(players[i].x, players[i].y, 10);
    }
    

    takeInput();
}

function takeInput(){
    let player;
    for(let i = 0; i < players.length; i++){
        if(players[i].id === channel.id){
            player = players[i];
        }
    }
    let change = false;
    if (keyIsDown(LEFT_ARROW)) {
        player.x -= speed;
        change = true;
    }
    
    if (keyIsDown(RIGHT_ARROW)) {
        player.x += speed;
        change = true;
    }
    
    if (keyIsDown(UP_ARROW)) {
        player.y -= speed;
        change = true;
    }
    
    if (keyIsDown(DOWN_ARROW)) {
        player.y += speed;
        change = true;
    }

    if(change){
        channel.emit('move', player);
    }
}