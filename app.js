let canvas;
let editor;

function initCanvas() {
    const container = document.querySelector('.container');
    const canvasEl = document.createElement('canvas');
    canvasEl.id = 'canvas';
    container.appendChild(canvasEl);

    canvas = new fabric.Canvas('canvas');
    initEditor();
    makeToolboxDraggable();
    resizeCanvas();

    window.addEventListener('resize', resizeCanvas);
}

function initEditor() {
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.session.setMode("ace/mode/javascript");
    editor.setFontSize(14);
    editor.setOptions({
        wrap: true,
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true
    });
}

function makeToolboxDraggable() {
    const toolbox = document.getElementById('toolbox');
    let isDragging = false;
    let offsetX, offsetY;

    toolbox.addEventListener('mousedown', (e) => {
        if (e.target === toolbox || e.target.classList.contains('title')) {
            isDragging = true;
            offsetX = e.clientX - toolbox.getBoundingClientRect().left;
            offsetY = e.clientY - toolbox.getBoundingClientRect().top;
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        toolbox.style.left = `${e.clientX - offsetX}px`;
        toolbox.style.top = `${e.clientY - offsetY}px`;
        toolbox.style.right = 'auto';
        toolbox.style.bottom = 'auto';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
}

function runCode() {
    const code = editor.getValue();
    try {
        eval(code);
    } catch (e) {
        alert('Error: ' + e.message);
    }
}

function resizeCanvas() {
    const container = document.querySelector('.container');
    canvas.setDimensions({
        width: container.clientWidth,
        height: container.clientHeight
    });
}

window.onload = initCanvas;   