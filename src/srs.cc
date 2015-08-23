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
    Nan::HandleScope scope;
    if (info.Length() != 1 || !info[0]->IsString())
      return Nan::ThrowTypeError("first argument must be srs string in any form readable by OGR, like WKT (.prj file) or a proj4 string");

    Local<Object> result = Nan::New<Object>();
    Nan::Set(result, Nan::New<String>("input").ToLocalChecked(), info[0]->ToString());
    Nan::Set(result, Nan::New<String>("proj4").ToLocalChecked(), Nan::Undefined());
    Nan::Set(result, Nan::New<String>("srid").ToLocalChecked(), Nan::Undefined());
    Nan::Set(result, Nan::New<String>("auth").ToLocalChecked(), Nan::Undefined());
    Nan::Set(result, Nan::New<String>("pretty_wkt").ToLocalChecked(), Nan::Undefined());
    Nan::Set(result, Nan::New<String>("esri").ToLocalChecked(), Nan::Undefined());
    Nan::Set(result, Nan::New<String>("name").ToLocalChecked(), Nan::Undefined());

    std::string wkt_string = TOSTR(info[0]->ToString());
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
            Nan::Set(result, Nan::New<String>("esri").ToLocalChecked(), Nan::New<Boolean>(true));
        }
    }
    else
    {
        error = false;
        if (wkt_string.substr(0,6) == "ESRI::")
        {
            Nan::Set(result, Nan::New<String>("esri").ToLocalChecked(), Nan::New<Boolean>(true));
        }
        else
        {
            Nan::Set(result, Nan::New<String>("esri").ToLocalChecked(), Nan::New<Boolean>(false));
        }
    }

    if (error) {
        return Nan::ThrowError(err_msg.c_str());
    } else {
        char  *srs_output = NULL;
        if (oSRS.Validate() == OGRERR_NONE) {
            Nan::Set(result, Nan::New<String>("valid").ToLocalChecked(), Nan::New<Boolean>(true));
        } else if (oSRS.Validate() == OGRERR_UNSUPPORTED_SRS) {
            Nan::Set(result, Nan::New<String>("valid").ToLocalChecked(), Nan::New<Boolean>(false));
        } else {
            Nan::Set(result, Nan::New<String>("valid").ToLocalChecked(), Nan::New<Boolean>(false));
        }

        if (oSRS.exportToProj4( &srs_output ) == OGRERR_NONE ) {
            // proj4 strings from osr have an uneeded trailing slash, so we trim it...
            Nan::Set(result, Nan::New<String>("proj4").ToLocalChecked(), Nan::New<String>(CPLString(srs_output).Trim().c_str()).ToLocalChecked());
        }

        CPLFree( srs_output );

        if (oSRS.AutoIdentifyEPSG() != OGRERR_NONE )
        {
            // do nothing
        }

        if (oSRS.IsGeographic())
        {
            Nan::Set(result, Nan::New<String>("is_geographic").ToLocalChecked(), Nan::New<Boolean>(true));
            const char *code = oSRS.GetAuthorityCode("GEOGCS");
            if (code) {
                Nan::Set(result, Nan::New<String>("srid").ToLocalChecked(), Nan::New<Integer>(atoi(code)));
            }
            const char *auth = oSRS.GetAuthorityName("GEOGCS");
            if (auth) {
                Nan::Set(result, Nan::New<String>("auth").ToLocalChecked(), Nan::New<String>(auth).ToLocalChecked());
            }
            const char *name = oSRS.GetAttrValue("GEOGCS");
            if (name) {
                Nan::Set(result, Nan::New<String>("name").ToLocalChecked(), Nan::New<String>(name).ToLocalChecked());
            }
        }
        else
        {
            Nan::Set(result, Nan::New<String>("is_geographic").ToLocalChecked(), Nan::New<Boolean>(false));
            const char *code = oSRS.GetAuthorityCode("PROJCS");
            if (code) {
                Nan::Set(result, Nan::New<String>("srid").ToLocalChecked(), Nan::New<Integer>(atoi(code)));
            }
            const char *auth = oSRS.GetAuthorityName("PROJCS");
            if (auth) {
                Nan::Set(result, Nan::New<String>("auth").ToLocalChecked(), Nan::New<String>(auth).ToLocalChecked());
            }
            const char *name = oSRS.GetAttrValue("PROJCS");
            if (name) {
                Nan::Set(result, Nan::New<String>("name").ToLocalChecked(), Nan::New<String>(name).ToLocalChecked());
            }
        }

        char  *srs_output2 = NULL;
        if (oSRS.exportToPrettyWkt( &srs_output2 , 0) == OGRERR_NONE ) {
            Nan::Set(result, Nan::New<String>("pretty_wkt").ToLocalChecked(), Nan::New<String>(srs_output2).ToLocalChecked());
        }
        CPLFree(srs_output2);
        info.GetReturnValue().Set(result);
    }
}


extern "C" {

  static void init (Handle<Object> target)
  {

    Nan::SetMethod(target, "_parse", parse);
    // versions of deps
    Local<Object> versions = Nan::New<Object>();
    Nan::Set(versions, Nan::New<String>("node").ToLocalChecked(), Nan::New<String>(NODE_VERSION+1).ToLocalChecked());
    Nan::Set(versions, Nan::New<String>("v8").ToLocalChecked(), Nan::New<String>(V8::GetVersion()).ToLocalChecked());
    Nan::Set(target, Nan::New<String>("versions").ToLocalChecked(), versions);
  }

  NODE_MODULE(srs, init);
}
