@echo off

REM Generate all data files to temporary files, so we can do a diff on the existing and new files.

.\bin\Debug\ParseAntaresPdf.exe -pdf ".\bin\Debug\Algoryn Army List Antares V2.0 pdf.pdf" -out .\bin\Debug\Algoryn-new.xml
.\bin\Debug\ParseAntaresPdf.exe -pdf ".\bin\Debug\Boromite Army List Antares V2.0 pdf.pdf" -out .\bin\Debug\Boromite-new.xml
.\bin\Debug\ParseAntaresPdf.exe -pdf ".\bin\Debug\Concord Antares Army List V2.0 pdf.pdf" -out .\bin\Debug\Concord-new.xml
.\bin\Debug\ParseAntaresPdf.exe -pdf ".\bin\Debug\Freeborn Antares Army List V2.0 pdf.pdf" -out .\bin\Debug\Freeborn-new.xml
.\bin\Debug\ParseAntaresPdf.exe -pdf ".\bin\Debug\Isorian Army List Antares V2.0 pdf.pdf" -out .\bin\Debug\Isorian-new.xml
