using System.IO;
using System.Linq;
using Newtonsoft.Json;

namespace ParseAntaresPdf.Text
{
    public class AmmoTypes
    {
        private string[] ammoTypes;

        public AmmoTypes()
        {
            Load();
        }

        private void Load()
        {
            var inFile = new StreamReader("Data\\AmmoTypes.json");
            var unitsJson = inFile.ReadToEnd();
            ammoTypes = JsonConvert.DeserializeObject<string[]>(unitsJson);
        }

        public bool Contains(string contains)
        {
            return ammoTypes.Count(ammoType => contains.Contains(ammoType)) != 0;
        }
    }
}
