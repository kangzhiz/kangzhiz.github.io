<script>
    import Background from './components/Background.svelte'
    import LinkContainer from './components/LinkContainer.svelte'
    import Logo from './components/Logo.svelte'
    import NameTag from './components/NameTag.svelte'

    export let numImages;
</script>

<main>
    <Background numImages={numImages}/>
    <div class='text-body'>
        <NameTag first='kangzhi' middle='john' last='zhao'/>
        <LinkContainer/>
    </div>
    <Logo/>
</main>

<style>
    main {
        height: 100%;
    }

    .text-body {
        left: 50%;
        position: absolute;
        text-align: center;
        text-shadow: 2px 2px 8px var(--gruv_dark0);
        top: 40%;
        transform: translate(-50%, -50%);
        width: 95%;
        z-index: 2;
    }
</style>