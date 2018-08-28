'use strict';

window.onhashchange = switchToStateFromURLHash;

function switchToStateFromURLHash() {

    let URLHash = window.location.hash;

    let hash = decodeURIComponent(URLHash.substr(1));

    let pageHTML;
    let SPAState;

    if (hash != "")
        SPAState = JSON.parse(hash);
    else
        SPAState = { pagename: 'Main' };

    switch (SPAState.pagename) {
        case 'Main':
            pageHTML = "<h3>Главная страница</h3>";
            break;
        case 'About':
            pageHTML = "";
            break;
        case 'Constructor':
            pageHTML = "<h3>Это новый конструктор</h3>";
            pageHTML += /*function loadPage() {
                document.getElementById("display").innerHTML='<object type="text/html" data="page.html" ></object> '
              }*/
            `<div class="display">
            <canvas id="can" width="800" height="600"></canvas>
            </div>
                <div class="instruments">
              <button class="elem" onclick='drawRect()'>Draw rectangle</button>
              <button class="elem" onclick='selection()'>Select</button>
              <button class="elem" onclick='drawLine()'>Draw line</button>
              <button class="elem" onclick='drawCircle()'>Draw circle</button>
              <button class="elem" onclick='addText()'>Add text</button>
              <button class="elem" id="delete">Delete selected object(s)</button>
              <button class="elem" onclick='clearField()'>Clear</button>
            </div>`
            break;
        case 'Contacts':
            pageHTML = "";
            break;
    }

    $('#Page').html(pageHTML);
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

let canvas = new fabric.Canvas('can', {
    selection: false
});

let rect, isDown, origX, origY;

function drawRect() {
    clearCanvasEvents();
    canvas.on('mouse:down', onMouseDown);
    canvas.on('mouse:up', onMouseUp);
    canvas.on('mouse:move', onMouseMove);
    changeSelection(false);
}

function selection() {
    canvas.off('mouse:down', onMouseDown);
    canvas.off('mouse:up', onMouseUp);
    canvas.off('mouse:move', onMouseMove);
    canvas.off('mouse:down', onMouseDownLine);
    canvas.off('mouse:up', onMouseUpLine);
    canvas.off('mouse:move', onMouseMoveLine);
    canvas.off('mouse:down', onMouseDownCircle);
    canvas.off('mouse:up', onMouseUpCircle);
    canvas.off('mouse:move', onMouseMoveCircle);
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

let line;
let isDrawing;

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

let circle;

function drawCircle() {
    clearCanvasEvents();
    canvas.on('mouse:down', onMouseDownCircle);
    canvas.on('mouse:up', onMouseUpCircle);
    canvas.on('mouse:move', onMouseMoveCircle);
    changeSelection(false);
}

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

$("#delete").click(function () {
    deleteObjects();
});