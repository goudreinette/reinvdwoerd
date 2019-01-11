/**
 * Components
 */
Vue.component('plane', {
    template: `
        <rect width="100" height="100" class="plane"" />`
})

Vue.component('box', {
    props: {
        x: Number,
        y: Number
    },
    template: `
        <g class="box">
            <plane :x="x" :y="y + 100"></plane> 
            <plane :x="x + 100" :y="y + 100"></plane> 
            <plane :x="x" :y="y + 200"></plane> 
            <plane :x="x" :y="y"></plane>
            <plane :x="x + 200" :y="y + 100"></plane>
        </g>`
})

Vue.component('glueing-edge', {
    template: `
        <polygon class="glueing-edge" points="101,10.5 1.1,10.5 10.2,0.5 92.1,0.5 101.1,10.5 1.2,10.5 "/>
    `
})


/**
 * Main
 */
new Vue({
    el: 'svg',
})