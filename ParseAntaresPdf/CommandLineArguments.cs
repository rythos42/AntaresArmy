using System.Linq;

namespace ParseAntaresPdf
{
    public class CommandLineArguments
    {
        private string[] args;

        public CommandLineArguments(string[] args)
        {
            this.args = args;
        }

        public bool HasArg(string key)
        {
            return args.Any(arg => arg.IndexOf(key) != -1);
        }

        public string GetKeyValue(string key)
        {
            for (int i = 0; i < args.Length; i++)
            {
                if (args[i].IndexOf(key) != -1)
                    return args[i + 1];
            }
            return null;
        }
    }
}
