var spotstaken = [], foreground = document.getElementById("foreground"), output = document.getElementById("demo");

function newgame() {
	var alltiles = document.getElementsByClassName("foretiles");
	while (alltiles[0]) {
		foreground.removeChild(alltiles[0]);
	}

	spotstaken = [];
	createtile();
	createtile();
}

function createtile() {
	var toprand, leftrand, top, left, spot, num, numclass, tile;

	if (Math.random() < 0.1) {
		num =  4;
	}else {
		num =  2;
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
	tile.classList.add(numclass);
	tile.classList.add("foretiles");
	tile.setAttribute("data-spot", spot);
}

function move(direction) {

	var alltiles = document.getElementsByClassName("foretiles");

	var i, j, k, sidespace, tilespot, tilepos, tilesonpos,
		tilesonposarray, newpos, newspot, index, mergetilesbool,
		spotafterindex, tileafter, currenttile, tileaftermergebool,
		tilebeforeindex, parentspotindex;

	tilesonposarray = [];
	mergetilesbool = [];

	if (direction == "up") {
		for (i = 0; i < alltiles.length; i++) {
			tilespot = parseInt(alltiles[i].dataset.spot);
			tilesonpos = 0;
			for (j=tilespot-4;j>=0;j-=4) {
				if (spotstaken.includes(j)) {
					tilesonpos += 1;
				}
			}
			tilesonposarray.push(tilesonpos);
		}

		// Starts Here
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
			tilespot = parseInt(alltiles[i].dataset.spot);
			newpos = tilesonposarray[i] * 121;
			tilepos = parseInt(alltiles[i].style.top.split("px")[0]);
			newspot = tilespot - ((tilepos - newpos)/121)*4;

			index = spotstaken.indexOf(tilespot);
			if (index !== -1) {
				spotstaken[index] = newspot;
			}
		    alltiles[i].style.top = newpos+"px";
		    alltiles[i].setAttribute("data-spot", newspot);
		}

		createmergedtile(mergetilesbool, alltiles);

	}else if (direction == "down") {
		for (i = 0; i < alltiles.length; i++) {
		    tilespot = parseInt(alltiles[i].dataset.spot);
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
			tilespot = parseInt(alltiles[i].dataset.spot);
			newpos = 363 - (tilesonposarray[i] * 121);
			tilepos = parseInt(alltiles[i].style.top.split("px")[0]);
			newspot = tilespot + ((newpos - tilepos)/121)*4;

			index = spotstaken.indexOf(tilespot);
			if (index !== -1) {
				spotstaken[index] = newspot;
			}
		    alltiles[i].style.top = newpos+"px";
		    alltiles[i].setAttribute("data-spot", newspot);
		}

		createmergedtile(mergetilesbool, alltiles);

	}else if (direction == "right") {
		for (i = 0; i < alltiles.length; i++) {
			tilespot = parseInt(alltiles[i].dataset.spot);
			
			sidespace = (16 - tilespot) % 4;
			
			tilesonpos = 0;
			for (j=tilespot+1;j<=tilespot+sidespace;j++) {
				if (spotstaken.includes(j)) {
					tilesonpos += 1;
				}
			}
			tilesonposarray.push(tilesonpos);
		}
		for (i = 0; i < tilesonposarray.length; i++) {
			tilespot = parseInt(alltiles[i].dataset.spot);
			newpos = 363 - (tilesonposarray[i] * 121);
			tilepos = parseInt(alltiles[i].style.left.split("px")[0]);
			newspot = tilespot + ((newpos - tilepos)/121);

			index = spotstaken.indexOf(tilespot);
			if (index !== -1) {
				spotstaken[index] = newspot;
			}
		    alltiles[i].style.left = newpos+"px";
		    alltiles[i].setAttribute("data-spot", newspot);
		}
	}else {
		for (i = 0; i < alltiles.length; i++) {
			tilespot = parseInt(alltiles[i].dataset.spot);
			
			sidespace = (tilespot - 1) % 4;
			
			tilesonpos = 0;
			for (j=tilespot-1;j>=tilespot-sidespace;j--) {
				if (spotstaken.includes(j)) {
					tilesonpos += 1;
				}
			}
			tilesonposarray.push(tilesonpos);
		}
		for (i = 0; i < tilesonposarray.length; i++) {
			tilespot = parseInt(alltiles[i].dataset.spot);
			newpos = tilesonposarray[i] * 121;
			tilepos = parseInt(alltiles[i].style.left.split("px")[0]);
			newspot = tilespot - ((tilepos - newpos)/121);

			index = spotstaken.indexOf(tilespot);
			if (index !== -1) {
				spotstaken[index] = newspot;
			}
		    alltiles[i].style.left = newpos+"px";
		    alltiles[i].setAttribute("data-spot", newspot);
		}
	}

	createtile();
}

function createmergedtile(mergetilesbool, alltiles) {
	j = 0;
	for (i in mergetilesbool) {
		k=i-j;
		if (mergetilesbool[i]) {
			parentspotindex = spotstaken.indexOf(spotstaken[k]);
			if (parentspotindex == k) {
				parentspotindex = spotstaken.lastIndexOf(spotstaken[k]);
			}

			var spot = spotstaken[parentspotindex];
			var newnum = 2 * (alltiles[parentspotindex].innerHTML)
			var newclass = "num"+newnum;

			var top, left;
			left = 3 - ((16 - spot) % 4);
			top = (spot - (left+1))/4;

			top *= 121;
			left *= 121;

			var tile = document.createElement("div");
			foreground.replaceChild(tile, alltiles[parentspotindex]);

			tile.innerHTML = newnum;
			tile.style.top = top+"px";
			tile.style.left = left+"px";
			tile.classList.add(newclass);
			tile.classList.add("foretiles");
			tile.setAttribute("data-spot", spot);

			foreground.removeChild(alltiles[k]);
			spotstaken.splice(k,1);
			j+=1;
		}
	}
}

document.addEventListener('keydown', function(event) {
	if (event.keyCode == 38 || event.keyCode == 87) {
		event.preventDefault();
		move("up");
	}else if (event.keyCode == 40 || event.keyCode == 83) {
		event.preventDefault();
		move("down");
	}else if (event.keyCode == 37 || event.keyCode == 65) {
		event.preventDefault();
		move("left");
	}else if (event.keyCode == 39 || event.keyCode == 68) {
		event.preventDefault();
		move("right");
	}
});

newgame();

// string  = "";
// output.innerHTML = string;
