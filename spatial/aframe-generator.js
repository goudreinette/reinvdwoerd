function randomScale() {
    return {
        sX: 1,
        sY: 1,
        sZ: 1
    }
}

function randomSidePosition({x, y, z}) {
    return _.sample([
        {x: x + 1, y, z},
        {x: x - 1, y, z},
        {x, y: y + 1, z},
        {x, y, z: z + 1},
        {x, y, z: z - 1}
    ])
}

function addBox() {
    const lastBox = $('a-box').last()
    const lastPos = lastBox.attr('position')
    const {x, y, z} = randomSidePosition(lastPos)
    const {sX, sY, sZ} = randomScale()
    $('a-scene').append(`
        <a-box 
            position="${x} ${y} ${z}" 
            width="0.5"
            height="0.5"
            color="white"
            material="opacity: 0.95"
        ></a-box>
    `)
}



for (var i = 0; i < 20; i++) {
    setTimeout(() => {
        addBox()
    }, i * 100)
}