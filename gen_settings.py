import os
import sys

settings = os.path.abspath(sys.argv[2])

# this goes into a srs_settings.js file beside the C++ srs.node
settings_template = """
module.exports.shared_gdal = %s;
"""

if __name__ == '__main__':
    arg = sys.argv[1].strip("'").strip('"')
    # windows gives ../false
    if 'false' in arg:
        open(settings,'w').write(settings_template % 'false')
    else:
        open(settings,'w').write(settings_template % 'true')
