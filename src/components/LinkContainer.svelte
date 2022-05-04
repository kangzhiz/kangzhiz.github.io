<script>
    import Link from './Link.svelte'
</script>

<div class='links-container'>
    <h2 class='header'>LINKS:</h2>

    <div class='links-group'>
        <Link link='https://github.com/kangzhiz' text='github'/>
        <Link link='https://www.linkedin.com/in/kangzhiz' text='linkedin'/>
    </div>
</div>

<style>
    .links-container {
        border: 3px solid var(--gruv_blue);
        border-radius: 25px;
        margin: auto;
        width: 80%;
    }

    .header {
        color: var(--gruv_blue);
        font-family: Arial, Helvetica, sans-serif;
    }

    .links-group {
        display: flex;
        font-family: 'Cascadia Mono', monospaced;
        justify-content: center;
        line-height: 3rem;
        padding-bottom: 2rem;
    }

    @media only screen and (max-width: 876px) {
        .links-group {
            flex-direction: column;
        }
    }
</style>
