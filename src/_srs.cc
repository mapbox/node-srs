// v8
#include <v8.h>

// node
#include <node.h>
#include <node_version.h>

// stl
#include <sstream>
#include <iostream>
#include <stdio.h>
#include <stdlib.h>

// osr
#include "ogr_spatialref.h"
//#include "ogr_core.h"
//#include "cpl_conv.h"
#include "cpl_string.h"
//#include "ogr_p.h"
//#include "cpl_multiproc.h"
//#include "ogr_srs_api.h"

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

static Handle<Value> parse(const Arguments& args)
{
    HandleScope scope;

    if (args.Length() != 1 || !args[0]->IsString())
      return ThrowException(Exception::TypeError(
        String::New("first argument must be srs string in any form readable by OGR, like WKT (.prj file) or a proj4 string")));

    OGRSpatialReference oSRS;

    Local<Object> result = Object::New();

    result->Set(String::NewSymbol("input"), args[0]->ToString());
    // intialize as undefined
    result->Set(String::NewSymbol("proj4"), Undefined());
    result->Set(String::NewSymbol("srid"), Undefined());
    result->Set(String::NewSymbol("auth"), Undefined());
    result->Set(String::NewSymbol("pretty_wkt"), Undefined());
    result->Set(String::NewSymbol("esri"), Undefined());
    result->Set(String::NewSymbol("name"), Undefined());

    std::string wkt_string = TOSTR(args[0]->ToString());

    const char *wkt_char = wkt_string.data();

    bool error = false;

    Handle<Value> err;
    
    if( oSRS.SetFromUserInput(wkt_char) != OGRERR_NONE )
    {
        error = true;
        std::ostringstream s;
        s << "OGR Error type #" << CPLE_AppDefined
          << " problem occured importing from srs wkt: " << wkt_string << ".\n";;
        err = ThrowException(Exception::TypeError(String::New(s.str().c_str())));

        // try again to import from ESRI
        oSRS.Clear();
        char **wkt_lines = NULL;
        wkt_lines = CSLTokenizeString2( wkt_char, " \t\n", 
                                CSLT_HONOURSTRINGS | CSLT_ALLOWEMPTYTOKENS );
        if( oSRS.importFromESRI(wkt_lines) != OGRERR_NONE )
        {
            error = true;
            oSRS.Clear();
            //std::ostringstream s;
            //s << "b: OGR Error type #" << CPLE_AppDefined 
            //  << " problem occured importing assuming esri wkt " << wkt_string << ".\n";
            //err = ThrowException(Exception::TypeError(String::New(s.str().c_str())));
        }
        else
        {
            error = false;
            std::clog << "imported assuming esri format...\n";
            result->Set(String::NewSymbol("esri"), Boolean::New(true));
        }
    }
    else
    {
        error = false;
        if (wkt_string.substr(0,6) == "ESRI::")
        {
            result->Set(String::NewSymbol("esri"), Boolean::New(true));
        }
        else
        {
            result->Set(String::NewSymbol("esri"), Boolean::New(false));
        }
    }
    
    if (error)
        return err;
    
    char  *srs_output = NULL;
    if( oSRS.Validate() == OGRERR_NONE)
        result->Set(String::NewSymbol("valid"), Boolean::New(true));
    else if (oSRS.Validate() == OGRERR_UNSUPPORTED_SRS)
        result->Set(String::NewSymbol("valid"), Boolean::New(false));    
    else
        result->Set(String::NewSymbol("valid"), Boolean::New(false));
    
    // TODO - trim output of proj4 result
    if (oSRS.exportToProj4( &srs_output ) != OGRERR_NONE )
    {
        std::ostringstream s;
        s << "OGR Error type #" << CPLE_AppDefined 
          << " problem occured when converting to proj4 format " << wkt_string << ".\n";
        // for now let proj4 errors be non-fatal so that some info can be known...
        //std::clog << s.str();
        //return ThrowException(Exception::TypeError(String::New(s.str().c_str())));
        
    }
    else
    {
        // proj4 strings from osr have an uneeded trailing slash, so we trim it...
        result->Set(String::NewSymbol("proj4"), String::New(CPLString(srs_output).Trim()));
    }

    CPLFree( srs_output );

    if (oSRS.AutoIdentifyEPSG() != OGRERR_NONE )
    {
        /*std::ostringstream s;
        s << "OGR Error type #" << CPLE_AppDefined 
          << " problem occured when attempting to auto identify epsg code " << wkt_string << ".\n";
        std::clog << s.str();
        */
        //return ThrowException(Exception::TypeError(String::New(s.str().c_str())));
    }

    if (oSRS.IsGeographic())
    {
        result->Set(String::NewSymbol("is_geographic"), Boolean::New(true));
        const char *code = oSRS.GetAuthorityCode("GEOGCS");
        if (code)
            result->Set(String::NewSymbol("srid"), Integer::New(atoi(code)));
        const char *auth = oSRS.GetAuthorityName("GEOGCS");
        if (auth)
            result->Set(String::NewSymbol("auth"), String::New(auth));
        const char *name = oSRS.GetAttrValue("GEOGCS");
        if (name)
            result->Set(String::NewSymbol("name"), String::New(name));
    }
    else
    {
        result->Set(String::NewSymbol("is_geographic"), Boolean::New(false));
        const char *code = oSRS.GetAuthorityCode("PROJCS");
        if (code)
            result->Set(String::NewSymbol("srid"), Integer::New(atoi(code)));
        const char *auth = oSRS.GetAuthorityName("PROJCS");
        if (auth)
            result->Set(String::NewSymbol("auth"), String::New(auth));
        const char *name = oSRS.GetAttrValue("PROJCS");
        if (name)
            result->Set(String::NewSymbol("name"), String::New(name));
    }

    char  *srs_output2 = NULL;
    if (oSRS.exportToPrettyWkt( &srs_output2 , 0) != OGRERR_NONE )
    {
        // this does not yet actually return errors
        std::ostringstream s;
        s << "OGR Error type #" << CPLE_AppDefined 
          << " problem occured when converting to pretty wkt format " << wkt_string << ".\n";
        //std::clog << s.str();
        //return ThrowException(Exception::TypeError(String::New(s.str().c_str())));
    }
    else
    {
        result->Set(String::NewSymbol("pretty_wkt"), String::New(srs_output2));
    }

    CPLFree( srs_output2 );
    //OGRSpatialReference::DestroySpatialReference( &oSRS );
    return scope.Close(result);
}


extern "C" {

  static void init (Handle<Object> target)
  {

    NODE_SET_METHOD(target, "_parse", parse);
    
    // versions of deps
    Local<Object> versions = Object::New();
    versions->Set(String::NewSymbol("node"), String::New(NODE_VERSION+1));
    versions->Set(String::NewSymbol("v8"), String::New(V8::GetVersion()));
    // ogr/osr ?
    target->Set(String::NewSymbol("versions"), versions);

  }

  NODE_MODULE(_srs, init);
}
