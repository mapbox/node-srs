import os
import sys

if __name__ == '__main__':
    settings = os.path.join(os.path.dirname(__file__),'lib','srs_settings.js')
    settings_template = """
module.exports.static_osr = %s;
    """
    if sys.argv[1] == 'internal':
        open(settings,'w').write(settings_template % 'true')
    else:
        open(settings,'w').write(settings_template % 'false')
