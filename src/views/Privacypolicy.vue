<template>
    <div class="container" url="/public/test.pdf">
        <iframe :src="pdfurl" class="pdf-iframe"></iframe>
    </div>
</template>



<script>
export default {
    name: 'PDF',
    data() {
        return {
            pdfurl: '/test.pdf'
        }
    }
}
</script>

<style scoped lang="scss">
.container {
    width: 80vw;
    height: 90vh;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}

.pdf-iframe {
    width: 100%;
    height: 100%;
    border: none;
    object-fit: contain;
}
</style>
