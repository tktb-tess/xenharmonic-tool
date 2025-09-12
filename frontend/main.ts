import './main.css';

const elem = (() => {
  const app_ = document.getElementById('app');
  if (!(app_ instanceof HTMLDivElement)) throw Error('cannot get Element');
  return app_;
})();

elem.textContent = 'Güddenn däģ!';
