{
  'includes': [ 'common.gypi' ],
  'variables': {
      'runtime_link%':'shared',
      'shared_gdal%':'false',
  },
  'targets': [
    {
      'target_name': '_srs',
      'conditions': [
        ['shared_gdal == "false"',
        {
            'dependencies': [
              'deps/osr.gyp:osr'
            ]
        },
        {
           'conditions': [
               ['runtime_link == "static"', {
                  'libraries': ['<!@(gdal-config --dep-libs)']
              }],
           ],
           'libraries' : ['<!@(gdal-config --libs)'],
            'cflags_cc' : ['<!@(gdal-config --cflags)'],
            'xcode_settings': {
              'OTHER_CPLUSPLUSFLAGS':[
                '<!@(gdal-config --cflags)'
              ]
            }
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
      'actions': [
          {
            'action_name': 'generate_setting',
            'inputs': [
              'gen_settings.py'
            ],
            'outputs': [
              'lib/srs_settings.js'
            ],
            'action': ['python', 'gen_settings.py', '<@(shared_gdal)']
          },
      ],
      'copies': [
          {
            'files': [ '<(PRODUCT_DIR)/_srs.node' ],
            'destination': './lib/'
          }
      ]
    }
  ]
}
