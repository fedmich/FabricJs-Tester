let canvas;
let toolboxCounter = 0;

function initCanvas() {
    const container = document.querySelector('.container');
    const canvasEl = document.createElement('canvas');
    canvasEl.id = 'canvas';
    container.appendChild(canvasEl);

    canvas = new fabric.Canvas('canvas');
    initEditor();
    makeToolboxDraggable(document.getElementById('toolbox'));
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

function makeToolboxDraggable(el) {
    const header = el.querySelector('.title');
    let isDragging = false;
    let offsetX, offsetY;

    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - el.getBoundingClientRect().left;
        offsetY = e.clientY - el.getBoundingClientRect().top;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        el.style.left = `${e.clientX - offsetX}px`;
        el.style.top = `${e.clientY - offsetY}px`;
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

function createToolbox(x, y) {
    const id = 'toolbox-' + Date.now();
    const toolbox = document.createElement('div');
    toolbox.className = 'toolbox';
    toolbox.id = id;
    toolbox.style.left = x + 'px';
    toolbox.style.top = y + 'px';

    const title = document.createElement('div');
    title.className = 'title';
    title.innerHTML = `🔧 Script ${++toolboxCounter} <button class="close-btn" onclick="document.getElementById('${id}').remove()">×</button>`;
    toolbox.appendChild(title);

    const editorContainer = document.createElement('div');
    editorContainer.className = 'editor';
    editorContainer.id = `editor-${id}`;
    toolbox.appendChild(editorContainer);

    const runBtn = document.createElement('button');
    runBtn.className = 'run-btn';
    runBtn.textContent = '▶️ Run';
    runBtn.onclick = () => runCodeIn(id);
    toolbox.appendChild(runBtn);

    document.body.appendChild(toolbox);
    makeToolboxDraggable(toolbox);

    // Ensure DOM is updated before initializing Ace
    setTimeout(() => {
        const aceEditor = ace.edit(editorContainer); // Pass element directly
        aceEditor.setTheme("ace/theme/monokai");
        aceEditor.session.setMode("ace/mode/javascript");
        aceEditor.setFontSize(14);
    }, 10);
}

function runCodeIn(id) {
    const editor = ace.edit(`editor-${id}`);
    const code = editor.getValue();
    try {
        eval(code);
    } catch (e) {
        alert('Error: ' + e.message);
    }
}

document.getElementById('addToolbox').addEventListener('click', () => {
    createToolbox(300 + (toolboxCounter * 60), 100 + (toolboxCounter * 60));
});

function resizeCanvas() {
    const container = document.querySelector('.container');
    canvas.setDimensions({
        width: container.clientWidth,
        height: container.clientHeight
    });
}

window.onload = initCanvas;