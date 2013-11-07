import glob
import os

files = []
files.extend(glob.glob('osr/src/*.c'))
files.extend(glob.glob('osr/src/*.cpp'))
for f in files:
    print "          '%s'," % f