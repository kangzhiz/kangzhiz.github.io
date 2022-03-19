<script>
    function printGreeting() {
        console.log('Hello!');
    }
</script>

<img src='/images/kangaroo.png' alt='kangaroo' on:click={printGreeting}/>

<style>
    img {
        background-color: var(--gruv_light);
        border-radius: 100px; 
        left: 50%;
        height: 50px;
        opacity: 0.5;
        position: absolute;
        top: 90%;
        transform: translate(-50%, -50%);
        width: auto;
        z-index: 3;
    }
</style>