/**
 * Components
 */

Vue.component('stage', {
    data: () => ({
        currentSceneIndex: 0
    }),
    mounted () {
        window.$stage = this
    },
    computed: {
        currentScene () {
            return this.$slots.default
                .filter(node => node.tag == 'scene')[this.currentSceneIndex]
        }
    },
    // TODO: transition
    render (h) {
        return h('div', {class: 'stage'},
            this.$slots.default
                .filter(node => node.tag == 'scene')
                .map((node, i) => 
                    h('transition-group', {attrs: {name: `scene-${i}`, class: 'scene'}}, 
                        i == this.currentSceneIndex 
                        ? [h('div', {key: 1}, node.children)]
                        : [])))    
    },
    template:
    `<div class="stage">
        <slot></slot>
    </div>`
})

Vue.component('scene')

/**
 * Init
 */
