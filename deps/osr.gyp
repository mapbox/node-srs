{
  'includes': [ '../common.gypi' ],
  'targets': [
    {
      'target_name': 'osr',
      'type': 'static_library',
      'include_dirs': [
        'osr/src'
      ],
      'xcode_settings': {
        'GCC_ENABLE_CPP_EXCEPTIONS': 'YES',
        'MACOSX_DEPLOYMENT_TARGET':'10.8',
        'CLANG_CXX_LIBRARY': 'libc++',
        'CLANG_CXX_LANGUAGE_STANDARD':'c++11',
        'GCC_VERSION': 'com.apple.compilers.llvm.clang.1_0',
      },
      'conditions': [
        ['OS == "win"', {
          'include_dirs': [
             './win-include'
          ]
        }],
        [ 'OS=="freebsd"', {
          'include_dirs': [
             './bsd-include'
          ]
        }],
        [ 'OS!="freebsd" and OS!="win"', {
          'include_dirs': [
             './unix-include'
          ]
        }]
      ],
      'sources': [
          'osr/src/osr_cs_wkt.c',
          'osr/src/osr_cs_wkt_parser.c',
          'osr/src/cpl_atomic_ops.cpp',
          'osr/src/cpl_base64.cpp',
          'osr/src/cpl_conv.cpp',
          'osr/src/cpl_csv.cpp',
          'osr/src/cpl_error.cpp',
          'osr/src/cpl_findfile.cpp',
          'osr/src/cpl_getexecpath.cpp',
          'osr/src/cpl_google_oauth2.cpp',
          'osr/src/cpl_hash_set.cpp',
          'osr/src/cpl_http.cpp',
          'osr/src/cpl_list.cpp',
          'osr/src/cpl_minixml.cpp',
          'osr/src/cpl_multiproc.cpp',
          'osr/src/cpl_path.cpp',
          'osr/src/cpl_progress.cpp',
          'osr/src/cpl_quad_tree.cpp',
          'osr/src/cpl_recode.cpp',
          'osr/src/cpl_recode_iconv.cpp',
          'osr/src/cpl_recode_stub.cpp',
          'osr/src/cpl_spawn.cpp',
          'osr/src/cpl_string.cpp',
          'osr/src/cpl_strtod.cpp',
          'osr/src/cpl_time.cpp',
          'osr/src/cpl_vsi_mem.cpp',
          'osr/src/cpl_vsil.cpp',
          'osr/src/cpl_vsil_abstract_archive.cpp',
          'osr/src/cpl_vsil_buffered_reader.cpp',
          'osr/src/cpl_vsil_cache.cpp',
          'osr/src/cpl_vsil_curl.cpp',
          'osr/src/cpl_vsil_curl_streaming.cpp',
          'osr/src/cpl_vsil_sparsefile.cpp',
          'osr/src/cpl_vsil_stdin.cpp',
          'osr/src/cpl_vsil_stdout.cpp',
          'osr/src/cpl_vsil_subfile.cpp',
          'osr/src/cpl_vsil_tar.cpp',
          'osr/src/cpl_vsil_unix_stdio_64.cpp',
          'osr/src/cpl_vsil_win32.cpp',
          'osr/src/cpl_vsisimple.cpp',
          'osr/src/cpl_xml_validate.cpp',
          'osr/src/cplgetsymbol.cpp',
          'osr/src/cplkeywordparser.cpp',
          'osr/src/cplstring.cpp',
          'osr/src/cplstringlist.cpp',
          'osr/src/ogr_fromepsg.cpp',
          'osr/src/ogr_srs_dict.cpp',
          'osr/src/ogr_srs_erm.cpp',
          'osr/src/ogr_srs_esri.cpp',
          'osr/src/ogr_srs_ozi.cpp',
          'osr/src/ogr_srs_panorama.cpp',
          'osr/src/ogr_srs_pci.cpp',
          'osr/src/ogr_srs_proj4.cpp',
          'osr/src/ogr_srs_usgs.cpp',
          'osr/src/ogr_srs_validate.cpp',
          'osr/src/ogr_srs_xml.cpp',
          'osr/src/ogr_srsnode.cpp',
          'osr/src/ogrct.cpp',
          'osr/src/ogrspatialreference.cpp'
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
