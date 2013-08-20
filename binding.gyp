{
  'includes': [ 'common.gypi' ],
  'variables': {
      'runtime_link%':'shared',
  },
  'targets': [
    {
      'target_name': '_srs',
      'libraries' : ['<!@(gdal-config --libs)'],
      'conditions': [
        ['runtime_link == "static"', {
            'libraries': ['<!@(gdal-config --dep-libs)']
        }]
      ],
      'cflags_cc' : ['<!@(gdal-config --cflags)'],
      'cflags_cc!': ['-fno-rtti', '-fno-exceptions'],
      'xcode_settings': {
        'OTHER_CPLUSPLUSFLAGS':[
           '<!@(gdal-config --cflags)'
        ],
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
