<script>
    import { onMount } from 'svelte';

    const PAPER_WIDTH = 2000;
    const PAPER_HEIGHT = 1200;

    let scratchpadRoot;
    let canvas;
    let canvasViewport;
    let context;
    let drawing = false;
    let tool = 'pen';
    let color = '#20313b';

    // Separate size preferences per tool, same default for both.
    let penSize = 3;
    let eraserSize = 3;
    $: currentSize = tool === 'eraser' ? eraserSize : penSize;

    let history = [];
    let fullscreen = false;

    let position = { x: 0, y: 0 };
    let isDragging = false;
    let dragStart = { x: 0, y: 0 };
    let dragMinX = null, dragMaxX = null, dragMinY = null, dragMaxY = null;

    let bodyOverflow = '';
    let htmlOverflow = '';

    let placeholderParent = null;
    let placeholderNext = null;

    function centerViewport() {
        if (!canvasViewport) return;
        canvasViewport.scrollLeft = (PAPER_WIDTH - canvasViewport.clientWidth) / 2;
        canvasViewport.scrollTop = (PAPER_HEIGHT - canvasViewport.clientHeight) / 2;
    }

    onMount(() => {
        const dpr = window.devicePixelRatio || 1;

        canvas.width = PAPER_WIDTH * dpr;
        canvas.height = PAPER_HEIGHT * dpr;
        canvas.style.width = PAPER_WIDTH + 'px';
        canvas.style.height = PAPER_HEIGHT + 'px';

        context = canvas.getContext('2d');
        context.scale(dpr, dpr);
        context.lineCap = 'round';
        context.lineJoin = 'round';

        centerViewport();

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('blur', resetTransientState);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('blur', resetTransientState);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (fullscreen) unlockPageScroll();
        };
    });

    function handleVisibilityChange() {
        if (document.hidden) resetTransientState();
    }

    function resetTransientState() {
        isDragging = false;
        if (drawing) {
            drawing = false;
            context.closePath();
        }
    }

    function lockPageScroll() {
        bodyOverflow = document.body.style.overflow;
        htmlOverflow = document.documentElement.style.overflow;
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
    }

    function unlockPageScroll() {
        document.body.style.overflow = bodyOverflow;
        document.documentElement.style.overflow = htmlOverflow;
    }

    function enterFullscreen() {
        placeholderParent = scratchpadRoot.parentElement;
        placeholderNext = scratchpadRoot.nextSibling;
        document.body.appendChild(scratchpadRoot);
        fullscreen = true;
        lockPageScroll();
        requestAnimationFrame(centerViewport);
    }

    function exitFullscreen() {
        fullscreen = false;
        unlockPageScroll();
        if (placeholderParent) {
            placeholderParent.insertBefore(scratchpadRoot, placeholderNext);
        }
        placeholderParent = null;
        placeholderNext = null;
        requestAnimationFrame(centerViewport);
    }

    function toggleFullscreen() {
        if (fullscreen) {
            exitFullscreen();
        } else {
            enterFullscreen();
        }
    }

    function handleMouseDown(event) {
        if (fullscreen) return;
        isDragging = true;
        dragStart.x = event.clientX - position.x;
        dragStart.y = event.clientY - position.y;

        const rect = scratchpadRoot.getBoundingClientRect();
        const parent = scratchpadRoot.parentElement?.getBoundingClientRect();

        if (parent) {
            const untranslatedLeft = rect.left - position.x;
            const untranslatedTop = rect.top - position.y;
            dragMinX = parent.left - untranslatedLeft;
            dragMaxX = parent.right - untranslatedLeft - rect.width;
            dragMinY = parent.top - untranslatedTop;
            dragMaxY = parent.bottom - untranslatedTop - rect.height;
        } else {
            dragMinX = dragMaxX = dragMinY = dragMaxY = null;
        }
    }

    function handleMouseMove(event) {
        if (!isDragging) return;

        let nextX = event.clientX - dragStart.x;
        let nextY = event.clientY - dragStart.y;

        if (dragMinX !== null) {
            const lowX = Math.min(dragMinX, dragMaxX);
            const highX = Math.max(dragMinX, dragMaxX);
            const lowY = Math.min(dragMinY, dragMaxY);
            const highY = Math.max(dragMinY, dragMaxY);
            nextX = Math.min(Math.max(nextX, lowX), highX);
            nextY = Math.min(Math.max(nextY, lowY), highY);
        }

        position = { x: nextX, y: nextY };
    }

    function handleMouseUp() {
        isDragging = false;
    }

    function pointFromEvent(event) {
        const bounds = canvas.getBoundingClientRect();
        return {
            x: event.clientX - bounds.left,
            y: event.clientY - bounds.top
        };
    }

    function saveState() {
        history = [...history.slice(-20), context.getImageData(0, 0, canvas.width, canvas.height)];
    }

    function startDrawing(event) {
        event.preventDefault();
        saveState();
        drawing = true;
        canvas.setPointerCapture(event.pointerId);

        const point = pointFromEvent(event);
        context.beginPath();
        context.moveTo(point.x, point.y);
        context.lineTo(point.x, point.y);
        configureBrush();
        context.stroke();
    }

    function draw(event) {
        if (!drawing) return;
        event.preventDefault();

        const point = pointFromEvent(event);
        configureBrush();
        context.lineTo(point.x, point.y);
        context.stroke();
    }

    function stopDrawing(event) {
        if (canvas.hasPointerCapture(event.pointerId)) {
            canvas.releasePointerCapture(event.pointerId);
        }
        if (!drawing) return;
        drawing = false;
        context.closePath();
    }

    function configureBrush() {
        context.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
        context.strokeStyle = color;
        context.lineWidth = tool === 'eraser' ? eraserSize * 4 : penSize;
    }

    function handleSizeInput(event) {
        const value = +event.currentTarget.value;
        if (tool === 'eraser') {
            eraserSize = value;
        } else {
            penSize = value;
        }
    }

    function undo() {
        const previous = history[history.length - 1];
        if (!previous) return;

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.putImageData(previous, 0, 0);
        history = history.slice(0, -1);
    }

    function clearCanvas() {
        saveState();
        context.clearRect(0, 0, canvas.width, canvas.height);
    }
</script>

<div
    class="scratchpad"
    class:fullscreen
    bind:this={scratchpadRoot}
    style={!fullscreen ? `transform: translate(${position.x}px, ${position.y}px);` : ''}
>
    <div class="scratchpad-heading" on:mousedown={handleMouseDown}>
        <div>
            <p class="eyebrow">Workspace</p>
            <h3>Scratchpad</h3>
        </div>
        <p class="hint">Draw with a mouse, finger, or stylus. Scroll to reveal more paper.</p>
    </div>

    <div class="toolbar" aria-label="Scratchpad tools">
        <button
            type="button"
            class:active={tool === 'pen'}
            aria-pressed={tool === 'pen'}
            on:click={() => tool = 'pen'}
        >
            Pen
        </button>
        <button
            type="button"
            class:active={tool === 'eraser'}
            aria-pressed={tool === 'eraser'}
            on:click={() => tool = 'eraser'}
        >
            Eraser
        </button>

        <label class="color-control">
            <span>Color</span>
            <input type="color" bind:value={color} on:input={() => tool = 'pen'} />
        </label>

        <label class="size-control">
            <span>Size</span>
            <input type="range" min="1" max="10" value={currentSize} on:input={handleSizeInput} />
        </label>

        <div class="toolbar-spacer"></div>

        <button type="button" on:click={(e) => { e.currentTarget.blur(); toggleFullscreen(); }}>
            {fullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button> 
        <button type="button" on:click={undo} disabled={history.length === 0}>Undo</button>
        <button type="button" class="clear-button" on:click={clearCanvas}>Clear</button>
    </div>

    <div class="canvas-viewport" bind:this={canvasViewport}>
        <canvas
            bind:this={canvas}
            aria-label="Blank drawing area for working out the problem"
            on:pointerdown={startDrawing}
            on:pointermove={draw}
            on:pointerup={stopDrawing}
            on:pointercancel={stopDrawing}
        ></canvas>
    </div>

</div>

<style>
    .scratchpad {
        margin-top: 1.5rem;
        padding: 1rem;
        border: 1px solid rgba(60, 111, 139, 0.22);
        border-radius: 14px;
        background: #eef5f8;
        text-align: left;
        position: relative;
        z-index: 1;
        box-sizing: border-box;
    }

    .scratchpad.fullscreen {
        position: fixed;
        inset: 0;
        z-index: 9999;
        margin-top: 0;
        border-radius: 0;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
    }

    .scratchpad-heading {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 1rem;
        margin-bottom: 0.85rem;
    }

    .scratchpad:not(.fullscreen) .scratchpad-heading {
        cursor: move;
    }

    .eyebrow {
        margin: 0 0 0.15rem;
        color: #3c6f8b;
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
    }

    h3 {
        margin: 0;
        color: #1f4c62;
        font-size: 1.3rem;
    }

    .hint {
        margin: 0;
        color: #607782;
        font-size: 0.9rem;
    }

    .toolbar {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.55rem;
        margin-bottom: 0.75rem;
    }

    button {
        border: 1px solid #aac4d3;
        border-radius: 8px;
        padding: 0.5rem 0.75rem;
        background: #ffffff;
        color: #1f4c62;
        font: inherit;
        font-weight: 600;
        cursor: pointer;
    }

    button:hover:not(:disabled),
    button.active {
        border-color: #3c6f8b;
        background: #dcecf3;
    }

    button:disabled {
        cursor: not-allowed;
        opacity: 0.45;
    }

    .clear-button {
        color: #8d3434;
    }

    .toolbar-spacer {
        flex: 1;
    }

    .color-control,
    .size-control {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        color: #425e6b;
        font-size: 0.85rem;
        font-weight: 600;
    }

    input[type="color"] {
        width: 2.25rem;
        height: 2.25rem;
        border: 1px solid #aac4d3;
        border-radius: 8px;
        padding: 0.15rem;
        background: #ffffff;
        cursor: pointer;
    }

    input[type="range"] {
        width: 6rem;
        accent-color: #3c6f8b;
    }

    .canvas-viewport {
        overflow: auto;
        border: 1px solid #c4d6df;
        border-radius: 10px;
        background: #ffffff;
        height: 380px;
    }

    .fullscreen .canvas-viewport {
        flex: 1;
        height: auto;
    }

    canvas {
        display: block;
        background-color: #ffffff;
        background-image:
            linear-gradient(rgba(60, 111, 139, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(60, 111, 139, 0.08) 1px, transparent 1px);
        background-size: 25px 25px;
        cursor: crosshair;
        touch-action: none;
    }

    @media (max-width: 620px) {
        .scratchpad-heading {
            align-items: flex-start;
            flex-direction: column;
        }

        .toolbar-spacer {
            display: none;
        }

        .canvas-viewport {
            height: 300px;
        }
    }
</style>
