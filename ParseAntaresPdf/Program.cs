using System;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;
using iTextSharp.text.pdf;
using iTextSharp.text.pdf.parser;
using ParseAntaresPdf.Text;

namespace ParseAntaresPdf
{
    public static class Program
    {
        private static bool debugVerbose;
        private static bool debugWholeOptions;
        private static bool debugIndividualOptions;
        private static bool justText;

        private static bool inArmyList;
        private static bool inSection;
        private static bool inModel;
        private static bool inOptions;
        private static LineType nextLine;
        private static StringBuilder currentOptions = new StringBuilder();

        private static Units units;
        private static Options options;
        private static IgnoreLines ignoreLines;
        private static Sections sections;

        private const string AmmoTypes = "Scrambler, Arc, Blur, Scoot, Net and Grip";


        private static void Main(string[] args)
        {
            var commandLineArgs = new CommandLineArguments(args);
            var inputFileName = commandLineArgs.GetKeyValue("pdf");
            if (inputFileName == null)
            {
                ShowHelp();
                return;
            }

            var output = ReadPdfFile(inputFileName);

            debugVerbose = commandLineArgs.HasArg("debugVerbose");
            debugWholeOptions = commandLineArgs.HasArg("debugWholeOptions");
            debugIndividualOptions = commandLineArgs.HasArg("debugIndividualOptions");
            justText = commandLineArgs.HasArg("justText");

            var outputFileName = commandLineArgs.GetKeyValue("out") ?? "Output.xml";
            StreamWriter outFile = new StreamWriter(outputFileName);

            if (justText)
            {
                outFile.Write(output);
            }
            else
            {
                outFile.WriteLine("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");

                units = new Units();
                options = new Options();
                ignoreLines = new IgnoreLines();
                sections = new Sections();

                var lines = output.Split(new[] {"\r\n"}, StringSplitOptions.RemoveEmptyEntries);
                foreach (var line in lines)
                {
                    if (debugVerbose)
                        outFile.WriteLine("<line>" + line + "</line>");
                    else
                        DealWithLine(line, outFile);
                }

                CloseTag(outFile, true, true, true);
                outFile.WriteLine("</army-list>");
            }

            outFile.Close();
        }

        private static void ShowHelp()
        {
            Console.WriteLine("ParseAntaresPdf -pdf <input file> [-out <output file>] [-justText] [-debugVerbose] [-debugWholeOptions] [-debugIndividualOptions]");
            Console.WriteLine("\tFor the debug options, instead of writing the expected XML, they will write a variety of levels of debug based on the parsed PDF, to assist in tracking down how to update this program code to work around issues found in parsing. They can be helpful in determining what to add/move around in the .json data files to make the list work.");
            Console.ReadLine();
        }

        private static string ReadPdfFile(string inputFile)
        {
            var output = new StringBuilder();
            if (File.Exists(inputFile))
            {
                PdfReader pdfReader = new PdfReader(inputFile);

                for (int page = 1; page <= pdfReader.NumberOfPages; page++)
                {
                    ITextExtractionStrategy strategy = new TopToBottomTextExtractionStrategy();
                    string currentText = PdfTextExtractor.GetTextFromPage(pdfReader, page, strategy);

                    currentText =
                        Encoding.UTF8.GetString(ASCIIEncoding.Convert(Encoding.Default, Encoding.UTF8,
                            Encoding.Default.GetBytes(currentText)));
                    output.Append(currentText);
                }
                pdfReader.Close();
            }
            return output.ToString();
        }
        
        private static string WriteAmmoTypes(StreamWriter outFile, string points, string ammoTypeLine, string pointsLine) 
        {
            // This gets a little weird
            var orAmmoTypes = ammoTypeLine.Replace("and", "or");

            // Write out the ammo types with "OR" and the points from the start of the line
            WriteOptionName(outFile, orAmmoTypes);
            outFile.WriteLine("\t\t\t\t\t<points>" + points + "</points>");
            outFile.WriteLine("\t\t\t\t</option>");

            // Write out the ammo types with "AND", and return the points for the unwritten option to be finished outside the loop in WriteCurrentOptions.
            outFile.WriteLine("\t\t\t\t<option>");
            WriteOptionName(outFile, ammoTypeLine);

            // pointsLine is "5pts each OR 15pts for all Options", starting at OR, split on space and get the second token.
            return RemoveNonNumericConvertFree(pointsLine.Substring(pointsLine.IndexOf("OR")).Split(' ')[1]);
        }

        private static void WriteCurrentOptions(StreamWriter outFile)
        {
            if (debugWholeOptions)
            {
                outFile.WriteLine(currentOptions);
                return;
            }

            var options = currentOptions.ToString().Split(new[] {"@"}, StringSplitOptions.RemoveEmptyEntries);
            for(int i = 0; i < options.Length - 1; i++)
            {
                if (debugIndividualOptions)
                {
                    outFile.WriteLine("\t\t\t\t<option>" + options[i] + "</option>");
                    continue;
                }

                var name = options[i].Trim();
                var points = RemoveNonNumericConvertFree(options[i + 1].Trim().Split(' ')[0]);  // first value on next option line is the points for the current one, because of "@" split

                outFile.WriteLine("\t\t\t\t<option>");

                // Have to handle ammo types specially
                if (name.IndexOf(AmmoTypes) != -1)
                    points = WriteAmmoTypes(outFile, points, options[i], options[i + 1]);
                else
                    WriteOptionName(outFile, name);

                outFile.WriteLine("\t\t\t\t\t<points>" + points + "</points>");
                outFile.WriteLine("\t\t\t\t</option>");
            }

            if (debugIndividualOptions)  // output the last line for debugging
                outFile.WriteLine("\t\t\t\t<not-option>" + options[options.Length - 1] + "</not-option>");
        }

        private static void WriteOptionName(StreamWriter outFile, string name)
        {
            bool wroteOptionName = false;
            foreach (var option in options.GetOptions())
            {
                var optionNameNoSpace = option.Name.Replace(" ", "");
                var nameNoSpace = name.Replace(" ", "");

                var index = nameNoSpace.IndexOf(optionNameNoSpace, StringComparison.OrdinalIgnoreCase);
                if (index != -1)
                {
                    var toBeWritten = option.Replacement ?? option.Name;
                    outFile.WriteLine("\t\t\t\t\t<name>" + toBeWritten + "</name>");
                    wroteOptionName = true;
                    break;
                }
            }

            if (!wroteOptionName)
                outFile.WriteLine("\t\t\t\t\t<name>" + name + "</name>");
        }

        private static string RemoveNonNumericConvertFree(string points)
        {
            if (points.Equals("Free"))
                return "0";

            return Regex.Replace(points, "[^0-9.]", "");
        }

        private static void CloseTag(StreamWriter outFile, bool closeSection, bool closeModel, bool closeOptions)
        {
            if (inOptions && currentOptions.Length != 0)
            {
                WriteCurrentOptions(outFile);
            }

            if (inOptions && closeOptions)
            {
                outFile.WriteLine("\t\t\t</options>");
                inOptions = false;
            }

            if (inModel && closeModel)
            {
                outFile.WriteLine("\t\t</model>");
                inModel = false;
            }

            if (inSection && closeSection)
            {
                outFile.WriteLine("\t</section>");
                inSection = false;
            }
        }

        private static void DealWithLine(string line, StreamWriter outFile)
        {
            if (line.Contains("Army List") && !inArmyList)
            {
                inArmyList = true;
                var armyListType = line.Substring(0, line.IndexOf("Army List")).Trim();
                outFile.WriteLine("<army-list type=\"" + armyListType + "\">");
                return;
            }

            if (sections.Contains(line))
            {
                CloseTag(outFile, true, true, true);

                inSection = true;
                outFile.WriteLine("\t<section name=\"" + line + "\">");
                return;
            }

            var adjustedModelName = units.GetAdjustedName(line);
            if (adjustedModelName != null)
            {
                CloseTag(outFile, false, true, true);

                inModel = true;
                nextLine = LineType.UnitTypePointsValueLimited;
                outFile.WriteLine("\t\t<model>");
                outFile.WriteLine("\t\t\t<name>" + adjustedModelName + "</name>");
                return;
            }

            if (nextLine == LineType.UnitTypePointsValueLimited)
            {
                nextLine = LineType.Undefined;

                var splitOnPointValues = line.Split(new[] {"Points Value: "}, StringSplitOptions.RemoveEmptyEntries);
                var unitType = splitOnPointValues[0].Trim();

                var splitOnSpacesToGetPoints = splitOnPointValues[1].Split(new []{' '}, StringSplitOptions.RemoveEmptyEntries);
                var points = splitOnSpacesToGetPoints[0];

                var isLimited = line.Contains("Limited Choice").ToString().ToLower();

                outFile.WriteLine("\t\t\t<unit-type>" + unitType + "</unit-type>");
                outFile.WriteLine("\t\t\t<points>" + points + "</points>");
                outFile.WriteLine("\t\t\t<is-limited>" + isLimited + "</is-limited>");
                return;
            }

            if (inModel && !inOptions && (line.Equals("Options") || line.Equals("Weapon Options")))
            {
                CloseTag(outFile, false, false, true);

                inOptions = true;
                outFile.WriteLine("\t\t\t<options>");
                currentOptions = new StringBuilder();
                return;
            }

            if (line.Replace(" ", "").Equals("VARIANTFORCESELECTORS"))
            {
                CloseTag(outFile, true, true, true);
                return;
            }

            if(ignoreLines.Contains(line))
                return;

            if (inOptions)
                currentOptions.Append(line + " ");
        }
    }
}
