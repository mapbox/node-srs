
# Node-Srs
      
  Bindings to libosr for handling spatial references in [node](http://nodejs.org).
  

## Depends

  node >= 0.2.4 (development headers)
  
  No other required depedencies
  
  Optionally can depend/dynamically link to libgdal (see STATICALLY_LINK_OSR in wscript)


## Installation
  
  Install node-srs:
  
  From source:
  
    $ git clone git://github.com/springmeyer/node-srs.git
    $ cd node-srs
    $ ./configure
    $ make
    $ sudo make install
    $ ./test.js

  Make sure the node modules is on your path:
  
    export NODE_PATH=/usr/local/lib/node/

  Or you can install via npm:
  
    $ npm install srs
  

## License

  BSD, see LICENSE.txt