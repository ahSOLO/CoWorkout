import debounce from 'lodash.debounce';

export const hoverHandler = function (hoverFunc, hoverState) {
  debounce(() => hoverFunc(hoverState), 40)();
}
