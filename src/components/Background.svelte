<script>
    export let numImages;
    let fileNum;
    
    export function randomizeBackground() {
        let curFileNum = fileNum;
        fileNum = Math.floor(Math.random() * numImages + 1);

        if (numImages > 1 && curFileNum == fileNum) {
            randomizeBackground();
        }

        console.log(fileNum);
    }

    randomizeBackground();
</script>

<div class='background' style='background-image: url("/images/backgrounds/{fileNum}.jpeg")'></div>

<style>
    .background {
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        filter: blur(12px);
        height: 100%;
    }
</style>