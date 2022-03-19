<script>
    export let first;
    export let middle;
    export let last;

    let out1 = '';
    let out2 = '';
    let out3 = '';

    function handleResize() {
        if (window.innerWidth > 875) {
            out1 = first;
            out2 = middle
            out3 = last;
        } else {
            out1 = first[0];
            out2 = middle[0];
            out3 = last[0];
        }
    }
</script>

<svelte:window on:load={handleResize} on:resize={handleResize}/>

<div class='name-container'>
    <span class='name firstlast'>{out1}</span>
    <span class='bracket'>(</span>
    <span class="name middle">{out2}</span>
    <span class='bracket'>)</span>
    <span class='name firstlast'>{out3}</span>
</div>

<style>
    .name-container {
        font-family: 'Cascadia Mono Italic', monospaced;
        font-size: 4rem;
        padding-bottom: 3vh;
    }

    .name {
        color: var(--gruv_light);
    }

    .bracket {
        color: var(--gruv_blue);
        font-size: 5rem;
    }

    @media only screen and (max-width: 876px) {
        .bracket {
            margin: 0 -1rem;
        }
    }
</style>