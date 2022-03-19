<script>
    import NameTag from './components/NameTag.svelte'
    import Background from './components/Background.svelte'
    import LinkContainer from './components/LinkContainer.svelte'

    let randBg;
</script>

<main>
    <Background numImages={3} bind:randomizeBackground={randBg}/>
    <div class='text-body'>
        <NameTag first='kangzhi' middle='john' last='zhao'/>
        <LinkContainer/>
    </div>
    <img src='/images/kangaroo.png' alt='Button' on:click={randBg}/>
</main>

<style>
    main {
        height: 100%;
    }

    .text-body {
        left: 50%;
        position: absolute;
        text-align: center;
        top: 40%;
        transform: translate(-50%, -50%);
        width: 95%;
        z-index: 2;
    }

    img {
        background-color: var(--gruv_light);
        border-radius: 100px; 
        left: 50%;
        height: 50px;
        opacity: 0.3;
        position: absolute;
        top: 90%;
        transform: translate(-50%, -50%);
        transition: all .2s;
        width: auto;
        z-index: 3;
    }

    img:hover {
        height: 70px;
        opacity: 0.7;
    } 
</style>