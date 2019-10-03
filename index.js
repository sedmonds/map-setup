var html = require('choop/html')
var devtools = require('choo-devtools')
var choop = require('choop')

var mixmap = require('mixmap')
var regl = require('regl')
var glsl = require('glslify')
var resl = require('resl')
 
var mix = mixmap(regl, { extensions: ['oes_element_index_uint', 'oes_texture_float'] })
var map = mix.create({ viewbox: [+36.1, +49.9, +36.3, +50.1]})
var geoRender = require('mixmap-georender')(map)
 
var drawLines = map.createDraw(geoRender.lines)

var drawPoints = map.createDraw(geoRender.points)

resl({
  manifest: {
    lines: { type: 'text', src: './mixmap-georender/example/lines.json', parser: JSON.parse },
    points: { type: 'text', src: './mixmap-georender/example/points.json', parser: JSON.parse }
  },
  onDone: function (assets) {
    drawLines.props.push({
      positions: assets.lines.positions,
      normals: assets.lines.normals
    })
    drawPoints.props.push({
      positions: assets.points.positions,
      types: assets.points.types
    })
  }
})
 
window.addEventListener('keydown', function (ev) {
  if (ev.code === 'Digit0') {
    map.setZoom(Math.min(6,Math.round(map.getZoom()+1)))
  } else if (ev.code === 'Minus') {
    map.setZoom(map.getZoom()-1)
  } else if (ev.code === 'Equal') {
    map.setZoom(map.getZoom()+1)
  }
})
 
document.body.appendChild(mix.render())
document.body.appendChild(map.render({ width: 600, height: 400 }))


// pwa
var app = choop()
app.use(devtools())
app.use(countStore)
app.route('/', mainView)
app.mount('body')

function mainView (state, emit) {
  return html`
    <main>
      <h1>count is ${state.count}</h1>
      <button onclick=${onclick}>Increment</button>
    </main>
  `

  function onclick () {
    emit('increment', 1)
  }
}

function countStore (state, emitter) {
  state.count = 0
  emitter.on('increment', function (count) {
    state.count += count
    emitter.emit('render')
  })
}
