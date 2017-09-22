// Stolen from http://cjhaas.com/blog/2013/03/13/itextsharp-slightly-smarter-text-extraction-strategy/

using iTextSharp.text.pdf.parser;
using System;
using System.Collections.Generic;
using System.Text;

public class TopToBottomTextExtractionStrategy : ITextExtractionStrategy
{

    private Vector lastStart;
    private Vector lastEnd;

    //Store each line individually. A SortedDictionary will automatically shuffle things around based on the key
    private SortedDictionary<int, StringBuilder> results = new SortedDictionary<int, StringBuilder>();

    //Constructor and some methods that aren't used
    public TopToBottomTextExtractionStrategy() { }
    public virtual void BeginTextBlock() { }
    public virtual void EndTextBlock() { }
    public virtual void RenderImage(ImageRenderInfo renderInfo) { }

    //Convert our lines into a giant block of text
    public virtual String GetResultantText()
    {
        //Buffer
        StringBuilder buf = new StringBuilder();
        //Loop through each line (which is already sorted top to bottom)
        foreach (var s in results)
        {
            //Append to the buffer
            buf.AppendLine(s.Value.ToString());
        }
        return buf.ToString();
    }
    public virtual void RenderText(TextRenderInfo renderInfo)
    {
        bool firstRender = results.Count == 0;

        LineSegment segment = renderInfo.GetBaseline();
        Vector start = segment.GetStartPoint();
        Vector end = segment.GetEndPoint();

        //Use the Y value of the bottom left corner of the text for the key
        int currentLineKey = (int)start[1];

        if (!firstRender)
        {
            Vector x0 = start;
            Vector x1 = lastStart;
            Vector x2 = lastEnd;

            float dist = (x2.Subtract(x1)).Cross((x1.Subtract(x0))).LengthSquared / x2.Subtract(x1).LengthSquared;

            float sameLineThreshold = 1f;
            //If we've detected that we're still on the same
            if (dist <= sameLineThreshold)
            {
                //Use the previous Y coordinate
                currentLineKey = (int)lastStart[1];
            }
        }
        //Hack: PDFs start with zero at the bottom so our keys will be upside down. Using negative keys cheats this.
        currentLineKey = currentLineKey * -1;

        //If this line hasn't been used before add a new line to our collection
        if (!results.ContainsKey(currentLineKey))
        {
            results.Add(currentLineKey, new StringBuilder());
        }

        //Insert a space between blocks of text if it appears there should be
        if (!firstRender &&                                       //First pass never needs a leading space
            results[currentLineKey].Length != 0 &&                 //Don't append a space to the begining of a line
            !results[currentLineKey].ToString().EndsWith(" ") &&  //Don't append if the current buffer ends in a space already
            renderInfo.GetText().Length > 0 &&                    //Don't append if the new next is empty
            !renderInfo.GetText().StartsWith(" "))
        {              //Don't append if the new text starts with a space
            //Calculate the distance between the two blocks
            float spacing = lastEnd.Subtract(start).Length;
            //If it "looks" like it should be a space
            if (spacing > renderInfo.GetSingleSpaceWidth() / 2f)
            {
                //Add a space
                results[currentLineKey].Append(" ");
            }
        }

        //Add the text to the line in our collection
        results[currentLineKey].Append(renderInfo.GetText());

        lastStart = start;
        lastEnd = end;
    }
}