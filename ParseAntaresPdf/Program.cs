using System;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using iTextSharp.text.pdf;
using iTextSharp.text.pdf.parser;

namespace ParseAntaresPdf
{
    class Program
    {
        private static bool debugWholeOutput;
        private static bool debugWholeOptionsOutput;
        private static bool debugIndividualOptionsOutput;

        private static bool inArmyList;
        private static bool inSection;
        private static bool inModel;
        private static bool inOptions;
        private static LineType nextLine;
        private static StringBuilder currentOptions = new StringBuilder();
        
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

            debugWholeOutput = commandLineArgs.HasArg("debugWholeOutput");
            debugWholeOptionsOutput = commandLineArgs.HasArg("debugWholeOptionsOutput");
            debugIndividualOptionsOutput = commandLineArgs.HasArg("debugIndividualOptionsOutput");

            var outputFileName = commandLineArgs.GetKeyValue("out") ?? "Output.xml";
            StreamWriter outFile = new StreamWriter(outputFileName);
            outFile.WriteLine("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");

            var lines = output.Split(new[] {"\r\n"}, StringSplitOptions.RemoveEmptyEntries);
            foreach (var line in lines)
            {
                if (debugWholeOutput)
                    outFile.WriteLine("<line>" + line + "</line>");
                else
                    DealWithLine(line, outFile);
            }

            CloseTag(outFile, true, true, true);

            outFile.WriteLine("</army-list>");
            outFile.Close();
        }

        private static void ShowHelp()
        {
            Console.WriteLine("ParseAntaresPdf -pdf <input file> [-out <output file>] [-debugWholeOutput] [-debugWholeOptionsOutput] [-debugIndividualOptionsOutput]");
            Console.WriteLine("\tRealistically, the debug options are only really useful for developers. Instead of writing the expected XML, they will write a variety of levels of debug based on the parsed PDF, to assist in tracking down how to update this program code to work around issues found in parsing.");
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

        private static string[] Sections = { "TACTICAL" , "STRATEGIC", "SUPPORT","AUXILIARY"  };
        private static string[] IgnoreLines =
        {
            "Concord Army List",
            "•     ",
            "*Note this is a discounted value because it’s an either/or unit choice for ",
            "Exchange any or all twin Plasma Carbines for  ",
            "Plasma Lance @Free a weapon that already carries a ‘premium weapon’ points adjustment"
        };

        private static string[] Models =
        {
            "C3 STRIKE COMMAND SQUAD",
            "NUHU MANDARIN",
            "C3 DROP COMMAND SQUAD",
            "CONCORD DRONE COMMANDER",
            "NANO-PROBE NET",
            "C3 STRIKE SQUAD",
            "C3 DROP SQUAD",
            "C3 INTERCEPTOR COMMAND SQUAD",
            "C3 INTERCEPTOR SQUAD",
            "C3 STRIKE SUPPORT TEAM",
            "CONCORD C3D1 LIGHT SUPPORT DRONE",
            "CONCORD T7 TRANSPORTER DRONE",
            "CONCORD C3D2 MEDIUM SUPPORT DRONE",
            "C3 STRIKE HEAVY SUPPORT TEAM",
            "CONCORD C3M4 COMBAT DRONE",
            "CONCORD C3M407 (CS) CLOSE SUPPORT DRONE",
            "CONCORD C3M25 HEAVY COMBAT DRONE",
            "CONCORD C3M50 HEAVY SUPPORT DRONE",
            "TARGETER PROBE SHARD",
            "MEDI-PROBE SHARD",
            "SCOUT PROBE SHARD",
            "CONCORD ISO-DRONE",
            "CONCORD C3D1/GP GENERAL PURPOSE DRONE"
        };

        // Careful if you re-order these or add new ones.
        // The algorithm runs top to bottom, so if a line matches an earlier option "Trooper" when it should match a later one, it will output wrong.
        // Generally: More general items must be later in the list than more specific items
        private static Option[] Options =
        {
            new Option { Name = "Add up to 3 Drop Troopers with Plasma Carbine and X-Sling Exchange 1 Drop Trooper’s Plasma Carbine and X-Sling for a  to unit" },
            new Option {Name = "increasing  capability", Replacement = "Enhanced Machine Intelligence"}, // the parsing is weird here - the lines don't match up
            new Option {Name = "kinetic armour", Replacement = "Kinetic Armour"},
            new Option {Name = "Spotter Drone"},
            new Option {Name = "Leader 3"},
            new Option {Name = "Medi-Drone"},
            new Option {Name = "Medi-Probes"},
            new Option {Name = "Plasma Grenade"},
            new Option {Name = "Synchoniser Drone"},
            new Option {Name = "Synchroniser Drone"},
            new Option {Name = "SlingNet Ammo"},
            new Option {Name = "Shield Drone"},
            new Option {Name = "Gun Drones with Plasma Carbines"},
            new Option {Name = "Weapon Drone"},
            new Option {Name = "Batter Drone"},
            new Option {Name = "Scrambler, Arc, Blur, Scoot, Net and Grip"},
            new Option {Name = "Scrambler, Arc, Blur, Scoot, Net or Grip"},
            new Option {Name = "X-launcher"},
            new Option {Name = "X-Howitzer"},
            new Option {Name = "Mag Mortar"},
            new Option {Name = "Nano-probe Net"},
            new Option {Name = "Self-Repair"},
            new Option {Name = "Self Repair"},
            new Option {Name = "Nano-probes"},
            new Option {Name = "Leader 2"},
            new Option {Name = "Compactor Drone with compacted Plasma Cannon"},
            new Option {Name = "Fractal Cannon"},
            new Option {Name = "Compression Cannon"},
            new Option {Name = "Plasma Cannon"},
            new Option {Name = "Plasma Bombard"},
            new Option {Name = "Sensor Module"},
            new Option {Name = "Subverter Matrix"},
            new Option {Name = "Scout Probes"},
            new Option {Name = "Targeter Probe"},
            new Option {Name = "Plasma Light Support"},
            new Option {Name = "Compactor Drone"},
            new Option {Name = "Leader"},
            new Option {Name = "Plasma Lance"},
            new Option {Name = "Trooper"}
        };

        private const string ammoTypes = "Scrambler, Arc, Blur, Scoot, Net and Grip";

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
            if (debugWholeOptionsOutput)
            {
                outFile.WriteLine(currentOptions);
                return;
            }

            var options = currentOptions.ToString().Split(new[] {"@"}, StringSplitOptions.RemoveEmptyEntries);
            for(int i = 0; i < options.Length - 1; i++)
            {
                if (debugIndividualOptionsOutput)
                {
                    outFile.WriteLine("\t\t\t\t<option>" + options[i] + "</option>");
                    continue;
                }

                var name = options[i].Trim();
                var points = RemoveNonNumericConvertFree(options[i + 1].Trim().Split(' ')[0]);  // first value on next option line is the points for the current one, because of "@" split

                outFile.WriteLine("\t\t\t\t<option>");

                // Have to handle ammo types specially
                if (name.IndexOf(ammoTypes) != -1)
                    points = WriteAmmoTypes(outFile, points, options[i], options[i + 1]);
                else
                    WriteOptionName(outFile, name);

                outFile.WriteLine("\t\t\t\t\t<points>" + points + "</points>");
                outFile.WriteLine("\t\t\t\t</option>");
            }

            if (debugIndividualOptionsOutput)  // output the last line for debugging
                outFile.WriteLine("\t\t\t\t<not-option>" + options[options.Length - 1] + "</not-option>");
        }

        private static void WriteOptionName(StreamWriter outFile, string name)
        {
            bool wroteOptionName = false;
            foreach (var option in Options)
            {
                var index = name.IndexOf(option.Name);
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

            if (Sections.Contains(line))
            {
                CloseTag(outFile, true, true, true);

                inSection = true;
                outFile.WriteLine("\t<section name=\"" + line + "\">");
                return;
            }

            if (Models.Contains(line, new CompareIgnoreSpaces()))
            {
                CloseTag(outFile, false, true, true);

                inModel = true;
                nextLine = LineType.UnitTypePointsValueLimited;
                outFile.WriteLine("\t\t<model>");
                outFile.WriteLine("\t\t\t<name>" + line + "</name>");
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

            if(IgnoreLines.Contains(line))
                return;

            if (inOptions)
                currentOptions.Append(line + " ");
        }
    }
}
