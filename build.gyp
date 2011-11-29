
{
  'variables': {
      'node_module_sources': [
          "src/_srs.cc",
      ],
      'node_root': '/usr/local'
  },
  'targets': [
    {
      'target_name': '_srs',
      'product_name': '_srs',
      'type': 'loadable_module',
      'product_prefix': '',
      'product_extension':'node',
      'sources': [
        '<@(node_module_sources)',
      ],
      'defines': [
        'PLATFORM="<(OS)"',
        '_LARGEFILE_SOURCE',
        '_FILE_OFFSET_BITS=64',
      ],
      'conditions': [
        [ 'OS=="mac"', {
          'libraries': [
            '-lgdal',
            '-undefined dynamic_lookup'
          ],
          'include_dirs': [
             'src/',
             '<@(node_root)/include/node',
             '<@(node_root)/include',
          ],
        }],
        [ 'OS=="win"', {
          'defines': [
            'PLATFORM="win32"',
            '_LARGEFILE_SOURCE',
            '_FILE_OFFSET_BITS=64',
            '_WINDOWS',
            '__WINDOWS__', # ltdl
            'BUILDING_NODE_EXTENSION'
          ],
          'libraries': [ 
              'gdal.lib',
              'node.lib',
          ],
          'include_dirs': [
             'c:\\mapnik-2.0\\include',
             'c:\\dev2\\gdal',
             'c:\\dev2\\gdal\\ogr',
             'c:\\dev2\\gdal\\gcore',
             'c:\\dev2\\gdal\\port',
             'c:\\dev2\\node-v0.6.2\\deps\\v8\\include',
             'c:\\dev2\\node-v0.6.2\\src',
             'c:\\dev2\\node-v0.6.2\\deps\\uv\\include',
          ],
          'msvs_settings': {
            'VCLinkerTool': {
              'AdditionalOptions': [
                # https://github.com/mapnik/node-mapnik/issues/74
                '/FORCE:MULTIPLE'
              ],
              'AdditionalLibraryDirectories': [
                'c:\\dev2\\node-v0.6.2\\Release\\lib',
                'c:\\dev2\\node-v0.6.2\\Release',
                'c:\\dev2\\gdal\\',
              ],
            },
          },
        },
      ], # windows
      ] # condition
    }, # targets
  ],
}