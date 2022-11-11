var item_type_map = [0, 'block', 'tool', 'consumable'];
var item_name_map = [0, 'stone', 'grass', 'water', 'wood', 'pickaxe'];

class ClientItem{ //block
    constructor(type, name, amount, left, right){
        this.type = type;
        this.name = name;
        this.img_num = find_in_array(this.name, tile_name_map); //img found in img_map
        this.amount = amount;
        this.left = left;
        this.right = right;
    }

    toStr(){
        return find_in_array(this.type, item_type_map) + '.' + find_in_array(this.name, item_name_map) + '.' + this.amount;
    }

    render(x, y){
        image(img_map[this.img_num], x, y);
    }

    L_click(){
        let txtinput = this.left;
        let script = tokenize(txtinput);
        parse(script);
    }

    R_click(){
        let txtinput = this.right;
        let script = tokenize(txtinput);
        parse(script);
    }
}