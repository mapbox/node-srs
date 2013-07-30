{
  'conditions': [
      ['OS=="win"', {
        'variables': {
          'copy_command%': 'copy'
        },
      },{
        'variables': {
          'copy_command%': 'cp'
        },
      }]
  ],
  'targets': [
    {
      'target_name': '_srs',
      'libraries' : ['<!@(gdal-config --libs)','<!@(gdal-config --dep-libs)'],
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
      'actions': [
        {
          'action_name': 'move_node_module',
          'inputs': [
            '<@(PRODUCT_DIR)/_srs.node'
          ],
          'outputs': [
            'lib/_mapnik.node'
          ],
          'action': ['<@(copy_command)', '<@(PRODUCT_DIR)/_srs.node', 'lib/_srs.node']
        }
      ]
    }
  ]
}
