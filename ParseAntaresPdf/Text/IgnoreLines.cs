using System.Linq;

namespace ParseAntaresPdf.Text
{
    public static class IgnoreLines
    {
        /*
         * This is to ignore/remove random nonsense lines from the parsed PDF. These lines are ones that have no value in the desired XML output.
         */
        private static readonly string[] Lines =
        {
            "Concord Army List",
            "•     ",
            "*Note this is a discounted value because it’s an either/or unit choice for ",
            "Exchange any or all twin Plasma Carbines for  ",
            "Plasma Lance @Free a weapon that already carries a ‘premium weapon’ points adjustment"
        };

        public static bool Contains(string contains)
        {
            return Lines.Contains(contains);
        }
    }
}
