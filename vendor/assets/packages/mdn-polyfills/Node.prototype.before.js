!function(){function t(){var e=Array.prototype.slice.call(arguments),o=document.createDocumentFragment();e.forEach(function(e){var t=e instanceof Node;o.appendChild(t?e:document.createTextNode(String(e)))}),this.insertBefore(o,this)}[Element.prototype,CharacterData.prototype,DocumentType.prototype].forEach(function(e){e.hasOwnProperty("before")||Object.defineProperty(e,"before",{configurable:!0,enumerable:!0,writable:!0,value:t})})}();
