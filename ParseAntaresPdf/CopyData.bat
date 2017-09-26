@echo off

REM For each data file, copy it to the web site and delete the temporary file.
REM Only do this after you are sure the temporary files are all correct.

copy .\bin\Debug\Algoryn-new.xml ..\Web\armylists\Algoryn.xml > nul
del .\bin\Debug\Algoryn-new.xml

copy .\bin\Debug\Boromite-new.xml ..\Web\armylists\Boromite.xml  > nul
del .\bin\Debug\Boromite-new.xml

copy .\bin\Debug\Concord-new.xml ..\Web\armylists\Concord.xml > nul
del .\bin\Debug\Concord-new.xml

copy .\bin\Debug\Freeborn-new.xml ..\Web\armylists\Freeborn.xml > nul
del .\bin\Debug\Freeborn-new.xml

copy .\bin\Debug\Isorian-new.xml ..\Web\armylists\Isorian.xml > nul
del .\bin\Debug\Isorian-new.xml

copy ".\bin\Debug\Ghar Empire-new.xml" "..\Web\armylists\Ghar Empire.xml" > nul
del ".\bin\Debug\Ghar Empire-new.xml"

copy ".\bin\Debug\Ghar Rebel-new.xml" "..\Web\armylists\Ghar Rebel.xml" > nul
del ".\bin\Debug\Ghar Rebel-new.xml"

