#!/usr/bin/env python
import os
import sys, os, shutil, glob
from os import unlink, symlink, popen, uname, environ
from os.path import join, dirname, abspath, normpath, exists
from shutil import copy2 as copy
from subprocess import call

cwd = os.getcwd()

# http://www.freehackers.org/~tnagy/wafbook/index.html

# node-wafadmin
import Options
import Utils

TARGET = '_srs'
TARGET_FILE = '%s.node' % TARGET
built = 'build/default/%s' % TARGET_FILE
dest = 'lib/%s' % TARGET_FILE
settings = 'lib/settings.js'

# by default we compile local libosr code,
# statically link it, and bundle projection csv's
# alternative is to dynamically link against
# an ogr enabled libgdal
# make this False if you have an install of gdal
# you prefer to link against
STATICALLY_LINK_OSR = True

# this goes into a settings.js file beside the C++ _srs.node
settings_template = """
module.exports.static_osr = %s;
"""

def safe_path(path):
  return path.replace("\\", "/")

def write_settings(static_osr='true'):
    open(settings,'w').write(settings_template % (static_osr))

def set_options(opt):
    opt.tool_options("compiler_cxx")
    
def configure(conf):
    conf.check_tool("compiler_cxx")
    conf.check_tool("node_addon")

    if not STATICALLY_LINK_OSR:
        path_list = environ.get('PATH', '').split(os.pathsep)
        if os.path.exists('/Library/Frameworks/GDAL.framework'):
            path_list.append('/Library/Frameworks/GDAL.framework/Programs')
        conf.find_program('gdal-config', var='GDAL_CONFIG', path_list=path_list, mandatory=True)
        has_ogr = popen('gdal-config --ogr-enabled').read().strip()
        if not has_ogr:
            Utils.pprint('YELLOW', 'ogr appears not to be anabled in your gdal build based on "gdal-config --ogr-enabled"')
            conf.fatal('please rebuild gdal with ogr support or set STATICALLY_LINK_OSR = True in the node-srs/wscript file.')
    linkflags = []
    if STATICALLY_LINK_OSR:
        write_settings(static_osr='true')
        linkflags.append('../deps/osr/ogr/libogr.a')
        linkflags.append('../deps/osr/port/libcpl.a')
    else:
        write_settings(static_osr='false')
        linkflags.extend(popen('gdal-config --libs').read().strip().split(' '))
        #linkflags.append('-L/usr/local/lib')
        #linkflags.append('-lgdal')

    conf.env.append_value("LINKFLAGS", linkflags)
    
    #conf.env.append_value("LIB_OSR", "gdal")
    
    cxxflags = []
    if STATICALLY_LINK_OSR:
        cxxflags.append('-I../deps/osr/ogr')
        cxxflags.append('-I../deps/osr/port')
    else:
        cxxflags.extend(popen('gdal-config --cflags').read().strip().split(' '))
        #cxxflags.append('-I/usr/local/include')

    conf.env.append_value("CXXFLAGS", cxxflags)
    
    #ldflags = []
    #conf.env.append_value("LDFLAGS", ldflags)

def build_ogr(bld):
  cmd = join(cwd, 'tools/scons/scons.py -C ../deps/osr')
  ogr = bld.new_task_gen(
    source        = 'deps/osr/SConstruct '
                    + bld.path.ant_glob('osr/ogr/*')
                    + bld.path.ant_glob('osr/cpl/*'),
    rule = cmd ,
    before        = "cxx",
    install_path  = None)

def build(bld):
    if STATICALLY_LINK_OSR:
        #build_ogr_cpl()
        build_ogr(bld)
    obj = bld.new_task_gen("cxx", "shlib", "node_addon", install_path=None)
    obj.cxxflags = ["-DNDEBUG", "-O3", "-g", "-Wall", "-D_FILE_OFFSET_BITS=64", "-D_LARGEFILE_SOURCE"]
    obj.target = TARGET
    obj.source = "src/_srs.cc"
    obj.uselib = "SRS"
    start_dir = bld.path.find_dir('lib')
    # http://www.freehackers.org/~tnagy/wafbook/index.html#_installing_files
    if STATICALLY_LINK_OSR:
        bld.install_files('${LIBPATH_NODE}/node/srs', start_dir.ant_glob('**/*'), cwd=start_dir, relative_trick=True)
    else:
        bld.install_files('${LIBPATH_NODE}/node/srs', start_dir.ant_glob('*'), cwd=start_dir, relative_trick=True)
    
def shutdown():
    if Options.commands['clean']:
        if exists(TARGET):
            unlink(TARGET)
        if exists(dest):
            unlink(dest)
        cmd = join(cwd, 'tools/scons/scons.py -C deps/osr -c')
        os.system(cmd)
    else:
        if exists(built):
            copy(built,dest)
