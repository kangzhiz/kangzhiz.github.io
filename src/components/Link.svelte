<script>
    export let link; 
    export let text;
</script>

<span class='link'>
    <a href={link} target='_blank'>{text}</a>
</span>

<style>
    .link {
        height: 3rem;
        padding: 0 1.5rem;
        text-shadow: 2px 2px 8px var(--gruv_dark0);
    }
    
    a {
        color: var(--gruv_light);
        font-size: 1.75rem;
        text-decoration: none;
        transition: all .2s;
    }

    a:hover {
        font-size: 2rem;
        cursor: pointer;
    }

    @media only screen and (max-width: 876px) {
        a {
            font-size: 1.5rem;
        }

        a:hover {
            font-size: 1.75rem;
        }
    }
</style>