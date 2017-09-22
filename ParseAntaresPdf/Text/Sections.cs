using System.Linq;

namespace ParseAntaresPdf.Text
{
    public static class Sections
    {
        /*
         * These words are all on their own in the parsed PDFs. If a line exactly matches one of these, open a new <section> tag.
         */
        private static readonly string[] Names = { "TACTICAL", "STRATEGIC", "SUPPORT", "AUXILIARY" };

        public static bool Contains(string contains)
        {
            return Names.Contains(contains);
        }
    }
}
