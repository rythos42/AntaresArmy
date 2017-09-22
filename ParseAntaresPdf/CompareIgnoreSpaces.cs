using System.Collections.Generic;

namespace ParseAntaresPdf
{
    public class CompareIgnoreSpaces : IEqualityComparer<string>
    {
        public bool Equals(string x, string y)
        {
            var xNoSpaces = x.Replace(" ", "");
            var yNoSpaces = y.Replace(" ", "");
            return xNoSpaces.Equals(yNoSpaces);
        }

        public int GetHashCode(string obj)
        {
            return obj.GetHashCode();
        }
    }
}
