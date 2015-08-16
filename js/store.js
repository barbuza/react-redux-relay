export function count(state=0, action) {
  switch (action.type) {
    case 'inc':
      return state + 1;
    default:
      return state;
  }
}
