var item_type_map = [0, 'block', 'tool', 'consumable'];
var item_name_map = [0, 'stone', 'grass', 'water', 'wood', 'pickaxe'];

class ClientItem{ //block
    constructor(type, name, amount, click){
        this.type = type;
        this.name = name;
        this.img_num = find_in_array(this.name, item_name_map); //img found in tile_img_map
        this.amount = amount;
        this.click = 'place ' + find_in_array(this.name, item_name_map) + ',';
        if(this.name == 'pickaxe'){
            this.click = 'hurt 1,';
        }
        if(click !== ''){
            this.click = click;
        }
    }

    toStr(){
        return find_in_array(this.type, item_type_map) + '.' + find_in_array(this.name, item_name_map) + '.' + this.amount + '≈';
    }

    render(x, y){
        push();
        imageMode(CENTER);
        image(item_img_map[this.img_num], x, y);
        pop();
    }

    clicked(x, y, z){
        let txtinput = this.click;
        txtinput = txtinput + x + ',' + y + ',' + z + ';';
        let script = tokenize(txtinput);
        if(parse(script) == 'placed'){
            this.amount -= 1;
            if(this.amount <= 0){
                console.log(cc_map.tile_map[player.y][player.x][player.z].inv);
                for(let i = 0; i < cc_map.tile_map[player.y][player.x][player.z].inv.length; i++){
                    if(cc_map.tile_map[player.y][player.x][player.z].inv[i].amount <= 0){
                        cc_map.tile_map[player.y][player.x][player.z].inv[i] = undefined;
                    }
                }
            }
        }
    }
}