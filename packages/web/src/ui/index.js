// == OpenJSCAD.org, Copyright (c) 2013-2016, Licensed under MIT License
const { setUpEditor } = require('./editor')
const { setupDragDrop } = require('./dragDrop/ui-drag-drop') // toggleAutoReload

const { detectBrowser } = require('./detectBrowser')
const { getUrlParams } = require('./urlHelpers')
const AlertUserOfUncaughtExceptions = require('./errorDispatcher')

const version = require('../../package.json').version
const Processor = require('../jscad/processor')

const me = document.location.toString().match(/^file:/) ? 'web-offline' : 'web-online'
const browser = detectBrowser()

var gProcessor = null
var gEditor = null
var memFs = [] // associated array, contains file content in source memFs[i].{name,source}

function init () {
  // Show all exceptions to the user: // WARNING !! this is not practical at dev time
  AlertUserOfUncaughtExceptions()

  getUrlParams(document.URL)

  gProcessor = new Processor(document.getElementById('viewerContext'))
  gEditor = setUpEditor(undefined, gProcessor)

  let about = document.getElementById('about');
  let tail = document.getElementById('tail');
  let footer = document.getElementById('footer');

  if (about) {
    const versionText = `Version ${version}`
    document.getElementById('aboutVersion').innerHTML = versionText

    function addEventListenerList(list, event, callback) {
      Array
        .from(list)
        .forEach(element => element.addEventListener(event, callback))
    }

    addEventListenerList(document.getElementsByClassName('navlink about'), 'click', function () {
      about.style.display = 'inline'
      return false
    })

    document.querySelector('.okButton').addEventListener('click', function () {
      about.style.display = 'none'
      return false
    })
  }

  // dropzone section
  if (tail) {
    let dropZone = document.getElementById('filedropzone')
    if (dropZone) {
      const dropZoneText = browser === 'chrome' && me === 'web-online' ? ', or folder with jscad files ' : ''
      document.getElementById('filedropzone_empty')
        .innerHTML =
        `Drop one or more supported files
           ${dropZoneText}
           here (see <a style='font-weight: normal' href='https://openjscad.org/dokuwiki/doku.php' target=_blank>details</a>)
           <br>or directly edit OpenJSCAD or OpenSCAD code using the editor.`

      let {toggleAutoReload, reloadAllFiles} = setupDragDrop(me, {memFs, gProcessor, gEditor})
      document.getElementById('reloadAllFiles').onclick = reloadAllFiles
      document.getElementById('autoreload').onclick = function (e) {
        const toggle = document.getElementById('autoreload').checked
        toggleAutoReload(toggle)
      }
    }
  }

  // version number displays
  if (footer) {
    const footerContent = `OpenJSCAD.org ${version}, MIT License, get your own copy/clone/fork from <a target=_blank href="https://github.com/jscad/OpenJSCAD.org">GitHub: OpenJSCAD</a>`
    document.getElementById('footer').innerHTML = footerContent
  }
}

document.addEventListener('DOMContentLoaded', function (event) {
  init()
})
