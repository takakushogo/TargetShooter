function main(param) {
    g.game.pushScene(createTitleScene());
}


function createTitleScene()
{
    const scene = new g.Scene
    ({
        game: g.game,
        assetIds: ["target"]
    });
    scene.onLoad.add(function()
    {
        const group=new g.E({scene:scene});

        const titleFont = new g.DynamicFont
        ({
            game: g.game,
            fontFamily: g.FontFamily.SansSerif,
            size: 50
        });
        const titleLabel = new g.Label
        ({
            scene: scene,
            font: titleFont,
            text: "ターゲットを撃て!",
            fontSize: 50,
            textColor: "black",
            anchorX:0.5,
            x: 1280/2,
            y: 720/2,
        });

        const buttonFont = new g.DynamicFont
        ({
            game: g.game,
            fontFamily: g.FontFamily.SansSerif,
            size: 30
        });
        const buttonLabel=new g.Label
        ({
            scene: scene,
            font: buttonFont,
            text: "Press Start",
            fontSize: 30,
            textColor: "black",
            anchorX:0.5,
            x: 1280/2,
            y: 720/2+100
        })

        const targetImage = scene.asset.getImageById("target");
        const backImage=new g.Sprite
        ({
            scene: scene,
            src:targetImage,
            width: 500,
            height: 500,
            anchorX:0.5,
            anchorY:0.5,
            x:1280/2,
            y:720/2,
            scaleX:2.5,
            scaleY:2.5
        });

        group.append(backImage);
        group.append(titleLabel);
        group.append(buttonLabel);
        scene.append(group);
    });
    scene.onPointDownCapture.add(function()
    {
        g.game.replaceScene(createGameScene(0));
    });
    return scene;
}


function createGameScene(point)
{
	const scene = new g.Scene
    ({
        game: g.game,
        assetIds: ["bom","target"]
    });
	const group=new g.E({scene:scene});


    scene.onLoad.add(function ()
	{
		const bomImage = scene.asset.getImageById("bom");
        const targetImage = scene.asset.getImageById("target");
		const font = new g.DynamicFont
		({
			game: g.game,
			fontFamily: g.FontFamily.SansSerif,
			size: 15
		});
		const label = new g.Label
		({
			scene: scene,
			font: font,
			text: `${point}`,
			fontSize: 15,
			textColor: "blue",
			x: 1280/2,
			y: 720/2
		});


		let timeout;
		let specialPoint=0;
		const nowpoint=point;
		const random=Math.floor(g.game.random.generate()*10)+1;
		const targetcount=Math.floor(g.game.random.generate()*random);
        const specialCount=Math.floor(g.game.random.generate()*5);
		let time=1000;
		if(random-targetcount==0)
		{
			time=1000;
		}else
		{
			for(let i=0;i<targetcount;i++)
			{
				if(i>0)
				{
					time+=450;
				}
			}
		}
		for(let i=0;i<random-targetcount;i++)
		{
            const positionx=g.game.random.generate()*(g.game.width-50);
            const positiony=g.game.random.generate()*(g.game.height-50);
            const bom= new g.Sprite
            ({
                scene: scene,
                src: bomImage,
                width: 800,
                height: 800,
                scaleX:0.2,
                scaleY:0.2,
                x:Math.floor(positionx),
                y:Math.floor(positiony),
                touchable:true
            });

            bom.onPointDown.add(()=>
            {
                scene.clearTimeout(timeout);
                g.game.replaceScene(createGameOverScene(point+specialPoint));
            })
            group.append(bom);

            if(i==targetcount-1 && specialCount==0)
            {
                const specialTarget=new g.Sprite
                ({
                    scene: scene,
                    src:targetImage,
                    width: 500,
                    height: 500,
                    x:Math.floor(positionx)+60,
                    y:Math.floor(positiony)+85,
                    scaleX:0.05,
                    scaleY:0.05,
                    cssColor:"Yellow",
                    touchable:true
                });
                specialTarget.onPointDown.add(function ()
                {
                    specialPoint+=3;
                    label.text=`${point+specialPoint}`;
                    group.remove(specialTarget);
                    label.invalidate();
                });

                group.append(specialTarget);
            }
		}
		for(let i=0;i<targetcount;i++)
		{
            const target = new g.Sprite
			({
				scene: scene,
                src:targetImage,
				width: 500,
				height: 500,
				x:Math.floor(g.game.random.generate()*(g.game.width-50)),
				y:Math.floor(g.game.random.generate()*(g.game.height-50)),
                scaleX:0.1,
                scaleY:0.1,
				cssColor:"red",
				touchable:true
			});

			target.onPointDown.add(function ()
			{
				point+=1;
				label.text=`${point+specialPoint}`;
				group.remove(target);
				label.invalidate();
			});
			group.append(target);


		}

		group.append(label);
		scene.append(group);

		timeout=scene.setTimeout(function()
		{
			if(point==(nowpoint+targetcount))
			{
				if(targetcount==0)
				{
					point+=1;
					label.text=`${point+specialPoint}`;
					label.invalidate();
				}
				g.game.replaceScene(createGameScene(point+specialPoint));
			}else
			{
				g.game.replaceScene(createGameOverScene(point+specialPoint));
			}
		},time);
    });
	return scene;
}


function createGameOverScene(point)
{
	const scene=new g.Scene
	({
        game: g.game,
    });

	scene.onLoad.add(function () {
		const font = new g.DynamicFont
		({
			game: g.game,
			fontFamily: g.FontFamily.SansSerif,
			size: 50
		});
		const label = new g.Label
		({
			scene: scene,
			font: font,
			text: "GAME OVER",
			fontSize: 50,
			textColor: "red",
			x: 1280/2,
			y: 720/2
		});

		const score = new g.Label
		({
			scene: scene,
			font: font,
			text: "スコア"+`${point}`,
			fontSize: 50,
			textColor: "blue",
			x: 1280/2+50,
			y: 720/2+50
		});
		scene.append(score);
		scene.append(label);

		scene.onPointDownCapture.add(function()
		{
			g.game.replaceScene(createGameScene(0));
		});
	})
	return scene;
}

module.exports = main;
