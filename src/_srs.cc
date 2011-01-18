// v8
#include <v8.h>

// node
#include <node.h>
#include <node_version.h>

// stl
#include <sstream>

// osr
#include "ogr/ogr_spatialref.h"
//#include "ogr/ogr_core.h"
//#include "cpl/cpl_conv.h"
#include "cpl/cpl_string.h"
//#include "ogr/ogr_p.h"
//#include "cpl/cpl_multiproc.h"
//#include "ogr/ogr_srs_api.h"

using namespace node;
using namespace v8;

static Handle<Value> inspect_spatial_reference(const Arguments& args)
{
    HandleScope scope;

    if (args.Length() != 1 || !args[0]->IsString())
      return ThrowException(Exception::TypeError(
        String::New("first argument must be srs string in any form readable by OGR, like WKT (.prj file) or a proj4 string")));

    OGRSpatialReference oSRS;

    Local<Object> result = Object::New();

    result->Set(String::NewSymbol("input"), args[0]->ToString());

    const char *wkt_string = *String::AsciiValue(args[0]->ToString());

    bool error = false;

    Handle<Value> err;
    
    if( oSRS.SetFromUserInput(wkt_string) != OGRERR_NONE )
    {
        error = true;
        std::ostringstream s;
        s << "OGR Error type #" << CPLE_AppDefined 
          << " problem occured translating " << wkt_string << ".\n";;
        err = ThrowException(Exception::TypeError(String::New(s.str().c_str())));

        // try again to import from ESRI
        oSRS.Clear();
        char **wkt_lines = NULL;
        wkt_lines = CSLTokenizeString2( wkt_string, " \t\n", 
                                CSLT_HONOURSTRINGS | CSLT_ALLOWEMPTYTOKENS );
        if( oSRS.importFromESRI(wkt_lines) != OGRERR_NONE )
        {
            error = true;
            std::ostringstream s;
            s << "OGR Error type #" << CPLE_AppDefined 
              << " problem occured translating " << wkt_string << ".\n";
            oSRS.Clear();
            err = ThrowException(Exception::TypeError(String::New(s.str().c_str())));
        }
        else
        {
            error = false;
            result->Set(String::NewSymbol("esri"), Boolean::New(true));
        }
    }
    else
    {
        error = false;
        result->Set(String::NewSymbol("esri"), Boolean::New(false));
    }
    
    if (error)
        return err;
    
    char  *srs_output = NULL;

    // missing ogr_srs_validate.cpp
    /*if( oSRS.Validate() != OGRERR_NONE )
        result->Set(String::NewSymbol("valid"), Boolean::New(false));
    else
        result->Set(String::NewSymbol("valid"), Boolean::New(true));
    */
    
    // TODO - trim output of proj4 result
    if (oSRS.exportToProj4( &srs_output ) != OGRERR_NONE )
    {
        std::ostringstream s;
        s << "OGR Error type #" << CPLE_AppDefined 
          << " problem occured translating " << wkt_string << ".\n";
        return ThrowException(Exception::TypeError(String::New(s.str().c_str())));
    }
    else
    {
        result->Set(String::NewSymbol("proj4"), String::New(srs_output));
    }
    CPLFree( srs_output );

    if (oSRS.AutoIdentifyEPSG() != OGRERR_NONE )
    {
        std::ostringstream s;
        s << "OGR Error type #" << CPLE_AppDefined 
          << " problem occured translating " << wkt_string << ".\n";
        return ThrowException(Exception::TypeError(String::New(s.str().c_str())));
    }

    if (oSRS.IsGeographic())
    {
        result->Set(String::NewSymbol("epsg"), String::New(oSRS.GetAuthorityCode("GEOGCS")));
        result->Set(String::NewSymbol("auth"), String::New(oSRS.GetAuthorityName("GEOGCS")));
    }
    else
    {
        result->Set(String::NewSymbol("epsg"), String::New(oSRS.GetAuthorityCode("PROJCS")));
        result->Set(String::NewSymbol("auth"), String::New(oSRS.GetAuthorityName("PROJCS")));
    }

    if (oSRS.exportToPrettyWkt( &srs_output ) != OGRERR_NONE )
    {
        // this does not yet actually return errors
        std::ostringstream s;
        s << "OGR Error type #" << CPLE_AppDefined 
          << " problem occured translating " << wkt_string << ".\n";
        return ThrowException(Exception::TypeError(String::New(s.str().c_str())));
    }
    else
    {
        result->Set(String::NewSymbol("pretty_wkt"), String::New(srs_output));
    }
    CPLFree( srs_output );

    //OGRSpatialReference::DestroySpatialReference( &oSRS );
    return scope.Close(result);
}


extern "C" {

  static void init (Handle<Object> target)
  {
    NODE_SET_METHOD(target, "inspect", inspect_spatial_reference);            

    // node-srs version
    target->Set(String::NewSymbol("version"), String::New("0.1.0"));
    
    // versions of deps
    Local<Object> versions = Object::New();
    versions->Set(String::NewSymbol("node"), String::New(NODE_VERSION+1));
    versions->Set(String::NewSymbol("v8"), String::New(V8::GetVersion()));
    // ogr/osr ?
    target->Set(String::NewSymbol("versions"), versions);

  }

  NODE_MODULE(_srs, init);
}
