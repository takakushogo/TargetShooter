let point=0;
let timeout;
function main(param) {
	g.game.pushScene(createGameScene());
}

function createGameScene()
{
	const scene = new g.Scene
    ({
        game: g.game,
        assetIds: ["bom"]
    });
	const group=new g.E({scene:scene});


    scene.onLoad.add(function ()
	{
		var bomImage = scene.asset.getImageById("bom");
		var font = new g.DynamicFont
		({
			game: g.game,
			fontFamily: g.FontFamily.SansSerif,
			size: 15
		});
		let label = new g.Label
		({
			scene: scene,
			font: font,
			text: String(point),
			fontSize: 15,
			textColor: "blue",
			x: 1280/2,
			y: 720/2
		});




		let nowpoint=point;
		let random=Math.floor(g.game.localRandom.generate()*10)+1;
		let targetcount=Math.floor(g.game.localRandom.generate()*random);
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
			let bom= new g.Sprite
			({
				scene: scene,
				src: bomImage,
				width: 800,
				height: 800,
				scaleX:0.2,
				scaleY:0.2,
				x:Math.floor(g.game.localRandom.generate()*(g.game.width-50)),
				y:Math.floor(g.game.localRandom.generate()*(g.game.height-50)),
				touchable:true
			});

			bom.onPointDown.add(()=>
			{
                scene.clearTimeout(timeout);
				g.game.replaceScene(createGameOverScene());
			})
			group.append(bom);
		}
		for(let i=0;i<targetcount;i++)
		{
			let target = new g.FilledRect
			({
				scene: scene,
				width: 50,
				height: 50,
				x:Math.floor(g.game.localRandom.generate()*(g.game.width-50)),
				y:Math.floor(g.game.localRandom.generate()*(g.game.height-50)),
				cssColor:"red",
				touchable:true
			});

			target.onPointDown.add(function ()
			{
				point+=1;
				label.text=String(point);
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
					label.text=String(point);
					label.invalidate();
				}
				g.game.replaceScene(createGameScene());
			}else
			{
				g.game.replaceScene(createGameOverScene());
			}
		},time);
    });
	return scene;
}


function createGameOverScene()
{
	const scene=new g.Scene
	({
        game: g.game,
    });

	scene.onLoad.add(function () {
		var font = new g.DynamicFont
		({
			game: g.game,
			fontFamily: g.FontFamily.SansSerif,
			size: 50
		});
		let label = new g.Label
		({
			scene: scene,
			font: font,
			text: "GAME OVER",
			fontSize: 50,
			textColor: "red",
			x: 1280/2,
			y: 720/2
		});

		  let score = new g.Label
		  ({
			scene: scene,
			font: font,
			text: "スコア"+point,
			fontSize: 50,
			textColor: "blue",
			x: 1280/2+50,
			y: 720/2+50
		});
		scene.append(score);
		scene.append(label);

		scene.onPointDownCapture.add(function()
		{
			point=0;
			g.game.replaceScene(createGameScene());
		});
	})
	return scene;
}

module.exports = main;
