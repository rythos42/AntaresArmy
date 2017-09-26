@echo off

REM Generate all data files to temporary files, so we can do a diff on the existing and new files.

.\bin\Debug\ParseAntaresPdf.exe -pdf ".\bin\Debug\Algoryn Army List Antares V2.0 pdf.pdf" -out .\bin\Debug\Algoryn-new.xml
.\bin\Debug\ParseAntaresPdf.exe -pdf ".\bin\Debug\Boromite Army List Antares V2.0 pdf.pdf" -out .\bin\Debug\Boromite-new.xml
.\bin\Debug\ParseAntaresPdf.exe -pdf ".\bin\Debug\Concord Antares Army List V2.0 pdf.pdf" -out .\bin\Debug\Concord-new.xml
.\bin\Debug\ParseAntaresPdf.exe -pdf ".\bin\Debug\Freeborn Antares Army List V2.0 pdf.pdf" -out .\bin\Debug\Freeborn-new.xml
.\bin\Debug\ParseAntaresPdf.exe -pdf ".\bin\Debug\Isorian Army List Antares V2.1 pdf.pdf" -out .\bin\Debug\Isorian-new.xml
.\bin\Debug\ParseAntaresPdf.exe -pdf ".\bin\Debug\Ghar Empire Army List V2.0 pdf.pdf" -out ".\bin\Debug\Ghar Empire-new.xml"
.\bin\Debug\ParseAntaresPdf.exe -pdf ".\bin\Debug\Ghar Rebel Army List Antares V2.0 pdf.pdf" -out ".\bin\Debug\Ghar Rebel-new.xml"

fc ..\Web\armylists\Algoryn.xml .\bin\Debug\Algoryn-new.xml
IF ERRORLEVEL 1 ECHO Algoryn-new.xml not the same as original. Check differences are correct before using CopyData.bat.
fc ..\Web\armylists\Boromite.xml .\bin\Debug\Boromite-new.xml 
IF ERRORLEVEL 1 ECHO Boromite-new.xml not the same as original. Check differences are correct before using CopyData.bat.
fc ..\Web\armylists\Concord.xml .\bin\Debug\Concord-new.xml
IF ERRORLEVEL 1 ECHO Concord-new.xml not the same as original. Check differences are correct before using CopyData.bat.
fc ..\Web\armylists\Freeborn.xml .\bin\Debug\Freeborn-new.xml
IF ERRORLEVEL 1 ECHO Freeborn-new.xml not the same as original. Check differences are correct before using CopyData.bat.
fc ..\Web\armylists\Isorian.xml .\bin\Debug\Isorian-new.xml
IF ERRORLEVEL 1 ECHO Isorian-new.xml not the same as original. Check differences are correct before using CopyData.bat.
fc "..\Web\armylists\Ghar Empire.xml" ".\bin\Debug\Ghar Empire-new.xml"
IF ERRORLEVEL 1 ECHO Ghar Empire-new.xml not the same as original. Check differences are correct before using CopyData.bat.
fc "..\Web\armylists\Ghar Rebel.xml" ".\bin\Debug\Ghar Rebel-new.xml"
IF ERRORLEVEL 1 ECHO Ghar Rebel-new.xml not the same as original. Check differences are correct before using CopyData.bat.

