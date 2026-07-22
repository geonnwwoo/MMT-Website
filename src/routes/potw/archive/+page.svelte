<script>
    import PageHeader from '$lib/components/PageHeader.svelte';
    import Section from '$lib/components/Section.svelte';
    import Heading from '$lib/components/Heading.svelte';
    import FlexBox from '$lib/components/FlexBox.svelte';
    import Image from '$lib/components/Image.svelte';
    import PanelBox from '$lib/components/PanelBox.svelte';
    import Link from '$lib/components/Link.svelte';
    import sponsorTiers from '$lib/jsons/sponsorTiers';

    let windowWidth;
    let windowHeight;
    let learnMoreIsVisible = true;
    let y;
    let scrollOpacity = 1;
    $: scrollOpacity = Math.max((windowHeight - 2 * y) / windowHeight, 0);
    $: learnMoreIsVisible = scrollOpacity > 0;

    function scrollToElem(e) {
        e.scrollIntoView({
            behavior: "smooth",
        });
    }
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
            tex: {
                inlineMath: [['\\(', '\\)'], ['$', '$']]
            }
        };
    </script>
    <script type="text/javascript" id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
</svelte:head>


<PageHeader title="Past Problems" description="Previous Problems of the Week and Solutions" button_url="
https://drive.google.com/file/d/1WubRiqJ7TAcbwGY8PX-xHiY5-_1r7iS3/view" button_text="Sponsor Mustang Math!" button_id="sponsorMM"/>



<Section>
    <div class="potw-layout">
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

            <div class="solution-card">
                <p class="solution-label">Answer: 12</p>
                <p>
                    We can find that when (a=1) there are 5 possible triples,
                    4 when (a=2), 2 when (a=3), and 1 when (a=4).
                    Therefore, there is a total of 12 possible solutions.
                </p>
            </div>
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

    .solution-card {
        margin-top: 1.5rem;
        text-align: left;
        background: #ffffff;
        border-radius: 12px;
        padding: 1rem 1.15rem;
        color: #20313b;
        line-height: 1.8;
        box-shadow: inset 0 0 0 1px rgba(60, 111, 139, 0.15);
    }

    .solution-label {
        margin-top: 0;
        font-weight: 700;
        color: #1f4c62;
    }
</style>
