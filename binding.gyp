{
  'includes': [ 'common.gypi' ],
  'variables': {
      'runtime_link%':'shared',
      'shared_gdal%':'false',
  },
  'targets': [
    {
      'target_name': 'srs',
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
        'GCC_ENABLE_CPP_EXCEPTIONS': 'YES',
        'OTHER_LDFLAGS':[
          '-Wl,-bind_at_load'
        ]
      },
      'sources': [
        'src/srs.cc'
      ],
      "include_dirs" : [
          "<!(node -e \"require('nan')\")"
      ]
    },
    {
      'target_name': 'action_after_build',
      'type': 'none',
      'dependencies': [ 'srs' ],
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
            'files': [ '<(PRODUCT_DIR)/<(module_name).node' ],
            'destination': '<(module_path)'
          }
      ]
    }
  ]
}
