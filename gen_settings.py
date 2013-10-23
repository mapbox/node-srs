import os
import sys

if __name__ == '__main__':
    settings = os.path.join(os.path.dirname(__file__),'lib','srs_settings.js')
    settings_template = """
module.exports.shared_gdal = %s;
    """
    if sys.argv[1] == 'false':
        open(settings,'w').write(settings_template % 'false')
    else:
        open(settings,'w').write(settings_template % 'true')
