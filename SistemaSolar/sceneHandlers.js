
// Un valor entero, en píxeles, que indica la coordenada X en la que se encontraba el puntero del mouse cuando ocurrió el evento. 
let mouseDown = false, pageX = 0;

function rotateScene(deltax, group)
{
    group.rotation.y += deltax / 100;
    document.getElementById('rotation').innerHTML = "rotation: 0," + group.rotation.y.toFixed(1) + ",0";
}

function scaleScene(scale, time)
{
    time = scale * 1000
}

function onMouseMove(evt, group)
{
    if (!mouseDown)
        return;
    
    // The preventDefault() method cancels the event if it is cancelable, meaning that the default action that belongs to the event will not occur.
    evt.preventDefault();
    
    let deltax = evt.pageX - pageX;
    pageX = evt.pageX;
    rotateScene(deltax, group);
}

function onMouseDown(evt)
{
    evt.preventDefault();
    
    mouseDown = true;
    pageX = evt.pageX;
}

function onMouseUp(evt)
{
    evt.preventDefault();
    
    mouseDown = false;
}

function addMouseHandler(canvas, group, time)
{
    // console.log('addMouseHandler called');

    canvas.addEventListener( 'mousemove', e => onMouseMove(e, group), false);
    canvas.addEventListener( 'mousedown', e => {
        onMouseDown(e), false
        // console.log('mouse down!!!');
    } );
    canvas.addEventListener( 'mouseup',  e => onMouseUp(e), false );

    // oninput es cuando se mueve la barrita
    document.getElementById('slider').oninput = (e) => scaleScene(e.target.value, time);
}