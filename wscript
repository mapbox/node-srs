import os
from glob import glob
from os import unlink, symlink, popen, uname, environ
from os.path import exists
from shutil import copy2 as copy
from subprocess import call

# node-wafadmin
import Options
import Utils

TARGET = '_srs'
TARGET_FILE = '%s.node' % TARGET
built = 'build/default/%s' % TARGET_FILE
dest = 'lib/%s' % TARGET_FILE


def set_options(opt):
    opt.tool_options("compiler_cxx")
    
def configure(conf):
    conf.check_tool("compiler_cxx")
    conf.check_tool("node_addon")

    linkflags = []
    linkflags.append('../src/libosr/ogr/ogr.a')
    linkflags.append('../src/libosr/cpl/cpl.a')

    conf.env.append_value("LINKFLAGS", linkflags)
    
    #conf.env.append_value("LIB_OSR", "gdal")
    
    cxxflags = ['-I../src/libosr']

    conf.env.append_value("CXXFLAGS_OSR", cxxflags)
    
    #ldflags = []
    #conf.env.append_value("LDFLAGS", ldflags)

def build_ogr_cpl():
    os.chdir('src/libosr')
    if Options.commands['clean']:
        os.system('make clean')
    else:
        os.system('make')
    os.chdir('../../')

def build(bld):
    build_ogr_cpl()
    obj = bld.new_task_gen("cxx", "shlib", "node_addon", install_path=None)
    obj.cxxflags = ["-DNDEBUG", "-O3", "-g", "-Wall", "-D_FILE_OFFSET_BITS=64", "-D_LARGEFILE_SOURCE"]
    obj.target = TARGET
    obj.source = "src/_srs.cc"
    obj.uselib = "OSR"
    files = glob('lib/*')
    # loop to make sure we can install
    # directories as well as files
    for f in files:
        if os.path.isdir(f):
            path = f.replace('lib','srs')
            bld.install_files('${PREFIX}/lib/node/%s' % path, '%s/*' % path)
        else:
            bld.install_files('${PREFIX}/lib/node/srs/', f)

def shutdown():
    if Options.commands['clean']:
        if exists(TARGET): unlink(TARGET)
    if Options.commands['clean']:
        if exists(dest):
            unlink(dest)
    else:
        if exists(built):
            copy(built,dest)
