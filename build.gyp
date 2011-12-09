
{
  'variables': {
      'node_module_sources': [
          "src/_srs.cc",
      ],
      'node_root': '/usr/local',
      'node_root_win': 'c:\\node',
      'deps_root_win': 'c:\\dev2'
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
             '<@(deps_root_win)\\gdal',
             '<@(deps_root_win)\\gdal\\ogr',
             '<@(deps_root_win)\\gdal\\gcore',
             '<@(deps_root_win)\\gdal\\port',
             '<@(node_root_win)\\deps\\v8\\include',
             '<@(node_root_win)\\src',
             '<@(node_root_win)\\deps\\uv\\include',
          ],
          'msvs_settings': {
            'VCLinkerTool': {
              'AdditionalOptions': [
                # https://github.com/mapnik/node-mapnik/issues/74
                '/FORCE:MULTIPLE'
              ],
              'AdditionalLibraryDirectories': [
                '<@(node_root_win)\\Release\\lib',
                '<@(node_root_win)\\Release',
                '<@(deps_root_win)\\gdal\\',
              ],
            },
          },
        },
      ], # windows
      ] # condition
    }, # targets
  ],
}