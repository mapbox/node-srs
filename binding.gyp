{
  'includes': [ 'common.gypi' ],
  'variables': {
      'runtime_link%':'shared',
      'gdal%':'internal',
  },
  'targets': [
    {
      'target_name': '_srs',
      'conditions': [
        ['runtime_link == "static"', {
            'libraries': ['<!@(gdal-config --dep-libs)']
        }],
        ['gdal != "internal"', {
           'libraries' : ['<!@(gdal-config --libs)'],
            'cflags_cc' : ['<!@(gdal-config --cflags)'],
            'xcode_settings': {
              'OTHER_CPLUSPLUSFLAGS':[
                '<!@(gdal-config --cflags)'
              ]
            }
        },
        {
            'dependencies': [
              'deps/osr.gyp:osr'
            ]
        }
        ]
      ],
      'cflags_cc!': ['-fno-rtti', '-fno-exceptions'],
      'xcode_settings': {
        'GCC_ENABLE_CPP_RTTI': 'YES',
        'GCC_ENABLE_CPP_EXCEPTIONS': 'YES'
      },
      'sources': [
        'src/_srs.cc'
      ],
    },
    {
      'target_name': 'action_after_build',
      'type': 'none',
      'dependencies': [ '_srs' ],
      'copies': [
          {
            'files': [ '<(PRODUCT_DIR)/_srs.node' ],
            'destination': './lib/'
          }
      ]
    }
  ]
}
