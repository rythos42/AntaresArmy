using System.IO;
using Newtonsoft.Json;

namespace ParseAntaresPdf.Text
{
    public class Options
    {
        private Option[] options;

        public Options()
        {
            Load();
        }

        private void Load()
        {
            var inFile = new StreamReader("Data\\Options.json");
            var unitsJson = inFile.ReadToEnd();
            options = JsonConvert.DeserializeObject<Option[]>(unitsJson);
        }

        public Option[] GetOptions()
        {
            return options;
        }
    }
}
