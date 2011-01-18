/* test_srs.cpp: Test standalone OGRSpatialReference code
 */

#include "cpl_conv.h"
#include "cpl_string.h"
#include "ogr_srs_api.h"

int main(int argc, char *argv[])
{
    OGRErr eErr;
    const char *pszWKT;
    OGRSpatialReferenceH hSRS;

    if (argc != 2)
    {
        printf("Usage: %s <wkt_string>\n", argv[0]);
        return -1;
    }

    pszWKT = argv[1];


    hSRS = OSRNewSpatialReference( NULL );

    eErr = OSRSetFromUserInput( hSRS, pszWKT );

    if( eErr != OGRERR_NONE )
    {
        OSRDestroySpatialReference( hSRS );
        printf("Ingestion of WKT string failed.\n");
        return -1;
    }

    // Export OGR SRS to a PROJ4 string
    char *pszProj = NULL;

    if (OSRExportToProj4( hSRS, &pszProj ) != OGRERR_NONE ||
        pszProj == NULL || strlen(pszProj) == 0)
    {
        printf("Conversion from OGR SRS to PROJ4 failed.\n");
        CPLFree(pszProj);
        return -1;
    }

    printf("PROJ.4 defn: %s\n", pszProj);
    
    OSRDestroySpatialReference( hSRS );
    CPLFree(pszProj);

    return 0;
}
