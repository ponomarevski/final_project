'use strict';

let flats = httpGet('http://localhost:3000/flats');

window.onhashchange = switchToStateFromURLHash;

let canvas = new fabric.Canvas('can', {
    selection: false
});

function switchToStateFromURLHash() {

    let URLHash = window.location.hash;
    let hash = decodeURIComponent(URLHash.substr(1));
    let SPAState;

    if (hash != "") {
        SPAState = JSON.parse(hash);
    } else {
        SPAState = { pagename: 'Main' };
    }

    switch (SPAState.pagename) {
        case 'Main':
            addInfoToContainer('mainID');
            break;
        case 'About':
            addInfoToContainer('aboutID');
            break;
        case 'Constructor':
            addInfoToContainer('displayTemplate');
            addFlatButton();
            initializeCanvasVars();
            break;
        case 'Contacts':
            addInfoToContainer('headingID');
            break;
    }
}

function addInfoToContainer(elementId) {
    let source = $(`#${elementId}`).html();
    $('#Page').html(source);
}

function switchToState(newState) {
    location.hash = encodeURIComponent(JSON.stringify(newState));

}

function switchToMainPage() {
    switchToState({ pagename: 'Main' });
}

function switchToAboutPage() {
    switchToState({ pagename: 'About' });
}

function switchToConstructorPage() {
    switchToState({ pagename: 'Constructor' });
}

function switchToContactsPage() {
    switchToState({ pagename: 'Contacts' });
}

$('#myLink').click(function () {
    switchToMainPage(); return false;
});
$('#constLink').click(function () {
    switchToConstructorPage(); return false;
});
$('#aboutLink').click(function () {
    switchToAboutPage(); return false;
});
$('#contLink').click(function () {
    switchToContactsPage(); return false;
});

switchToStateFromURLHash();



let isDown, origX, origY;
let rect,
    line,
    isDrawing,
    circle;

function drawRect() {
    clearCanvasEvents();
    canvas.on('mouse:down', onMouseDown);
    canvas.on('mouse:up', onMouseUp);
    canvas.on('mouse:move', onMouseMove);
    changeSelection(false);
}

function selection() {
    clearCanvasEvents();
    changeSelection(true);
}

function clearCanvasEvents() {
    canvas.off('mouse:down', onMouseDown);
    canvas.off('mouse:up', onMouseUp);
    canvas.off('mouse:move', onMouseMove);
    canvas.off('mouse:down', onMouseDownLine);
    canvas.off('mouse:up', onMouseUpLine);
    canvas.off('mouse:move', onMouseMoveLine);
    canvas.off('mouse:down', onMouseDownCircle);
    canvas.off('mouse:up', onMouseUpCircle);
    canvas.off('mouse:move', onMouseMoveCircle);

}

function onMouseDown(o) {
    isDown = true;
    let pointer = canvas.getPointer(o.e);
    origX = pointer.x;
    origY = pointer.y;
    pointer = canvas.getPointer(o.e);
    rect = new fabric.Rect({
        left: origX,
        top: origY,
        originX: 'left',
        originY: 'top',
        width: pointer.x - origX,
        height: pointer.y - origY,
        angle: 0,
        fill: 'white',
        strokeWidth: 2,
        stroke: 'black',
        transparentCorners: false
    });
    canvas.add(rect);
};

function onMouseMove(o) {
    if (!isDown) return;
    let pointer = canvas.getPointer(o.e);

    if (origX > pointer.x) {
        rect.set({
            left: Math.abs(pointer.x)
        });
    }
    if (origY > pointer.y) {
        rect.set({
            top: Math.abs(pointer.y)
        });
    }

    rect.set({
        width: Math.abs(origX - pointer.x)
    });
    rect.set({
        height: Math.abs(origY - pointer.y)
    });
    canvas.requestRenderAll();
};

function onMouseUp(o) {
    isDown = false;
    rect.setCoords();
};

function addText() {
    let text = new fabric.IText('add text', {
        fontFamily: 'Verdana',
        left: 50,
        top: 50,
        fontSize: 20,
        textAlign: 'center'
    });
    canvas.add(text);
}

function changeSelection(value) {
    canvas.selection = value;
    canvas.forEachObject(function (obj) {
        obj.selectable = value;
    });
    canvas.requestRenderAll();
}

function deleteObjects() {
    let activeGroup = canvas.getActiveObjects();
    if (activeGroup && activeGroup.length > 0 && confirm('Are you sure?')) {
        canvas.discardActiveObject();
        activeGroup.forEach(function (object) {
            canvas.remove(object);
        });
    }
}

function drawLine() {
    clearCanvasEvents();
    canvas.on('mouse:down', onMouseDownLine);
    canvas.on('mouse:up', onMouseUpLine);
    canvas.on('mouse:move', onMouseMoveLine);
    changeSelection(false);
}

function onMouseDownLine(o) {
    isDrawing = true;
    let pointer = canvas.getPointer(o.e);
    let points = [pointer.x, pointer.y, pointer.x, pointer.y];

    line = new fabric.Line(points, {
        strokeWidth: 1,
        stroke: 'black',
        selectable: true
    });
    canvas.add(line);
};

function onMouseMoveLine(o) {
    if (isDrawing) {
        let pointer = canvas.getPointer(o.e);
        line.set({ x2: pointer.x, y2: pointer.y });
        canvas.renderAll();
    }
};

function onMouseUpLine(o) {
    isDrawing = false;
};

function drawCircle() {
    clearCanvasEvents();
    canvas.on('mouse:down', onMouseDownCircle);
    canvas.on('mouse:up', onMouseUpCircle);
    canvas.on('mouse:move', onMouseMoveCircle);
    changeSelection(false);
};

function onMouseDownCircle(o) {
    isDown = true;
    let pointer = canvas.getPointer(o.e);
    origX = pointer.x;
    origY = pointer.y;
    circle = new fabric.Circle({
        left: pointer.x,
        top: pointer.y,
        radius: 1,
        strokeWidth: 1,
        stroke: 'black',
        fill: 'white',
        selectable: true,
        originX: 'center', originY: 'center'
    });
    canvas.add(circle);
};

function onMouseMoveCircle(o) {
    if (!isDown) return;
    var pointer = canvas.getPointer(o.e);
    circle.set({ radius: Math.abs(origX - pointer.x) });
    canvas.renderAll();
};

function onMouseUpCircle(o) {
    isDown = false;
};


function initializeCanvasVars() {
    canvas = new fabric.Canvas('can', {
        selection: false
    });
    $("#delete").click(function () {
        deleteObjects();
    });
    
    $("#clear").click(function () {
        confirm('Are you sure?');
        canvas.clear();
    });
    
}

function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false);
    xmlHttp.send(null);
    return JSON.parse(xmlHttp.responseText);
}


function createRect(shape) {
    rect = new fabric.Rect({
        left: shape.x,
        top: shape.y,
        originX: 'left',
        originY: 'top',
        width: shape.width,
        height: shape.height,
        angle: 0,
        fill: 'white',
        strokeWidth: shape.strokeWidth,
        stroke: 'black',
        transparentCorners: false
    });
    canvas.add(rect);
};

function createLine(shape) {
    let points = [shape.x, shape.y, shape.endX, shape.endY];
    line = new fabric.Line(points, {
        strokeWidth: 1,
        stroke: 'black',
        selectable: true
    });
    canvas.add(line);
};

function createCircle(shape) {
    circle = new fabric.Circle({
        left: shape.x,
        top: shape.y,
        radius: shape.radius,
        strokeWidth: 1,
        stroke: 'black',
        fill: 'white',
        selectable: true,
        originX: 'center', originY: 'center'
    });
    canvas.add(circle);
};

function createText(shape) {
    let text = new fabric.IText(shape.text, {
        fontFamily: 'Verdana',
        left: shape.x,
        top: shape.y,
        fontSize: 20,
        textAlign: 'center'
    });
    canvas.add(text);
}

function drawFlat() {
    canvas.clear();
    let flat = this;
    flat.shapes.forEach((shape) => {
        switch (shape.type) {
            case 'RECTANGLE':
                createRect(shape);
                break;
            case 'LINE':
                createLine(shape);
                break;
            case 'CIRCLE':
                createCircle(shape);
                break;
            case 'TEXT':
                createText(shape);
                break;
        };
    });
};

function addFlatButton() {
    flats.forEach((flat) => {
        let btn = document.createElement('button');
        btn.innerHTML = flat.title;
        btn.className = 'elem';
        btn.onclick = drawFlat.bind(flat);
        document.getElementById('costructorButtons').appendChild(btn);
    });
};


function sendReview() {
    let requestData = {};
    requestData.first_name = $('#fname').val();
    requestData.last_name = $('#lname').val();
    requestData.country = $('#country').val();
    requestData.subject = $('#subject').val();
    let xhr = new XMLHttpRequest();
    let url = "http://localhost:3000/reviews";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 201) {
            var json = JSON.parse(xhr.responseText);
            console.log(json.first_name + ", " + json.last_name);
        }
    };
    let data = JSON.stringify(requestData);
    xhr.send(data);
}