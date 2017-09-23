using System.IO;
using System.Linq;
using Newtonsoft.Json;

namespace ParseAntaresPdf.Text
{
    public class IgnoreLines
    {
        private string[] ignoreLines;

        public IgnoreLines()
        {
            Load();
        }

        private void Load()
        {
            var inFile = new StreamReader("Data\\IgnoreLines.json");
            var unitsJson = inFile.ReadToEnd();
            ignoreLines = JsonConvert.DeserializeObject<string[]>(unitsJson);
        }

        public bool Contains(string contains)
        {
            return ignoreLines.Contains(contains);
        }
    }
}
