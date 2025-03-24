import {
  createElementBlock,
  createElementVNode,
  defineComponent,
  openBlock,
} from 'vue'

const _hoisted_1 = {
  'xmlns': 'http://www.w3.org/2000/svg',
  'xmlns:xlink': 'http://www.w3.org/1999/xlink',
  'viewBox': '0 0 512 512',
}
export default (0, defineComponent)({
  name: 'CodeOutline',
  render: function render(_ctx, _cache) {
    return (
      (0, openBlock)(),
      (0, createElementBlock)(
        'svg',
        _hoisted_1,
        _cache[0]
        || (_cache[0] = [
          (0, createElementVNode)(
            'path',
            {
              'fill': 'none',
              'stroke': 'currentColor',
              'stroke-linecap': 'round',
              'stroke-linejoin': 'round',
              'stroke-width': '32',
              'd': 'M160 368L32 256l128-112',
            },
            null,
            -1, /* HOISTED */
          ),
          (0, createElementVNode)(
            'path',
            {
              'fill': 'none',
              'stroke': 'currentColor',
              'stroke-linecap': 'round',
              'stroke-linejoin': 'round',
              'stroke-width': '32',
              'd': 'M352 368l128-112l-128-112',
            },
            null,
            -1, /* HOISTED */
          ),
        ]),
      )
    )
  },
})
