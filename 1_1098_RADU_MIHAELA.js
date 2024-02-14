var canvas = document.getElementById('Canvas');
var context = canvas.getContext('2d');

var culoareFundal = document.getElementById('culoareFundal');
var sterge = document.getElementById('sterge');
var culoare= document.getElementById('culoare');
var culoareContur = document.getElementById('culoareContur');
var grosime= document.getElementById('grosime');
var linie= document.getElementById('linie');
var romb= document.getElementById('romb');
var dreptunghi= document.getElementById('dreptunghi');
var elipsa = document.getElementById('elipsa');

var salveazaPng = document.getElementById('savePng');
var salveazaSvg = document.getElementById('saveSvg');
var modificaForma = document.getElementById('modificaForma');
var stergeForma = document.getElementById('stergeForma');
var coordX = document.getElementById('coordX');
var coordY = document.getElementById('coordY');
var latime = document.getElementById('latime');
var inaltime = document.getElementById('inaltime');

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

var deseneaza = false;
//var isDrawingDashed = false;
var preview = true;
var listaForme = [];

var formaCurenta = {
    type: null,
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    culoare: '#FFFFFF',
    grosime: 1,
    culoareContur: '#000000',          
};

//BUTOANE
//culoarea fundalului
culoareFundal.addEventListener('input', function() {
    canvas.style.backgroundColor = culoareFundal.value;
});

// buton pt stergerea intreglui canvas
sterge.addEventListener('click', function() {
    listaForme = [];      //stergem toate formele
    //formaCurenta = { type: null, startX: 0, startY: 0, endX: 0, endY: 0, culoare: '#FFFFFF', grosime: 1, culoareContur: '#000000' }; // resetare forma curenta
    reDeseneaza();        //redesenam canvasul gol
    updateListaFiguri();
});

// selectarea culorii de umplere
culoare.addEventListener('input', function() {
    formaCurenta.culoare = this.value;
});

// culoarea conturului
culoareContur.addEventListener('input', function() {
    formaCurenta.culoareContur = this.value;
});

// grosimea conturului
grosime.addEventListener('input', function() {
    formaCurenta.grosime = parseInt(this.value) || 1;
});

// buton elipsa
elipsa.addEventListener('click', function() {
    formaCurenta.type = 'elipsa';
    //currentShape.isDashed = false; // Resetează modul "desenare punctată" la fiecare schimbare de formă
});

// buton dreptunghi
dreptunghi.addEventListener('click', function() {
    formaCurenta.type = 'dreptunghi';
});

// buton romb
romb.addEventListener('click', function() {
    formaCurenta.type = 'romb';
});

// buton linie
linie.addEventListener('click', function() {
    formaCurenta.type = 'linie';
});




//MISCARE MOUSE
// apasare buton mouse
canvas.addEventListener('mousedown', function(e) {
    deseneaza = true;
    formaCurenta.startX = e.clientX - canvas.offsetLeft;
    formaCurenta.startY = e.clientY - canvas.offsetTop;
   });

//deplasare mouse
canvas.addEventListener('mousemove', function(e) {
    if (deseneaza) {
        formaCurenta.endX = e.clientX - canvas.offsetLeft;
        formaCurenta.endY = e.clientY - canvas.offsetTop;
        reDeseneaza(true);
    }
   });

//cand eliberaram butonul mouse ului
canvas.addEventListener('mouseup', function() {
    deseneaza = false;
    listaForme.push(Object.assign({}, formaCurenta));

    //fct pt actualizare lista
    updateListaFiguri();
   });

// daca parasim zona canvas cu cursorul
canvas.addEventListener('mouseleave', function() {
    deseneaza = false;
});



// redesenarea tuturor formelor pe canvas
function reDeseneaza() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // desenam toate formele din lista
    for (var i = 0; i < listaForme.length; i++) {
        switch (listaForme[i].type) {
            case 'elipsa':
                desenElipsa(listaForme[i].startX, listaForme[i].startY, listaForme[i].endX, listaForme[i].endY, listaForme[i]);
                break;
            case 'dreptunghi':
                desenDreptunghi(listaForme[i].startX, listaForme[i].startY, listaForme[i].endX, listaForme[i].endY, listaForme[i]);
                break;
            case 'romb':
                desenRomb(listaForme[i].startX, listaForme[i].startY, listaForme[i].endX, listaForme[i].endY, listaForme[i]);
                break;
            case 'linie':
                desenLine(listaForme[i].startX, listaForme[i].startY, listaForme[i].endX, listaForme[i].endY, listaForme[i]);
                break;
        }
    }

    // daca desenam fix in momentul asta, desenam si forma curenta
    if (deseneaza) {
        switch (formaCurenta.type) {
            case 'elipsa':
                desenElipsa(formaCurenta.startX, formaCurenta.startY, formaCurenta.endX, formaCurenta.endY, formaCurenta);
                break;
            case 'dreptunghi':
                desenDreptunghi(formaCurenta.startX, formaCurenta.startY, formaCurenta.endX, formaCurenta.endY, formaCurenta);
                break;
            case 'romb':
                desenRomb(formaCurenta.startX, formaCurenta.startY, formaCurenta.endX, formaCurenta.endY, formaCurenta);
                break;
            case 'linie':
                desenLine(formaCurenta.startX, formaCurenta.startY, formaCurenta.endX, formaCurenta.endY, formaCurenta);
                break;
        }
    }

    // fct pt actualizare lista
   // updateListaFiguri();
}

//DESENARE FORME
// fct pt desenare elipsa
function desenElipsa(x1, y1, x2, y2, forma) {
    context.beginPath();
    var razaX = Math.abs(x2 - x1) / 2;
    var razaY = Math.abs(y2 - y1) / 2;
    var centruX = x1 < x2 ? x1 + razaX : x1 - razaX;
    var centruY = y1 < y2 ? y1 + razaY : y1 - razaY;

    //context.setLineDash([]); // resetam stilul liniei
    context.ellipse(centruX, centruY, razaX, razaY, 0, 0, 2 * Math.PI);
    context.lineWidth = forma.grosime;
    context.strokeStyle = forma.culoareContur;
    context.stroke();
    context.fillStyle = forma.culoare;
    context.fill();
    context.closePath();
}


// fct pt desenare dreptunghi
function desenDreptunghi(x1, y1, x2, y2, forma) {
    context.beginPath();

    context.rect(x1, y1, x2 - x1, y2 - y1);
    context.lineWidth = forma.grosime;
    context.strokeStyle = forma.culoareContur;
    context.stroke();
    context.fillStyle = forma.culoare;
    context.fill();
    context.closePath();
}

// functia pt romb
function desenRomb(x1, y1, x2, y2, forma) {
    context.beginPath();

    context.moveTo((x1 + x2) / 2, y1);
    context.lineTo(x2, (y1 + y2) / 2);
    context.lineTo((x1 + x2) / 2, y2);
    context.lineTo(x1, (y1 + y2) / 2);
    context.closePath();
    context.lineWidth = forma.grosime;
    context.strokeStyle = forma.culoareContur;
    context.stroke();
    context.fillStyle = forma.culoare;
    context.fill();
}

// fct pt linie
function desenLine(x1, y1, x2, y2, forma) {
    context.beginPath();

    //  liniei  punctata
    if (forma.isDashed) {
        context.setLineDash([5, 5]);
    } else {
        context.setLineDash([]); 
    }

    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.lineWidth = forma.grosime;
    context.strokeStyle = forma.culoareContur;
    context.stroke();
    context.closePath();
}


//SALVAREA

// butonul pt PNG
salveazaPng.addEventListener('click', function() {
    exportRaster();
});
// butonul pt SVG
salveazaSvg.addEventListener('click', function() {
    exportVector();
});

// export in format PNG
function exportRaster() {
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'desen.png';
    link.click();
}

// export in format SVG
function exportVector() {
    const stringSVG = transformCanvas();
    const blob = new Blob([stringSVG], { type: 'image/svg+xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'desen.svg';
    link.click();
}

// facem conversia din  canvas in stringSVG
function transformCanvas() {
    let stringSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="' + canvas.width + '" height="' + canvas.height + '">';

    for (const forma of listaForme) {
        const { type, startX, startY, endX, endY, culoare, culoareContur, grosime } = forma;
    
        switch (type) {
            case 'elipsa':
                stringSVG =stringSVG + `<ellipse 
                    cx="${startX + (endX - startX) / 2}" 
                    cy="${startY + (endY - startY) / 2}" 
                    rx="${Math.abs(endX - startX) / 2}" 
                    ry="${Math.abs(endY - startY) / 2}" 
                    stroke="${culoareContur}" 
                    stroke-width="${grosime}" 
                    fill="${culoare}"
                />`;
                break;
            case 'dreptunghi':
                stringSVG =stringSVG + `<rect 
                    x="${startX}" 
                    y="${startY}" 
                    width="${endX - startX}" 
                    height="${endY - startY}" 
                    stroke="${culoareContur}" 
                    stroke-width="${grosime}" 
                    fill="${culoare}"
                />`;
                break;
            case 'romb':
                stringSVG = stringSVG +`<polygon 
                    points="${(startX + endX) / 2},${startY} ${endX},${(startY + endY) / 2} ${(startX + endX) / 2},${endY} ${startX},${(startY + endY) / 2}" 
                    stroke="${culoareContur}" 
                    stroke-width="${grosime}" 
                    fill="${culoare}"
                />`;
                break;
            case 'linie':
                stringSVG =stringSVG + `<line 
                    x1="${startX}" 
                    y1="${startY}" 
                    x2="${endX}" 
                    y2="${endY}" 
                    stroke="${culoare}" 
                    stroke-width="${grosime}"
                />`;
                break;
        }
    }
    
    stringSVG += '</svg>';
    return stringSVG;
}


//MODIFICARE FIGURA DIN LISTA
function updateListaFiguri() {
    var listaFiguri = document.getElementById('listaFiguri');
    listaFiguri.innerHTML = '';      // golim lista

    //parcurgem 
    for (var i = 0; i < listaForme.length; i++) {
        var figuraDiv = document.createElement('div');
        figuraDiv.className = 'figura';
        figuraDiv.textContent = listaForme[i].type;

        //selectam prin click
        figuraDiv.addEventListener('click', (function(index) {
            return function() {
                selecteazaForma(index);
            };
        })(i));

        listaFiguri.appendChild(figuraDiv);
    }
}

var formaSelectata = {
    index: null,
    forma: null
};

function selecteazaForma(index) {
    formaSelectata.index = index;
    formaSelectata.forma = listaForme[index];

    // afisam coordonatele formei selctate
    document.getElementById('coordX').value = formaSelectata.forma.startX;  
    document.getElementById('coordY').value = formaSelectata.forma.startY;   //x si y - coord pt colt stanga sus
    document.getElementById('latime').value = formaSelectata.forma.endX - formaSelectata.forma.startX;  
    document.getElementById('inaltime').value = formaSelectata.forma.endY - formaSelectata.forma.startY; //scăderea coordonatei y a colțului din stânga jos (endY) de la coordonata y a colțului stânga-sus (startY)
}

//modificare
modificaForma.addEventListener('click', function() {
    if (formaSelectata) {
        // actualizez coordonate
        formaSelectata.startX = parseInt(document.getElementById('coordX').value);
        formaSelectata.startY = parseInt(document.getElementById('coordY').value);
        formaSelectata.endX = formaSelectata.startX + parseInt(document.getElementById('latime').value);
        formaSelectata.endY = formaSelectata.startY + parseInt(document.getElementById('inaltime').value);

        //redesenam pt a afisa noua stare a formei
        reDeseneaza();
        // actualizez lista de figuri
        updateListaFiguri();
    }
});

// stergere
stergeForma.addEventListener('click', function() {
    if (formaSelectata.index !== null) {
        listaForme.splice(formaSelectata.index, 1); // stergere din vector
        formaSelectata.index = null;
        formaSelectata.forma = null;
        
        reDeseneaza();
        updateListaFiguri();
    }
});

// coordonatele modificate
coordX.addEventListener('input', function() {
    if (formaSelectata.forma) {
        formaSelectata.forma.startX = parseInt(this.value) || 0;
        reDeseneaza();
    }
});

coordY.addEventListener('input', function() {
    if (formaSelectata.forma) {
        formaSelectata.forma.startY = parseInt(this.value) || 0;
        reDeseneaza();
    }
});

latime.addEventListener('input', function() {
    if (formaSelectata.forma) {
        formaSelectata.forma.endX = formaSelectata.forma.startX + (parseInt(this.value) || 0);
        reDeseneaza();
    }
});

inaltime.addEventListener('input', function() {
    if (formaSelectata.forma) {
        formaSelectata.forma.endY = formaSelectata.forma.startY + (parseInt(this.value) || 0);
        reDeseneaza();
    }
});

























































