@echo off

REM Generate all data files to temporary files, so we can do a diff on the existing and new files.

.\bin\Debug\ParseAntaresPdf.exe -pdf ".\bin\Debug\Algoryn Army List Antares V2.0 pdf.pdf" -out .\bin\Debug\Algoryn-new.xml
.\bin\Debug\ParseAntaresPdf.exe -pdf ".\bin\Debug\Boromite Army List Antares V2.0 pdf.pdf" -out .\bin\Debug\Boromite-new.xml
.\bin\Debug\ParseAntaresPdf.exe -pdf ".\bin\Debug\Concord Antares Army List V2.0 pdf.pdf" -out .\bin\Debug\Concord-new.xml
.\bin\Debug\ParseAntaresPdf.exe -pdf ".\bin\Debug\Freeborn Antares Army List V2.0 pdf.pdf" -out .\bin\Debug\Freeborn-new.xml
.\bin\Debug\ParseAntaresPdf.exe -pdf ".\bin\Debug\Isorian Army List Antares V2.1 pdf.pdf" -out .\bin\Debug\Isorian-new.xml

fc .\bin\Debug\Algoryn.xml .\bin\Debug\Algoryn-new.xml
IF ERRORLEVEL 1 ECHO Algoryn-new.xml not the same as original. Check differences are correct before using CopyData.bat.
fc .\bin\Debug\Boromite.xml .\bin\Debug\Boromite-new.xml 
IF ERRORLEVEL 1 ECHO Boromite-new.xml not the same as original. Check differences are correct before using CopyData.bat.
fc .\bin\Debug\Concord.xml .\bin\Debug\Concord-new.xml
IF ERRORLEVEL 1 ECHO Concord-new.xml not the same as original. Check differences are correct before using CopyData.bat.
fc .\bin\Debug\Freeborn.xml .\bin\Debug\Freeborn-new.xml
IF ERRORLEVEL 1 ECHO Freeborn-new.xml not the same as original. Check differences are correct before using CopyData.bat.
fc .\bin\Debug\Isorian.xml .\bin\Debug\Isorian-new.xml
IF ERRORLEVEL 1 ECHO Isorian-new.xml not the same as original. Check differences are correct before using CopyData.bat.

