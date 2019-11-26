(function(){
// Organizando os atributos do objeto 'game' do Phaser
    var config = {
        type: Phaser.AUTO, // Seleciona se aguenta Canvas ou WebLG
        width: 400,
        height: 600,
        id: 'divGame',
        physics:{
            default: 'arcade', //Defini o modo Arcade como a fisica
            arcade:{
                gravity: {y:300}, //Gravidade
                debug: false
            }
        },
        scene: {
            preload:preload,
            create:create,
            update:update
        }

    };

    // Instancia do Phaser
    var game = new Phaser.Game(config);
    //variaveis que serão usadas em mais de 1 metodo
    var player, keys, fruits, grounds, c;

    // Carrega para a memoria do dispositivo
    function preload(){
        this.load.image('floresta', 'img/foresta.png');
        this.load.image('ground', 'img/ground.png');
        this.load.spritesheet('boy','img/PBoy.png',{frameWidth:48, frameHeight:46});
                                                           //Defini os tamanhos de cada sprite
        this.load.spritesheet('fruit','img/Pfruits.png',{frameWidth:32, frameHeight:32});
        
    }

    // Cria os elementos do jogo
    function create(){
        //Variavel recebe as informações dos botões do teclado
        keys = this.input.keyboard.createCursorKeys();
        this.add.image(200,300,'floresta'); //Criando o fundo
        grounds = this.physics.add.staticGroup();
        grounds.create(200, 577,'ground');
        player = this.physics.add.sprite(50,50,'boy'); //Criando o personagem já com a física
        player.body.setCollideWorldBounds(true); //Não permite o personagem passar dos limites do jogo
        player.body.bounce.y = 0.1; //O corpo quica. Ajuste de 0 a 1

        fruits = this.physics.add.group(); //cria o grupo de frutos
        fruits.enableBody = true; //Ativa um corpo para as frutas
        


        //for(var i = 0; i < 10; i++){
            //c = fruits.create(Phaser.Math.Between(15,385), 50, 'fruit', Phaser.Math.Between(0,7));
            //c.body.gravity.y = Phaser.Math.Between(-290,-275);
        //}

        //Criando as animações
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('boy',{start: 0, end: 3}),
            frameRate:10,
            repeat: -1
        })
        this.anims.create({
            key: 'turn',
            frames: [{key: 'boy', frame: 4}],
            frameRate: 20
        })
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('boy',{start: 5, end: 8}),
            frameRate:10,
            repeat: -1
        })

    }

    // Verifica a logica em cada loop
    function update(){
        //Verificação se os direcionais estão sendo precionados
        if(keys.left.isDown){
            player.setVelocityX(-150);
            player.anims.play('left',true); //Insere a animação
        }else if(keys.right.isDown){
            player.setVelocityX(150);
            player.anims.play('right',true);
        }else{
            player.setVelocityX(0);
            player.anims.play('turn');
        }

        if(keys.up.isDown && player.body.touching.down){
            player.setVelocityY(-300);
        }

        this.physics.add.collider(player,grounds);

        //setInterval(() => {
        //    c = fruits.create(Phaser.Math.Between(15,385), 50, 'fruit', Phaser.Math.Between(0,7));
        //}, 500);
        //c = fruits.create(Phaser.Math.Between(15,385), 50, 'fruit', Phaser.Math.Between(0,7));
    }

}());