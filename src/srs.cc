// v8
#include <v8.h>

// node
#include <node.h>
#include <nan.h>
#include <node_version.h>

// stl
#include <sstream>
#include <iostream>
#include <stdio.h>
#include <stdlib.h>

// osr
#include "ogr_spatialref.h"
#include "cpl_error.h" // CPLE_AppDefined
#include "cpl_conv.h" // CPLFree
#include "cpl_string.h" // CPLString

using namespace node;
using namespace v8;

#define TOSTR(obj) (*String::Utf8Value((obj)->ToString()))

/*
OGRERR_DICT = { 1 : (OGRException, "Not enough data."),
                2 : (OGRException, "Not enough memory."),
                3 : (OGRException, "Unsupported geometry type."),
                4 : (OGRException, "Unsupported operation."),
                5 : (OGRException, "Corrupt data."),
                6 : (OGRException, "OGR failure."),
                7 : (SRSException, "Unsupported SRS."),
                8 : (OGRException, "Invalid handle."),
                }
*/

NAN_METHOD(parse) {
    NanScope();
    if (args.Length() != 1 || !args[0]->IsString())
      return NanThrowTypeError("first argument must be srs string in any form readable by OGR, like WKT (.prj file) or a proj4 string");

    Local<Object> result = NanNew<Object>();
    result->Set(NanNew<String>("input"), args[0]->ToString());
    result->Set(NanNew<String>("proj4"), NanUndefined());
    result->Set(NanNew<String>("srid"), NanUndefined());
    result->Set(NanNew<String>("auth"), NanUndefined());
    result->Set(NanNew<String>("pretty_wkt"), NanUndefined());
    result->Set(NanNew<String>("esri"), NanUndefined());
    result->Set(NanNew<String>("name"), NanUndefined());

    std::string wkt_string = TOSTR(args[0]->ToString());
    const char *wkt_char = wkt_string.data();
    bool error = false;
    std::string err_msg;
    OGRSpatialReference oSRS;
    if( oSRS.SetFromUserInput(wkt_char) != OGRERR_NONE )
    {
        error = true;
        std::ostringstream s;
        s << "OGR Error type #" << CPLE_AppDefined
          << " problem occured importing from srs wkt: " << wkt_string << ".\n";;
        err_msg = s.str();

        // try again to import from ESRI
        oSRS.Clear();
        char **wkt_lines = NULL;
        wkt_lines = CSLTokenizeString2( wkt_char, " \t\n",
                                CSLT_HONOURSTRINGS | CSLT_ALLOWEMPTYTOKENS );
        if( oSRS.importFromESRI(wkt_lines) != OGRERR_NONE )
        {
            error = true;
            oSRS.Clear();
        }
        else
        {
            error = false;
            result->Set(NanNew<String>("esri"), NanNew<Boolean>(true));
        }
    }
    else
    {
        error = false;
        if (wkt_string.substr(0,6) == "ESRI::")
        {
            result->Set(NanNew<String>("esri"), NanNew<Boolean>(true));
        }
        else
        {
            result->Set(NanNew<String>("esri"), NanNew<Boolean>(false));
        }
    }

    if (error) {
        return NanThrowError(err_msg.c_str());
    } else {
        char  *srs_output = NULL;
        if (oSRS.Validate() == OGRERR_NONE) {
            result->Set(NanNew<String>("valid"), NanNew<Boolean>(true));
        } else if (oSRS.Validate() == OGRERR_UNSUPPORTED_SRS) {
            result->Set(NanNew<String>("valid"), NanNew<Boolean>(false));
        } else {
            result->Set(NanNew<String>("valid"), NanNew<Boolean>(false));
        }

        if (oSRS.exportToProj4( &srs_output ) == OGRERR_NONE ) {
            // proj4 strings from osr have an uneeded trailing slash, so we trim it...
            result->Set(NanNew<String>("proj4"), NanNew<String>(CPLString(srs_output).Trim().c_str()));
        }

        CPLFree( srs_output );

        if (oSRS.AutoIdentifyEPSG() != OGRERR_NONE )
        {
            // do nothing
        }

        if (oSRS.IsGeographic())
        {
            result->Set(NanNew<String>("is_geographic"), NanNew<Boolean>(true));
            const char *code = oSRS.GetAuthorityCode("GEOGCS");
            if (code) {
                result->Set(NanNew<String>("srid"), NanNew<Integer>(atoi(code)));
            }
            const char *auth = oSRS.GetAuthorityName("GEOGCS");
            if (auth) {
                result->Set(NanNew<String>("auth"), NanNew<String>(auth));
            }
            const char *name = oSRS.GetAttrValue("GEOGCS");
            if (name) {
                result->Set(NanNew<String>("name"), NanNew<String>(name));
            }
        }
        else
        {
            result->Set(NanNew<String>("is_geographic"), NanNew<Boolean>(false));
            const char *code = oSRS.GetAuthorityCode("PROJCS");
            if (code) {
                result->Set(NanNew<String>("srid"), NanNew<Integer>(atoi(code)));
            }
            const char *auth = oSRS.GetAuthorityName("PROJCS");
            if (auth) {
                result->Set(NanNew<String>("auth"), NanNew<String>(auth));
            }
            const char *name = oSRS.GetAttrValue("PROJCS");
            if (name) {
                result->Set(NanNew<String>("name"), NanNew<String>(name));
            }
        }

        char  *srs_output2 = NULL;
        if (oSRS.exportToPrettyWkt( &srs_output2 , 0) == OGRERR_NONE ) {
            result->Set(NanNew<String>("pretty_wkt"), NanNew<String>(srs_output2));
        }
        CPLFree(srs_output2);
        NanReturnValue(result);
    }
}


extern "C" {

  static void init (Handle<Object> target)
  {

    NODE_SET_METHOD(target, "_parse", parse);
    // versions of deps
    Local<Object> versions = NanNew<Object>();
    versions->Set(NanNew<String>("node"), NanNew<String>(NODE_VERSION+1));
    versions->Set(NanNew<String>("v8"), NanNew<String>(V8::GetVersion()));
    target->Set(NanNew<String>("versions"), versions);
  }

  NODE_MODULE(srs, init);
}
