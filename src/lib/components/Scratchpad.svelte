<!-- Scratchpad for the potw -->

<script>
    import { onMount } from 'svelte';

    let canvas;
    let context;
    let drawing = false;
    let tool = 'pen';
    let color = '#20313b';
    let lineWidth = 3;
    let history = [];

    onMount(() => {
        context = canvas.getContext('2d');
        context.lineCap = 'round';
        context.lineJoin = 'round';
    });

    function pointFromEvent(event) {
        const bounds = canvas.getBoundingClientRect();
        return {
            x: (event.clientX - bounds.left) * (canvas.width / bounds.width),
            y: (event.clientY - bounds.top) * (canvas.height / bounds.height)
        };
    }
//saves canvas state so that the undo button can work
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
        if (!drawing) return;
        drawing = false;
        context.closePath();

        if (canvas.hasPointerCapture(event.pointerId)) {
            canvas.releasePointerCapture(event.pointerId);
        }
    }

    function configureBrush() {
        context.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
        context.strokeStyle = color;
        context.lineWidth = tool === 'eraser' ? lineWidth * 4 : lineWidth;
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

<div class="scratchpad">
    <div class="scratchpad-heading">
        <div>
            <p class="eyebrow">Workspace</p>
            <h3>Scratchpad</h3>
        </div>
        <p class="hint">Draw with a mouse, finger, or stylus.</p>
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
            <input type="range" min="1" max="10" bind:value={lineWidth} />
        </label>

        <div class="toolbar-spacer"></div>

        <button type="button" on:click={undo} disabled={history.length === 0}>Undo</button>
        <button type="button" class="clear-button" on:click={clearCanvas}>Clear</button>
    </div>

    <canvas
        bind:this={canvas}
        width="1000"
        height="500"
        aria-label="Blank drawing area for working out the problem"
        on:pointerdown={startDrawing}
        on:pointermove={draw}
        on:pointerup={stopDrawing}
        on:pointercancel={stopDrawing}
    ></canvas>
</div>

<style>
    .scratchpad {
        margin-top: 1.5rem;
        padding: 1rem;
        border: 1px solid rgba(60, 111, 139, 0.22);
        border-radius: 14px;
        background: #eef5f8;
        text-align: left;
    }

    .scratchpad-heading {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 1rem;
        margin-bottom: 0.85rem;
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

    canvas {
        display: block;
        width: 100%;
        height: auto;
        border: 1px solid #c4d6df;
        border-radius: 10px;
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
    }
</style>
