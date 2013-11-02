{
  'includes': [ '../common.gypi' ],
  'targets': [
    {
      'target_name': 'osr',
      'type': 'static_library',
      'include_dirs': [
        'osr/src'
      ],
      'conditions': [
        ['OS == "win"', {
          'include_dirs': [
             './win-include'
          ]
        }, {
          'include_dirs': [
             './unix-include'
          ]
        }]
      ],
      'sources': [
        '<!@(python -c "import glob;print(\' \'.join(glob.glob(\'osr/src/*.c\')))")',
        '<!@(python -c "import glob;print(\' \'.join(glob.glob(\'osr/src/*.cpp\')))")'
      ],
      'defines': [
        "_FILE_OFFSET_BITS=64",
        "_LARGEFILE_SOURCE"
      ],
      'direct_dependent_settings': {
        'include_dirs': [
          'osr/src'
        ],
        'conditions': [
          ['OS == "win"', {
            'include_dirs': [
               './win-include'
            ]
          }, {
            'include_dirs': [
               './unix-include'
            ]
          }]
        ],
        'defines': [
          "_FILE_OFFSET_BITS=64",
          "_LARGEFILE_SOURCE"
        ],
      },
    }
  ]
}
