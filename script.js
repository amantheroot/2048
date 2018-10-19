var spotstaken = [], oldspotstaken = [], foreground = document.getElementById("foreground"), score = 0, best = 0;

var merged, poschanged;

var gamefin = false, gameover = false;

function newgame() {
	var alltiles = document.getElementsByClassName("foretiles");
	while (alltiles[0]) {
		foreground.removeChild(alltiles[0]);
	}

	spotstaken = [];
	score = 0;

	displayscore();

	gamefin = false;

	document.removeEventListener('keydown', eventkeydown);
	document.addEventListener('keydown', eventkeydown);

	createtile();
	createtile();
}

function createtile() {
	var toprand, leftrand, top, left, spot, num, numclass, tile;

	if (Math.random() < 0.1) {
		num = 4;
	}else {
		num = 2;
	}

	numclass = "num"+num;

	do {
		if (spotstaken.length+1 > 16) {
			return;
		}
		toprand = Math.floor(Math.random() * 4);
		leftrand = Math.floor(Math.random() * 4);
		top = toprand * 121;
		left = leftrand * 121;
		spot = (toprand * 4) + leftrand + 1;
	}while (spotstaken.includes(spot));

	spotstaken.push(spot);

	tile = document.createElement("div");
	foreground.appendChild(tile);
	tile.innerHTML = num;
	tile.style.top = top+"px";
	tile.style.left = left+"px";
	tile.className = numclass+" foretiles foretilesbirth";
	tile.setAttribute("data-spot", spot);
}

function move(direction,checkgameover) {

	oldspotstaken = [];
	for (i in spotstaken) {
		oldspotstaken.push(spotstaken[i]);
	}

	merged = false;
	poschanged = false;

	var alltiles = document.getElementsByClassName("foretiles");

	var i, j, k, sidespace, tilespot, tilepos, tilesonpos,
		tilesonposarray, newpos, newspot, index, mergetilesbool,
		spotafterindex, tileafter, currenttile, tileaftermergebool,
		tilebeforeindex, parentspotindex;

	tilesonposarray = [];
	mergetilesbool = [];

	if (direction == "up") {
		for (i = 0; i < alltiles.length; i++) {
			tilespot = parseInt(spotstaken[i]);
			tilesonpos = 0;
			for (j=tilespot-4;j>=0;j-=4) {
				if (spotstaken.includes(j)) {
					tilesonpos += 1;
				}
			}
			tilesonposarray.push(tilesonpos);
		}

		for (i=0;i<tilesonposarray.length;i++) {
			mergetilesbool.push(false);
		}
		for (i=1;i<=3;i++) {
			for (j in tilesonposarray) {
				if (tilesonposarray[j] == i) {
					for (k=1;k<=3;k++) {
						spotafterindex = spotstaken.indexOf(spotstaken[j] - 4*k);
						if (spotafterindex !== -1) {
							tileafter = alltiles[spotafterindex];
							currenttile = alltiles[j];
							tileaftermergebool = mergetilesbool[spotafterindex];
							if ((currenttile.innerHTML == tileafter.innerHTML) && (!tileaftermergebool)) {
								mergetilesbool[j] = true;
							}
							break;
						}
					}
				}
			}
		}
		if (checkgameover) {
			return mergetilesbool;
		}
		for (i in mergetilesbool) {
			if (mergetilesbool[i]) {
				tilesonposarray[i] = tilesonposarray[i] - 1;
				for (j=1;j<=3;j++) {
					if (spotstaken.includes(spotstaken[i] + 4*j)) {
						tilebeforeindex = spotstaken.indexOf(spotstaken[i] + 4*j);
						tilesonposarray[tilebeforeindex] = tilesonposarray[tilebeforeindex] - 1;
					}
				}
			}
		}

		for (i = 0; i < tilesonposarray.length; i++) {
			tilespot = parseInt(spotstaken[i]);
			newpos = tilesonposarray[i] * 121;
			tilepos = parseInt(alltiles[i].style.top.split("px")[0]);
			newspot = tilespot - ((tilepos - newpos)/121)*4;

			spotstaken[i] = newspot;

		    alltiles[i].style.top = newpos+"px";
		    alltiles[i].setAttribute("data-spot", newspot);
		}

		setTimeout(function() {createmergedtile(mergetilesbool, alltiles);},100);

	}else if (direction == "down") {
		for (i = 0; i < alltiles.length; i++) {
		    tilespot = parseInt(spotstaken[i]);
			tilesonpos = 0;
			for (j=tilespot+4;j<=16;j+=4) {
				if (spotstaken.includes(j)) {
					tilesonpos += 1;
				}
			}
			tilesonposarray.push(tilesonpos);
		}

		for (i=0;i<tilesonposarray.length;i++) {
			mergetilesbool.push(false);
		}
		for (i=1;i<=3;i++) {
			for (j in tilesonposarray) {
				if (tilesonposarray[j] == i) {
					for (k=1;k<=3;k++) {
						spotafterindex = spotstaken.indexOf(spotstaken[j] + 4*k);
						if (spotafterindex !== -1) {
							tileafter = alltiles[spotafterindex];
							currenttile = alltiles[j];
							tileaftermergebool = mergetilesbool[spotafterindex];
							if ((currenttile.innerHTML == tileafter.innerHTML) && (!tileaftermergebool)) {
								mergetilesbool[j] = true;
							}
							break;
						}
					}
				}
			}
		}
		if (checkgameover) {
			return mergetilesbool;
		}
		for (i in mergetilesbool) {
			if (mergetilesbool[i]) {
				tilesonposarray[i] = tilesonposarray[i] - 1;
				for (j=1;j<=3;j++) {
					if (spotstaken.includes(spotstaken[i] - 4*j)) {
						tilebeforeindex = spotstaken.indexOf(spotstaken[i] - 4*j);
						tilesonposarray[tilebeforeindex] = tilesonposarray[tilebeforeindex] - 1;
					}
				}
			}
		}

		for (i = 0; i < tilesonposarray.length; i++) {
			tilespot = parseInt(spotstaken[i]);
			newpos = 363 - (tilesonposarray[i] * 121);
			tilepos = parseInt(alltiles[i].style.top.split("px")[0]);
			newspot = tilespot + ((newpos - tilepos)/121)*4;

			spotstaken[i] = newspot;

		    alltiles[i].style.top = newpos+"px";
		    alltiles[i].setAttribute("data-spot", newspot);
		}

		setTimeout(function() {createmergedtile(mergetilesbool, alltiles);},100);

	}else if (direction == "right") {
		for (i = 0; i < alltiles.length; i++) {
			tilespot = parseInt(spotstaken[i]);
			
			sidespace = (16 - tilespot) % 4;
			
			tilesonpos = 0;
			for (j=tilespot+1;j<=tilespot+sidespace;j++) {
				if (spotstaken.includes(j)) {
					tilesonpos += 1;
				}
			}
			tilesonposarray.push(tilesonpos);
		}

		for (i=0;i<tilesonposarray.length;i++) {
			mergetilesbool.push(false);
		}
		for (i=1;i<=3;i++) {
			for (j in tilesonposarray) {
				if (tilesonposarray[j] == i) {

					sidespace = (16 - spotstaken[j]) % 4;

					for (k=1;k<=sidespace;k++) {
						spotafterindex = spotstaken.indexOf(spotstaken[j]+k);
						if (spotafterindex !== -1) {
							tileafter = alltiles[spotafterindex];
							currenttile = alltiles[j];
							tileaftermergebool = mergetilesbool[spotafterindex];
							if ((currenttile.innerHTML == tileafter.innerHTML) && (!tileaftermergebool)) {
								mergetilesbool[j] = true;
							}
							break;
						}
					}
				}
			}
		}
		if (checkgameover) {
			return mergetilesbool;
		}
		for (i in mergetilesbool) {
			if (mergetilesbool[i]) {
				sidespace = (16 - spotstaken[i]) % 4;
				tilesonposarray[i] = tilesonposarray[i] - 1;
				for (j=1;j<=(3-sidespace);j++) {
					if (spotstaken.includes(spotstaken[i]-j)) {
						tilebeforeindex = spotstaken.indexOf(spotstaken[i]-j);
						tilesonposarray[tilebeforeindex] = tilesonposarray[tilebeforeindex] - 1;
					}
				}
			}
		}

		for (i = 0; i < tilesonposarray.length; i++) {
			tilespot = parseInt(alltiles[i].dataset.spot);
			newpos = 363 - (tilesonposarray[i] * 121);
			tilepos = parseInt(alltiles[i].style.left.split("px")[0]);
			newspot = tilespot + ((newpos - tilepos)/121);

			spotstaken[i] = newspot;

		    alltiles[i].style.left = newpos+"px";
		    alltiles[i].setAttribute("data-spot", newspot);
		}

		setTimeout(function() {createmergedtile(mergetilesbool, alltiles);},100);

	}else {
		for (i = 0; i < alltiles.length; i++) {
			tilespot = parseInt(spotstaken[i]);
			
			sidespace = (tilespot - 1) % 4;
			
			tilesonpos = 0;
			for (j=tilespot-1;j>=tilespot-sidespace;j--) {
				if (spotstaken.includes(j)) {
					tilesonpos += 1;
				}
			}
			tilesonposarray.push(tilesonpos);
		}

		for (i=0;i<tilesonposarray.length;i++) {
			mergetilesbool.push(false);
		}
		for (i=1;i<=3;i++) {
			for (j in tilesonposarray) {
				if (tilesonposarray[j] == i) {

					sidespace = (spotstaken[j] - 1) % 4;

					for (k=1;k<=sidespace;k++) {
						spotafterindex = spotstaken.indexOf(spotstaken[j]-k);
						if (spotafterindex !== -1) {
							tileafter = alltiles[spotafterindex];
							currenttile = alltiles[j];
							tileaftermergebool = mergetilesbool[spotafterindex];
							if ((currenttile.innerHTML == tileafter.innerHTML) && (!tileaftermergebool)) {
								mergetilesbool[j] = true;
							}
							break;
						}
					}
				}
			}
		}
		if (checkgameover) {
			return mergetilesbool;
		}
		for (i in mergetilesbool) {
			if (mergetilesbool[i]) {
				sidespace = (spotstaken[i] - 1) % 4;
				tilesonposarray[i] = tilesonposarray[i] - 1;
				for (j=1;j<=(3-sidespace);j++) {
					if (spotstaken.includes(spotstaken[i]+j)) {
						tilebeforeindex = spotstaken.indexOf(spotstaken[i]+j);
						tilesonposarray[tilebeforeindex] = tilesonposarray[tilebeforeindex] - 1;
					}
				}
			}
		}

		for (i = 0; i < tilesonposarray.length; i++) {
			tilespot = parseInt(alltiles[i].dataset.spot);
			newpos = tilesonposarray[i] * 121;
			tilepos = parseInt(alltiles[i].style.left.split("px")[0]);
			newspot = tilespot - ((tilepos - newpos)/121);

			spotstaken[i] = newspot;

		    alltiles[i].style.left = newpos+"px";
		    alltiles[i].setAttribute("data-spot", newspot);
		}

		setTimeout(function() {createmergedtile(mergetilesbool, alltiles);},100);
	}
}

function createmergedtile(mergetilesbool, alltiles) {
	var j = 0;
	var oldscore = score;
	for (i in mergetilesbool) {
		var k=i-j;
		if (mergetilesbool[i]) {
			var attackerspot = spotstaken[k];

			parentspotindex = spotstaken.indexOf(attackerspot);
			if (parentspotindex == k) {
				parentspotindex = spotstaken.lastIndexOf(attackerspot);
			}

			var newnum = 2 * (alltiles[parentspotindex].innerHTML);

			if (newnum == 2048) {
				gamefin = true;
			}

			score += newnum;
			if (score >= best) {
				best = score;
			}

			if (newnum <= 2048) {
				var newclass = "num"+newnum;
			}else {
				var newclass = "numgt2048";
			}

			var currenttile = alltiles[parentspotindex];

			currenttile.innerHTML = newnum;
			currenttile.className = '';
			currenttile.className = newclass+" foretiles foretilesmerge";

			setTimeout(function() {currenttile.classList.remove("foretilesmerge");},175);

			foreground.removeChild(alltiles[k]);
			spotstaken.splice(k,1);
			j+=1;

			merged = true;
		}
	}

	poschanged = checkposchanged(oldspotstaken,spotstaken);

	if (merged) {
		displayscore();
		scoringanimation(oldscore);
	}

	if ((merged) || (poschanged)) {
		createtile();
	}

	if (spotstaken.length == 16) {
		var allmergetilesbool = [];
		allmergetilesbool.push(move("up",true));
		allmergetilesbool.push(move("down",true));
		allmergetilesbool.push(move("left",true));
		allmergetilesbool.push(move("right",true));

		gameover = true;
		for (i in allmergetilesbool) {
			for (j in allmergetilesbool[i]) {
				if(allmergetilesbool[i][j]) {
					gameover = false;
				}
			}
		}
	}

	if (gamefin) {
		document.getElementById("overground").innerHTML = "<h1>You Won!</h1><button onclick=\"gamecontinue()\">Continue</button>";
		document.getElementById("overground").classList.add("gamefinfadein");
		document.removeEventListener('keydown', eventkeydown);
		document.getElementById("overoverground").style.display = "none";
	}

	if (gameover) {
		document.getElementById("overground").innerHTML = "<h1>Game Over!</h1><button onclick=\"gamereset()\">Try Again</button>";
		document.getElementById("overground").classList.add("gamefinfadein");
		document.removeEventListener('keydown', eventkeydown);
		document.getElementById("overoverground").style.display = "none";
	}
}

function checkposchanged(oldarr,newarr) {
	if (oldarr.length !== newarr.length) {
		return true;
	}
	for (i in newarr) {
		if (newarr[i] !== oldarr[i]) {
			return true;
		}
	}
}

function displayscore() {
	var scoretab = document.getElementById("score");
	var bestscoretab = document.getElementById("score-best");

	scoretab.innerHTML = score;
	bestscoretab.innerHTML = best;
}

function scoringanimation(oldscore) {
	var diff = score - oldscore;
	var string = "+"+diff;
	var scoreanime = document.getElementById("scoreanime");
	var scoretab = document.getElementById("score");

	var toleft = scoretab.offsetLeft+(scoretab.offsetWidth/2)-(scoreanime.offsetWidth/2);

	scoreanime.style.left = toleft+"px";
	scoreanime.innerHTML = string;
	scoreanime.classList.add("scoringani");
	setTimeout(function() {scoreanime.classList.remove("scoringani");},600);
}

function eventkeydown(event) {
	if (event.keyCode == 38 || event.keyCode == 87) {
		event.preventDefault();
		move("up",false);
	}else if (event.keyCode == 40 || event.keyCode == 83) {
		event.preventDefault();
		move("down",false);
	}else if (event.keyCode == 37 || event.keyCode == 65) {
		event.preventDefault();
		move("left",false);
	}else if (event.keyCode == 39 || event.keyCode == 68) {
		event.preventDefault();
		move("right",false);
	}
}

function gamecontinue() {
	gamefin = false;
	document.getElementById("overground").classList.remove("gamefinfadein");
	document.getElementById("overground").innerHTML = "";
	document.getElementById("overoverground").style.display = "block";
	document.addEventListener('keydown', eventkeydown);
}

function gamereset() {
	gameover = false;
	document.getElementById("overground").classList.remove("gamefinfadein");
	document.getElementById("overground").innerHTML = "";
	document.getElementById("overoverground").style.display = "block";
	newgame();
}

newgame();
