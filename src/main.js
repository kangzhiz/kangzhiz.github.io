import App from './App.svelte';

const app = new App({
    target: document.body,
    props: {
        numImages: 1 
    }
});

export default app;