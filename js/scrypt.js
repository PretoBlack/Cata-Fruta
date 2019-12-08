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
                gravity: {y:500}, //Gravidade
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
    var player, keys, fruits, grounds, spikes;

    //textos
    var pontos = 0;
    var textoPontos, fimDoJogo;

    // Carrega para a memoria do dispositivo
    function preload(){
        this.load.image('floresta', 'img/foresta.png');
        this.load.image('ground', 'img/ground.png');
        this.load.spritesheet('boy','img/PBoy.png',{frameWidth:48, frameHeight:46});
                                                           //Defini os tamanhos de cada sprite
        this.load.spritesheet('fruit','img/Pfruits.png',{frameWidth:32, frameHeight:32});
        this.load.image('spike','img/spikeball.png');
        this.load.image('title','img/title.png');
        this.load.image('button','img/button.png');
    }

    // Cria os elementos do jogo
    function create(){



        //Variavel recebe as informações dos botões do teclado
        keys = this.input.keyboard.createCursorKeys();
        this.add.image(200,300,'floresta'); //Criando o fundo
        grounds = this.physics.add.staticGroup();
        grounds.create(200, 577,'ground');
        player = this.physics.add.sprite(200,533,'boy'); //Criando o personagem já com a física
        player.body.setCollideWorldBounds(true); //Não permite o personagem passar dos limites do jogo
        player.body.bounce.y = 0; //O corpo quica. Ajuste de 0 a 1
  
        fimDoJogo = this.add.text(40, 300, 'FIM DO JOGO', { font: "50px Arial", fill: "red"});
        fimDoJogo.visible = false;

            fruits = this.physics.add.group({
                    key: 'fruit',
                    frame: [0,1,2,3,4,5,6,7],                    
                    setXY: {x: 16, y: 0, stepX: 52}
                }); //cria o grupo de frutas    

        spikes = this.physics.add.group();
        this.physics.add.collider(spikes, grounds);
        this.physics.add.collider(player, spikes, dano, null, this);
        
        fruits.children.iterate(function (child){
            child.setBounceY(Phaser.Math.FloatBetween(0.4,0.9));
        });

        this.physics.add.collider(fruits, grounds); //colisão do chão com as frutas
        this.physics.add.overlap(player, fruits, collectFruit, null, this); //verifica se houve sobreposição do jogador e das frutas

        function collectFruit(player, fruit)
        {
            fruit.disableBody(true, true);

            pontos += 1;
            textoPontos.setText('Pontos: ' + pontos);

            if (fruits.countActive(true) === 0)
            {
                fruits.children.iterate(function (child) {
                    child.enableBody(true, child.x, 0, true, true);
                });
                var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
                var spike = spikes.create(x, 16, 'spike');
                spike.setBounce(1);
                spike.setCollideWorldBounds(true);
                spike.setVelocity(Phaser.Math.Between(-200, 200), 20);
            }
        }

        function dano (player, spike){
            this.physics.pause();
            player.setTint(0xff0000);
            player.anims.play('turn');
            gameOver = true;
            fimDoJogo.visible = true;
        }

        //marcando a pontuação
        textoPontos = this.add.text(16, 16, 'Pontos: 0', { fontSize: '32px', fill: '#FFF' });

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
    }

}());