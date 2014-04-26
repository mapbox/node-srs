import os
import sys

if __name__ == '__main__':
    settings = os.path.join(os.path.dirname(__file__),'lib','srs_settings.js')
    settings_template = """
module.exports.shared_gdal = %s;
    """
    arg = sys.argv[1].strip("'").strip('"')
    # windows gives ../false
    if 'false' in arg:
        open(settings,'w').write(settings_template % 'false')
    else:
        open(settings,'w').write(settings_template % 'true')
