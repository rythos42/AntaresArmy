@echo off

REM For each data file, copy it to a non-temporary form, copy it to the web site and delete the temporary file.
REM Only do this after you are sure the temporary files are all correct.

copy .\bin\Debug\Algoryn-new.xml .\bin\Debug\Algoryn.xml
copy .\bin\Debug\Algoryn-new.xml ..\Web\armylists\Algoryn.xml
del .\bin\Debug\Algoryn-new.xml

copy .\bin\Debug\Boromite-new.xml .\bin\Debug\Boromite.xml
copy .\bin\Debug\Boromite-new.xml ..\Web\armylists\Boromite.xml
del .\bin\Debug\Boromite-new.xml

copy .\bin\Debug\Concord-new.xml .\bin\Debug\Concord.xml
copy .\bin\Debug\Concord-new.xml ..\Web\armylists\Concord.xml
del .\bin\Debug\Concord-new.xml

copy .\bin\Debug\Freeborn-new.xml .\bin\Debug\Freeborn.xml
copy .\bin\Debug\Freeborn-new.xml ..\Web\armylists\Freeborn.xml
del .\bin\Debug\Freeborn-new.xml

copy .\bin\Debug\Isorian-new.xml .\bin\Debug\Isorian.xml
copy .\bin\Debug\Isorian-new.xml ..\Web\armylists\Isorian.xml
del .\bin\Debug\Isorian-new.xml

