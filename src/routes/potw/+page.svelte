<script>
    import PageHeader from '$lib/components/PageHeader.svelte';
    import Section from '$lib/components/Section.svelte';
    import Heading from '$lib/components/Heading.svelte';
    import FlexBox from '$lib/components/FlexBox.svelte';
    import Image from '$lib/components/Image.svelte';
    import PanelBox from '$lib/components/PanelBox.svelte';
    import Link from '$lib/components/Link.svelte';
    import sponsorTiers from '$lib/jsons/sponsorTiers';
    import Scratchpad from '$lib/components/Scratchpad.svelte';
    import { onMount, tick } from 'svelte';

    let mathContainer;

    let windowWidth;
    let windowHeight;
    let learnMoreIsVisible = true;
    let y;
    let scrollOpacity = 1;
    let scratchpadOpen = false;
    $: scrollOpacity = Math.max((windowHeight - 2 * y) / windowHeight, 0);
    $: learnMoreIsVisible = scrollOpacity > 0;

    function scrollToElem(e) {
        e.scrollIntoView({
            behavior: "smooth",
        });
    }

    onMount(async () => {
        await tick();

        for (let attempts = 0; attempts < 100; attempts++) {
            if (window.MathJax?.typesetPromise) {
                await new Promise(requestAnimationFrame);
                window.MathJax.typesetClear?.([mathContainer]);
                await window.MathJax.typesetPromise([mathContainer]);
                return;
            }

            await new Promise((resolve) => setTimeout(resolve, 100));
        }
    });
</script>

<svelte:window
    bind:scrollY={y}
    bind:innerWidth={windowWidth}
    bind:innerHeight={windowHeight}
/>

<svelte:head>
	<title>Problem of the Week</title>
    <script>
        window.MathJax = {
            startup: {
                typeset: false
            },
            tex: {
                inlineMath: [['\\(', '\\)'], ['$', '$']]
            }
        };
    </script>
    <script type="text/javascript" id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
</svelte:head>

<PageHeader title="Problem of the Week" description="Weekly Problem Solving" button_url="/potw/archive" button_text="See Past Problems" button_id="seePotwArchive" target="_self"/>


<Section>
    <div class="potw-layout" bind:this={mathContainer}>
        <Heading text="PoTW #1" size={4} textColor="#3C6F8B" />

        <PanelBox width="min(920px, 92vw)" padding="2rem" borderRadius="18px" style="background: #f8fbfd;">
            <div class="problem-card">
                <p class="problem-label">Problem</p>
                <div class="latex-problem">
                    <p>
                        Let \(a,b,c\) be positive integers such that \(a+b+c=12\). Find the number of ordered triples \((a,b,c)\) with \(a \le b \le c\).
                    </p>
                </div>
            </div>

            <div class="submit-card">
                <label for="potw-answer" class="submit-label">Your answer</label>
                <textarea id="potw-answer" rows="5" placeholder="Type your answer here..."></textarea>
                <button class="submit-button" type="button">Submit</button>
            </div>

            <div class="scratchpad-toggle-row">
                <button
                    class="scratchpad-toggle"
                    type="button"
                    aria-expanded={scratchpadOpen}
                    on:click={() => scratchpadOpen = !scratchpadOpen}
                >
                    {scratchpadOpen ? 'Close' : 'Scratchpad'}
                    <span aria-hidden="true">{scratchpadOpen ? '−' : '+'}</span>
                </button>
            </div>

            {#if scratchpadOpen}
                <Scratchpad />
            {/if}
        </PanelBox>
    </div>
</Section>

<style>
    .potw-layout {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        gap: 1.25rem;
        padding: 3rem 1rem 4rem;
        background: #b9c6d2;
    }

    .problem-card {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        text-align: left;
    }

    .problem-label {
        margin: 0;
        color: #1f4c62;
        font-weight: 700;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        font-size: 0.95rem;
    }

    .latex-problem {
        background: #ffffff;
        border-radius: 12px;
        padding: 1rem 1.15rem;
        color: #20313b;
        line-height: 1.8;
        font-size: 1.05rem;
        box-shadow: inset 0 0 0 1px rgba(60, 111, 139, 0.15);
    }

    .latex-problem p {
        margin: 0;
    }

    .submit-card {
        margin-top: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        text-align: left;
    }

    .submit-label {
        font-weight: 700;
        color: #1f4c62;
    }

    textarea {
        width: 100%;
        box-sizing: border-box;
        resize: vertical;
        border: 1px solid #aac4d3;
        border-radius: 10px;
        padding: 0.9rem 1rem;
        font: inherit;
        background: #ffffff;
        color: #20313b;
    }

    textarea:focus {
        outline: none;
        border-color: #65c083;
        box-shadow: 0 0 0 3px rgba(101, 192, 131, 0.18);
    }

    .submit-button {
        align-self: flex-start;
        border: none;
        border-radius: 999px;
        background: #65c083;
        color: white;
        padding: 0.75rem 1.2rem;
        font-weight: 700;
        cursor: pointer;
    }

    .scratchpad-toggle-row {
        display: flex;
        justify-content: center;
        margin-top: 1.25rem;
    }

    .scratchpad-toggle {
        display: inline-flex;
        align-items: center;
        gap: 0.65rem;
        border: 1px solid #3c6f8b;
        border-radius: 999px;
        background: #ffffff;
        color: #1f4c62;
        padding: 0.7rem 1.1rem;
        font: inherit;
        font-weight: 700;
        cursor: pointer;
    }

    .scratchpad-toggle:hover {
        background: #e7f1f5;
    }

    .scratchpad-toggle span {
        font-size: 1.25rem;
        line-height: 1;
    }
</style>
