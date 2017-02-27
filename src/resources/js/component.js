Vue.component('brage', {
  // The goods-item component now accepts a
  // "prop", which is like a custom attribute.
  // This prop is called list.
  props: ['list'],
  template: '<li>{{ list.text }}</li>'
});