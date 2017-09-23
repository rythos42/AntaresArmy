using System.IO;
using System.Linq;
using Newtonsoft.Json;

namespace ParseAntaresPdf.Text
{
    public class Units
    {
        private string[] names;

        public Units()
        {
            Load();
        }

        private void Load()
        {
            var inFile = new StreamReader("Data\\Units.json");
            var unitsJson = inFile.ReadToEnd();
            names = JsonConvert.DeserializeObject<string[]>(unitsJson);
        }
        
        public string GetAdjustedName(string contains)
        {
            var containsNoSpaces = contains.Replace(" ", "");
            return names.FirstOrDefault(name => name.Replace(" ", "").Equals(containsNoSpaces));
        }
    }
}
