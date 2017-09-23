using System.IO;
using System.Linq;
using Newtonsoft.Json;

namespace ParseAntaresPdf.Text
{
    public class Sections
    {
        private string[] sections;

        public Sections()
        {
            Load();
        }

        private void Load()
        {
            var inFile = new StreamReader("Data\\Sections.json");
            var unitsJson = inFile.ReadToEnd();
            sections = JsonConvert.DeserializeObject<string[]>(unitsJson);
        }

        public bool Contains(string contains)
        {
            return sections.Contains(contains);
        }
    }
}
