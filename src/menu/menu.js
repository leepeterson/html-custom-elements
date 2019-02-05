import { HTMLCustomElement, createCustomEvent } from 'html-custom-element';

const html = `
<nav role="navigation">
  <hce-content></hce-content>
</nav>
`;
const css = `
  a { text-decoration: none; white-space: nowrap; text-transform: uppercase }

  /* submenu */
  li > ul { display: none; } /* hide all submenus in default */
  li.has-submenu:hover > ul { display: block;}
  li.has-submenu:focus > ul { display: block;}
  li.has-submenu.submenu-open > ul { display: block;}

  /* basic styles */
  :root.basic a { transition: all .2s; color: inherit }
  :root.basic a:hover { color: #fff }
  :root.basic ul { margin: 0; padding: 0; list-style: none; background: #333; color: #fff }
  :root.basic li { padding: 8px; position: relative; color: #aaa; }

  :root.basic > ul > li { padding: 15px; }   
  :root.basic > ul > li:after, :root.basic > ul > li:after { 
    content: ' '; display: block; position: absolute; bottom: 4px; left: 0;
    width: 100%; height: 2px; opacity: 0; background: #0FF; 
  }
  :root.basic > ul > li:hover:after, :root.basic > ul > li:focus:after { 
    opacity: 1; transition:all .5s;
  }
  :root.basic > ul > li.selected  { color: #fff; }
  :root.basic li ul{ position: absolute; }  /* submenu items */

  :root.top > ul { display: flex; justify-content: space-around }
  :root.top li > ul ul { top: 1px; left: calc(100% + 1px); } /* submenu items */
  :root.top li > ul { top: calc(100% + 1px); left: 0;}

  :root.bottom > ul { display: flex; justify-content: space-around }
  :root.bottom li > ul ul { bottom: 0; left: calc(100% + 1px); } /* submenu items */
  :root.bottom li > ul { bottom: calc(100% + 1px); left: 0;}     /* submenu items */

  :root.left > ul { display: inline-block; }       
  :root.left li > ul {top: 0; left: calc(100% + 1px);}   /* submenu items */

  :root.right > ul { display: inline-block; }
  :root.right li > ul {top: 0; right: calc(100% + 1px);} /* submenu items */
`;

class HCEMenu extends HTMLCustomElement {
  static get observedAttributes() { return ['selected-index']; }
  get selectedIndex() { return this.__selectedIndex; }

  set selectedIndex(selectedIndex) {
    this.__selectedIndex = selectedIndex;
    Array.from(this.querySelectorAll('ul > li')).forEach((liEl, ndx) =>  {
      const func = ndx === selectedIndex ? 'add' : 'remove';
      liEl.classList[func]('selected');
    })
  }

  connectedCallback() {
    this.renderWith(null, css).then( _ => {
      this.setAccessibility();
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    (name === 'selected-index') && (this.selectedIndex = parseInt(newValue));
  }

  setAccessibility() {
    const liEls = this.querySelectorAll('li');
    Array.from(liEls).forEach(liEl => {
      if (liEl.querySelector('ul')) { // if submenu exists
        liEl.classList.add('has-submenu');
        liEl.setAttribute('tabindex', 0);       // make it as an action item
        const aEls = liEl.querySelectorAll('a');
        // control show/hide by class 'submenu-open'
        liEl.addEventListener('blur', _ => liEl.classList.remove('submenu-open'));
        Array.from(aEls).forEach(aEl => {
          aEl.addEventListener('focus', _ => liEl.classList.add('submenu-open'));
          aEl.addEventListener('blur', _ => {
            setTimeout(_ => { //next focus needs time
              const focused = liEl.querySelector(':focus');
              !focused && liEl.classList.remove('submenu-open');
            }, 10);
          })
        })
      }
    });
  }
}

HCEMenu.define('hce-menu', HCEMenu);