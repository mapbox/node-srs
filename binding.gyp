{
  'includes': [ 'common.gypi' ],
  'variables': {
    'runtime_link%':'shared',
    'shared_gdal%':'false',
  },
  'targets': [
    {
      'target_name': 'action_before_build',
      'hard_dependency': 1,
      'type': 'none',
      'actions': [
        {
          'action_name': 'generate_setting',
          'inputs': [
            'gen_settings.py'
          ],
          'outputs': [
            '<(SHARED_INTERMEDIATE_DIR)/srs_settings.js'
          ],
          'action': ['python', 'gen_settings.py', '<@(shared_gdal)', '<(SHARED_INTERMEDIATE_DIR)/srs_settings.js']
        }
      ],
      'copies': [
        {
          'files': [ '<(SHARED_INTERMEDIATE_DIR)/srs_settings.js' ],
          'destination': '<(module_path)'
        }
      ]
    },
    {
      'target_name': 'srs',
      'dependencies': [ 'action_before_build' ],
      'conditions': [
        ['shared_gdal == "false"',
          {
            'dependencies': [
              'deps/osr.gyp:osr'
            ]
          },
          {
            'conditions': [
              ['runtime_link == "static"',
                {
                  'libraries': ['<!@(gdal-config --dep-libs)']
                }
              ],
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
      'cflags_cc!': ['-fno-exceptions'],
      'xcode_settings': {
        'GCC_ENABLE_CPP_EXCEPTIONS': 'YES',
        'MACOSX_DEPLOYMENT_TARGET':'10.8',
        'CLANG_CXX_LIBRARY': 'libc++',
        'CLANG_CXX_LANGUAGE_STANDARD':'c++11',
        'GCC_VERSION': 'com.apple.compilers.llvm.clang.1_0',
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
      'dependencies': [ '<(module_name)' ],
      'copies': [
        {
          'files': [ '<(PRODUCT_DIR)/<(module_name).node' ],
          'destination': '<(module_path)'
        }
      ]
    }
  ]
}
